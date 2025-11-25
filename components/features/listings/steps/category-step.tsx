'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { categorySchema, CategoryData } from "../listings.schema"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Car, Home, Smartphone, Shirt, Sofa, Bike, Music, Gamepad } from "lucide-react"

const CATEGORIES = [
    { id: "vehicles", label: "Véhicules", icon: Car },
    { id: "real_estate", label: "Immobilier", icon: Home },
    { id: "electronics", label: "Électronique", icon: Smartphone },
    { id: "fashion", label: "Mode", icon: Shirt },
    { id: "home", label: "Maison", icon: Sofa },
    { id: "hobbies", label: "Loisirs", icon: Bike },
    { id: "multimedia", label: "Multimédia", icon: Music },
    { id: "games", label: "Jeux & Jouets", icon: Gamepad },
]

export function CategoryStep({
    defaultValues,
    onSubmit
}: {
    defaultValues?: Partial<CategoryData>,
    onSubmit: (data: CategoryData) => void
}) {
    const { setValue, watch, handleSubmit, formState: { errors } } = useForm<CategoryData>({
        resolver: zodResolver(categorySchema),
        defaultValues
    })

    const selectedCategory = watch("category")

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon
                    const isSelected = selectedCategory === cat.id
                    return (
                        <div
                            key={cat.id}
                            onClick={() => setValue("category", cat.id, { shouldValidate: true })}
                            className={cn(
                                "cursor-pointer flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all hover:border-primary/50 hover:bg-accent",
                                isSelected ? "border-primary bg-primary/5" : "border-transparent bg-card shadow-sm"
                            )}
                        >
                            <Icon className={cn("w-8 h-8", isSelected ? "text-primary" : "text-muted-foreground")} />
                            <span className={cn("font-medium text-sm", isSelected ? "text-primary" : "text-foreground")}>
                                {cat.label}
                            </span>
                        </div>
                    )
                })}
            </div>
            {errors.category && <p className="text-sm text-destructive text-center">{errors.category.message}</p>}

            <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={!selectedCategory}>
                    Suivant
                </Button>
            </div>
        </form>
    )
}
