#!/bin/bash

set -e

echo "🚀 Fleet Manager - Database Setup"
echo "=================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
fi

# 1. Install dependencies
echo -e "\n${BLUE}📦 Installing dependencies...${NC}"
npm install

# 2. Generate Prisma Client
echo -e "\n${BLUE}🔧 Generating Prisma Client...${NC}"
npm run prisma:generate

# 3. Check database connection
echo -e "\n${BLUE}🔌 Testing database connection...${NC}"
npx prisma db pull 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Could not connect to database. Make sure PostgreSQL is running.${NC}"
    exit 1
}

# 4. Run migrations
echo -e "\n${BLUE}🗄️  Running database migrations...${NC}"
npm run prisma:migrate:deploy

# 5. Seed database
echo -e "\n${BLUE}🌱 Seeding database...${NC}"
npm run prisma:seed

# 6. Open Prisma Studio (optional)
echo -e "\n${GREEN}✅ Setup complete!${NC}"
echo -e "\n${BLUE}Would you like to open Prisma Studio? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    npm run prisma:studio
fi