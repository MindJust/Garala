import { getListings } from "@/components/features/listings/listings.actions"
import { ListingFeed } from "@/components/features/listings/listing-feed"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default async function Home() {
  const listings = await getListings()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            Tout se vend, tout s'achète
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            La plateforme de petites annonces #1 en République Centrafricaine
          </p>
        </div>
      </div>

      {/* Listings Feed */}
      <div className="container py-12">
        <h2 className="text-2xl font-bold mb-8">Dernières annonces</h2>
        <ListingFeed initialListings={listings} />
      </div>
    </div>
  );
}
