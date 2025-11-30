import { getProfile } from "@/components/features/profile/profile.actions"
import { ProfileForm } from "@/components/features/profile/profile-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { VibrationToggle } from "@/components/vibration-toggle"

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
    const profile = await getProfile()

    if (!profile) {
        return <div>Chargement...</div>
    }

    return (
        <div className="container max-w-2xl py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Mon Compte</h1>
                <ThemeToggle />
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm">
                <ProfileForm initialData={profile} />
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm mt-6">
                <h2 className="text-xl font-semibold mb-4">Préférences</h2>
                <VibrationToggle />
            </div>
        </div>
    )
}
