"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import type { Order, OrderItem } from "@/lib/types"
import {
  ArrowLeft,
  Package,
  User,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Mail,
  Copy,
  Download,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useOrder } from "@/queries"

const statusConfig = {
  CREATED: {
    label: "Đã tạo",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Clock,
    progress: 25,
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: CheckCircle,
    progress: 50,
  },
  DELIVERED: {
    label: "Đã giao",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Truck,
    progress: 100,
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    progress: 0,
  },
}

function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-8 w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-2 w-full" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function OrderDetails({ orderId }: { orderId: string }) {
  const { orderDetailQuery } = useOrder(orderId)
  const [order, setOrder] = useState<Order | undefined>(orderDetailQuery.data)
  const { toast } = useToast()

  useEffect(() => {
    setOrder(orderDetailQuery.data)
  }, [orderDetailQuery.data])

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId)
    toast({
      title: "Đã sao chép",
      description: "ID đơn hàng đã được sao chép vào clipboard",
    })
  }

  const handleRefresh = () => {
    orderDetailQuery.refetch()
    toast({
      title: "Đã làm mới",
      description: "Thông tin đơn hàng đã được cập nhật",
    })
  }

  if (orderDetailQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
        <div className="container mx-auto px-4 py-8">
          <OrderDetailsSkeleton />
        </div>
      </div>
    )
  }

  if (orderDetailQuery.isError || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Không tìm thấy đơn hàng</h2>
              <p className="text-muted-foreground">Đơn hàng #{orderId} không tồn tại hoặc đã bị xóa.</p>
            </div>
            <Button asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const statusInfo = statusConfig[order.status as keyof typeof statusConfig]
  const StatusIcon = statusInfo.icon
  const totalItems = order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Chi tiết đơn hàng</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  Đơn hàng #{order.id}
                  <Button variant="ghost" size="sm" onClick={handleCopyOrderId}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </h1>
                <p className="text-muted-foreground">Tạo lúc {new Date(order.createdAt).toLocaleString("vi-VN")}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Làm mới
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất PDF
              </Button>
            </div>
          </div>

          {/* Status Alert */}
          <Alert
            className={`border-l-4 ${statusInfo.color.includes("green") ? "border-l-green-500" : statusInfo.color.includes("red") ? "border-l-red-500" : statusInfo.color.includes("yellow") ? "border-l-yellow-500" : "border-l-blue-500"}`}
          >
            <StatusIcon className="h-4 w-4" />
            <AlertDescription>
              Đơn hàng hiện tại đang ở trạng thái <strong>{statusInfo.label}</strong>.{" "}
              {order.status === "DELIVERED" && "Cảm ơn bạn đã mua hàng!"}
              {order.status === "CANCELLED" && "Đơn hàng đã bị hủy."}
              {order.status === "CONFIRMED" && "Đơn hàng đang được chuẩn bị."}
              {order.status === "CREATED" && "Đơn hàng đang chờ xác nhận."}
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Thông tin đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Khách hàng</div>
                        <div className="font-medium">{order.userEmail}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Ngày tạo</div>
                        <div className="font-medium">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Tổng tiền</div>
                        <div className="font-bold text-lg">${Number(order.totalAmount).toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Số lượng sản phẩm</div>
                        <div className="font-medium">{totalItems} sản phẩm</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cập nhật lần cuối:</span>
                  <span className="text-sm">{new Date(order.updatedAt).toLocaleString("vi-VN")}</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Chi tiết sản phẩm
                  </span>
                  <Badge variant="secondary">{totalItems} sản phẩm</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead>Giá</TableHead>
                        <TableHead className="text-right">Tổng phụ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(order.orderItems ?? []).map((item: OrderItem, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div>
                                <div className="font-medium">{item.product.name}</div>
                                <div className="text-sm text-muted-foreground">ID: {item.product.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.quantity}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">${Number(item.product.price).toFixed(2)}</TableCell>
                          <TableCell className="text-right font-semibold">
                            ${(item.quantity * Number(item.product.price)).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4 p-6">
                  {(order.orderItems ?? []).map((item: OrderItem, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div>
                            <h4 className="font-medium">{item.product.name}</h4>
                            <p className="text-sm text-muted-foreground">ID: {item.product.id}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Số lượng:</span>
                              <Badge variant="outline">{item.quantity}</Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">
                                ${Number(item.product.price).toFixed(2)} x {item.quantity}
                              </div>
                              <div className="font-semibold">
                                ${(item.quantity * Number(item.product.price)).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StatusIcon className="h-5 w-5" />
                  Trạng thái đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge className={`${statusInfo.color} px-3 py-1 text-sm`}>{statusInfo.label}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tiến độ</span>
                    <span>{statusInfo.progress}%</span>
                  </div>
                  <Progress value={statusInfo.progress} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div
                    className={`flex items-center space-x-3 ${
                      ["CREATED", "CONFIRMED", "DELIVERED"].includes(order.status) ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        ["CREATED", "CONFIRMED", "DELIVERED"].includes(order.status) ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                    <span className="text-sm">Đơn hàng đã được tạo</span>
                  </div>

                  <div
                    className={`flex items-center space-x-3 ${
                      ["CONFIRMED", "DELIVERED"].includes(order.status) ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        ["CONFIRMED", "DELIVERED"].includes(order.status) ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                    <span className="text-sm">Đơn hàng đã được xác nhận</span>
                  </div>

                  <div
                    className={`flex items-center space-x-3 ${
                      order.status === "DELIVERED" ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        order.status === "DELIVERED" ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                    <span className="text-sm">Đơn hàng đã được giao</span>
                  </div>

                  {order.status === "CANCELLED" && (
                    <div className="flex items-center space-x-3 text-red-600">
                      <div className="w-3 h-3 rounded-full bg-red-600" />
                      <span className="text-sm">Đơn hàng đã bị hủy</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>${Number(order.totalAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between">
                  <span>Thuế</span>
                  <span>$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng cộng</span>
                  <span>${Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Thao tác nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Mail className="h-4 w-4 mr-2" />
                  Gửi email cho khách hàng
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Tải hóa đơn
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Cập nhật trạng thái
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
