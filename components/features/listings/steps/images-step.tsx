'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { imagesSchema, ImagesData } from "../listings.schema"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "../image-upload"
import { ArrowLeft } from "lucide-react"

export function ImagesStep({
    defaultValues,
    onBack,
    onSubmit
}: {
    defaultValues?: Partial<ImagesData>,
    onBack: () => void,
    onSubmit: (data: ImagesData) => void
}) {
    const { setValue, watch, handleSubmit, formState: { errors } } = useForm<ImagesData>({
        resolver: zodResolver(imagesSchema),
        defaultValues: {
            images: defaultValues?.images || []
        }
    })

    const images = watch("images")

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <label className="text-sm font-medium">Photos</label>
                <ImageUpload
                    value={images}
                    onChange={(urls) => setValue("images", urls, { shouldValidate: true })}
                />
                {errors.images && <p className="text-sm text-destructive">{errors.images.message}</p>}
            </div>

            <div className="flex justify-between pt-4">
                <Button type="button" variant="ghost" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Button>
                <Button type="submit" size="lg">
                    Publier l'annonce
                </Button>
            </div>
        </form>
    )
}
