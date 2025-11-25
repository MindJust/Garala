'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

/**
 * Delete a listing (owner only)
 */
export async function deleteListing(listingId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Vous devez être connecté" }
    }

    // Verify ownership
    const { data: listing, error: fetchError } = await supabase
        .from('listings')
        .select('user_id')
        .eq('id', listingId)
        .single()

    if (fetchError || !listing) {
        console.error('Fetch listing error:', fetchError)
        return { error: "Annonce introuvable" }
    }

    if (listing.user_id !== user.id) {
        return { error: "Vous n'êtes pas le propriétaire de cette annonce" }
    }

    // Delete the listing
    const { error: deleteError } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId)
        .eq('user_id', user.id)

    if (deleteError) {
        console.error('Delete error:', deleteError)
        return { error: deleteError.message }
    }

    revalidatePath('/')
    revalidatePath('/account')
    redirect('/')
}

/**
 * Report a listing
 */
export async function reportListing(
    listingId: string,
    reason: 'spam' | 'inappropriate' | 'scam' | 'duplicate' | 'other',
    details?: string
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Vous devez être connecté pour signaler" }
    }

    // Check if user already reported this listing
    const { data: existingReport } = await supabase
        .from('reports')
        .select('id')
        .eq('listing_id', listingId)
        .eq('reporter_id', user.id)
        .single()

    if (existingReport) {
        return { error: "Vous avez déjà signalé cette annonce" }
    }

    // Create report
    const { error } = await supabase
        .from('reports')
        .insert({
            listing_id: listingId,
            reporter_id: user.id,
            reason,
            details: details || null
        })

    if (error) {
        return { error: error.message }
    }

    return { success: true, message: "Signalement envoyé avec succès" }
}

/**
 * Check if current user is the owner of a listing
 */
export async function isListingOwner(listingId: string): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data } = await supabase
        .from('listings')
        .select('user_id')
        .eq('id', listingId)
        .single()

    return data?.user_id === user.id
}
