FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./

RUN npm install --production || npm install --production

COPY . .

ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]
