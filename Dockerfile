# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN echo "===This is <app> folder after build:"
RUN ls -la /app && sleep 5

RUN echo "===This is <dist> folder after build:"
RUN ls -la /app/dist && sleep 5

# Stage 2: Runtime
FROM node:18-alpine AS runtime

WORKDIR /app

# Copy dist folder from build stage to runtime stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

COPY .env .env

EXPOSE 3000

CMD ["npm", "start"]
