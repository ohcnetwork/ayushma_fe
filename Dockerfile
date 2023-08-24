FROM node:18-alpine AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat python3 build-base

WORKDIR /app

RUN mkdir chatbot

COPY package.json yarn.lock ./
COPY ./chatbot/package.json ./chatbot/yarn.lock ./chatbot/

RUN yarn i-all

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN yarn build

FROM base AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/build/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/build/static ./build/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]