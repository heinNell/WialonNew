#!/bin/bash

# AWS Fleet Manager Deployment Script
set -e

echo "🚀 Starting Fleet Manager Deployment..."

# Configuration
APP_NAME="fleet-manager"
REGION="us-east-1"
EC2_USER="ubuntu"
EC2_HOST="your-ec2-instance.compute.amazonaws.com"
DEPLOY_PATH="/home/ubuntu/fleet-manager"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Build Docker images locally
log_info "Building Docker images..."
cd backend
docker build -t ${APP_NAME}-backend:latest .
cd ..

# 2. Save and compress Docker image
log_info "Saving Docker image..."
docker save ${APP_NAME}-backend:latest | gzip > backend-image.tar.gz

# 3. Upload to EC2
log_info "Uploading files to EC2..."
scp -r backend-image.tar.gz \
       backend/docker-compose.yml \
       backend/.env.production \
       backend/nginx.conf \
       ${EC2_USER}@${EC2_HOST}:${DEPLOY_PATH}/

# 4. SSH and deploy
log_info "Connecting to EC2 and deploying..."
ssh ${EC2_USER}@${EC2_HOST} << 'ENDSSH'
cd /home/ubuntu/fleet-manager

# Load Docker image
echo "Loading Docker image..."
gunzip -c backend-image.tar.gz | docker load

# Stop existing containers
echo "Stopping existing containers..."
docker-compose down

# Start new containers
echo "Starting new containers..."
docker-compose up -d

# Run migrations
echo "Running database migrations..."
docker-compose exec -T backend npx prisma migrate deploy

# Health check
echo "Waiting for services to be healthy..."
sleep 10
docker-compose ps

# Cleanup
rm backend-image.tar.gz

echo "Deployment completed!"
ENDSSH

log_success "Deployment successful! 🎉"
log_info "Access your application at: https://${EC2_HOST}"