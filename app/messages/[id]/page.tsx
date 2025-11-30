import { getConversation, getMessages } from "@/components/features/messages/messages.actions"
import { ChatThread } from "@/components/features/messages/chat-thread"
import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/auth')
    }

    const conversation = await getConversation(id)
    if (!conversation) {
        notFound()
    }

    const messages = await getMessages(id)

    return (
        <ChatThread
            conversationId={id}
            initialMessages={messages}
            currentUserId={user.id}
            otherParticipant={conversation.other_participant}
            listing={conversation.listing}
        />
    )
}
