'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { profileSchema } from "../auth/auth.schema"

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/auth')
}

export async function getProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth')
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert([{ id: user.id }])
                .select()
                .single()

            if (createError) {
                console.error('Error creating profile:', createError)
                return { email: user.email, fullName: '', username: '' }
            }
            return {
                email: user.email,
                fullName: newProfile.full_name || '',
                username: newProfile.username || ''
            }
        }
        console.error('Error fetching profile:', error)
        return { email: user.email, fullName: '', username: '' }
    }

    // Map database fields to camelCase for the form
    return {
        email: user.email,
        fullName: profile.full_name || '',
        username: profile.username || ''
    }
}

export async function updateProfile(data: z.infer<typeof profileSchema>) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Non connecté' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: data.fullName,
            username: data.username,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/account')
    return { success: true, message: 'Profil mis à jour' }
}
