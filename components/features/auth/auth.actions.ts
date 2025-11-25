'use server'

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { z } from "zod"
import { emailSchema, passwordSchema, profileSchema } from "./auth.schema"

export async function checkEmailExists(email: string) {
    return { exists: 'unknown' }
}

export async function signInWithEmail(email: string, password: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        // Check if it's an email not confirmed error
        if (error.message.includes('Email not confirmed')) {
            return {
                error: "Votre email n'est pas encore vérifié. Veuillez vérifier votre boîte mail.",
                needsConfirmation: true
            }
        }
        return { error: error.message }
    }

    // Check if user exists but email not confirmed
    if (data.user && !data.user.email_confirmed_at) {
        return {
            error: "Veuillez vérifier votre email pour activer votre compte.",
            needsConfirmation: true
        }
    }

    redirect('/')
}

export async function signUpWithEmail(email: string, password: string, profile: { fullName: string, username: string }) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: profile.fullName,
                username: profile.username,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    if (!data.user) {
        return { error: "Erreur lors de la création du compte" }
    }

    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            full_name: profile.fullName,
            username: profile.username,
        })
        .eq('id', data.user.id)

    if (profileError) {
        console.error('Error updating profile:', profileError)
    }

    if (data.session) {
        redirect('/')
    } else {
        return { success: true, message: "Compte créé ! Veuillez vérifier votre email." }
    }
}

export async function signInWithOAuth(provider: 'google' | 'apple') {
    const supabase = await createClient()

    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: redirectUrl,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    if (data.url) {
        redirect(data.url)
    }
}
