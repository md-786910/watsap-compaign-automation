#!/bin/bash

# Define directories (ensure spaces are handled)
ROOT_DIR="$(pwd)"          # Backend in root directory
FRONTEND_DIR="$ROOT_DIR/client"

# Define binaries (quotes handle spaces)
NODE_BIN="$(which node)"
NPM_BIN="$(which npm)"
PM2_BIN="$(which pm2)"

echo "Starting deployment script..."

# Step 1: Install backend dependencies
echo "Installing backend dependencies..."
cd "$ROOT_DIR" || exit
"$NPM_BIN" install

# Step 2: Install frontend dependencies
echo "Installing frontend dependencies..."
cd "$FRONTEND_DIR" || exit
"$NPM_BIN" install

# Step 3: Build the frontend using Vite
echo "Building frontend..."
"$NPM_BIN" run build

# Step 4: Start backend with PM2 (force restart if already running)
echo "Starting backend with PM2..."
cd "$ROOT_DIR" || exit
"$PM2_BIN" start index.js --name "express-app" -f

# Step 5: Serve the frontend using `serve`
echo "Starting frontend server..."
"$NPM_BIN" install -g serve  # Ensure `serve` is installed
pm2 serve "$FRONTEND_DIR/dist" 5173 --name "frontend" --spa

echo "Deployment complete!"
