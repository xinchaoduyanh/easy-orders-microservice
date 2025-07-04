"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Product, ProductCategory } from "@/lib/types"
import { ShoppingCart, AlertCircle } from "lucide-react"
import { useProduct } from "@/queries"
import AddToCartDialog from "./add-to-cart-dialog"
import { CategoryFilter } from "./category-filter"
import React from "react";

const categoryColors: Record<ProductCategory, string> = {
  ELECTRONICS: "bg-blue-500 hover:bg-blue-600",
  CLOTHING: "bg-purple-500 hover:bg-purple-600",
  BOOKS: "bg-green-500 hover:bg-green-600",
  HOME_GARDEN: "bg-orange-500 hover:bg-orange-600",
  SPORTS: "bg-red-500 hover:bg-red-600",
  BEAUTY: "bg-pink-500 hover:bg-pink-600",
  FOOD_BEVERAGE: "bg-yellow-500 hover:bg-yellow-600",
  OTHER: "bg-gray-500 hover:bg-gray-600",
}

const categoryLabels: Record<ProductCategory, string> = {
  ELECTRONICS: "Điện tử",
  CLOTHING: "Thời trang",
  BOOKS: "Sách",
  HOME_GARDEN: "Nhà cửa",
  SPORTS: "Thể thao",
  BEAUTY: "Làm đẹp",
  FOOD_BEVERAGE: "Thực phẩm",
  OTHER: "Khác",
}

function ProductSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="space-y-3">
        <Skeleton className="h-40 w-full rounded-md" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent className="flex-1">
        <Skeleton className="h-8 w-20" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product) => void }) {
  return (
    <Card className="group flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-3">
        {product.imageUrl && (
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {product.category && (
              <Badge
                variant="secondary"
                className={`absolute top-2 right-2 ${categoryColors[product.category]} text-white border-0 shadow-sm`}
              >
                {categoryLabels[product.category]}
              </Badge>
            )}
          </div>
        )}

        <div className="space-y-2">
          <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">{product.name}</CardTitle>

          {product.description && <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">${Number(product.price).toFixed(2)}</div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={() => onAddToCart(product)}
          className="w-full transition-all duration-200 hover:shadow-md"
          size="lg"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Thêm vào giỏ hàng
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function ProductList() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "ALL">("ALL")
  const [page, setPage] = useState(1)
  const PRODUCTS_PER_PAGE = 20;

  const { data: products, isLoading, isError } = useProduct()

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedProduct(null)
  }

  const filteredProducts = products?.filter((product: Product) => {
    if (selectedCategory === "ALL") return true
    return product.category === selectedCategory
  }) || [];

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  // Reset to page 1 when category changes
  React.useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-center">
            Có lỗi xảy ra khi tải danh sách sản phẩm. Vui lòng thử lại sau.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <div className="space-y-6">
        <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="text-6xl">🛍️</div>
          <h3 className="text-xl font-semibold text-muted-foreground">Không tìm thấy sản phẩm nào</h3>
          <p className="text-muted-foreground text-center max-w-md">
            {selectedCategory === "ALL"
              ? "Hiện tại chưa có sản phẩm nào trong cửa hàng."
              : `Không có sản phẩm nào trong danh mục "${categoryLabels[selectedCategory as ProductCategory]}".`}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            className="px-3 py-1 rounded border bg-card text-foreground disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded border bg-card text-foreground disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            &gt;
          </button>
        </div>
      )}

      <AddToCartDialog product={selectedProduct} isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </div>
  )
}
