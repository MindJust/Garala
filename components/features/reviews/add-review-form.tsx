'use client'

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addReview } from "./reviews.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AddReviewFormProps {
    listingId: string
}

export function AddReviewForm({ listingId }: AddReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            toast.error("Veuillez sélectionner une note")
            return
        }

        setSubmitting(true)
        const result = await addReview(listingId, rating, comment)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Avis ajouté avec succès")
            setRating(0)
            setComment("")
            router.refresh()
        }

        setSubmitting(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4">
            <h3 className="font-semibold">Laisser un avis</h3>

            {/* Star Rating */}
            <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                    Note
                </label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 hover:scale-110 transition-transform"
                        >
                            <Star
                                className={`w-8 h-8 ${star <= (hoverRating || rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Comment */}
            <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                    Commentaire (optionnel)
                </label>
                <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Partagez votre expérience..."
                    rows={4}
                    maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">
                    {comment.length}/500 caractères
                </p>
            </div>

            <Button type="submit" disabled={submitting || rating === 0}>
                {submitting ? "Envoi..." : "Publier l'avis"}
            </Button>
        </form>
    )
}
