# Secret Generation Guide

This guide explains how to generate secure secrets for your MERN Dashboard deployment.

## Using the Secret Generator Script

The project includes a helper script to generate cryptographically secure secrets:

```bash
node generate-secrets.js
```

This will output secure random strings you can use for:
- `JWT_SECRET`
- `SESSION_SECRET`
- `MONGO_ROOT_PASSWORD`

## Manual Secret Generation

### Using Node.js

```javascript
// Generate a 64-character hex string
require('crypto').randomBytes(32).toString('hex')
```

### Using OpenSSL (Linux/Mac)

```bash
# Generate 32-byte (64 character) secret
openssl rand -hex 32

# Generate 64-byte (128 character) secret
openssl rand -hex 64
```

### Using PowerShell (Windows)

```powershell
# Generate 32-byte secret
-join ((1..32) | ForEach-Object { '{0:X2}' -f (Get-Random -Maximum 256) })
```

## Secret Requirements

### JWT_SECRET
- **Minimum length:** 32 characters
- **Recommended:** 64+ characters
- **Used for:** Signing JWT tokens for authentication

### SESSION_SECRET
- **Minimum length:** 32 characters
- **Recommended:** 64+ characters
- **Used for:** Encrypting session data

### MONGO_ROOT_PASSWORD
- **Minimum length:** 16 characters
- **Recommended:** 32+ characters with mixed characters
- **Used for:** MongoDB root user authentication

## Best Practices

1. **Never reuse secrets** across different environments
2. **Never commit secrets** to version control
3. **Rotate secrets** periodically (every 90 days recommended)
4. **Use a secret manager** in production (AWS Secrets Manager, HashiCorp Vault, etc.)
5. **Limit access** to production secrets

## Environment File Template

```bash
# .env.production

# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=<generated-password>
MONGO_DATABASE=mern_dashboard

# Authentication
JWT_SECRET=<generated-secret>
SESSION_SECRET=<generated-secret>

# URLs
CLIENT_URL=https://your-domain.com
REACT_APP_API_URL=https://your-domain.com
REACT_APP_SOCKET_URL=https://your-domain.com
```

## Generating All Secrets at Once

Run this command to generate all required secrets:

```bash
echo "MONGO_ROOT_PASSWORD=$(openssl rand -hex 16)"
echo "JWT_SECRET=$(openssl rand -hex 32)"
echo "SESSION_SECRET=$(openssl rand -hex 32)"
```

Or on Windows with Node.js:

```powershell
node -e "const c=require('crypto');console.log('MONGO_ROOT_PASSWORD='+c.randomBytes(16).toString('hex'));console.log('JWT_SECRET='+c.randomBytes(32).toString('hex'));console.log('SESSION_SECRET='+c.randomBytes(32).toString('hex'))"
```
