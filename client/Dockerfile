# ---- Stage 1: Build ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite build ke liye env variables chahiye honge (VITE_ prefix wale)
# Ye build-time pe pass honge docker-compose se
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_BASE_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_BASE_URL=$VITE_BASE_URL

RUN npm run build

# ---- Stage 2: Serve ----
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]