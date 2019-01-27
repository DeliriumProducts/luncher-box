FROM node:10.15.0-stretch-slim

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD node server.js