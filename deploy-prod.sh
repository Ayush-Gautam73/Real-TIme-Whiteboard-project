#!/bin/bash

# Production deployment script
set -e

echo "🚀 Starting MERN Dashboard Production Deployment..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please create .env.production with all required environment variables."
    exit 1
fi

# Load production environment variables
export $(grep -v '^#' .env.production | xargs)

# Validate required environment variables
required_vars=("MONGODB_URI" "JWT_SECRET" "SESSION_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: Required environment variable $var is not set!"
        exit 1
    fi
done

echo "✅ Environment variables validated"

# Build and start production services
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "🚀 Starting production services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
timeout=300
elapsed=0

while [ $elapsed -lt $timeout ]; do
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up (healthy)"; then
        health_count=$(docker-compose -f docker-compose.prod.yml ps | grep -c "Up (healthy)" || true)
        total_count=$(docker-compose -f docker-compose.prod.yml ps | grep -c "Up" || true)
        
        if [ "$health_count" -eq "$total_count" ] && [ "$total_count" -gt 0 ]; then
            echo "✅ All services are healthy!"
            break
        fi
    fi
    
    sleep 10
    elapsed=$((elapsed + 10))
    echo "⏳ Still waiting... (${elapsed}s/${timeout}s)"
done

if [ $elapsed -ge $timeout ]; then
    echo "❌ Timeout: Services did not become healthy within $timeout seconds"
    echo "📋 Current status:"
    docker-compose -f docker-compose.prod.yml ps
    echo "📋 Logs:"
    docker-compose -f docker-compose.prod.yml logs --tail=20
    exit 1
fi

# Run health checks
echo "🔍 Running health checks..."
health_check_passed=true

# Check server health
if ! curl -f -s http://localhost:5000/api/health > /dev/null; then
    echo "❌ Server health check failed"
    health_check_passed=false
fi

# Check client accessibility
if ! curl -f -s http://localhost:3000 > /dev/null; then
    echo "❌ Client health check failed"
    health_check_passed=false
fi

if [ "$health_check_passed" = true ]; then
    echo "✅ All health checks passed!"
    echo "🎉 Deployment successful!"
    echo ""
    echo "📱 Application URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:5000"
    echo "   Health:   http://localhost:5000/api/health"
    echo ""
    echo "📊 Service Status:"
    docker-compose -f docker-compose.prod.yml ps
else
    echo "❌ Health checks failed. Rolling back..."
    docker-compose -f docker-compose.prod.yml down
    exit 1
fi