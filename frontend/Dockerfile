FROM node:10.15.0-stretch-slim

WORKDIR /usr/app

COPY package*.json ./
COPY yarn.lock ./
RUN npm install -g yarn
RUN yarn

COPY . .

ARG FRONTEND_URL
ARG BACKEND_URL
ARG SOCKET_URL

RUN yarn build

EXPOSE 3000
CMD node server.js
