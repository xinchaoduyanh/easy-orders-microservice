import { Suspense } from "react"
import OrderDashboard from "@/components/order-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

function OrderDashboardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Đơn hàng</h1>
      <Suspense fallback={<OrderDashboardSkeleton />}>
        <OrderDashboard />
      </Suspense>
    </div>
  )
}
