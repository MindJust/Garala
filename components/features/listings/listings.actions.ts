'use server'

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { listingSchema, ListingData } from "./listings.schema"

export async function createListing(data: ListingData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Vous devez être connecté pour publier une annonce." }
    }

    // Validate data on server side
    const result = listingSchema.safeParse(data)
    if (!result.success) {
        return { error: "Données invalides." }
    }

    const { error } = await supabase
        .from('listings')
        .insert({
            user_id: user.id,
            title: data.title,
            description: data.description,
            price: data.price,
            currency: data.currency,
            category: data.category,
            images: data.images,
            location: {
                quartier: data.quartier,
                arrondissement: data.arrondissement || ""
            },
            phone: data.phone,
            status: 'active'
        })

    if (error) {
        console.error('Error creating listing:', error)
        return { error: "Erreur lors de la création de l'annonce." }
    }

    redirect('/')
}

export async function updateListing(id: string, data: ListingData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Vous devez être connecté pour modifier une annonce." }
    }

    // Verify ownership
    const { data: listing } = await supabase
        .from('listings')
        .select('user_id')
        .eq('id', id)
        .single()

    if (!listing || listing.user_id !== user.id) {
        return { error: "Vous n'êtes pas autorisé à modifier cette annonce." }
    }

    // Validate data on server side
    const result = listingSchema.safeParse(data)
    if (!result.success) {
        return { error: "Données invalides." }
    }

    const { error } = await supabase
        .from('listings')
        .update({
            title: data.title,
            description: data.description,
            price: data.price,
            currency: data.currency,
            category: data.category,
            images: data.images,
            location: {
                quartier: data.quartier,
                arrondissement: data.arrondissement || ""
            },
            phone: data.phone,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating listing:', error)
        return { error: "Erreur lors de la modification de l'annonce." }
    }

    redirect(`/listings/${id}`)
}

export async function uploadListingImage(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const file = formData.get('file') as File
    if (!file) return { error: "No file uploaded" }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`

    const { error } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file)

    if (error) {
        return { error: error.message }
    }

    const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName)

    return { url: publicUrl }
}

export async function getListings() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('listings')
        .select(`
            *,
            profiles (
                id,
                full_name,
                username,
                avatar_url,
                is_pro
            )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching listings:', error)
        return []
    }

    // Transform database location jsonb to flat structure for component
    return data.map(listing => ({
        ...listing,
        quartier: listing.location?.quartier,
        arrondissement: listing.location?.arrondissement,
    }))
}

export async function getListing(id: string) {
    const supabase = await createClient()

    const { data: listing, error } = await supabase
        .from('listings')
        .select(`
            *,
            profiles (
                id,
                full_name,
                username,
                avatar_url,
                is_pro
            )
        `)
        .eq('id', id)
        .eq('status', 'active')
        .single()

    if (error) {
        console.error('Error fetching listing:', error.message, error.details, error.hint)
        return null
    }

    // Transform location from jsonb
    return {
        ...listing,
        quartier: listing.location?.quartier,
        arrondissement: listing.location?.arrondissement,
    }
}
