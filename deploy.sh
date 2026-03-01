#!/bin/bash

# Configuration
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting ORDINO B2B Platform Deployment...${NC}"

# Bring down existing containers
echo "Stopping existing containers..."
docker-compose down

# Rebuild and start in detached mode
echo "Building and starting containers..."
docker-compose up -d --build

echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "API: http://localhost:3000"
echo -e "Admin Panel: http://localhost:3001"
echo -e "Buyer Panel: http://localhost:3002"
echo -e "Seller Panel: http://localhost:3003"
