'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PlusCircle, User, LogOut, Settings, HelpCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function Navbar() {
    const [user, setUser] = useState<any>(null)
    const [helpMenuOpen, setHelpMenuOpen] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user))

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center">
                        <Image src="/logo.png" alt="Garala" width={40} height={40} className="w-10 h-10" />
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {/* Help Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setHelpMenuOpen(!helpMenuOpen)}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            aria-label="Aide"
                        >
                            <HelpCircle className="w-5 h-5" />
                        </button>

                        {helpMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setHelpMenuOpen(false)} />
                                <div className="absolute right-0 mt-2 w-56 bg-card border rounded-lg shadow-lg z-50">
                                    <div className="py-2">
                                        <Link
                                            href="/legal/terms"
                                            className="block px-4 py-2 hover:bg-accent transition-colors text-sm"
                                            onClick={() => setHelpMenuOpen(false)}
                                        >
                                            CGU
                                        </Link>
                                        <Link
                                            href="/legal/privacy"
                                            className="block px-4 py-2 hover:bg-accent transition-colors text-sm"
                                            onClick={() => setHelpMenuOpen(false)}
                                        >
                                            Confidentialité
                                        </Link>
                                        <Link
                                            href="/legal/cookies"
                                            className="block px-4 py-2 hover:bg-accent transition-colors text-sm"
                                            onClick={() => setHelpMenuOpen(false)}
                                        >
                                            Cookies
                                        </Link>
                                        <Link
                                            href="/legal/about"
                                            className="block px-4 py-2 hover:bg-accent transition-colors text-sm"
                                            onClick={() => setHelpMenuOpen(false)}
                                        >
                                            À propos
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {user ? (
                        <>
                            <Link href="/listings/new">
                                <Button className="gap-2">
                                    <PlusCircle className="w-4 h-4" />
                                    Déposer une annonce
                                </Button>
                            </Link>

                            <div className="relative group">
                                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                </button>

                                <div className="absolute right-0 mt-2 w-56 bg-card border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <div className="p-2">
                                        <Link href="/account" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
                                            <Settings className="w-4 h-4" />
                                            Mon compte
                                        </Link>
                                        <button
                                            onClick={() => supabase.auth.signOut()}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-destructive"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Se déconnecter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/auth">
                                <Button variant="ghost">Connexion</Button>
                            </Link>
                            <Link href="/auth">
                                <Button>Inscription</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
