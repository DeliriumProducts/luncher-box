FROM node:10.15.0-stretch-slim

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

COPY .env ./

EXPOSE 8000
CMD npm run prod