'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Review {
    id: string
    listing_id: string
    reviewer_id: string
    rating: number
    comment: string | null
    created_at: string
    updated_at: string
    reviewer?: {
        id: string
        full_name: string
        avatar_url: string | null
    }
}

/**
 * Get all reviews for a listing
 */
export async function getListingReviews(listingId: string): Promise<Review[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('listing_reviews')
        .select(`
            *,
            reviewer:profiles!reviewer_id(id, full_name, avatar_url)
        `)
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching reviews:', error)
        return []
    }

    return data || []
}

/**
 * Get average rating for a listing
 */
export async function getListingRating(listingId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('listing_reviews')
        .select('rating')
        .eq('listing_id', listingId)

    if (error || !data || data.length === 0) {
        return { average: 0, count: 0 }
    }

    const average = data.reduce((sum, review) => sum + review.rating, 0) / data.length
    return { average: Math.round(average * 10) / 10, count: data.length }
}

/**
 * Add a review
 */
export async function addReview(listingId: string, rating: number, comment?: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Vous devez être connecté pour laisser un avis." }
    }

    // Check if user already reviewed this listing
    const { data: existing } = await supabase
        .from('listing_reviews')
        .select('id')
        .eq('listing_id', listingId)
        .eq('reviewer_id', user.id)
        .single()

    if (existing) {
        return { error: "Vous avez déjà laissé un avis pour cette annonce." }
    }

    const { error } = await supabase
        .from('listing_reviews')
        .insert({
            listing_id: listingId,
            reviewer_id: user.id,
            rating,
            comment: comment || null
        })

    if (error) {
        console.error('Error adding review:', error)
        return { error: "Erreur lors de l'ajout de votre avis." }
    }

    revalidatePath(`/listings/${listingId}`)
    return { success: true }
}

/**
 * Update a review
 */
export async function updateReview(reviewId: string, rating: number, comment?: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Vous devez être connecté." }
    }

    const { error } = await supabase
        .from('listing_reviews')
        .update({
            rating,
            comment: comment || null
        })
        .eq('id', reviewId)
        .eq('reviewer_id', user.id) // Ensure user owns the review

    if (error) {
        console.error('Error updating review:', error)
        return { error: "Erreur lors de la mise à jour de votre avis." }
    }

    return { success: true }
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Vous devez être connecté." }
    }

    const { error } = await supabase
        .from('listing_reviews')
        .delete()
        .eq('id', reviewId)
        .eq('reviewer_id', user.id)

    if (error) {
        console.error('Error deleting review:', error)
        return { error: "Erreur lors de la suppression de votre avis." }
    }

    return { success: true }
}
