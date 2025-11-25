import { notFound, redirect } from "next/navigation"
import { getListing } from "@/components/features/listings/listings.actions"
import { isListingOwner } from "@/components/features/listings/listing-management.actions"

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const listing = await getListing(id)

    if (!listing) {
        notFound()
    }

    // Check if current user is the owner
    const isOwner = await isListingOwner(id)

    if (!isOwner) {
        redirect(`/listings/${id}`)
    }

    // Check if it's a guest listing
    if (listing.is_guest) {
        redirect(`/listings/${id}`) // Guest listings cannot be edited
    }

    return (
        <div className="container py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Modifier l'annonce</h1>

            <div className="bg-muted/50 border border-dashed rounded-lg p-12 text-center">
                <p className="text-muted-foreground text-lg mb-4">
                    Page d'édition en cours de développement
                </p>
                <p className="text-sm text-muted-foreground">
                    Cette fonctionnalité sera disponible dans Sprint 2
                </p>
            </div>
        </div>
    )
}
