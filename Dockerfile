# -----------------------------------------------
# Base Image with Doppler
# -----------------------------------------------
FROM node:20 AS doppler
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates curl gnupg && \
    curl -sLf --retry 3 --tlsv1.2 --proto "=https" 'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' | gpg --dearmor -o /usr/share/keyrings/doppler-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/doppler-archive-keyring.gpg] https://packages.doppler.com/public/cli/deb/debian any-version main" | tee /etc/apt/sources.list.d/doppler-cli.list && \
    apt-get update && \
    apt-get -y install doppler

# -----------------------------------------------
# Builder Image
# -----------------------------------------------
FROM doppler AS builder

# Install software
WORKDIR /
COPY . /
RUN yarn install

# out, but it isn't working
ARG PROJECT_NAME hearing

# For some reason we need to build types first. Turbo should be able to figure this
# Build everything, then build the frontend for the specific project
RUN yarn build --filter types
RUN yarn build --filter='!frontend'
WORKDIR /apps/frontend
RUN yarn build:${PROJECT_NAME}

# -----------------------------------------------
# Runtime Image
# -----------------------------------------------
FROM doppler AS runtime

# Get the builds
COPY --from=builder /apps/backend/build /build/
COPY --from=builder /apps/frontend/dist /build/frontend

# Install yarn deps
WORKDIR /build
RUN yarn install --production
ENTRYPOINT doppler run -p backend -c ${DOPPLER_CONFIG} -- node /build/bundle.js