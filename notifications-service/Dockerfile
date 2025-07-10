# Dockerfile for notifications-service
FROM microservice-shared:latest AS shared
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Copy toàn bộ microservice-shared
COPY --from=shared /app ./microservice-shared
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
# Debug: List the dist directory to verify build success
RUN ls -la dist/ && ls -la dist/src/

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=shared /app ./microservice-shared
COPY .env .env
RUN npm install --omit=dev --legacy-peer-deps
CMD ["node", "dist/src/main.js"] 