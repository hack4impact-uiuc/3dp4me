FROM node:20 AS builder

# Build the frontend
FROM builder as frontend-builder
COPY ./frontend /app/frontend
WORKDIR /app/frontend
RUN yarn install
RUN yarn build

# Build the backend
FROM builder as backend-builder
COPY ./backend /app/backend
WORKDIR /app/backend
RUN yarn install
RUN yarn build

FROM node:20
COPY --from=backend-builder /app/backend/dist /build/
COPY --from=frontend-builder /app/frontend/dist /build/frontend