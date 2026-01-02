# MERN Dashboard - Docker Guide

## Overview

This project includes Docker support for both development and production environments.

## Prerequisites

- Docker Engine 24.0+
- Docker Compose v2.20+
- Git

## Quick Start (Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/mern-dashboard.git
   cd mern-dashboard
   ```

2. **Create environment file:**
   ```bash
   cp .env.production.example .env
   # Edit .env with your configuration
   ```

3. **Start development environment:**
   ```bash
   docker compose up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## Development Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f server

# Stop all services
docker compose down

# Rebuild and restart
docker compose up -d --build

# Remove all data (including database)
docker compose down -v
```

## Production Deployment

1. **Create production environment file:**
   ```bash
   cp .env.production.example .env.production
   # Edit .env.production with secure values
   ```

2. **Deploy using the script:**
   ```bash
   chmod +x deploy-prod.sh
   ./deploy-prod.sh
   ```

   Or manually:
   ```bash
   docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
   ```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network                            │
│                                                              │
│  ┌─────────┐    ┌─────────────┐    ┌──────────────────────┐ │
│  │ MongoDB │◄───│   Server    │◄───│  Client (Nginx)      │ │
│  │  :27017 │    │    :5000    │    │    :80 / :443        │ │
│  └─────────┘    └─────────────┘    └──────────────────────┘ │
│                                              ▲               │
└──────────────────────────────────────────────│───────────────┘
                                               │
                                          Users/Internet
```

## Container Details

### MongoDB Container
- Image: `mongo:7`
- Volume: Persistent data storage
- Healthcheck: Ping command every 30s

### Server Container
- Custom Node.js 20 Alpine image
- Automatic restart on failure
- Healthcheck via `/api/health` endpoint

### Client Container
- **Development:** React development server with hot reload
- **Production:** Nginx serving static build with API proxy

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_ROOT_USERNAME` | MongoDB admin username | Yes |
| `MONGO_ROOT_PASSWORD` | MongoDB admin password | Yes |
| `MONGO_DATABASE` | Database name | No (default: mern_dashboard) |
| `JWT_SECRET` | JWT signing secret | Yes |
| `SESSION_SECRET` | Session secret | Yes |
| `CLIENT_URL` | Frontend URL | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | No |

## Health Checks

All services include health checks:

```bash
# Check MongoDB
docker compose exec mongo mongosh --eval "db.adminCommand('ping')"

# Check Server
curl http://localhost:5000/api/health

# Check Client (production)
curl http://localhost/health
```

## Troubleshooting

### Services not starting
```bash
# Check logs
docker compose logs

# Rebuild from scratch
docker compose down -v
docker compose up -d --build
```

### MongoDB connection issues
```bash
# Verify MongoDB is healthy
docker compose exec mongo mongosh --eval "db.adminCommand('ping')"

# Check MongoDB logs
docker compose logs mongo
```

### Permission issues (Linux)
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

## CI/CD Pipeline

The project includes GitHub Actions workflows:

- **ci-cd.yml**: Main CI/CD pipeline with tests, build, and deployment
- **docker-test.yml**: Docker build verification for pull requests

### Pipeline Stages

1. **Test**: Run linting and tests for server and client
2. **Build**: Build Docker images
3. **Integration**: Run docker-compose integration tests
4. **Deploy**: Push images to GitHub Container Registry (main branch only)

## Security Recommendations

1. Use strong, unique passwords for all secrets
2. Never commit `.env` files to version control
3. Use HTTPS in production
4. Regularly update base images
5. Run containers as non-root users (production Dockerfiles)
