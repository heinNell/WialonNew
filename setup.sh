#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Creating Fleet Management Project Structure...${NC}\n"

# Create root directories
mkdir -p fleet/{backend,frontend,sdk,docker,docs,scripts,.github/workflows}

cd fleet

# ============================================
# BACKEND STRUCTURE (NestJS)
# ============================================
echo -e "${GREEN}✓ Creating backend...${NC}"

mkdir -p backend/{src/{modules/{auth,vehicles,geofences,reports,wialon},common/{guards,interceptors,decorators,filters},config},prisma/{migrations},test,dist}

# Backend files
touch backend/main.ts
touch backend/app.module.ts
touch backend/.env.example
touch backend/tsconfig.json
touch backend/nest-cli.json
touch backend/package.json

# Backend modules
touch backend/src/modules/auth/{auth.controller.ts,auth.service.ts,auth.module.ts,jwt.strategy.ts,auth.guard.ts,dto.ts}
touch backend/src/modules/vehicles/{vehicles.controller.ts,vehicles.service.ts,vehicles.module.ts,vehicles.gateway.ts,dto.ts}
touch backend/src/modules/geofences/{geofences.controller.ts,geofences.service.ts,geofences.module.ts,dto.ts}
touch backend/src/modules/reports/{reports.controller.ts,reports.service.ts,reports.module.ts,dto.ts}
touch backend/src/modules/wialon/{wialon.service.ts,wialon.module.ts,wialon.client.ts}

# Backend common
touch backend/src/common/guards/{auth.guard.ts,roles.guard.ts}
touch backend/src/common/interceptors/{logging.interceptor.ts,transform.interceptor.ts}
touch backend/src/common/decorators/{current-user.decorator.ts,roles.decorator.ts}
touch backend/src/common/filters/{http-exception.filter.ts}

# Backend config
touch backend/src/config/{database.config.ts,jwt.config.ts,wialon.config.ts,env.config.ts}

# Prisma
touch backend/prisma/schema.prisma
touch backend/prisma/.env

# ============================================
# FRONTEND STRUCTURE (Next.js)
# ============================================
echo -e "${GREEN}✓ Creating frontend...${NC}"

mkdir -p frontend/{app/{login,dashboard,vehicles,geofences,reports,api},components/{ui,map,layout,forms},hooks,libs,styles,public/{img,icons},__tests__}

# Frontend root files
touch frontend/package.json
touch frontend/next.config.js
touch frontend/tsconfig.json
touch frontend/tailwind.config.ts
touch frontend/.env.example
touch frontend/middleware.ts
touch frontend/README.md

# Frontend app structure
touch frontend/app/layout.tsx
touch frontend/app/page.tsx
touch frontend/app/login/{page.tsx,layout.tsx}
touch frontend/app/dashboard/{page.tsx,layout.tsx}
touch frontend/app/vehicles/{page.tsx,layout.tsx,\[id\].tsx}
touch frontend/app/geofences/{page.tsx,layout.tsx}
touch frontend/app/reports/{page.tsx,layout.tsx}
touch frontend/app/api/auth/\[...nextauth\].ts

# Frontend components
touch frontend/components/ui/{Button.tsx,Card.tsx,Modal.tsx,Input.tsx,Select.tsx,Table.tsx}
touch frontend/components/map/{MapView.tsx,VehicleMarker.tsx,GeofenceLayer.tsx}
touch frontend/components/layout/{Header.tsx,Sidebar.tsx,Footer.tsx}
touch frontend/components/forms/{LoginForm.tsx,VehicleForm.tsx,GeofenceForm.tsx}

# Frontend hooks
touch frontend/hooks/{useVehicles.ts,useGeofences.ts,useRealtime.ts,useAuth.ts,useApi.ts}

# Frontend libs
touch frontend/libs/{api-client.ts,validators.ts,utils.ts,constants.ts}

# Frontend styles
touch frontend/styles/{globals.css,variables.css}

# Frontend public
touch frontend/public/img/favicon.png
touch frontend/public/icons/{vehicle.svg,geofence.svg,driver.svg}

# ============================================
# SDK STRUCTURE (Wialon SDK)
# ============================================
echo -e "${GREEN}✓ Creating SDK...${NC}"

mkdir -p sdk/{src,dist,types,__tests__}

touch sdk/package.json
touch sdk/tsconfig.json
touch sdk/README.md
touch sdk/.npmignore

# SDK source files
touch sdk/src/{index.ts,session.ts,item.ts,unit.ts,resource.ts,geofence.ts,driver.ts,errors.ts}
touch sdk/src/types/{index.ts,session.ts,unit.ts,resource.ts}

# ============================================
# DOCKER STRUCTURE
# ============================================
echo -e "${GREEN}✓ Creating Docker configs...${NC}"

touch docker/{Dockerfile.backend,Dockerfile.frontend,docker-compose.yml,.dockerignore}

# ============================================
# CI/CD STRUCTURE (.github/workflows)
# ============================================
echo -e "${GREEN}✓ Creating CI/CD workflows...${NC}"

touch .github/workflows/{ci.yml,deploy.yml,security.yml}

# ============================================
# DOCUMENTATION
# ============================================
echo -e "${GREEN}✓ Creating documentation...${NC}"

mkdir -p docs/{api,architecture,guides}

touch docs/{README.md,setup.md,architecture.md,api.md,security.md}
touch docs/guides/{development.md,deployment.md,contributing.md}

# ============================================
# SCRIPTS
# ============================================
echo -e "${GREEN}✓ Creating scripts...${NC}"

touch scripts/{seed.ts,migrate.sh,build.sh,deploy.sh,setup.sh}

# ============================================
# ROOT FILES
# ============================================
echo -e "${GREEN}✓ Creating root files...${NC}"

touch {package.json,tsconfig.json,.env.example,.gitignore,.dockerignore,README.md,LICENSE}

# ============================================
# GIT SETUP
# ============================================
echo -e "${GREEN}✓ Initializing Git...${NC}"

git init
git config user.name "Fleet Team"
git config user.email "team@fleet.local"

# ============================================
# DONE
# ============================================
echo -e "\n${BLUE}📁 Project Structure Created!${NC}"
echo -e "\n${GREEN}Directory Tree:${NC}\n"

tree -L 3 -I 'node_modules' 2>/dev/null || find . -type d -not -path '*/\.*' | head -30

echo -e "\n${BLUE}Next Steps:${NC}"
echo "1. cd fleet"
echo "2. Fill in .env files"
echo "3. Run: pnpm install (in backend/ and frontend/)"
echo "4. Run: docker compose up"
echo -e "\n${GREEN}✨ Setup Complete!${NC}\n"