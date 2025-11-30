'use client'

import { cn } from "@/lib/utils"
import type { Message } from "../messages.actions"

interface MessageBubbleProps {
    message: Message
    isOwnMessage: boolean
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
    const isText = message.message_type === 'text'

    return (
        <div className={cn(
            "flex mb-4",
            isOwnMessage ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "max-w-[70%] rounded-2xl px-4 py-2",
                isOwnMessage
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted text-foreground rounded-tl-sm"
            )}>
                {isText && message.content && (
                    <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                    </p>
                )}

                <div className={cn(
                    "text-[10px] mt-1",
                    isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                    {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                    {isOwnMessage && message.read_at && " • Lu"}
                </div>
            </div>
        </div>
    )
}
