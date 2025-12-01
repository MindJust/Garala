'use client'

import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sendMessage } from "./messages.actions"
import { toast } from "sonner"
import { ImageUpload } from "./image-upload"
import { AudioRecorder } from "./audio-recorder"
import { MeetingScheduler } from "./meeting-scheduler"
import { createClient } from "@/lib/supabase/client"

interface MessageInputProps {
    conversationId: string
    onMessageSent?: (tempMessage: any) => void
}

export function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
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

        const content = message.trim()
        setMessage("") // Clear immediately for better UX

        // Optimistic update - show message immediately
        if (onMessageSent) {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Create temporary message to show immediately
                const tempMessage = {
                    id: `temp-${Date.now()}`,
                    conversation_id: conversationId,
                    sender_id: user.id,
                    content: content,
                    message_type: 'text' as const,
                    media_url: null,
                    meeting_data: null,
                    read_at: null,
                    created_at: new Date().toISOString(),
                    sender: {
                        id: user.id,
                        full_name: user.user_metadata?.full_name || 'Vous',
                        avatar_url: user.user_metadata?.avatar_url
                    }
                }
                onMessageSent(tempMessage)
            }
        }

        setSending(true)
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
                {/* Media Actions */}
                <div className="flex items-center gap-1">
                    <ImageUpload conversationId={conversationId} />
                    <AudioRecorder conversationId={conversationId} />
                    <MeetingScheduler conversationId={conversationId} />
                </div>

                {/* Text Input */}
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

                {/* Send Button */}
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
