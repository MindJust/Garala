import { notFound, redirect } from "next/navigation"
import { getListing } from "@/components/features/listings/listings.actions"
import { isListingOwner } from "@/components/features/listings/listing-management.actions"
import { ListingWizard } from "@/components/features/listings/listing-wizard"
import { ListingData } from "@/components/features/listings/listings.schema"

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

    // Check if it's a guest listing (future feature)
    if (listing.is_guest) {
        redirect(`/listings/${id}`) // Guest listings cannot be edited
    }

    // Transform listing data to match ListingData schema
    const initialData: Partial<ListingData> = {
        category: listing.category,
        title: listing.title,
        description: listing.description || undefined,
        price: listing.price,
        currency: listing.currency,
        quartier: listing.quartier,
        arrondissement: listing.arrondissement || undefined,
        phone: listing.phone || undefined,
        images: listing.images || []
    }

    return (
        <div className="container py-8 max-w-3xl">
            <ListingWizard
                mode="edit"
                listingId={id}
                initialData={initialData}
            />
        </div>
    )
}
