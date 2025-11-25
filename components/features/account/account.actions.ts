'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function deleteAccount() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Non connecté' }
    }

    try {
        // Call the database function to delete the account
        const { error: rpcError } = await supabase.rpc('delete_user_account')

        if (rpcError) {
            console.error('Error deleting account:', rpcError)
            return { error: 'Erreur lors de la suppression du compte' }
        }

        // Sign out after deletion
        await supabase.auth.signOut()
        redirect('/auth')
    } catch (err) {
        console.error('Error deleting account:', err)
        return { error: 'Erreur lors de la suppression du compte' }
    }
}
