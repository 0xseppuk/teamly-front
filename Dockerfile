# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build args for Next.js public env variables
ARG NEXT_PUBLIC_BACKEND_BASE_URL=/api
ARG NEXT_PUBLIC_CHAT_SOCKET_URL
ARG NEXT_PUBLIC_CHAT_SOCKET_PATH=/socket.io/
ARG NEXT_PUBLIC_RECAPTCHA_TOKEN

ENV NEXT_PUBLIC_BACKEND_BASE_URL=$NEXT_PUBLIC_BACKEND_BASE_URL
ENV NEXT_PUBLIC_CHAT_SOCKET_URL=$NEXT_PUBLIC_CHAT_SOCKET_URL
ENV NEXT_PUBLIC_CHAT_SOCKET_PATH=$NEXT_PUBLIC_CHAT_SOCKET_PATH
ENV NEXT_PUBLIC_RECAPTCHA_TOKEN=$NEXT_PUBLIC_RECAPTCHA_TOKEN

# Build Next.js app
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start Next.js
CMD ["npm", "start"]
