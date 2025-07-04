import { Suspense } from "react"
import type { Metadata } from "next"
import ProductList from "@/components/product-list"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Package, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "Danh sách Sản phẩm | Cửa hàng",
  description: "Khám phá bộ sưu tập sản phẩm đa dạng với chất lượng cao và giá cả hợp lý.",
}

function ProductListSkeleton() {
  return (
    <div className="space-y-8">
      {/* Category Filter Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>

        {/* Desktop filter skeleton */}
        <div className="hidden sm:block">
          <div className="flex gap-3 pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-24 flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Mobile filter skeleton */}
        <div className="block sm:hidden">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader className="pb-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Skeleton className="h-10 w-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PageHeader() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>Trang chủ</span>
        <span>/</span>
        <span className="text-foreground font-medium">Sản phẩm</span>
      </nav>

      {/* Main Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Danh sách Sản phẩm</h1>
              <p className="text-muted-foreground">Khám phá bộ sưu tập sản phẩm đa dạng của chúng tôi</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-3">



        </div>
      </div>

      {/* Feature Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
          ✨ Miễn phí vận chuyển
        </Badge>
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
          🔄 Đổi trả 30 ngày
        </Badge>
        <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
          🎁 Ưu đãi đặc biệt
        </Badge>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted dark:from-background dark:to-muted">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <PageHeader />

        <div className="bg-card rounded-xl shadow-sm border p-6 text-foreground">
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
