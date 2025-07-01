import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/toaster"
import Navigation from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cổng Hoạt động Đơn hàng",
  description: "Hệ thống quản lý đơn hàng và sản phẩm",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <CartProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
