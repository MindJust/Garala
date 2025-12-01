'use client'

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Message } from "./messages.actions"
import Image from "next/image"
import { Play, Pause, Calendar, MapPin, FileText } from "lucide-react"

interface MessageBubbleProps {
    message: Message
    isOwnMessage: boolean
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

    const handlePlayAudio = () => {
        if (!message.media_url) return

        if (audioElement) {
            if (isPlaying) {
                audioElement.pause()
                setIsPlaying(false)
            } else {
                audioElement.play()
                setIsPlaying(true)
            }
        } else {
            const audio = new Audio(message.media_url)
            audio.onended = () => setIsPlaying(false)
            audio.play()
            setIsPlaying(true)
            setAudioElement(audio)
        }
    }

    // Text Message
    if (message.message_type === 'text' && message.content) {
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
                    <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                    </p>
                    <MessageTimestamp message={message} isOwnMessage={isOwnMessage} />
                </div>
            </div>
        )
    }

    // Image Message
    if (message.message_type === 'image' && message.media_url) {
        return (
            <div className={cn(
                "flex mb-4",
                isOwnMessage ? "justify-end" : "justify-start"
            )}>
                <div className={cn(
                    "max-w-[70%] rounded-2xl overflow-hidden",
                    isOwnMessage ? "bg-primary/10" : "bg-muted"
                )}>
                    <div className="relative w-full aspect-video">
                        <Image
                            src={message.media_url}
                            alt="Image"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="px-3 py-2">
                        <MessageTimestamp message={message} isOwnMessage={isOwnMessage} />
                    </div>
                </div>
            </div>
        )
    }

    // Voice Message
    if (message.message_type === 'voice' && message.media_url) {
        return (
            <div className={cn(
                "flex mb-4",
                isOwnMessage ? "justify-end" : "justify-start"
            )}>
                <div className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2 flex items-center gap-3",
                    isOwnMessage
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                )}>
                    <button
                        onClick={handlePlayAudio}
                        className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition"
                    >
                        {isPlaying ? (
                            <Pause className="w-5 h-5" />
                        ) : (
                            <Play className="w-5 h-5" />
                        )}
                    </button>
                    <div className="flex-1">
                        <p className="text-sm font-medium">Message vocal</p>
                        <MessageTimestamp message={message} isOwnMessage={isOwnMessage} />
                    </div>
                </div>
            </div>
        )
    }

    // Meeting Request
    if (message.message_type === 'meeting' && message.meeting_data) {
        const { date, time, location, notes } = message.meeting_data

        return (
            <div className={cn(
                "flex mb-4",
                isOwnMessage ? "justify-end" : "justify-start"
            )}>
                <div className={cn(
                    "max-w-[70%] rounded-2xl overflow-hidden",
                    isOwnMessage
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-muted border-2 border-border"
                )}>
                    <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            <p className="font-semibold">Proposition de rendez-vous</p>
                        </div>

                        <div className="space-y-1 text-sm">
                            <p><strong>Date :</strong> {new Date(date).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                            <p><strong>Heure :</strong> {time}</p>

                            {location && (
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-0.5" />
                                    <p>{location}</p>
                                </div>
                            )}

                            {notes && (
                                <div className="flex items-start gap-2 mt-2">
                                    <FileText className="w-4 h-4 mt-0.5" />
                                    <p className="text-muted-foreground">{notes}</p>
                                </div>
                            )}
                        </div>

                        <MessageTimestamp message={message} isOwnMessage={isOwnMessage} />
                    </div>
                </div>
            </div>
        )
    }

    return null
}

function MessageTimestamp({ message, isOwnMessage }: { message: Message; isOwnMessage: boolean }) {
    return (
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
    )
}
