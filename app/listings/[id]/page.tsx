import { notFound } from "next/navigation"
import { getListing } from "@/components/features/listings/listings.actions"
import { isListingOwner } from "@/components/features/listings/listing-management.actions"
import Image from "next/image"
import { MapPin, User, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCategoryLabel } from "@/lib/categories"
import { ImageGallery } from "@/components/features/listings/image-gallery"
import { ListingActions } from "@/components/features/listings/listing-actions"

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const listing = await getListing(id)

    if (!listing) {
        notFound()
    }

    // Check if current user is the owner
    const isOwner = await isListingOwner(id)

    return (
        <div className="container py-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Images and Description */}
                <div className="md:col-span-2 space-y-8">
                    <ImageGallery images={listing.images} title={listing.title} />

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Description</h2>
                        <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                            {listing.description}
                        </p>
                    </div>
                </div>

                {/* Right Column: Price, Seller, Actions */}
                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-xl border shadow-sm space-y-6">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
                                <div className="text-3xl font-bold text-primary">
                                    {listing.price?.toLocaleString()} FCFA
                                </div>
                            </div>
                            <ListingActions
                                listingId={id}
                                listingTitle={listing.title}
                                isOwner={isOwner}
                                isGuest={listing.is_guest || false}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Catégorie</div>
                                <div className="font-medium">{getCategoryLabel(listing.category)}</div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                                    {listing.profiles?.avatar_url ? (
                                        <Image src={listing.profiles.avatar_url} alt="Seller" width={40} height={40} />
                                    ) : (
                                        <User className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </div>
                                <div>
                                    <div className="font-medium">{listing.profiles?.full_name || listing.profiles?.username || "Vendeur"}</div>
                                    <div className="text-xs text-muted-foreground">Membre depuis {new Date(listing.created_at).getFullYear()}</div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                {listing.phone && (
                                    <>
                                        <a href={`tel:${listing.phone}`} className="w-full">
                                            <Button className="w-full gap-2" size="lg" variant="default">
                                                <Phone className="w-5 h-5" />
                                                Appeler
                                            </Button>
                                        </a>
                                        <a
                                            href={`https://wa.me/${listing.phone.replace(/\D/g, '')}?text=Bonjour, je suis intéressé par votre annonce "${listing.title}"`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full"
                                        >
                                            <Button className="w-full gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white border-0" size="lg">
                                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                </svg>
                                                WhatsApp
                                            </Button>
                                        </a>
                                    </>
                                )}
                                {!listing.phone && (
                                    <Button className="w-full" size="lg" disabled>
                                        Pas de contact disponible
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                        <h3 className="font-semibold">Localisation</h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{listing.quartier || "Bangui"}{listing.arrondissement ? ` (${listing.arrondissement})` : ""}</span>
                        </div>
                        {listing.phone && (
                            <div className="text-sm space-y-1">
                                <div className="font-medium">Téléphone</div>
                                <a href={`tel:${listing.phone}`} className="text-primary hover:underline">{listing.phone}</a>
                            </div>
                        )}
                    </div>

                    <div className="text-xs text-center text-muted-foreground">
                        Annonce publiée le {new Date(listing.created_at).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    )
}
