FROM node:24.22.1-bookworm-slim@sha256:55fb5f5a527ea2c5c4a95f963e48ef90aa38c7b346054fdc8ee9957a2b55d205

WORKDIR /usr/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive
COPY . .

ENV NODE_ENV=production
USER node
EXPOSE 8000
CMD ["node", "-r", "ts-node/register/transpile-only", "src/index.ts"]
