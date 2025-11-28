FROM node:18-alpine

WORKDIR /usr/src/app

RUN npm install -g http-server

COPY . .

EXPOSE 80

CMD ["http-server", "-p", "80", "."]
