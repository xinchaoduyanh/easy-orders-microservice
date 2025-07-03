import "./globals.css";
import { Inter } from "next/font/google";
import Navigation from "@/components/navigation"; // hoặc Header nếu bạn dùng tên khác
import { Providers } from "./providers"; // nếu bạn có file Providers

export const metadata = {
  title: "Cổng Hoạt động Đơn hàng",
  description: "Hệ thống quản lý đơn hàng và sản phẩm",
  generator: ''
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navigation /> {/* Thêm dòng này */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
