#!/bin/bash

set -e

echo "🚀 Fleet Management System - Complete Setup"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# 1. Install root dependencies
echo -e "${BLUE}📦 Installing root dependencies...${NC}"
npm install

# 2. Setup backend
echo -e "${BLUE}🔧 Setting up backend...${NC}"
cd backend
npm install

if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating backend .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Please update backend/.env with your credentials${NC}"
fi

cd ..

# 3. Setup frontend
echo -e "${BLUE}🎨 Setting up frontend...${NC}"
cd frontend
npm install

if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating frontend .env.local file...${NC}"
    cp .env.local.example .env.local
    echo -e "${GREEN}✅ Please update frontend/.env.local with your credentials${NC}"
fi

cd ..

# 4. Setup SDK
echo -e "${BLUE}📚 Setting up SDK...${NC}"
cd sdk
npm install
npm run build
cd ..

# 5. Start Docker services
echo -e "${BLUE}🐳 Starting Docker services...${NC}"
docker-compose -f docker-compose.dev.yml up -d

echo ""
echo -e "${GREEN}✅ Waiting for services to be ready...${NC}"
sleep 10

# 6. Run migrations
echo -e "${BLUE}📊 Running database migrations...${NC}"
cd backend
npm run migration:run
cd ..

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "📝 Next steps:"
echo "  1. Update .env files with your Wialon credentials"
echo "  2. Start backend: cd backend && npm run start:dev"
echo "  3. Start frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Services:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend: http://localhost:3001"
echo "  - API Docs: http://localhost:3001/api/docs"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo "  - PgAdmin: http://localhost:5050"
echo "  - Redis Commander: http://localhost:8081"
echo ""
echo "🔍 Useful commands:"
echo "  - Start dev: npm run dev"
echo "  - Docker logs: docker-compose logs -f"
echo "  - Stop services: docker-compose down"
echo ""