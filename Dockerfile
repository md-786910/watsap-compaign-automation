# Use official Node.js image
FROM node:latest

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the entire backend code
COPY . .

# Expose backend port
EXPOSE 3000

# Start the Express server
CMD ["node", "index.js"]
