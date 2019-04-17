FROM node:10.15.0-stretch-slim

WORKDIR /usr/app

COPY package*.json ./
RUN npm install -g yarn
RUN yarn

COPY . .

EXPOSE 3000
CMD yarn prod:docker