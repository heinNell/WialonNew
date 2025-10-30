#!/bin/bash

echo "🛑 Stopping Fleet Management System"

# Stop Docker services
docker-compose -f docker-compose.dev.yml down

# Kill any running node processes
pkill -f "nest start"
pkill -f "next dev"

echo "✅ All services stopped"