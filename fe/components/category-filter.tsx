"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { ProductCategory } from "@/lib/types"
import { Filter, X } from "lucide-react"

interface CategoryFilterProps {
  selectedCategory: ProductCategory | "ALL"
  onCategoryChange: (category: ProductCategory | "ALL") => void
}

const categories: {
  value: ProductCategory | "ALL"
  label: string
  color: string
  icon: string
}[] = [
  { value: "ALL", label: "Tất cả", color: "bg-slate-500 hover:bg-slate-600", icon: "🏪" },
  { value: "ELECTRONICS", label: "Điện tử", color: "bg-blue-500 hover:bg-blue-600", icon: "📱" },
  { value: "CLOTHING", label: "Thời trang", color: "bg-purple-500 hover:bg-purple-600", icon: "👕" },
  { value: "BOOKS", label: "Sách", color: "bg-green-500 hover:bg-green-600", icon: "📚" },
  { value: "HOME_GARDEN", label: "Nhà cửa", color: "bg-orange-500 hover:bg-orange-600", icon: "🏡" },
  { value: "SPORTS", label: "Thể thao", color: "bg-red-500 hover:bg-red-600", icon: "⚽" },
  { value: "BEAUTY", label: "Làm đẹp", color: "bg-pink-500 hover:bg-pink-600", icon: "💄" },
  { value: "FOOD_BEVERAGE", label: "Thực phẩm", color: "bg-yellow-500 hover:bg-yellow-600", icon: "🍕" },
  { value: "OTHER", label: "Khác", color: "bg-gray-500 hover:bg-gray-600", icon: "📦" },
]

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const selectedCategoryData = categories.find((cat) => cat.value === selectedCategory)
  const activeFiltersCount = selectedCategory === "ALL" ? 0 : 1

  const handleClearFilters = () => {
    onCategoryChange("ALL")
  }

  return (
    <div className="space-y-4">
      {/* Header with filter info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">Danh mục sản phẩm</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount} bộ lọc
            </Badge>
          )}
        </div>

        {selectedCategory !== "ALL" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Mobile: Compact view with expand option */}
      <div className="block sm:hidden">
        {!isExpanded ? (
          <div className="space-y-3">
            {/* Selected category display */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Đang xem:</span>
              <Badge className={`${selectedCategoryData?.color} text-white border-0 px-3 py-1`}>
                <span className="mr-1">{selectedCategoryData?.icon}</span>
                {selectedCategoryData?.label}
              </Badge>
            </div>

            <Button variant="outline" size="sm" onClick={() => setIsExpanded(true)} className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Thay đổi danh mục
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    onCategoryChange(category.value)
                    setIsExpanded(false)
                  }}
                  className={`justify-start h-auto py-2 px-3 ${
                    selectedCategory === category.value
                      ? `${category.color} text-white border-0 hover:opacity-90`
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="mr-2 text-base">{category.icon}</span>
                  <span className="text-xs font-medium">{category.label}</span>
                </Button>
              ))}
            </div>

            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)} className="w-full">
              Thu gọn
            </Button>
          </div>
        )}
      </div>

      {/* Desktop: Full horizontal scroll view */}
      <div className="hidden sm:block">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 pb-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="lg"
                onClick={() => onCategoryChange(category.value)}
                className={`flex-shrink-0 h-12 px-4 transition-all duration-200 ${
                  selectedCategory === category.value
                    ? `${category.color} text-white border-0 shadow-md hover:opacity-90 scale-105`
                    : "hover:bg-muted hover:scale-105"
                }`}
              >
                <span className="mr-2 text-lg">{category.icon}</span>
                <span className="font-medium">{category.label}</span>
                {selectedCategory === category.value && (
                  <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="mt-2" />
        </ScrollArea>
      </div>

      {/* Active filter summary */}
      {selectedCategory !== "ALL" && (
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm text-muted-foreground">Đang lọc theo:</span>
            <Badge className={`${selectedCategoryData?.color} text-white border-0`}>
              <span className="mr-1">{selectedCategoryData?.icon}</span>
              {selectedCategoryData?.label}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
