# -----------------------------------------------
# Base Image with Doppler
# -----------------------------------------------
FROM node:22-alpine AS doppler

# Install Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
apk add doppler

# Install image manipulation tools
RUN apk update
RUN apk add ghostscript graphicsmagick 

# Install corepack
RUN npm install -g corepack@latest

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

# -----------------------------------------------
# Builder Image
# -----------------------------------------------
FROM doppler AS builder

# Install dependencies
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY packages/types/package.json ./packages/types/package.json
COPY packages/eslint-config-3dp4me/package.json ./packages/eslint-config-3dp4me/package.json
RUN pnpm install 

# Copy code
COPY . .

ARG PROJECT_NAME hearing
# For some reason we need to build types first. Turbo should be able to figure this
# Build everything, then build the frontend for the specific project
RUN pnpm run build --filter types
RUN pnpm run build --filter='!frontend'
WORKDIR /app/apps/frontend
RUN pnpm run build:${PROJECT_NAME}

# -----------------------------------------------
# Runtime Image
# -----------------------------------------------
FROM doppler AS runtime

# Install the prod dependencies
WORKDIR /build
COPY apps/backend/package.json .
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY packages/types/package.json ./packages/types/package.json
COPY packages/eslint-config-3dp4me/package.json ./packages/eslint-config-3dp4me/package.json
RUN pnpm install --filter backend --prod

# Copy over the built backend
COPY --from=builder /app/apps/backend/build ./apps/backend

# Copy over the built frontend to be served by the backend
COPY --from=builder /app/apps/frontend/dist ./apps/backend/frontend/

# Install libvips (needs to be done AFTER pnpm install)
RUN apk add vips-dev -U -X http://dl-3.alpinelinux.org/alpine/edge/testing/

# Install production deps
ENTRYPOINT doppler run -p backend -c ${DOPPLER_CONFIG} -- node /build/apps/backend/bundle.js