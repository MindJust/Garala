import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const supabase = await createClient()

        // Exchange code for session
        await supabase.auth.exchangeCodeForSession(code)

        // Get user data
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            // Check if profile exists
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            // If profile exists but is empty, update it with OAuth data
            if (profile && (!profile.full_name || !profile.username)) {
                const fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
                const username = user.user_metadata?.preferred_username ||
                    user.email?.split('@')[0] ||
                    ''

                await supabase
                    .from('profiles')
                    .update({
                        full_name: fullName,
                        username: username,
                        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
                    })
                    .eq('id', user.id)
            }
        }
    }

    // Redirect to home
    return NextResponse.redirect(new URL('/', requestUrl.origin))
}
