FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN echo "===This is <app> folder after build:"
RUN ls -la /app && sleep 5

RUN echo "===This is <dist> folder after build:"
RUN ls -la /app/dist && sleep 5

COPY .env .env

EXPOSE 3000

CMD ["npm", "start"]
