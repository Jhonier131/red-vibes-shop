# Etapa 1: build Angular
FROM node:12-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: servir con nginx
FROM nginx:alpine

COPY --from=build /app/dist/red-vibes /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
