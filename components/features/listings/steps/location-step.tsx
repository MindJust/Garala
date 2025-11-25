'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { locationSchema, LocationData } from "../listings.schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { searchQuartiers, ARRONDISSEMENTS } from "@/lib/bangui-locations"

export function LocationStep({
    defaultValues,
    onBack,
    onSubmit
}: {
    defaultValues?: Partial<LocationData>,
    onBack: () => void,
    onSubmit: (data: LocationData) => void
}) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedQuartier, setSelectedQuartier] = useState(defaultValues?.quartier || "")
    const [selectedArr, setSelectedArr] = useState(defaultValues?.arrondissement || "")

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<LocationData>({
        resolver: zodResolver(locationSchema),
        defaultValues
    })

    const filteredQuartiers = searchTerm ? searchQuartiers(searchTerm) : []

    const handleQuartierSelect = (quartier: string, arr: string) => {
        setSelectedQuartier(quartier)
        setSelectedArr(arr)
        setValue("quartier", quartier, { shouldValidate: true })
        setValue("arrondissement", arr, { shouldValidate: true })
        setSearchTerm("")
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Localisation</label>
                    <div className="relative">
                        <Input
                            value={selectedQuartier || searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher un quartier à Bangui..."
                        />
                        {searchTerm && filteredQuartiers.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-card border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {filteredQuartiers.map((loc, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleQuartierSelect(loc.quartier, loc.arrondissement)}
                                        className="w-full text-left px-4 py-2 hover:bg-accent transition-colors"
                                    >
                                        <div className="font-medium">{loc.quartier}</div>
                                        <div className="text-xs text-muted-foreground">{loc.arrondissement} arrondissement</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {selectedQuartier && (
                        <div className="text-sm text-muted-foreground">
                            Sélectionné : <span className="font-medium">{selectedQuartier}</span> ({selectedArr} arrondissement)
                        </div>
                    )}
                    {errors.quartier && <p className="text-sm text-destructive">{errors.quartier.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Téléphone (facultatif)</label>
                    <Input
                        {...register("phone")}
                        placeholder="+236 XX XX XX XX"
                        type="tel"
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                    <p className="text-xs text-muted-foreground">Format: +236 suivi de 8 chiffres</p>
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
