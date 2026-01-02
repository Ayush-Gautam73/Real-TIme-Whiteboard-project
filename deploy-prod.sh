#!/bin/bash

# MERN Dashboard - Production Deployment Script
# Usage: ./deploy-prod.sh [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  MERN Dashboard Production Deployment${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if .env.production exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Error: $ENV_FILE not found!${NC}"
    echo -e "${YELLOW}Please create $ENV_FILE with your production settings.${NC}"
    echo -e "${YELLOW}You can use .env.production.example as a template.${NC}"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' $ENV_FILE | xargs)

# Validate required environment variables
required_vars=("MONGO_ROOT_USERNAME" "MONGO_ROOT_PASSWORD" "JWT_SECRET" "SESSION_SECRET" "CLIENT_URL")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo -e "${RED}Error: Missing required environment variables:${NC}"
    printf '%s\n' "${missing_vars[@]}"
    exit 1
fi

echo -e "${GREEN}✓ Environment variables validated${NC}"

# Pull latest changes if git is available
if command -v git &> /dev/null && [ -d ".git" ]; then
    echo -e "${BLUE}Pulling latest changes...${NC}"
    git pull origin main || git pull origin master || true
    echo -e "${GREEN}✓ Repository updated${NC}"
fi

# Stop existing containers
echo -e "${BLUE}Stopping existing containers...${NC}"
docker compose -f $COMPOSE_FILE down --remove-orphans || true
echo -e "${GREEN}✓ Existing containers stopped${NC}"

# Build and start containers
echo -e "${BLUE}Building and starting production containers...${NC}"
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE up -d --build

# Wait for services to be healthy
echo -e "${BLUE}Waiting for services to be healthy...${NC}"

# Wait for MongoDB
echo -n "  MongoDB: "
timeout 60 bash -c 'until docker compose -f '"$COMPOSE_FILE"' exec -T mongo mongosh --eval "db.adminCommand(\"ping\")" > /dev/null 2>&1; do sleep 2; done' && echo -e "${GREEN}Ready${NC}" || echo -e "${RED}Failed${NC}"

# Wait for Server
echo -n "  Server: "
timeout 120 bash -c 'until curl -sf http://localhost:5000/api/health > /dev/null 2>&1; do sleep 3; done' && echo -e "${GREEN}Ready${NC}" || echo -e "${YELLOW}Timeout (may still be starting)${NC}"

# Wait for Client
echo -n "  Client: "
timeout 60 bash -c 'until curl -sf http://localhost/health > /dev/null 2>&1; do sleep 2; done' && echo -e "${GREEN}Ready${NC}" || echo -e "${YELLOW}Timeout (may still be starting)${NC}"

# Show container status
echo -e "\n${BLUE}Container Status:${NC}"
docker compose -f $COMPOSE_FILE ps

# Cleanup old images
echo -e "\n${BLUE}Cleaning up old images...${NC}"
docker image prune -f

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Application is running at: ${BLUE}${CLIENT_URL}${NC}"
