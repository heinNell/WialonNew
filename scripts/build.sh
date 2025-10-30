#!/bin/bash
set -e
echo "Building backend..."
cd backend && npm run build
echo "Building frontend..."
cd ../frontend && npm run build
echo "Build complete!"