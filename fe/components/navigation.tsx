"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, BarChart3 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname()
  const { cart } = useCart()
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const { theme, setTheme } = useTheme();

  const navItems = [
    { href: "/products", label: "Sản phẩm", icon: Package },
    { href: "/cart", label: "Giỏ hàng vui vẻ", icon: ShoppingCart, badge: totalItems },
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
            {navItems.map((item, idx) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              // Insert theme toggle right after Dashboard button
              const isDashboard = item.href === "/dashboard";
              return (
                <>
                  <Button key={item.href} variant={isActive ? "default" : "ghost"} asChild className="relative">
                    <Link href={item.href} className="flex items-center">
                      <span className="relative">
                        <Icon className="h-4 w-4 mr-2" />
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold shadow">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      {item.label}
                    </Link>
                  </Button>
                  {isDashboard && (
                    <div className="flex items-center ml-2">
                      <Sun className="h-4 w-4 mr-1 text-yellow-500" />
                      <Switch
                        checked={theme === "dark"}
                        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                        aria-label="Toggle dark mode"
                      />
                      <Moon className="h-4 w-4 ml-1 text-blue-900 dark:text-yellow-300" />
                    </div>
                  )}
                </>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
