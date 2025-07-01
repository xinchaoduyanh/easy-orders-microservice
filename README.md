# Sotatek Order Management System

## 1. Tổng quan bài toán & giải pháp

Bài toán yêu cầu xây dựng hệ thống quản lý đơn hàng dạng microservice, gồm các luồng:

- Đặt hàng, xác nhận, giao hàng, hủy đơn
- Thanh toán xác thực (mock)
- Gửi thông báo email khi giao hàng thành công
- Dashboard realtime cho người dùng

Hệ thống này đã giải quyết đầy đủ các yêu cầu trên, với kiến trúc tách biệt, realtime, dễ mở rộng.

---

## 2. Kiến trúc tổng thể & các service

- **orders-app**: Quản lý đơn hàng, trạng thái, tự động chuyển trạng thái, giao tiếp với các service khác qua Kafka.
- **payments-app**: Xử lý thanh toán, nhận yêu cầu từ orders-app, trả về kết quả (confirmed/declined) qua Kafka.
- **notifications-app**: Lắng nghe Kafka, gửi email thông báo khi đơn hàng được giao thành công (DELIVERED) qua Resend.
- **fe/**: Frontend React, dashboard realtime, tạo/hủy đơn hàng, xem chi tiết, trạng thái, timeline, v.v.
- **Kafka**: Pub/Sub cho các service.
- **PostgreSQL**: Lưu trữ dữ liệu.

---

## 3. Các luồng xử lý chính

### **A. Luồng tạo đơn hàng & thanh toán**

1. **User** tạo đơn hàng trên frontend (fe/), nhập thông tin sản phẩm, email.
2. **orders-app** nhận request, tạo đơn hàng ở trạng thái `CREATED` trong DB.
3. **orders-app** gửi message Kafka (topic `order_events`) yêu cầu thanh toán sang **payments-app**.
4. **payments-app** nhận message, xử lý mock ( confirmed/declined) dựa trên tổng tiền có đơn hàng, gửi kết quả về lại Kafka.
5. **orders-app** nhận kết quả thanh toán:
   - Nếu `declined` → cập nhật trạng thái đơn hàng thành `CANCELLED`.
   - Nếu `confirmed` → cập nhật trạng thái đơn hàng thành `CONFIRMED`, đồng thời lên lịch tự động chuyển sang `DELIVERED` sau 15 giây.

### **B. Luồng giao hàng & gửi email thông báo**

6. Khi đơn hàng chuyển sang `DELIVERED` (tự động sau 15 giây):
   - **orders-app** gửi message Kafka (topic `order-delivered`) sang **notifications-app** với thông tin đơn hàng và email khách hàng.
7. **notifications-app** lắng nghe topic này, nhận message, gửi email xác nhận giao hàng thành công qua Resend API.

### **C. Luồng realtime dashboard**

8. **fe/** liên tục fetch/poll trạng thái đơn hàng từ **orders-app** để cập nhật realtime (có thể mở rộng sang websocket/pubsub nếu cần).
9. User có thể xem danh sách đơn hàng, chi tiết, timeline trạng thái, tạo/hủy đơn hàng trực tiếp trên dashboard.

---

## 4. Hệ thống đã giải quyết được gì so với đề bài?

- **Tách biệt microservice:** Mỗi chức năng (order, payment, notification) là một service độc lập, giao tiếp qua Kafka.
- **Đầy đủ các trạng thái đơn hàng:** CREATED, CONFIRMED, DELIVERED, CANCELLED.
- **Thanh toán mock:** payments-app trả về kết quả **confirmed** nếu số tiền < 5000, ngược lại trả về **declined**; orders-app cập nhật trạng thái đúng logic.
- **Tự động chuyển trạng thái:** Đơn hàng CONFIRMED sẽ tự động sang DELIVERED sau 15 giây.
- **Thông báo email:** Khi DELIVERED, hệ thống tự động gửi email qua notifications-app (Resend).
- **Realtime dashboard:** Frontend luôn cập nhật trạng thái mới nhất, UX hiện đại.
- **Dễ mở rộng:** Có thể thêm các loại notification khác, thêm các trạng thái, tích hợp các hệ thống thanh toán thực tế.
- **Xóa dữ liệu orders khi seed lại:** Phù hợp cho dev/test, không bị lỗi dữ liệu cũ.

---

## 5. Công nghệ sử dụng

- **NestJS** (NodeJS, Typescript)
- **Next.js 15** (App Router, React, TailwindCSS)
- **Prisma ORM** (PostgreSQL)
- **Kafka** (Pub/Sub)
- **Resend** (Email API)
- **Docker Compose** (multi-service dev)

---

## 6. Hướng dẫn chạy local

1. Clone repo về máy
2. Cài đặt dependencies cho từng service:
   ```bash
   cd orders-app && npm install
   cd ../payments-app && npm install
   cd ../notifications-app && npm install
   cd ../fe && npm install
   ```
3. Khởi động Kafka, Postgres (dùng docker-compose hoặc tự setup)
4. Tạo database, cấu hình biến môi trường `.env` cho từng service (xem ví dụ trong từng thư mục)
5. Chạy migrate và seed cho orders-app:
   ```bash
   cd orders-app
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
6. Chạy từng service:
   ```bash
   # Terminal 1
   cd orders-app && npm run start:dev
   # Terminal 2
   cd payments-app && npm run start:dev
   # Terminal 3
   cd notifications-app && npm run start:dev
   # Terminal 4
   cd fe && npm run dev
   ```
7. Truy cập frontend tại http://localhost:3000

---

## 7. Ghi chú

- Để gửi email, cần đăng ký tài khoản Resend và cấu hình RESEND_API_KEY
- Nếu migrate lỗi do dữ liệu cũ, hãy xóa sạch bảng orders và order_items trước khi migrate
- Có thể xóa sạch dữ liệu orders khi seed lại (phù hợp dev/test)

---

## 8. Tác giả
