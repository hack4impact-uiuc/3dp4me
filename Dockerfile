# -----------------------------------------------
# Base Image with Doppler
# -----------------------------------------------
FROM node:22 AS doppler

# Install doppler
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates curl gnupg && \
    curl -sLf --retry 3 --tlsv1.2 --proto "=https" 'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' | gpg --dearmor -o /usr/share/keyrings/doppler-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/doppler-archive-keyring.gpg] https://packages.doppler.com/public/cli/deb/debian any-version main" | tee /etc/apt/sources.list.d/doppler-cli.list
    
RUN apt-get update && apt-get -y install doppler

# Install image manipulation tools
RUN apt-get -y install ghostscript graphicsmagick

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

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
# RUN pnpm run build --filter='!frontend'
# WORKDIR /apps/frontend
# RUN pnpm run build:${PROJECT_NAME}

# # -----------------------------------------------
# # Runtime Image
# # -----------------------------------------------
# FROM doppler AS runtime

# # Get the builds
# COPY --from=builder /apps/backend/build /build/
# COPY --from=builder /apps/frontend/dist /build/frontend

# # Install production deps
# WORKDIR /build
# RUN pnpm install --production
# ENTRYPOINT doppler run -p backend -c ${DOPPLER_CONFIG} -- node /build/bundle.js