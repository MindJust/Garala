'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { priceSchema, PriceData } from "../listings.schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

export function PriceStep({
    defaultValues,
    onBack,
    onSubmit
}: {
    defaultValues?: Partial<PriceData>,
    onBack: () => void,
    onSubmit: (data: PriceData) => void
}) {
    const { register, handleSubmit, formState: { errors } } = useForm<PriceData>({
        resolver: zodResolver(priceSchema),
        defaultValues: {
            currency: "XAF",
            ...defaultValues
        }
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Prix</label>
                    <div className="relative">
                        <Input
                            {...register("price")}
                            type="number"
                            min="0"
                            step="1"
                            className="pr-16"
                            placeholder="0"
                        />
                        <span className="absolute right-3 top-2.5 text-muted-foreground font-medium">FCFA</span>
                    </div>
                    {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
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
