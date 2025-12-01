'use client'

import { useState, useRef } from "react"
import { Image as ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadMessageImage, sendImageMessage } from "./messages.actions"
import { toast } from "sonner"
import Image from "next/image"
import { usePreferences } from "@/hooks/use-preferences"

interface ImageUploadProps {
    conversationId: string
}

export function ImageUpload({ conversationId }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { vibrate } = usePreferences()

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Veuillez sélectionner une image")
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("L'image ne doit pas dépasser 5MB")
            return
        }

        // Show preview
        const reader = new FileReader()
        reader.onload = (e) => {
            setPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)

        // Upload
        setUploading(true)
        const result = await uploadMessageImage(conversationId, file)

        if (result.error) {
            toast.error(result.error)
            setPreview(null)
            setUploading(false)
            return
        }

        // Send as message
        const sendResult = await sendImageMessage(conversationId, result.url!)

        if (sendResult.error) {
            toast.error(sendResult.error)
        } else {
            vibrate(20)
        }

        setPreview(null)
        setUploading(false)

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const cancelUpload = () => {
        setPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
            />

            {preview ? (
                <div className="relative">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <Image src={preview} alt="Preview" fill className="object-cover" />
                    </div>
                    <button
                        onClick={cancelUpload}
                        className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ) : (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="rounded-lg"
                >
                    <ImageIcon className="h-5 w-5" />
                </Button>
            )}
        </>
    )
}
