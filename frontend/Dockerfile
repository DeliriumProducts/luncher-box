FROM node:24.22.1-bookworm-slim@sha256:55fb5f5a527ea2c5c4a95f963e48ef90aa38c7b346054fdc8ee9957a2b55d205 AS build

WORKDIR /usr/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive
COPY . .

ARG FRONTEND_URL
ARG BACKEND_URL
ARG SOCKET_URL
# Next 8's webpack requires the legacy provider only while compiling assets.
RUN NODE_OPTIONS=--openssl-legacy-provider yarn build

FROM node:24.22.1-bookworm-slim@sha256:55fb5f5a527ea2c5c4a95f963e48ef90aa38c7b346054fdc8ee9957a2b55d205
WORKDIR /usr/app
COPY --from=build /usr/app ./
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "server.js"]
