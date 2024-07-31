# Stage 0
FROM node:20-slim AS base
LABEL maintainer="YourName <yourname@domain.com>"
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app
COPY package.json package-lock.json next.config.mjs ./


# Stage 1
FROM base AS deps
RUN  --mount=type=cache,id=npm,target=/root/.npm npm install --production


# Stage 2
FROM base AS builder
RUN --mount=type=cache,id=npm,target=/root/.npm npm install
COPY . .
RUN npm run build


# Stage 3
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION
COPY --from=builder /app/.env* ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=deps /app/node_modules ./node_modules
EXPOSE $PORT
CMD ["npm", "start"]