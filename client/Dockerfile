# Use a Node.js base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the frontend
# RUN npm run build
EXPOSE 5173

# Use an Nginx base image to serve the frontend
# FROM nginx:latest
# COPY --from=0 /app/dist /usr/share/nginx/html

# Expose the default Nginx port
# EXPOSE 80
CMD ["npm", "run", "dev", "--", "--host"]
# CMD ["nginx", "-g", "daemon off;"]
