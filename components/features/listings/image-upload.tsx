'use client'

import { useState } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import imageCompression from 'browser-image-compression'
import { toast } from 'sonner'

export function ImageUpload({
    value,
    onChange,
    maxImages = 10
}: {
    value: string[]
    onChange: (urls: string[]) => void
    maxImages?: number
}) {
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])

        if (!files.length) return

        // Limit total images
        const remainingSlots = maxImages - value.length
        if (files.length > remainingSlots) {
            toast.error(`Vous pouvez ajouter maximum ${remainingSlots} image(s) supplémentaire(s)`)
            return
        }

        setUploading(true)
        setUploadProgress(0)

        try {
            const newUrls: string[] = []
            const totalFiles = files.length

            for (let i = 0; i < files.length; i++) {
                const file = files[i]

                // Update progress
                setUploadProgress(Math.round(((i + 1) / totalFiles) * 100))

                // Compress image (WhatsApp style - max 1MB)
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                }

                const compressedFile = await imageCompression(file, options)

                // Upload to Supabase
                const formData = new FormData()
                formData.append('file', compressedFile)

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (!response.ok) {
                    throw new Error(`Upload failed for image ${i + 1}`)
                }

                const data = await response.json()
                newUrls.push(data.url)
            }

            onChange([...value, ...newUrls])
            toast.success(`${newUrls.length} image(s) ajoutée(s) avec succès`)

        } catch (error) {
            console.error('Error uploading images:', error)
            toast.error('Erreur lors de l\'upload des images')
        } finally {
            setUploading(false)
            setUploadProgress(0)
        }
    }

    const removeImage = (index: number) => {
        const newValue = value.filter((_, i) => i !== index)
        onChange(newValue)
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {value.map((url, index) => (
                    <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
                        <Image
                            src={url}
                            alt={`Image ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                        </div>
                    </div>
                ))}

                {value.length < maxImages && (
                    <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                            className="hidden"
                        />
                        {uploading ? (
                            <div className="text-center">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                                <p className="text-sm font-medium">{uploadProgress}%</p>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground text-center px-2">
                                    Ajouter des photos
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {value.length}/{maxImages}
                                </p>
                            </>
                        )}
                    </label>
                )}
            </div>

            {uploading && (
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                    />
                </div>
            )}

            <p className="text-sm text-muted-foreground">
                <ImageIcon className="w-4 h-4 inline mr-1" />
                Sélectionnez jusqu'à {maxImages} photos depuis votre galerie. Elles seront automatiquement compressées.
            </p>
        </div>
    )
}
