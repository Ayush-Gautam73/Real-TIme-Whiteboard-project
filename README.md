# MERN Dashboard - Real-time Collaborative Canvas

A modern collaborative whiteboard application built with the MERN stack, featuring real-time editing, advanced sharing controls, and comprehensive drawing tools.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)

## ✨ Features

### 🎨 Real-time Collaboration
- **Live Synchronization**: Multiple users can edit simultaneously with instant updates
- **User Presence**: See who's online with real-time cursor tracking
- **Conflict Resolution**: Smart handling of concurrent edits

### 🔗 Advanced Sharing System
- **Granular Permissions**: Configure view, edit, or admin access
- **Smart Expiration**: Set link expiration (1h, 1d, 7d, 30d, or never)
- **Link Management**: Create, manage, and revoke share links easily

### 🎯 Drawing Tools
- **Text & Shapes**: Add text, rectangles, circles, and arrows
- **Freehand Drawing**: Natural drawing with customizable brush tools
- **Zoom & Pan**: Navigate large canvases with smooth interactions
- **Undo/Redo**: Full history management for all actions

### 🔐 Security & Authentication
- **JWT Authentication**: Secure user sessions and API access
- **Role-based Access**: Owner-controlled board permissions

### 🐳 DevOps & Deployment
- **Docker Containerization**: Full containerized application stack
- **CI/CD Pipeline**: Automated testing, building, and deployment with GitHub Actions
- **Multi-stage Builds**: Optimized production Docker images
- **Health Monitoring**: Comprehensive health checks and monitoring
- **Auto-scaling Ready**: Kubernetes and Docker Swarm compatible
- **Secure Sharing**: Cryptographically secure share tokens

### 🎨 Modern Interface
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Theme**: Easy-on-the-eyes interface with intuitive controls
- **Export Options**: Save boards as PNG or PDF files

## 🛠️ Tech Stack

**Frontend:**
- React.js with Hooks & Context API
- Tailwind CSS for styling
- Socket.IO Client for real-time features
- Lucide React for icons

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose ODM
- Socket.IO for WebSocket communication
- JWT for authentication

**DevOps:**
- Environment-based configuration
- Production-ready deployment setup

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/yourusername/mern-dashboard.git
   cd mern-dashboard
   
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies
   cd ../client && npm install
   ```

2. **Environment Configuration**
   
   Copy and configure environment files:
   ```bash
   # Server environment
   cp server/.env.example server/.env
   # Edit server/.env with your database URL and secrets
   
   # Client environment  
   cp client/.env.example client/.env
   # Edit client/.env if needed (defaults work for local development)
   ```

3. **Start the application**

   **Option 1: Docker (Recommended)**
   ```bash
   # Start all services with Docker
   docker-compose up -d --build
   
   # View logs
   docker-compose logs -f
   
   # Stop services
   docker-compose down
   ```

   **Option 2: Manual Setup**
   ```bash
   # From the root directory
   npm run dev
   
   # Or start separately:
   # Terminal 1: cd server && npm start
   # Terminal 2: cd client && npm start
   ```

4. **Open your browser**
   - Application: http://localhost:3000
   - API: http://localhost:5000

## 📁 Project Structure

```
mern-dashboard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── services/      # API services
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/           # API endpoints
│   ├── models/           # Database models
│   ├── socket/           # Real-time handlers
│   └── package.json
└── README.md
```

## � API Overview

### Core Endpoints
- **Authentication**: Register, login, user management
- **Boards**: CRUD operations for boards and elements
- **Sharing**: Create and manage share links
- **Real-time**: Socket.IO events for live collaboration

### Socket Events
- Canvas updates and element synchronization
- User presence and cursor tracking
- Real-time notifications

## 🐳 Docker & CI/CD Deployment

### Quick Start with Docker

1. **Development Environment**
   ```bash
   # Clone and navigate to project
   git clone https://github.com/Ayush-Gautam73/Real-TIme-Whiteboard-project.git
   cd mern-dashboard
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your configuration
   
   # Start all services with Docker Compose
   docker-compose up -d --build
   ```

2. **Production Deployment**
   ```bash
   # Setup production environment
   cp .env.production.example .env.production
   # Configure production variables
   
   # Deploy with production optimizations
   chmod +x deploy-prod.sh
   ./deploy-prod.sh
   ```

### 🚀 CI/CD Pipeline

**Automated GitHub Actions workflow includes:**
- ✅ Multi-version Node.js testing (16.x, 18.x, 20.x)
- 🔒 Security vulnerability scanning
- 🏗️ Automated Docker image building
- 📦 Container registry publishing (GitHub Container Registry)
- 🚢 Automated deployment to staging/production
- 🩺 Health checks and rollback mechanisms

**Deployment Triggers:**
- Push to `main`/`master`: Full CI/CD pipeline
- Pull Requests: Testing and security scans
- Tags: Production deployments with versioning

### 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │  React Client   │    │   Node.js API   │
│   (Port 80/443) │────│   (Port 3000)   │────│   (Port 5000)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐    ┌─────────────────┐
                       │     Redis       │    │    MongoDB      │
                       │  (Port 6379)    │    │  (Port 27017)   │
                       └─────────────────┘    └─────────────────┘
```

### 🌐 Deployment Options

**Containerized Deployment:**
- **Docker Compose**: Local development and small-scale production
- **Kubernetes**: Enterprise-scale with auto-scaling
- **Docker Swarm**: Multi-node container orchestration

**Cloud Platforms:**
- **AWS**: ECS, EKS, or EC2 with Docker
- **Google Cloud**: Cloud Run, GKE
- **Azure**: Container Instances, AKS
- **DigitalOcean**: App Platform, Droplets with Docker

**Traditional Hosting:**
- **Frontend**: Netlify, Vercel (static build)
- **Backend**: Heroku, Railway, DigitalOcean Apps
- **Database**: MongoDB Atlas, AWS DocumentDB

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Built with modern web technologies and inspired by collaborative tools like Figma and Miro.

---

**⭐ Star this repo if you find it useful!**
