// MongoDB initialization script
db = db.getSiblingDB('mern_dashboard');

// Create application user
db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'mern_dashboard'
    }
  ]
});

// Create initial collections with indexes
db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ googleId: 1 }, { sparse: true });

db.createCollection('boards');
db.boards.createIndex({ owner: 1 });
db.boards.createIndex({ createdAt: -1 });
db.boards.createIndex({ 'collaborators.user': 1 });

db.createCollection('sessions');
db.sessions.createIndex({ expires: 1 }, { expireAfterSeconds: 0 });

print('Database initialization completed!');