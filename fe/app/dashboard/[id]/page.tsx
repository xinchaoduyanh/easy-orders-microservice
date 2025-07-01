import { Suspense } from "react"
import OrderDetails from "@/components/order-details"
import { Skeleton } from "@/components/ui/skeleton"

function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  )
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<OrderDetailsSkeleton />}>
      <OrderDetails orderId={params.id} />
    </Suspense>
  )
}
