# Dockerfile tổng cho microservice-shared (root)
FROM node:20-alpine AS builder
WORKDIR /app
COPY microservice-shared/package*.json ./microservice-shared/
WORKDIR /app/microservice-shared
RUN npm install --legacy-peer-deps
COPY microservice-shared .
RUN npm run build
CMD ["ls", "-l", "dist"] 