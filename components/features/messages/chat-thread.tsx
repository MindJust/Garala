'use client'

import { useEffect, useRef, useState } from "react"
import { MessageBubble } from "./message-bubble"
import { MessageInput } from "./message-input"
import { createClient } from "@/lib/supabase/client"
import type { Message } from "./messages.actions"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface ChatThreadProps {
    conversationId: string
    initialMessages: Message[]
    currentUserId: string
    otherParticipant: any
    listing: any
}

export function ChatThread({
    conversationId,
    initialMessages,
    currentUserId,
    otherParticipant,
    listing
}: ChatThreadProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    // Scroll to bottom on new message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Realtime subscription
    useEffect(() => {
        const channel = supabase
            .channel(`conversation:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                async (payload) => {
                    console.log('New message received:', payload)

                    // Fetch full message with sender data
                    const { data } = await supabase
                        .from('messages')
                        .select(`
                            *,
                            sender:profiles(id, full_name, avatar_url)
                        `)
                        .eq('id', payload.new.id)
                        .single()

                    if (data) {
                        setMessages((prev) => {
                            // Check if message already exists
                            if (prev.some(m => m.id === data.id)) {
                                return prev
                            }
                            return [...prev, data]
                        })
                    }
                }
            )
            .subscribe((status) => {
                console.log('Subscription status:', status)
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [conversationId, supabase])

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                <div className="container flex items-center gap-4 h-16">
                    <Link href="/messages">
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>

                    <div className="flex items-center gap-3 flex-1">
                        {otherParticipant?.avatar_url ? (
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                    src={otherParticipant.avatar_url}
                                    alt={otherParticipant.full_name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-semibold">
                                    {otherParticipant?.full_name?.[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <h2 className="font-semibold text-sm truncate">
                                {otherParticipant?.full_name || "Utilisateur"}
                            </h2>
                            <p className="text-xs text-muted-foreground truncate">
                                {listing?.title}
                            </p>
                        </div>
                    </div>

                    {listing && (
                        <Link href={`/listings/${listing.id}`}>
                            <Button variant="outline" size="sm" className="hidden md:flex">
                                Voir l'annonce
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-muted/10">
                <div className="container max-w-4xl">
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isOwnMessage={message.sender_id === currentUserId}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <MessageInput conversationId={conversationId} />
        </div>
    )
}
