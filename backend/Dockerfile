FROM node:10.15.0-stretch-slim

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
COPY .env ./dist/
WORKDIR /usr/app/dist

EXPOSE 8000
CMD node index.js