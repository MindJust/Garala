import { getProfile } from "@/components/features/profile/profile.actions"
import { ProfileForm } from "@/components/features/profile/profile-form"

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
    const profile = await getProfile()

    if (!profile) {
        return <div>Chargement...</div>
    }

    return (
        <div className="container max-w-2xl py-10">
            <h1 className="text-3xl font-bold mb-8">Mon Compte</h1>
            <div className="bg-card p-6 rounded-xl border shadow-sm">
                <ProfileForm initialData={profile} />
            </div>
        </div>
    )
}
