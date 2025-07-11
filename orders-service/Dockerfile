# Dockerfile for orders-service
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
# Install OpenSSL for Prisma
RUN apk add --no-cache openssl
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
RUN npm install --omit=dev --legacy-peer-deps
EXPOSE 3000
COPY .env .env
CMD ["node", "dist/src/main.js"] 