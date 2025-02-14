FROM node:22.11.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./src ./src

COPY ./test ./test

EXPOSE 8080

CMD ["npm","start"]