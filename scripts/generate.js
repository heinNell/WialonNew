#!/usr/bin/env node
// generate.js - Zero-dependency structure generator

const fs = require('fs');
const path = require('path');

// Structure definition
const structure = {
  // Backend
  'backend/main.ts': '// NestJS entry point\nimport { NestFactory } from "@nestjs/core";\nimport { AppModule } from "./app.module";\n\nasync function bootstrap() {\n  const app = await NestFactory.create(AppModule);\n  await app.listen(3001);\n}\nbootstrap();',
  'backend/app.module.ts': '// Root module\nimport { Module } from "@nestjs/common";\n\n@Module({\n  imports: [],\n  controllers: [],\n  providers: [],\n})\nexport class AppModule {}',
  'backend/modules/auth/.gitkeep': '',
  'backend/modules/vehicles/.gitkeep': '',
  'backend/modules/geofences/.gitkeep': '',
  'backend/modules/reports/.gitkeep': '',
  'backend/modules/wialon/.gitkeep': '',
  'backend/common/.gitkeep': '',
  'backend/config/.gitkeep': '',
  'backend/prisma/schema.prisma': '// Prisma schema\ngenerator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\nmodel User {\n  id        Int      @id @default(autoincrement())\n  email     String   @unique\n  password  String\n  createdAt DateTime @default(now())\n}',
  'backend/test/.gitkeep': '',
  'backend/package.json': JSON.stringify({
    name: 'fleet-backend',
    version: '1.0.0',
    scripts: {
      'start:dev': 'nest start --watch',
      'build': 'nest build',
      'prisma:generate': 'prisma generate',
      'prisma:migrate': 'prisma migrate dev'
    },
    dependencies: {
      '@nestjs/common': '^10.0.0',
      '@nestjs/core': '^10.0.0',
      '@nestjs/platform-express': '^10.0.0',
      '@prisma/client': '^5.0.0'
    },
    devDependencies: {
      '@nestjs/cli': '^10.0.0',
      'prisma': '^5.0.0',
      'typescript': '^5.0.0'
    }
  }, null, 2),

  // Frontend
  'frontend/middleware.ts': '// Next.js middleware\nimport { NextResponse } from "next/server";\nimport type { NextRequest } from "next/server";\n\nexport function middleware(request: NextRequest) {\n  return NextResponse.next();\n}',
  'frontend/next.config.js': '/** @type {import("next").NextConfig} */\nmodule.exports = {\n  reactStrictMode: true,\n  env: {\n    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,\n  },\n};',
  'frontend/app/layout.tsx': '// Root layout\nimport type { Metadata } from "next";\nimport "./globals.css";\n\nexport const metadata: Metadata = {\n  title: "Fleet Management",\n  description: "Logistics fleet tracking",\n};\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}',
  'frontend/app/page.tsx': '// Home page\nexport default function Home() {\n  return <main><h1>Fleet Management</h1></main>;\n}',
  'frontend/app/globals.css': '/* Global styles */\n* { margin: 0; padding: 0; box-sizing: border-box; }',
  'frontend/app/login/page.tsx': '// Login page\nexport default function Login() {\n  return <div>Login</div>;\n}',
  'frontend/app/dashboard/page.tsx': '// Dashboard\nexport default function Dashboard() {\n  return <div>Dashboard</div>;\n}',
  'frontend/app/vehicles/page.tsx': '// Vehicles list\nexport default function Vehicles() {\n  return <div>Vehicles</div>;\n}',
  'frontend/app/geofences/page.tsx': '// Geofences\nexport default function Geofences() {\n  return <div>Geofences</div>;\n}',
  'frontend/app/reports/page.tsx': '// Reports\nexport default function Reports() {\n  return <div>Reports</div>;\n}',
  'frontend/components/.gitkeep': '',
  'frontend/hooks/.gitkeep': '',
  'frontend/libs/.gitkeep': '',
  'frontend/styles/.gitkeep': '',
  'frontend/public/.gitkeep': '',
  'frontend/package.json': JSON.stringify({
    name: 'fleet-frontend',
    version: '1.0.0',
    scripts: {
      'dev': 'next dev',
      'build': 'next build',
      'start': 'next start'
    },
    dependencies: {
      'next': '^14.0.0',
      'react': '^18.0.0',
      'react-dom': '^18.0.0'
    },
    devDependencies: {
      '@types/node': '^20.0.0',
      '@types/react': '^18.0.0',
      'typescript': '^5.0.0'
    }
  }, null, 2),

  // SDK
  'sdk/session.ts': '// Wialon session management\nexport class WialonSession {\n  constructor() {}\n}',
  'sdk/item.ts': '// Base item class\nexport class WialonItem {\n  constructor() {}\n}',
  'sdk/unit.ts': '// Unit/vehicle class\nexport class WialonUnit {\n  constructor() {}\n}',
  'sdk/resource.ts': '// Resource class\nexport class WialonResource {\n  constructor() {}\n}',
  'sdk/geofence.ts': '// Geofence class\nexport class WialonGeofence {\n  constructor() {}\n}',
  'sdk/index.ts': '// SDK exports\nexport * from "./session";\nexport * from "./item";\nexport * from "./unit";\nexport * from "./resource";\nexport * from "./geofence";',
  'sdk/package.json': JSON.stringify({
    name: '@fleet/wialon-sdk',
    version: '1.0.0',
    main: 'index.ts',
    types: 'index.ts'
  }, null, 2),

  // Docker
  'docker/Dockerfile.backend': '# Backend Dockerfile\nFROM node:20-alpine\nWORKDIR /app\nCOPY backend/package*.json ./\nRUN npm install\nCOPY backend/ ./\nEXPOSE 3001\nCMD ["npm", "run", "start:dev"]',
  'docker/Dockerfile.frontend': '# Frontend Dockerfile\nFROM node:20-alpine\nWORKDIR /app\nCOPY frontend/package*.json ./\nRUN npm install\nCOPY frontend/ ./\nEXPOSE 3000\nCMD ["npm", "run", "dev"]',
  'docker/docker-compose.yml': `version: '3.8'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: fleet
      POSTGRES_PASSWORD: fleet123
      POSTGRES_DB: fleet
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  backend:
    build:
      context: ..
      dockerfile: docker/Dockerfile.backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://fleet:fleet123@db:5432/fleet
    depends_on:
      - db
  
  frontend:
    build:
      context: ..
      dockerfile: docker/Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    depends_on:
      - backend

volumes:
  postgres_data:`,

  // GitHub Actions
  '.github/workflows/ci.yml': `name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npm test`,
  '.github/workflows/deploy.yml': `name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: echo "Deploy steps here"`,

  // Docs
  'docs/README.md': '# Fleet Management Documentation\n\nWelcome to the fleet management system.',
  'docs/setup.md': '# Setup Guide\n\n1. Install dependencies\n2. Configure environment\n3. Run migrations\n4. Start services',
  'docs/api.md': '# API Documentation\n\n## Endpoints\n\n- `POST /auth/login`\n- `GET /vehicles`\n- `GET /geofences`',

  // Scripts
  'scripts/seed.ts': '// Database seeder\nimport { PrismaClient } from "@prisma/client";\n\nconst prisma = new PrismaClient();\n\nasync function main() {\n  console.log("Seeding database...");\n  // Add seed data here\n}\n\nmain();',
  'scripts/migrate.sh': '#!/bin/bash\nset -e\necho "Running migrations..."\ncd backend\nnpm run prisma:migrate\necho "Migrations complete!"',
  'scripts/build.sh': '#!/bin/bash\nset -e\necho "Building backend..."\ncd backend && npm run build\necho "Building frontend..."\ncd ../frontend && npm run build\necho "Build complete!"',
  'scripts/deploy.sh': '#!/bin/bash\nset -e\necho "Deploying..."\ndocker compose -f docker/docker-compose.yml up -d\necho "Deployed!"',

  // Root files
  'package.json': JSON.stringify({
    name: 'fleet-management',
    version: '1.0.0',
    private: true,
    workspaces: ['backend', 'frontend', 'sdk'],
    scripts: {
      'dev:backend': 'cd backend && npm run start:dev',
      'dev:frontend': 'cd frontend && npm run dev',
      'build': './scripts/build.sh',
      'docker:up': 'docker compose -f docker/docker-compose.yml up',
      'docker:down': 'docker compose -f docker/docker-compose.yml down'
    }
  }, null, 2),
  'tsconfig.json': JSON.stringify({
    compilerOptions: {
      target: 'ES2020',
      module: 'commonjs',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true
    }
  }, null, 2),
  '.env.example': `# Database
DATABASE_URL=postgresql://fleet:fleet123@localhost:5432/fleet

# Backend
JWT_SECRET=your-secret-key-here
PORT=3001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Wialon
WIALON_API_URL=https://hst-api.wialon.com
WIALON_TOKEN=your-wialon-token`,
  '.gitignore': `node_modules/
.env
.next/
dist/
build/
*.log
.DS_Store
prisma/migrations/`,
  'README.md': `# Fleet Management System

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Setup database
cd backend
npm run prisma:migrate

# Run development servers
npm run dev:backend    # Backend on :3001
npm run dev:frontend   # Frontend on :3000
\`\`\`

## Docker

\`\`\`bash
npm run docker:up
\`\`\`

See \`docs/\` for more information.`
};

// Create files and directories
console.log('🚀 Generating fleet management structure...\n');

Object.entries(structure).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  const dir = path.dirname(fullPath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write file
  fs.writeFileSync(fullPath, content);
  console.log(`✓ Created ${filePath}`);
});

// Make shell scripts executable
const shellScripts = [
  'scripts/migrate.sh',
  'scripts/build.sh',
  'scripts/deploy.sh'
];

shellScripts.forEach(script => {
  const scriptPath = path.join(process.cwd(), script);
  if (fs.existsSync(scriptPath)) {
    fs.chmodSync(scriptPath, '755');
    console.log(`✓ Made ${script} executable`);
  }
});

console.log('\n✅ Structure created successfully!');
console.log('\n📦 Next steps:');
console.log('   1. npm install');
console.log('   2. cp .env.example .env');
console.log('   3. cd backend && npm install');
console.log('   4. cd frontend && npm install');
console.log('   5. npm run dev:backend');
console.log('   6. npm run dev:frontend');