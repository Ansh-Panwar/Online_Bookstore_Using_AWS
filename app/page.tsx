"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BookCard } from "@/components/book-card"
import { Input } from "@/components/ui/input"
import { ArrowRight, BookOpen, Users, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import { mockBooks } from "@/lib/mock-data"

export default function HomePage() {
  const trendingBooks = mockBooks.slice(0, 8)
  const categories = [
    { name: "Fiction", count: "2.5K+", image: "/placeholder.svg?height=200&width=200" },
    { name: "Non-Fiction", count: "1.8K+", image: "/placeholder.svg?height=200&width=200" },
    { name: "Children", count: "950+", image: "/placeholder.svg?height=200&width=200" },
    { name: "Technology", count: "750+", image: "/placeholder.svg?height=200&width=200" },
    { name: "Finance", count: "650+", image: "/placeholder.svg?height=200&width=200" },
    { name: "Health", count: "500+", image: "/placeholder.svg?height=200&width=200" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#124E66] to-[#1a6b7a] text-white py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Discover Your Next
                <span className="text-[#F9A826] block">Favorite Book</span>
              </h1>
              <p className="text-xl text-gray-200 max-w-lg">
                Explore thousands of books across all genres. From bestsellers to hidden gems, find your perfect read.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-[#F9A826] hover:bg-[#e09620] text-black font-semibold">
                  <Link href="/books">
                    Browse Books <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-[#124E66] bg-transparent"
                >
                  View Categories
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-96 bg-gradient-to-br from-[#F9A826] to-[#e09620] rounded-2xl p-8 shadow-2xl">
                <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
                <div className="relative z-10 h-full flex items-center justify-center">
                  <BookOpen className="h-32 w-32 text-white/80" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, label: "Books Available", value: "20K+" },
              { icon: Users, label: "Happy Customers", value: "10K+" },
              { icon: Star, label: "Average Rating", value: "4.8" },
              { icon: TrendingUp, label: "Positive Reviews", value: "95%" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#124E66] text-white rounded-full mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-[#124E66] mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Books Section */}
      <section className="py-16 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#212A31] mb-4">Trending Now</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the most popular books that everyone is talking about
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[#124E66] text-[#124E66] hover:bg-[#124E66] hover:text-white bg-transparent"
            >
              <Link href="/books">View All Books</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#212A31] mb-4">Browse Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find books in your favorite genres and discover new interests
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="bg-gradient-to-br from-[#124E66] to-[#1a6b7a] rounded-xl p-6 text-center text-white hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-200">{category.count} books</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-[#124E66] text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-200 mb-8">
              Subscribe to our newsletter and never miss out on new releases, exclusive deals, and book recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="bg-white text-black" />
              <Button className="bg-[#F9A826] hover:bg-[#e09620] text-black font-semibold">Subscribe</Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
