'use client'

import { useState } from "react"
import { ListingCard } from "./listing-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface ListingFeedProps {
    initialListings: any[] // Using any for now as the type from action needs to be inferred or defined shared
}

export function ListingFeed({ initialListings }: ListingFeedProps) {
    const [search, setSearch] = useState("")

    const filteredListings = initialListings.filter(listing =>
        listing.title.toLowerCase().includes(search.toLowerCase()) ||
        listing.description.toLowerCase().includes(search.toLowerCase()) ||
        listing.city?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="relative max-w-md mx-auto md:mx-0">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Rechercher une annonce..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
            </div>

            {filteredListings.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    Aucune annonce trouvée pour "{search}"
                </div>
            )}
        </div>
    )
}
