FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache python3 make g++ openssl

COPY package.json package-lock.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

FROM base AS build
COPY . .
RUN npm run build

FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
CMD ["npm", "start"]
