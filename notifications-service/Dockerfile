# Dockerfile for notifications-service
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
RUN ls -la dist/ && ls -la dist/src/

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY .env .env
RUN npm install --omit=dev --legacy-peer-deps
CMD ["node", "dist/src/main.js"] 