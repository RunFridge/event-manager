FROM node:18-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy pnpm-specific files
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY tsconfig*.json ./

FROM base AS dependencies

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

COPY . .

FROM dependencies AS build

# Build the application
RUN pnpm run build

FROM node:18-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy pnpm-specific files
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/dist ./dist
COPY --from=build /app/proto ./proto

ENV NODE_ENV production

CMD ["node", "dist/apps/gateway/main"]
