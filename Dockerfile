# 1. Podstawowy obraz Node.js
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache python3 make g++ openssl

COPY package.json package-lock.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

FROM base AS development
WORKDIR /app
ENV NODE_ENV=development

RUN npm install --global nodemon

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
