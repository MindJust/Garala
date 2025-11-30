'use client'

import { ConversationItem } from "./conversation-item"
import type { Conversation } from "./messages.actions"
import { MessageSquare } from "lucide-react"

interface ConversationsListProps {
    conversations: Conversation[]
}

export function ConversationsList({ conversations }: ConversationsListProps) {
    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
                <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Aucune conversation</h2>
                <p className="text-muted-foreground max-w-md">
                    Vous n'avez pas encore de conversations. Contactez un vendeur depuis une annonce pour démarrer une discussion.
                </p>
            </div>
        )
    }

    return (
        <div className="divide-y divide-border">
            {conversations.map((conversation) => (
                <ConversationItem key={conversation.id} conversation={conversation} />
            ))}
        </div>
    )
}
