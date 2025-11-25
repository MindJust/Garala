import Image from "next/image"
import Link from "next/link"
import { ListingData } from "./listings.schema"
import { MapPin } from "lucide-react"
import { getCategoryLabel } from "@/lib/categories"

interface ListingCardProps {
    listing: any // Using any for now due to location transformation
}

export function ListingCard({ listing }: ListingCardProps) {
    return (
        <Link href={`/listings/${listing.id}`} className="group block">
            <div className="bg-card rounded-xl border overflow-hidden shadow-sm transition-all hover:shadow-md">
                <div className="aspect-[4/3] relative bg-muted">
                    {listing.images?.[0] ? (
                        <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            Pas d'image
                        </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs font-medium">
                        {getCategoryLabel(listing.category)}
                    </div>
                </div>

                <div className="p-4 space-y-2">
                    <h3 className="font-semibold line-clamp-2 text-base">{listing.title}</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">
                            {listing.price?.toLocaleString()}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">FCFA</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{listing.quartier || "Bangui"}</span>
                    </div>
                    <div className="text-xs text-muted-foreground pt-2 border-t mt-2">
                        Publié le {new Date(listing.created_at).toLocaleDateString('fr-FR')}
                    </div>
                </div>
            </div>
        </Link>
    )
}
