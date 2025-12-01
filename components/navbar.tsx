'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PlusCircle, User, LogOut, Settings, HelpCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
    const [user, setUser] = useState<any>(null)
    const [helpMenuOpen, setHelpMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
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
                        <Image src="/logo.png" alt="Garala" width={50} height={50} className="w-[50px] h-[50px]" />
                    </Link>

                    {/* Desktop Navigation Links - Hidden on mobile/tablet */}
                    <nav className="hidden lg:flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                        >
                            Accueil
                        </Link>
                        <Link
                            href="/search"
                            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                        >
                            Rechercher
                        </Link>
                        <Link
                            href="/favorites"
                            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                        >
                            Favoris
                        </Link>
                        {user && (
                            <>
                                <Link
                                    href="/messages"
                                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                                >
                                    Messages
                                </Link>
                                <Link
                                    href="/account"
                                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                                >
                                    Mon Compte
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {/* Dark Mode Toggle - Always visible */}
                    <ThemeToggle />

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
                                <div className="fixed inset-0 z-[60]" onClick={() => setHelpMenuOpen(false)} />
                                <div className="absolute right-0 mt-2 w-56 bg-card border rounded-lg shadow-lg z-[70]">
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
                            <Link href="/listings/new" className="hidden md:flex">
                                <Button className="gap-2">
                                    <PlusCircle className="w-4 h-4" />
                                    <span className="hidden lg:inline">Déposer une annonce</span>
                                    <span className="lg:hidden">Poster</span>
                                </Button>
                            </Link>

                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
                                >
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                </button>

                                {userMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-[60]" onClick={() => setUserMenuOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-56 bg-card border rounded-xl shadow-lg z-[70]">
                                            <div className="p-2">
                                                <Link
                                                    href="/account"
                                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    Mon compte
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        supabase.auth.signOut()
                                                        setUserMenuOpen(false)
                                                    }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-destructive"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Se déconnecter
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/auth">
                                <Button variant="ghost" className="hidden md:flex">Connexion</Button>
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
