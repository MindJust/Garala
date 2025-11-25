'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, ProfileData } from "../auth/auth.schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateProfile, signOut } from "./profile.actions"
import { deleteAccount } from "../account/account.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function ProfileForm({ initialData }: { initialData: ProfileData & { email?: string } }) {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: initialData.fullName || "",
            username: initialData.username || "",
        },
    })

    const onSubmit = async (data: ProfileData) => {
        const res = await updateProfile(data)
        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success(res.message)
            router.refresh()
        }
    }

    const handleDeleteAccount = async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
            return
        }

        const res = await deleteAccount()
        if (res?.error) {
            toast.error(res.error)
        }
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Mes informations</h3>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input value={initialData.email} disabled className="bg-muted" />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nom complet</label>
                            <Input {...register("fullName")} />
                            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nom d'utilisateur</label>
                            <Input {...register("username")} />
                            {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                Enregistrer
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="pt-8 border-t space-y-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">Déconnexion</h3>
                    <Button variant="outline" onClick={() => signOut()}>
                        Se déconnecter
                    </Button>
                </div>

                <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium text-destructive mb-2">Zone de danger</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        La suppression de votre compte est irréversible. Toutes vos annonces seront supprimées.
                    </p>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                        Supprimer mon compte
                    </Button>
                </div>
            </div>
        </div>
    )
}
