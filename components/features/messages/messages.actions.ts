'use server'

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export interface Conversation {
    id: string
    listing_id: string
    participant_1: string
    participant_2: string
    last_message_at: string
    created_at: string
    listing?: any
    other_participant?: any
    unread_count?: number
}

export interface Message {
    id: string
    conversation_id: string
    sender_id: string
    content: string | null
    message_type: 'text' | 'image' | 'voice' | 'meeting'
    media_url: string | null
    meeting_data: any
    read_at: string | null
    created_at: string
    sender?: any
}

/**
 * Create or get existing conversation for a listing
 */
export async function createConversation(listingId: string, sellerId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Vous devez être connecté pour envoyer un message." }
    }

    // Check if conversation already exists (order-independent)
    const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', listingId)
        .or(`and(participant_1.eq.${user.id},participant_2.eq.${sellerId}),and(participant_1.eq.${sellerId},participant_2.eq.${user.id})`)
        .single()

    if (existing) {
        redirect(`/messages/${existing.id}`)
    }

    // Create new conversation
    const { data: conversation, error } = await supabase
        .from('conversations')
        .insert({
            listing_id: listingId,
            participant_1: user.id,
            participant_2: sellerId
        })
        .select('id')
        .single()

    if (error) {
        console.error('Error creating conversation:', error)
        return { error: "Erreur lors de la création de la conversation." }
    }

    redirect(`/messages/${conversation.id}`)
}

/**
 * Get all conversations for current user
 */
export async function getConversations(): Promise<Conversation[]> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('conversations')
        .select(`
            *,
            listing:listings(id, title, images, price, currency),
            participant_1_profile:profiles!conversations_participant_1_fkey(id, full_name, avatar_url),
            participant_2_profile:profiles!conversations_participant_2_fkey(id, full_name, avatar_url)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('last_message_at', { ascending: false })

    if (error) {
        console.error('Error fetching conversations:', error)
        return []
    }

    // Transform to add other_participant
    return data.map((conv: any) => ({
        ...conv,
        other_participant: conv.participant_1 === user.id
            ? conv.participant_2_profile
            : conv.participant_1_profile
    }))
}

/**
 * Get single conversation with participants
 */
export async function getConversation(conversationId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: conversation, error } = await supabase
        .from('conversations')
        .select(`
            *,
            listing:listings(id, title, images, price, currency, user_id),
            participant_1_profile:profiles!conversations_participant_1_fkey(id, full_name, avatar_url),
            participant_2_profile:profiles!conversations_participant_2_fkey(id, full_name, avatar_url)
        `)
        .eq('id', conversationId)
        .single()

    if (error || !conversation) {
        console.error('Error fetching conversation:', error)
        return null
    }

    // Verify user is participant
    if (conversation.participant_1 !== user.id && conversation.participant_2 !== user.id) {
        return null
    }

    return {
        ...conversation,
        other_participant: conversation.participant_1 === user.id
            ? conversation.participant_2_profile
            : conversation.participant_1_profile
    }
}

/**
 * Get messages for a conversation
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('messages')
        .select(`
            *,
            sender:profiles(id, full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching messages:', error)
        return []
    }

    return data
}

/**
 * Send a text message
 */
export async function sendMessage(conversationId: string, content: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Vous devez être connecté pour envoyer un message." }
    }

    // Insert message
    const { error: messageError } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: content,
            message_type: 'text'
        })

    if (messageError) {
        console.error('Error sending message:', messageError)
        return { error: "Erreur lors de l'envoi du message." }
    }

    // Update conversation last_message_at
    const { error: updateError } = await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId)

    if (updateError) {
        console.error('Error updating conversation:', updateError)
    }

    revalidatePath(`/messages/${conversationId}`)
    return { success: true }
}

/**
 * Mark message as read
 */
export async function markAsRead(messageId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId)
        .is('read_at', null)

    if (error) {
        console.error('Error marking message as read:', error)
    }
}

/**
 * Upload image to message storage
 */
export async function uploadMessageImage(conversationId: string, file: File) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Vous devez être connecté." }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${conversationId}/${user.id}_${Date.now()}.${fileExt}`

    // Upload to storage
    const { error: uploadError, data } = await supabase.storage
        .from('message-media')
        .upload(fileName, file)

    if (uploadError) {
        console.error('Error uploading image:', uploadError)
        return { error: "Erreur lors de l'upload de l'image." }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('message-media')
        .getPublicUrl(fileName)

    return { url: publicUrl }
}

/**
 * Send image message
 */
export async function sendImageMessage(conversationId: string, imageUrl: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Vous devez être connecté." }
    }

    const { error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            message_type: 'image',
            media_url: imageUrl
        })

    if (error) {
        console.error('Error sending image message:', error)
        return { error: "Erreur lors de l'envoi de l'image." }
    }

    // Update conversation last_message_at
    await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId)

    return { success: true }
}

/**
 * Send voice message
 */
export async function sendVoiceMessage(conversationId: string, audioBlob: Blob) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Vous devez être connecté." }
    }

    // Upload audio
    const fileName = `${conversationId}/${user.id}_${Date.now()}.webm`
    const { error: uploadError } = await supabase.storage
        .from('message-media')
        .upload(fileName, audioBlob)

    if (uploadError) {
        console.error('Error uploading voice:', uploadError)
        return { error: "Erreur lors de l'upload du message vocal." }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('message-media')
        .getPublicUrl(fileName)

    // Insert message
    const { error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            message_type: 'voice',
            media_url: publicUrl
        })

    if (error) {
        console.error('Error sending voice message:', error)
        return { error: "Erreur lors de l'envoi du message vocal." }
    }

    // Update conversation
    await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId)

    return { success: true }
}

/**
 * Send meeting request
 */
export async function sendMeetingRequest(
    conversationId: string,
    meetingData: { date: string; time: string; location?: string; notes?: string }
) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Vous devez être connecté." }
    }

    const { error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            message_type: 'meeting',
            meeting_data: meetingData
        })

    if (error) {
        console.error('Error sending meeting request:', error)
        return { error: "Erreur lors de l'envoi de la demande de rendez-vous." }
    }

    // Update conversation
    await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId)

    return { success: true }
}
