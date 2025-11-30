'use client'

import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sendMessage } from "../messages.actions"
import { toast } from "sonner"

interface MessageInputProps {
    conversationId: string
}

export function MessageInput({ conversationId }: MessageInputProps) {
    const [message, setMessage] = useState("")
    const [sending, setSending] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = "auto"
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
        }
    }, [message])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!message.trim() || sending) return

        setSending(true)
        const content = message.trim()
        setMessage("") // Clear immediately for better UX

        const result = await sendMessage(conversationId, content)

        if (result?.error) {
            toast.error(result.error)
            setMessage(content) // Restore message on error
        }

        setSending(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="border-t border-border p-4 bg-background">
            <div className="flex items-end gap-2">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Écrivez un message..."
                    className="flex-1 resize-none rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px] max-h-[120px]"
                    rows={1}
                    disabled={sending}
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={!message.trim() || sending}
                    className="rounded-lg h-11 w-11 flex-shrink-0"
                >
                    <Send className="h-5 w-5" />
                </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
                Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
            </p>
        </form>
    )
}
