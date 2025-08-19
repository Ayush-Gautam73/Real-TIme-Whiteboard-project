# MERN Dashboard - Real-time Collaborative Canvas

A comprehensive MERN stack application featuring real-time collaborative canvas with advanced sharing capabilities.

## ✨ Features

### 🎨 Real-time Collaboration
- **Socket.IO Integration**: Live element synchronization across multiple users
- **Multi-user Cursors**: Real-time cursor tracking and user presence indicators
- **Collaborative Drawing**: Simultaneous editing with conflict resolution

### 🔗 Advanced Share System
- **Granular Permissions**: View, Edit, and Admin access levels
- **Smart Expiration**: Configurable link expiration (1h, 1d, 7d, 30d, never)
- **Link Management**: Create, view, and revoke share links with descriptions
- **Inline Copy**: Dual copy functionality with visual feedback

### 🔐 Security & Authentication
- **JWT Authentication**: Secure user authentication and session management
- **Role-based Access**: Owner verification for admin operations
- **Permission Control**: Admin rights restricted to board creators
- **Secure Tokens**: Cryptographically secure share link generation

### 🎨 Modern UI/UX
- **Dark Theme**: Consistent dark interface with green accent navbar
- **Responsive Design**: Mobile-friendly responsive layout
- **Interactive Feedback**: Visual confirmations and loading states
- **Clean Architecture**: Modular component design

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time bidirectional communication
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Socket.IO** - Real-time engine
- **JWT** - JSON Web Token authentication

### Development Tools
- **ESLint** - Code linting and formatting
- **Nodemon** - Development server auto-restart
- **Concurrently** - Run multiple scripts simultaneously

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mern-dashboard.git
   cd mern-dashboard
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/mern-dashboard
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   NODE_ENV=development
   ```

   Create `.env` file in the client directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

5. **Start the application**
   
   **Option 1: Start both servers simultaneously (from root)**
   ```bash
   npm run dev
   ```
   
   **Option 2: Start servers separately**
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm start
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: mongodb://localhost:27017

## 📁 Project Structure

```
mern-dashboard/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── middleware/       # Express middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── socket/           # Socket.IO handlers
│   ├── index.js          # Server entry point
│   └── package.json
├── README.md
└── package.json          # Root package.json
```

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Boards
- `GET /api/boards` - Get user's boards
- `POST /api/boards` - Create new board
- `GET /api/boards/:id` - Get specific board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Share Links
- `GET /api/boards/:id/share-links` - Get board's share links
- `POST /api/boards/:id/share-links` - Create share link
- `DELETE /api/boards/:id/share-links/:linkId` - Revoke share link
- `GET /api/shared/:token` - Access shared board

## 🔌 Socket.IO Events

### Client → Server
- `join-board` - Join a board room
- `leave-board` - Leave a board room
- `canvas-update` - Send canvas changes
- `cursor-move` - Send cursor position

### Server → Client
- `canvas-update` - Receive canvas changes
- `user-joined` - User joined the board
- `user-left` - User left the board
- `cursor-update` - Receive cursor positions

## 🧪 Testing

```bash
# Run client tests
cd client
npm test

# Run server tests (if configured)
cd server
npm test
```

## 📦 Build for Production

```bash
# Build client
cd client
npm run build

# The build folder will contain the production-ready files
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- MongoDB for flexible data storage
- Tailwind CSS for rapid UI development
- React team for the amazing framework

## 📧 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/mern-dashboard](https://github.com/yourusername/mern-dashboard)

---

**Built with ❤️ using the MERN stack**
