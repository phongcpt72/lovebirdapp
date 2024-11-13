FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
ENV MINI_APP_URL=${MINI_APP_URL}

EXPOSE 3000

CMD ["npm", "start"]
