#!/bin/bash

echo "🚀 Setting up Fleet Management project structure..."

# Backend
mkdir -p backend/src/{modules,common,config,middleware}
mkdir -p backend/src/modules/{wialon,vehicles,logistics,auth,database,geofences,reports}
mkdir -p backend/src/modules/{vehicles,logistics,geofences,reports}/{controllers,services,entities,dto}
mkdir -p backend/test

# Frontend
mkdir -p frontend/app/{auth,vehicles,logistics,geofences,reports,settings}
mkdir -p frontend/app/\(dashboard\)/{vehicles,logistics,geofences,reports,settings}
mkdir -p frontend/app/\(dashboard\)/vehicles/\[id\]
mkdir -p frontend/app/\(dashboard\)/logistics/{tasks,routes}
mkdir -p frontend/components/{common,vehicles,logistics,map,charts}
mkdir -p frontend/hooks
mkdir -p frontend/lib/{api,utils}
mkdir -p frontend/styles
mkdir -p frontend/public/{icons,images,logos}

# SDK
mkdir -p sdk/src/{types,api,utils}

# Docker & Config
mkdir -p docker/{backend,frontend,postgres,redis}
mkdir -p scripts
mkdir -p docs
mkdir -p database/{migrations,seeds}

echo "✅ Project structure created!"
echo ""
echo "📁 Created directories:"
echo "  - backend/ (NestJS API)"
echo "  - frontend/ (Next.js UI)"
echo "  - sdk/ (Shared SDK)"
echo "  - docker/ (Container configs)"
echo "  - database/ (Migrations & seeds)"
echo "  - docs/ (Documentation)"
echo ""
echo "Next steps:"
echo "  1. cd backend && npm init -y"
echo "  2. cd ../frontend && npm init -y"
echo "  3. cd ../sdk && npm init -y"