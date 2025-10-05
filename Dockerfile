# Multi-stage Dockerfile for a small Next.js runtime image

# 1) Base image with deps cache
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline --no-audit --no-fund

# 2) Build stage
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Provide safe defaults for envs required at build time
ARG NEXT_PUBLIC_SUPABASE_URL=https://eyqnnncafnxqfsysoygx.supabase.co
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cW5ubmNhZm54cWZzeXNveWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MTQ0NzAsImV4cCI6MjA2ODM5MDQ3MH0.zwWGwNOWQg8UqnNgg0L-td-0EssyPkGuaGWyIRwqFz8
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-http://localhost}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-dummy_anon_key}
# Ensure a reproducible build
RUN npm run build

# 3) Production runner (tiny)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Copy Next.js standalone server and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]


