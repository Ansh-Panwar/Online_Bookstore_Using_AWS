"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RatingStars } from "@/components/rating-stars"
import { X } from "lucide-react"

interface FilterSidebarProps {
  filters: {
    category: string
    priceRange: number[]
    rating: number
    author: string
  }
  onFiltersChange: (filters: any) => void
}

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const categories = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Fantasy",
    "Biography",
    "History",
    "Self-Help",
    "Children",
    "Technology",
    "Business",
  ]

  const ratings = [5, 4, 3, 2, 1]

  const handleCategoryChange = (category: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      category: checked ? category : "",
    })
  }

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: value,
    })
  }

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      rating: filters.rating === rating ? 0 : rating,
    })
  }

  const handleAuthorChange = (author: string) => {
    onFiltersChange({
      ...filters,
      author,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      category: "",
      priceRange: [0, 100],
      rating: 0,
      author: "",
    })
  }

  const hasActiveFilters =
    filters.category || filters.rating > 0 || filters.author || filters.priceRange[0] > 0 || filters.priceRange[1] < 100

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Categories</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={filters.category === category}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label htmlFor={category} className="text-sm cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Price Range</Label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceRangeChange}
              max={100}
              min={0}
              step={5}
              className="mb-4"
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Rating */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Rating</Label>
          <div className="space-y-2">
            {ratings.map((rating) => (
              <div
                key={rating}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                onClick={() => handleRatingChange(rating)}
              >
                <Checkbox checked={filters.rating === rating} readOnly />
                <RatingStars rating={rating} size="sm" />
                <span className="text-sm text-gray-600">& up</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Author */}
        <div>
          <Label htmlFor="author" className="text-base font-semibold mb-3 block">
            Author
          </Label>
          <Input
            id="author"
            placeholder="Search by author..."
            value={filters.author}
            onChange={(e) => handleAuthorChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
