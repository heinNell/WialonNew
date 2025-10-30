#!/bin/bash

echo "🚀 Starting Fleet Management System (Development)"
echo "================================================"

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for services
echo "⏳ Waiting for services..."
sleep 5

# Start backend in background
echo "🔧 Starting backend..."
cd backend
npm run start:dev &
BACKEND_PID=$!

# Start frontend in background
echo "🎨 Starting frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Services started!"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; docker-compose -f docker-compose.dev.yml down" EXIT
wait