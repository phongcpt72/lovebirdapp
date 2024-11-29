FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

COPY .env .env

RUN echo "===This is <app> folder after build:"
RUN ls -la /app && sleep 10

RUN echo "===This is <dist> folder after build:"
RUN ls -la /app/dist && sleep 5


EXPOSE 3000

CMD ["npm", "start"]
