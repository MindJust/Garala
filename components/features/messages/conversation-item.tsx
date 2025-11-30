'use client'

import Link from "next/link"
import Image from "next/image"
import { MessageCircle } from "lucide-react"
import type { Conversation } from "../messages.actions"

interface ConversationItemProps {
    conversation: Conversation
}

export function ConversationItem({ conversation }: ConversationItemProps) {
    const otherUser = conversation.other_participant
    const listing = conversation.listing

    return (
        <Link
            href={`/messages/${conversation.id}`}
            className="flex items-center gap-4 p-4 hover:bg-accent transition-colors border-b border-border"
        >
            {/* Listing Image */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                {listing?.images?.[0] ? (
                    <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <MessageCircle className="w-6 h-6 text-muted-foreground" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">
                        {otherUser?.full_name || "Utilisateur"}
                    </h3>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                        {new Date(conversation.last_message_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short'
                        })}
                    </span>
                </div>

                <p className="text-sm text-muted-foreground truncate">
                    {listing?.title}
                </p>

                {listing?.price && (
                    <p className="text-xs font-bold text-primary mt-1">
                        {listing.price.toLocaleString()} {listing.currency === 'XAF' ? 'FCFA' : listing.currency}
                    </p>
                )}
            </div>

            {/* Unread count (optional, to be implemented) */}
            {conversation.unread_count && conversation.unread_count > 0 && (
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {conversation.unread_count}
                </div>
            )}
        </Link>
    )
}
