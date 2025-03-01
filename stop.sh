echo "Stopping backend..."
pm2 stop "express-app" && pm2 delete "express-app"

echo "Stopping frontend..."
kill $(lsof -t -i:5173) 2>/dev/null

echo "All services stopped."
