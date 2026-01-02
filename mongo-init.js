// MongoDB Initialization Script
// This script runs when MongoDB container is first created

// Switch to admin database to authenticate
db = db.getSiblingDB('admin');

// Create the application database
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || 'mern_dashboard');

// Create application user with readWrite permissions
db.createUser({
  user: 'app_user',
  pwd: process.env.MONGO_APP_PASSWORD || 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: process.env.MONGO_INITDB_DATABASE || 'mern_dashboard'
    }
  ]
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ googleId: 1 }, { sparse: true });
db.boards.createIndex({ owner: 1 });
db.boards.createIndex({ 'collaborators.user': 1 });
db.boards.createIndex({ 'shareLinks.token': 1 }, { sparse: true });
db.sessions.createIndex({ expires: 1 }, { expireAfterSeconds: 0 });

print('MongoDB initialization completed successfully');
