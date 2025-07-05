"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RatingStars } from "@/components/rating-stars"
import { BookCard } from "@/components/book-card"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react"
import { mockBooks } from "@/lib/mock-data"
import { motion } from "framer-motion"
import Image from "next/image"

export default function BookDetailPage() {
  const params = useParams()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const book = mockBooks.find((b) => b.id === params.id)
  const relatedBooks = mockBooks.filter((b) => b.category === book?.category && b.id !== book?.id).slice(0, 4)

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Book not found</h1>
          <p className="text-gray-500">The book you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart({ ...book, quantity })
    toast({
      title: "Added to cart",
      description: `${book.title} has been added to your cart.`,
    })
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${book.title} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    })
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            {/* Book Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="relative group">
                <Image
                  src={book.image || "/placeholder.svg"}
                  alt={book.title}
                  width={400}
                  height={600}
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                {book.discount && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white">{book.discount}% OFF</Badge>
                )}
              </div>
            </motion.div>

            {/* Book Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <Badge variant="secondary" className="mb-2">
                  {book.category}
                </Badge>
                <h1 className="text-3xl font-bold text-[#212A31] mb-2">{book.title}</h1>
                <p className="text-lg text-gray-600 mb-4">by {book.author}</p>
                <div className="flex items-center gap-4 mb-4">
                  <RatingStars rating={book.rating} />
                  <span className="text-sm text-gray-500">({book.reviews} reviews)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-[#124E66]">${book.price}</span>
                  {book.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">${book.originalPrice}</span>
                  )}
                </div>
                <p className="text-green-600 font-medium">In Stock</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-medium">Quantity:</label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      -
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleAddToCart} className="flex-1 bg-[#124E66] hover:bg-[#0f3d52]">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleWishlist}
                    className={isWishlisted ? "text-red-500 border-red-500" : ""}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                <Button className="w-full bg-[#F9A826] hover:bg-[#e09620] text-black font-semibold">Buy Now</Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="h-8 w-8 mx-auto mb-2 text-[#124E66]" />
                  <p className="text-sm font-medium">Free Delivery</p>
                  <p className="text-xs text-gray-500">On orders over $25</p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-[#124E66]" />
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% protected</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-8 w-8 mx-auto mb-2 text-[#124E66]" />
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-gray-500">30-day policy</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs Section */}
          <div className="border-t p-8">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({book.reviews})</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {book.description ||
                      "This is a captivating book that will take you on an incredible journey. With compelling characters and an engaging plot, it's a must-read for anyone who enjoys quality literature. The author's masterful storytelling and attention to detail make this book a standout in its genre."}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl font-bold text-[#124E66]">{book.rating}</div>
                    <div>
                      <RatingStars rating={book.rating} />
                      <p className="text-sm text-gray-500">{book.reviews} reviews</p>
                    </div>
                  </div>
                  {/* Sample reviews */}
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <RatingStars rating={5} />
                        <span className="font-medium">John Doe</span>
                        <span className="text-sm text-gray-500">2 days ago</span>
                      </div>
                      <p className="text-gray-700">Excellent book! Couldn't put it down once I started reading.</p>
                    </div>
                    <div className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <RatingStars rating={4} />
                        <span className="font-medium">Jane Smith</span>
                        <span className="text-sm text-gray-500">1 week ago</span>
                      </div>
                      <p className="text-gray-700">Great story and well-developed characters. Highly recommend!</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="details" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Book Information</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Author:</dt>
                        <dd className="font-medium">{book.author}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Publisher:</dt>
                        <dd className="font-medium">{book.publisher || "Penguin Random House"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Publication Date:</dt>
                        <dd className="font-medium">{book.publishDate}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Pages:</dt>
                        <dd className="font-medium">{book.pages || "320"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Language:</dt>
                        <dd className="font-medium">English</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">ISBN:</dt>
                        <dd className="font-medium">{book.isbn || "978-0-123456-78-9"}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#212A31] mb-6">Related Books</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBooks.map((relatedBook) => (
                <BookCard key={relatedBook.id} book={relatedBook} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
