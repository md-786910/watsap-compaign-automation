# Build the frontend using Node.js
FROM node:latest AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve frontend using Nginx
FROM nginx:latest
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY ../nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
