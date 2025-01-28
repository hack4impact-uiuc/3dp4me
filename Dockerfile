# -----------------------------------------------
# Base Image with Doppler
# -----------------------------------------------
FROM node:22 AS doppler
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates curl gnupg && \
    curl -sLf --retry 3 --tlsv1.2 --proto "=https" 'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' | gpg --dearmor -o /usr/share/keyrings/doppler-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/doppler-archive-keyring.gpg] https://packages.doppler.com/public/cli/deb/debian any-version main" | tee /etc/apt/sources.list.d/doppler-cli.list && \
    apt-get update && \
    apt-get -y install doppler && \
    apt-get -y install ghostscript graphicsmagick

# RUN corepack enable

# FROM node:20-alpine AS doppler
# RUN apk update && apk upgrade

# # Install Doppler CLI
# RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
#     echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
#     apk add doppler

# For image manipulation
# RUN apk add ghostscript graphicsmagick

# -----------------------------------------------
# Builder Image
# -----------------------------------------------
FROM doppler AS builder

# Install software
WORKDIR /
COPY . /
# COPY docker-package.json package.json
# RUN yarn set version berry
RUN npm install

ARG PROJECT_NAME hearing

# For some reason we need to build types first. Turbo should be able to figure this
# Build everything, then build the frontend for the specific project
RUN npm run build --filter types
RUN npm run build --filter='!frontend'
WORKDIR /apps/frontend
RUN npm run build:${PROJECT_NAME}

# # -----------------------------------------------
# # Runtime Image
# # -----------------------------------------------
# FROM doppler AS runtime

# # Get the builds
# COPY --from=builder /apps/backend/build /build/
# COPY --from=builder /apps/frontend/dist /build/frontend
# COPY --from=builder/

# # Install yarn deps
# WORKDIR /build
# RUN yarn install --production
# ENTRYPOINT doppler run -p backend -c ${DOPPLER_CONFIG} -- node /build/bundle.js