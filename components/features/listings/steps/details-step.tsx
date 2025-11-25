'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { detailsSchema, DetailsData } from "../listings.schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

export function DetailsStep({
    defaultValues,
    onBack,
    onSubmit
}: {
    defaultValues?: Partial<DetailsData>,
    onBack: () => void,
    onSubmit: (data: DetailsData) => void
}) {
    const { register, handleSubmit, formState: { errors } } = useForm<DetailsData>({
        resolver: zodResolver(detailsSchema),
        defaultValues
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Titre de l'annonce</label>
                    <Input {...register("title")} placeholder="Ex: iPhone 12 Pro Max 128Go" />
                    {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description (facultatif)</label>
                    <textarea
                        {...register("description")}
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Décrivez votre article (optionnel)..."
                    />
                    {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">État</label>
                    <select
                        {...register("condition")}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">Sélectionner l'état</option>
                        <option value="new">Neuf</option>
                        <option value="good">Très bon état</option>
                        <option value="fair">Bon état</option>
                        <option value="poor">État satisfaisant</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <Button type="button" variant="ghost" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Button>
                <Button type="submit" size="lg">
                    Suivant
                </Button>
            </div>
        </form>
    )
}
