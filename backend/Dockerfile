# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

# Enable corepack so pnpm is available without a separate install step
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy only the files needed to resolve and install dependencies first.
# This layer is cached as long as these files don't change.
COPY package.json pnpm-lock.yaml .npmrc pnpm-workspace.yaml ./

# --frozen-lockfile ensures the lockfile is never mutated inside Docker.
# Scripts are enabled so native addons (esbuild) can build their binaries
# for the Linux target — different from the Win32 binaries on the dev machine.
RUN pnpm install --frozen-lockfile

# Copy the rest of the source and compile
COPY . .
RUN pnpm exec nest build

# ─── Stage 2: Production image ────────────────────────────────────────────────
FROM node:22-alpine AS production

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Production flag so class-transformer, reflect-metadata etc. behave correctly
ENV NODE_ENV=production

# Install production-only dependencies into a clean layer
COPY package.json pnpm-lock.yaml .npmrc pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Pull the compiled output from the builder stage
COPY --from=builder /app/dist ./dist

# Render injects PORT automatically; fall back to 8080 as documented in .env.example
EXPOSE ${PORT:-8080}

# Run the compiled entry point directly — no ts-node overhead in production
CMD ["node", "dist/main"]
