import { Star } from "lucide-react"

interface RatingStarsProps {
  rating: number
  size?: "sm" | "md" | "lg"
  showNumber?: boolean
}

export function RatingStars({ rating, size = "md", showNumber = false }: RatingStarsProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
        />
      ))}
      {showNumber && <span className="ml-1 text-sm text-gray-600">({rating})</span>}
    </div>
  )
}
