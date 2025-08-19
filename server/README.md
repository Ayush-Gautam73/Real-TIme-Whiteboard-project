# MERN Dashboard Backend Setup

## 🚀 Backend Server is Ready!

Your backend server is now set up with Google OAuth authentication. Here's what has been implemented:

### ✅ Features Implemented

1. **Google OAuth Authentication**
   - Login with Google
   - Session management
   - JWT token generation
   - User profile management

2. **Board Management**
   - Create, read, update, delete boards
   - Board collaboration features
   - Real-time element updates
   - Access control (owner, editor, viewer)

3. **User Management**
   - User search functionality
   - User profiles
   - Activity tracking
   - Statistics

### 🔧 Setup Instructions

#### 1. Google OAuth Configuration

To enable Google authentication, you need to:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing one
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add authorized origins:
     - `http://localhost:3000` (your frontend)
     - `http://localhost:5000` (your backend)
   - Add authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback`

5. **Update your .env file** with the credentials:
   ```env
   GOOGLE_CLIENT_ID=your-actual-google-client-id
   GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
   ```

#### 2. MongoDB Setup

The server is configured for MongoDB. You can either:

**Option A: Use MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a cluster
4. Get the connection string
5. Update MONGODB_URI in .env

**Option B: Use Local MongoDB**
1. Install MongoDB locally
2. The default connection string will work: `mongodb://localhost:27017/mern-dashboard`

#### 3. Environment Variables

Update your `.env` file with actual values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database (choose one)
# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-dashboard
# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/mern-dashboard

# Session Secret (generate a secure random string)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Google OAuth Configuration (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# JWT Configuration (generate a secure random string)
JWT_SECRET=your-jwt-secret-key-change-this-in-production
JWT_EXPIRE=24h
```

### 🎯 API Endpoints

#### Authentication
- `GET /api/auth/google` - Start Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user
- `GET /api/auth/status` - Check auth status
- `POST /api/auth/logout` - Logout
- `PUT /api/auth/profile` - Update profile

#### Boards
- `GET /api/boards` - Get user's boards
- `POST /api/boards` - Create new board
- `GET /api/boards/:id` - Get specific board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board
- `PUT /api/boards/:id/elements` - Update board elements
- `POST /api/boards/:id/collaborators` - Add collaborator
- `DELETE /api/boards/:id/collaborators/:userId` - Remove collaborator

#### Users
- `GET /api/users/search` - Search users
- `GET /api/users/profile/:id` - Get user profile
- `GET /api/users/stats` - Get user statistics
- `PUT /api/users/preferences` - Update preferences
- `GET /api/users/activity` - Get activity feed

### 🧪 Testing the Server

1. **Health Check**: `GET http://localhost:5000/api/health`
2. **Test Google OAuth**: `GET http://localhost:5000/api/auth/google`

### 🔄 Next Steps

1. **Configure Google OAuth credentials**
2. **Set up MongoDB (local or Atlas)**
3. **Update frontend to connect to backend**
4. **Test authentication flow**
5. **Implement real-time features with Socket.IO** (optional)

### 📁 Project Structure

```
server/
├── config/
│   └── passport.js          # Passport Google OAuth setup
├── models/
│   ├── User.js             # User model with Google auth support
│   └── Board.js            # Board model with collaboration
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── boards.js           # Board management routes
│   └── users.js            # User management routes
├── middleware/
│   └── auth.js             # Authentication middleware
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Dependencies and scripts
└── index.js                # Main server file
```

### 🚨 Important Security Notes

1. **Never commit .env file** to version control
2. **Use strong secrets** for SESSION_SECRET and JWT_SECRET
3. **In production**: Set NODE_ENV=production and use HTTPS
4. **Rate limiting**: Consider adding rate limiting middleware
5. **CORS**: Configure CORS properly for production

### 🐛 Troubleshooting

- **MongoDB connection issues**: Check your connection string and network access
- **Google OAuth errors**: Verify your client ID, secret, and redirect URIs
- **Port conflicts**: Make sure port 5000 is available
- **CORS issues**: Check your CLIENT_URL in .env matches your frontend URL

Your backend is ready to rock! 🎸
