#!/bin/bash

# ========================================
# HireHub Backend Setup Script
# ========================================

echo "🚀 Starting HireHub Backend Setup..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env file exists
echo "📋 Step 1: Checking environment variables..."
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found!${NC}"
    echo "Creating .env file from template..."
    
    cat > .env << 'EOF'
# Server Configuration
PORT=5000

# MongoDB Connection
MONGO_URL=mongodb://localhost:27017/jobportal

# JWT Secret (CHANGE THIS!)
JWT_SECRET=hirehub_secret_key_change_me_in_production_2024

# Admin Credentials
ADMIN_EMAIL=admin@hirehub.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin User

# CORS Configuration
FRONTEND_URL=http://localhost:5173
EOF
    
    echo -e "${GREEN}✅ .env file created successfully!${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANT: Update JWT_SECRET in .env for security!${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

echo ""

# Check if MongoDB is running
echo "📊 Step 2: Checking MongoDB..."
if systemctl is-active --quiet mongod; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo -e "${RED}❌ MongoDB is not running${NC}"
    echo "Attempting to start MongoDB..."
    sudo systemctl start mongod
    
    if systemctl is-active --quiet mongod; then
        echo -e "${GREEN}✅ MongoDB started successfully${NC}"
    else
        echo -e "${RED}❌ Failed to start MongoDB${NC}"
        echo "Please install MongoDB or start it manually:"
        echo "  sudo systemctl start mongod"
        exit 1
    fi
fi

echo ""

# Check if node_modules exists
echo "📦 Step 3: Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "📝 To start the backend server:"
echo "   npm run dev"
echo ""
echo "🌐 Server will run at: http://localhost:5000"
echo ""
echo "🧪 Test endpoints:"
echo "   - POST http://localhost:5000/api/users/register"
echo "   - POST http://localhost:5000/api/users/login"
echo ""
echo "📚 For more details, see BACKEND_SETUP.md"
echo ""


