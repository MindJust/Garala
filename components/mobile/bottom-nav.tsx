'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Plus, Heart, Menu, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBottomNavVisibility } from '@/hooks/use-bottom-nav-visibility'
import { Button } from '@/components/ui/button'

export function BottomNav() {
    const pathname = usePathname()
    const isVisible = useBottomNavVisibility()

    if (!isVisible) return null

    const navItems = [
        {
            label: 'Accueil',
            icon: Home,
            href: '/',
            isActive: pathname === '/',
        },
        {
            label: 'Recherche',
            icon: Search,
            href: '/search',
            isActive: pathname === '/search',
        },
        {
            label: 'Poster',
            icon: Plus,
            href: '/listings/new',
            isActive: pathname === '/listings/new',
            isFab: true,
        },
        {
            label: 'Favoris',
            icon: Heart,
            href: '/favorites', // Placeholder route
            isActive: pathname === '/favorites',
        },
        {
            label: 'Compte',
            icon: User,
            href: '/account',
            isActive: pathname === '/account',
        },
    ]

    return (
        <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden">
            <nav className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-[2rem] shadow-xl px-2 py-2 flex items-center justify-between relative">
                {navItems.map((item, index) => {
                    if (item.isFab) {
                        return (
                            <div key={item.href} className="relative -top-8">
                                <Link href={item.href}>
                                    <Button
                                        size="icon"
                                        className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-transform active:scale-95"
                                    >
                                        <Plus className="h-8 w-8 text-primary-foreground" />
                                        <span className="sr-only">Poster une annonce</span>
                                    </Button>
                                </Link>
                            </div>
                        )
                    }

                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-16 h-12 gap-1 transition-colors",
                                item.isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("h-6 w-6", item.isActive && "fill-current")} />
                            {/* Optional: Add labels if needed, but icon-only is cleaner for this style */}
                            {/* <span className="text-[10px] font-medium">{item.label}</span> */}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
