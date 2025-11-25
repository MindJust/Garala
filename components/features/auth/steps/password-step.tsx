'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { passwordSchema, PasswordData } from "../auth.schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

export function PasswordStep({
    email,
    onBack,
    onSubmit,
    mode
}: {
    email: string,
    onBack: () => void,
    onSubmit: (password: string) => void,
    mode: 'login' | 'signup'
}) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PasswordData>({
        resolver: zodResolver(passwordSchema),
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="text-sm text-muted-foreground">
                    {email}
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                    {mode === 'login' ? "Bon retour parmi nous !" : "Créer un mot de passe"}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {mode === 'login'
                        ? "Entrez votre mot de passe pour vous connecter."
                        : "Choisissez un mot de passe sécurisé pour votre compte."}
                </p>
            </div>

            <form onSubmit={handleSubmit((data) => onSubmit(data.password))} className="space-y-4">
                <div className="space-y-2">
                    <Input
                        {...register("password")}
                        placeholder="Mot de passe"
                        type="password"
                        autoComplete={mode === 'login' ? "current-password" : "new-password"}
                    />
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {mode === 'login' ? "Se connecter" : "Continuer"}
                </Button>
            </form>
        </div>
    )
}
