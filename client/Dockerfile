# write docker for it
# Use the official Node.js 16 image
FROM node:20.12.1-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package*.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the client code to the working directory
COPY . .

# Build the Vite application
RUN npm run build

# Expose the port
EXPOSE 5173

# Run the command to start the Vite development server
CMD ["npm", "run", "serve"]