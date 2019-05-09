FROM node:10.15.0-stretch-slim

WORKDIR /usr/app

COPY package*.json ./
COPY yarn.lock ./
RUN npm install -g yarn
RUN yarn

COPY . .

EXPOSE 8000
# CMD yarn prod:docker