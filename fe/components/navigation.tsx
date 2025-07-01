"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, BarChart3 } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export default function Navigation() {
  const pathname = usePathname()
  const { cart } = useCart()
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const navItems = [
    { href: "/products", label: "Sản phẩm", icon: Package },
    { href: "/cart", label: "Giỏ hàng", icon: ShoppingCart, badge: totalItems },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Cổng Đơn hàng
          </Link>

          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Button key={item.href} variant={isActive ? "default" : "ghost"} asChild className="relative">
                  <Link href={item.href}>
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                    {item.badge && item.badge > 0 && (
                      <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
