'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, ProfileData } from "../auth.schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

export function ProfileStep({
    onBack,
    onSubmit
}: {
    onBack: () => void,
    onSubmit: (data: ProfileData) => void
}) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileData>({
        resolver: zodResolver(profileSchema),
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-lg font-semibold">Dites-nous en plus</h3>
            </div>

            <p className="text-sm text-muted-foreground">
                Ces informations apparaîtront sur votre profil public.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Nom complet</label>
                    <Input
                        {...register("fullName")}
                        placeholder="Jean Dupont"
                        autoComplete="name"
                    />
                    {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Nom d'utilisateur</label>
                    <Input
                        {...register("username")}
                        placeholder="jeandupont"
                        autoComplete="username"
                    />
                    {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    Créer mon compte
                </Button>
            </form>
        </div>
    )
}
