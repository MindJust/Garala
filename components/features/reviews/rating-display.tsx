'use client'

import { Star } from "lucide-react"

interface RatingDisplayProps {
    average: number
    count: number
    showCount?: boolean
}

export function RatingDisplay({ average, count, showCount = true }: RatingDisplayProps) {
    if (count === 0) {
        return (
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Star className="w-4 h-4" />
                <span>Pas encore d'avis</span>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= Math.round(average)
                    return (
                        <Star
                            key={star}
                            className={`w-4 h-4 ${filled
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                        />
                    )
                })}
            </div>
            <span className="font-semibold">{average.toFixed(1)}</span>
            {showCount && (
                <span className="text-muted-foreground text-sm">
                    ({count} {count === 1 ? 'avis' : 'avis'})
                </span>
            )}
        </div>
    )
}
