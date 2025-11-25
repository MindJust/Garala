import { ListingWizard } from "@/components/features/listings/listing-wizard"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function NewListingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth')
    }

    return (
        <div className="min-h-screen bg-muted/30 py-10 px-4">
            <ListingWizard />
        </div>
    )
}
