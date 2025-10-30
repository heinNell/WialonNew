#!/bin/bash
set -e
echo "Deploying..."
docker compose -f docker/docker-compose.yml up -d
echo "Deployed!"