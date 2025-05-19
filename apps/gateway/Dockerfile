FROM node:18-alpine AS base

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY tsconfig*.json ./

FROM base AS dependencies

RUN pnpm install --frozen-lockfile

COPY . .

FROM dependencies AS build

RUN pnpm run build -- gateway

FROM node:18-alpine AS production

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/dist/apps/gateway ./dist
COPY --from=build /app/proto ./proto

ENV NODE_ENV production

EXPOSE 3000
CMD ["node", "dist/main"]
