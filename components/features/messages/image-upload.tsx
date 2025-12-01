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
