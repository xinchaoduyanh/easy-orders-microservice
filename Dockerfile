# Dockerfile tổng cho root (không còn sử dụng microservice-shared)
FROM node:20-alpine AS builder
WORKDIR /app
RUN echo "Microservice-shared đã được loại bỏ, các service giờ tự quản lý Kafka modules"
CMD ["echo", "Build completed successfully"] 