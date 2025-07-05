"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RatingStars } from "@/components/rating-stars"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { motion } from "framer-motion"
import type { Book } from "@/lib/types"

interface BookCardProps {
  book: Book
  viewMode?: "grid" | "list"
}

export function BookCard({ book, viewMode = "grid" }: BookCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart({ ...book, quantity: 1 })
    toast({
      title: "Added to cart",
      description: `${book.title} has been added to your cart.`,
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${book.title} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    })
  }

  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
      >
        <Link href={`/books/${book.id}`}>
          <div className="flex gap-4 p-4">
            <div className="relative flex-shrink-0">
              <Image
                src={book.image || "/placeholder.svg"}
                alt={book.title}
                width={80}
                height={120}
                className="rounded-md object-cover"
              />
              {book.discount && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">{book.discount}% OFF</Badge>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-[#212A31] truncate">{book.title}</h3>
                  <p className="text-gray-600 mb-1">by {book.author}</p>
                  <Badge variant="secondary" className="text-xs">
                    {book.category}
                  </Badge>
                </div>
                <div className="flex flex-col items-end ml-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold text-[#124E66]">${book.price}</span>
                    {book.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${book.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <RatingStars rating={book.rating} size="sm" />
                    <span className="text-sm text-gray-500">({book.reviews})</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {book.description || "A captivating story that will keep you engaged from start to finish."}
              </p>
              <div className="flex items-center gap-2">
                <Button onClick={handleAddToCart} size="sm" className="bg-[#124E66] hover:bg-[#0f3d52]">
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWishlist}
                  className={isWishlisted ? "text-red-500 border-red-500" : ""}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/books/${book.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
    >
      <Link href={`/books/${book.id}`}>
        <div className="relative">
          <Image
            src={book.image || "/placeholder.svg"}
            alt={book.title}
            width={300}
            height={400}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {book.discount && <Badge className="absolute top-2 left-2 bg-red-500 text-white">{book.discount}% OFF</Badge>}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleWishlist}
              className={`${isWishlisted ? "text-red-500" : ""} bg-white/90 hover:bg-white`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
        <div className="p-4">
          <Badge variant="secondary" className="text-xs mb-2">
            {book.category}
          </Badge>
          <h3 className="font-semibold text-lg text-[#212A31] mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-gray-600 mb-2">by {book.author}</p>
          <div className="flex items-center gap-1 mb-3">
            <RatingStars rating={book.rating} size="sm" />
            <span className="text-sm text-gray-500">({book.reviews})</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#124E66]">${book.price}</span>
              {book.originalPrice && <span className="text-sm text-gray-500 line-through">${book.originalPrice}</span>}
            </div>
          </div>
          <Button
            onClick={handleAddToCart}
            className="w-full bg-[#124E66] hover:bg-[#0f3d52] transition-colors duration-200"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </Link>
    </motion.div>
  )
}
