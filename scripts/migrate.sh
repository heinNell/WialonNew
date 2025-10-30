#!/bin/bash
set -e
echo "Running migrations..."
cd backend
npm run prisma:migrate
echo "Migrations complete!"