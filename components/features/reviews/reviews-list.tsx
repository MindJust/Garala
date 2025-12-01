'use client'

import { Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Review } from "./reviews.actions"
import { deleteReview } from "./reviews.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface ReviewsListProps {
    reviews: Review[]
    currentUserId?: string
}

export function ReviewsList({ reviews, currentUserId }: ReviewsListProps) {
    const router = useRouter()

    const handleDelete = async (reviewId: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) return

        const result = await deleteReview(reviewId)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Avis supprimé")
            router.refresh()
        }
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Aucun avis pour le moment
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            {review.reviewer?.avatar_url ? (
                                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                    <Image
                                        src={review.reviewer.avatar_url}
                                        alt={review.reviewer.full_name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-primary font-semibold">
                                        {review.reviewer?.full_name?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                            )}
                            <div>
                                <p className="font-semibold">
                                    {review.reviewer?.full_name || "Utilisateur"}
                                </p>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${star <= review.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {currentUserId === review.reviewer_id && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(review.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    {review.comment && (
                        <p className="text-sm">{review.comment}</p>
                    )}

                    <p className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            ))}
        </div>
    )
}
