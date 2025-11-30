'use client'

import Image from "next/image"
import Link from "next/link"
import { MapPin, Heart, MessageCircle } from "lucide-react"
import { getCategoryLabel } from "@/lib/categories"
import { useState } from "react"

interface ListingCardProps {
    listing: any // Using any for now due to location transformation
}

export function ListingCard({ listing }: ListingCardProps) {
    const [isFavorite, setIsFavorite] = useState(false)
    const isSold = listing.status === 'sold'
    const isPro = listing.profiles?.is_pro || false // Will be added to DB

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsFavorite(!isFavorite)
        // TODO: Call server action to toggle favorite
    }

    const handleMessage = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        // TODO: Navigate to message/conversation
        console.log('Message seller')
    }

    return (
        <Link
            href={`/listings/${listing.id}`}
            className="group block bg-card rounded-[24px] overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.2)] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative border border-transparent dark:border-border"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                {listing.images?.[0] ? (
                    <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isSold ? 'grayscale opacity-70' : ''}`}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        Pas d'image
                    </div>
                )}

                {/* Sold Overlay */}
                {isSold && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                        <div className="bg-red-600 text-white px-6 py-2 transform -rotate-12 font-black text-xl uppercase tracking-widest shadow-lg border-4 border-white">
                            VENDU
                        </div>
                    </div>
                )}

                {/* Price Badge - Floating Top Left */}
                <div className="absolute top-3 left-3">
                    <div className="bg-white/95 dark:bg-black/80 backdrop-blur-md text-foreground font-black text-sm px-3 py-1.5 rounded-full shadow-sm flex items-baseline gap-1">
                        {listing.price?.toLocaleString('fr-FR')}
                        <span className="text-[10px] text-muted-foreground font-bold">
                            {listing.currency === 'XAF' ? 'FCFA' : listing.currency}
                        </span>
                    </div>
                </div>

                {/* Action Buttons - Top Right */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {/* Favorite Button */}
                    <button
                        className={`p-2 rounded-full transition-all active:scale-90 shadow-sm ${isFavorite
                                ? 'bg-red-50 dark:bg-red-900/50 text-red-500'
                                : 'bg-black/20 backdrop-blur-md text-white hover:bg-black/30'
                            }`}
                        onClick={handleFavorite}
                    >
                        <Heart size={18} className={isFavorite ? 'fill-current' : ''} strokeWidth={2.5} />
                    </button>

                    {/* Message Button */}
                    {!isSold && (
                        <button
                            className="p-2 rounded-full transition-all active:scale-90 shadow-sm bg-black/20 backdrop-blur-md text-white hover:bg-black/30"
                            onClick={handleMessage}
                        >
                            <MessageCircle size={18} strokeWidth={2.5} />
                        </button>
                    )}
                </div>

                {/* PRO Badge */}
                {isPro && (
                    <span className="absolute bottom-3 left-3 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        PRO
                    </span>
                )}
            </div>

            {/* Content - Minimalist */}
            <div className="p-4">
                <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="text-foreground font-bold leading-snug line-clamp-2 flex-grow text-[15px]">
                        {listing.title}
                    </h3>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin size={14} />
                        <span className="text-xs font-medium truncate max-w-[100px]">
                            {listing.quartier || "Bangui"}
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {new Date(listing.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short'
                        })}
                    </span>
                </div>
            </div>
        </Link>
    )
}
