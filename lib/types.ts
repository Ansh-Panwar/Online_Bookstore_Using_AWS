export interface Book {
    id: string
    title: string
    author: string
    price: number
    originalPrice?: number
    discount?: number
    rating: number
    reviews: number
    category: string
    image: string
    description?: string
    publishDate: string
    publisher?: string
    pages?: number
    isbn?: string
  }
  