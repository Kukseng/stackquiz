# 1. Build Stage
FROM node:20-alpine AS builder
WORKDIR /app

# Accept build-time environment variables for NEXT_PUBLIC_* vars
ARG NEXT_PUBLIC_API_URL
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_APP_URL
ARG NODE_ENV=production

# Set environment variables for build
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 2. Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

# Copy only necessary files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]