"use client"

import type React from "react"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  Shield,
  AlertCircle,
} from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { createOrder } from "@/lib/order-api"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalAmount } = useCart()
  const [userEmail, setUserEmail] = useState("")
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [emailError, setEmailError] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setUserEmail(email)
    if (email && !validateEmail(email)) {
      setEmailError("Email không hợp lệ")
    } else {
      setEmailError("")
    }
  }

  const handleCreateOrder = async () => {
    if (!userEmail.trim()) {
      setEmailError("Vui lòng nhập email của bạn")
      return
    }

    if (!validateEmail(userEmail)) {
      setEmailError("Email không hợp lệ")
      return
    }

    if (cart.length === 0) {
      toast({
        title: "Lỗi",
        description: "Giỏ hàng trống",
        variant: "destructive",
      })
      return
    }

    setIsCreatingOrder(true)
    try {
      const orderItems = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))

      const order = await createOrder(orderItems, userEmail)

      toast({
        title: "Thành công",
        description: order.message || `Đơn hàng #${order.id} đã được tạo thành công!`,
      })

      clearCart()
      router.push(`/dashboard/${order.id}`)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo đơn hàng. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = getTotalAmount()
  const shipping = subtotal > 100 ? 0 : 10
  const tax = 0 // Đổi về 0%
  const total = subtotal + shipping + tax

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted dark:from-background dark:to-muted">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/products")}
              className="p-0 h-auto font-normal"
            >
              Sản phẩm
            </Button>
            <span>/</span>
            <span className="text-foreground font-medium">Giỏ hàng</span>
          </nav>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Giỏ hàng trống</h1>
              <p className="text-muted-foreground max-w-md">
                Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá bộ sưu tập sản phẩm tuyệt vời của chúng tôi!
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => router.push("/products")} size="lg">
                <Package className="w-4 h-4 mr-2" />
                Xem sản phẩm
              </Button>
              <Button variant="outline" onClick={() => router.push("/")} size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Về trang chủ
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted dark:from-background dark:to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/products")} className="p-0 h-auto font-normal">
            Sản phẩm
          </Button>
          <span>/</span>
          <span className="text-foreground font-medium">Giỏ hàng</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Giỏ hàng</h1>
              <p className="text-muted-foreground">{totalItems} sản phẩm trong giỏ hàng</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => router.push("/products")} className="hidden sm:flex">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tiếp tục mua sắm
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Sản phẩm trong giỏ hàng
                  </CardTitle>
                  <Badge variant="secondary">{totalItems} sản phẩm</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>Giá</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead>Tổng phụ</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map((item, index) => (
                        <TableRow key={item.productId}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt={item.productName} className="object-cover w-full h-full" />
                                ) : (
                                  <Package className="w-6 h-6 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{item.productName}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">${Number(item.price).toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={e => {
                                  const value = Math.max(1, Number(e.target.value));
                                  updateQuantity(item.productId, value);
                                }}
                                className="w-16 text-center no-spinner"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeFromCart(item.productId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-6">
                  {cart.map((item, index) => (
                    <Card key={item.productId} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.productName} className="object-cover w-full h-full" />
                          ) : (
                            <Package className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div>
                            <h3 className="font-medium">{item.productName}</h3>
                            <p className="text-sm text-muted-foreground">ID: {item.productId}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-semibold">${Number(item.price).toFixed(2)}</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => removeFromCart(item.productId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={e => {
                                  const value = Math.max(1, Number(e.target.value));
                                  updateQuantity(item.productId, value);
                                }}
                                className="w-16 text-center no-spinner"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="font-semibold">${(Number(item.price) * item.quantity).toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping Button for Mobile */}
            <Button variant="outline" onClick={() => router.push("/products")} className="w-full sm:hidden">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tiếp tục mua sắm
            </Button>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Tạm tính ({totalItems} sản phẩm)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "Miễn phí" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế (0%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal < 100 && (
                  <Alert>
                    <Truck className="h-4 w-4" />
                    <AlertDescription>
                      Mua thêm ${(100 - subtotal).toFixed(2)} để được miễn phí vận chuyển!
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Checkout Form */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đặt hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userEmail">Email *</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={userEmail}
                    onChange={handleEmailChange}
                    placeholder="Nhập email của bạn"
                    className={emailError ? "border-destructive" : ""}
                  />
                  {emailError && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {emailError}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleCreateOrder}
                  disabled={isCreatingOrder || !!emailError || !userEmail}
                  className="w-full"
                  size="lg"
                >
                  {isCreatingOrder ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Đang tạo đơn hàng...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Tạo đơn hàng - ${total.toFixed(2)}
                    </>
                  )}
                </Button>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-2 pt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-3 h-3" />
                    <span>Thanh toán an toàn</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="w-3 h-3" />
                    <span>Giao hàng nhanh</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
