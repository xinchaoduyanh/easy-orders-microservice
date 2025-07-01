import { Suspense } from "react"
import ProductList from "@/components/product-list"
import { Skeleton } from "@/components/ui/skeleton"

function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Danh sách Sản phẩm</h1>
      </div>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList />
      </Suspense>
    </div>
  )
}
