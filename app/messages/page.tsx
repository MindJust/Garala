import { getConversations } from "@/components/features/messages/messages.actions"
import { ConversationsList } from "@/components/features/messages/conversations-list"
import { MessageSquare } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function MessagesPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/auth')
    }

    const conversations = await getConversations()

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-4xl py-8">
                <div className="flex items-center gap-3 mb-8">
                    <MessageSquare className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold">Messages</h1>
                </div>

                <div className="bg-card rounded-xl border overflow-hidden">
                    <ConversationsList conversations={conversations} />
                </div>
            </div>
        </div>
    )
}
