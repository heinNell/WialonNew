# 🚗 Fleet Management System

Complete fleet management system with Wialon integration, real-time tracking, and route optimization.

## 🌟 Features

- ✅ **User Authentication** - JWT-based auth with role management
- ✅ **Vehicle Tracking** - Real-time GPS tracking with Wialon
- ✅ **Task Management** - Create, assign, and track delivery tasks
- ✅ **Route Optimization** - AI-powered route planning (3 algorithms)
- ✅ **Delivery Tracking** - Track deliveries with proof of delivery
- ✅ **WebSocket Updates** - Real-time position and status updates
- ✅ **Responsive Dashboard** - Modern React-based interface

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7

### Option 1: Automated Setup

```bash  
# Clone repository  
git clone <repository-url>  
cd fleet-management  

# Run setup script  
bash scripts/setup-all.sh  

# Update .env files with your credentials  
# backend/.env  
# frontend/.env.local  

# Start development  
npm run dev  