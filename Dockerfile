FROM node:20 AS builder

# Build the frontend
FROM builder as frontend-builder
COPY ./frontend /app/frontend
WORKDIR /app/frontend
RUN yarn install
RUN yarn build
RUN cp -r /app/frontend/public/* /app/frontend/dist

# Build the backend
FROM builder as backend-builder
COPY ./backend /app/backend
WORKDIR /app/backend
RUN yarn install || true
RUN yarn build
RUN cp /app/backend/package.json /app/backend/dist

# Create runtime image
FROM node:20
ARG DOPPLER_TOKEN

# Get the builds
COPY --from=backend-builder /app/backend/dist /build/
COPY --from=frontend-builder /app/frontend/dist /build/frontend

# Install yarn deps
WORKDIR /build
RUN yarn install --production

# Install Doppler CLI
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates curl gnupg && \
    curl -sLf --retry 3 --tlsv1.2 --proto "=https" 'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' | gpg --dearmor -o /usr/share/keyrings/doppler-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/doppler-archive-keyring.gpg] https://packages.doppler.com/public/cli/deb/debian any-version main" | tee /etc/apt/sources.list.d/doppler-cli.list && \
    apt-get update && \
    apt-get -y install doppler

ENTRYPOINT [ "doppler", "run", "--"]
CMD ["node", "/build/main.js" ]
EXPOSE 8080