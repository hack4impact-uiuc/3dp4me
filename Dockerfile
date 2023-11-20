FROM node:20

# Build the frontend
COPY ./frontend /app/frontend
WORKDIR /app/frontend
RUN yarn install
RUN yarn build

# Build the backend
COPY ./backend /app/backend
WORKDIR /app/backend
RUN yarn install
RUN yarn build

RUN yarn
RUN yarn build