# 🔐 JWT & Session Secret Examples and Generation Guide

## 📋 Current Generated Secrets

### **For Development/Testing:**
```env
JWT_SECRET=4WI7S9xFUp48PJYVTSy7usP2kcFvR4N7np9G2BAsEL8=
SESSION_SECRET=A9/PO3/r9AqyGZM3XS5q6lrH9BFjykV1tKnGcGSY/sA=
```

## 🛠️ How to Generate Your Own Secure Secrets

### **Method 1: Using Node.js (Recommended)**
```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generate Session Secret  
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### **Method 2: Using OpenSSL**
```bash
# Generate JWT Secret
openssl rand -base64 32

# Generate Session Secret
openssl rand -base64 32
```

### **Method 3: Using PowerShell (Windows)**
```powershell
# Generate JWT Secret
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Generate Session Secret
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### **Method 4: Online Tools (Less Secure)**
- https://generate-secret.vercel.app/32
- https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx

## 📝 Example Secrets for Different Environments

### **Development Examples:**
```env
JWT_SECRET=dev_4WI7S9xFUp48PJYVTSy7usP2kcFvR4N7np9G2BAsEL8=
SESSION_SECRET=dev_A9/PO3/r9AqyGZM3XS5q6lrH9BFjykV1tKnGcGSY/sA=
```

### **Production Examples:**
```env
JWT_SECRET=prod_8kJ9mN2pQ7tR5vY8zB3cF6hK1lM4nP7qS0uW3xA5dG8j
SESSION_SECRET=prod_2eR5tY8uI1oP4aSdF7gH0jKlM3nQ6wErT9yU2iOpA5sD
```

### **Staging Examples:**
```env
JWT_SECRET=stage_X1v2B3n4M5z6K7j8L9p0Q1w2E3r4T5y6U7i8O9a0S1d2
SESSION_SECRET=stage_Z9x8C7v6B5n4M3z2K1j0L9p8Q7w6E5r4T3y2U1i0O9a8
```

## 🔒 Security Best Practices

### **✅ DO:**
- Use at least 32 characters (256 bits)
- Include random letters, numbers, and symbols
- Use different secrets for JWT and Session
- Use different secrets for each environment
- Store secrets in environment variables
- Rotate secrets periodically

### **❌ DON'T:**
- Use simple passwords or dictionary words
- Hardcode secrets in your source code
- Use the same secret across environments
- Share secrets in plain text
- Commit secrets to version control

## 🔄 Secret Rotation Schedule

### **Recommended Rotation:**
- **Development**: Every 3-6 months
- **Staging**: Every 1-3 months  
- **Production**: Every 1-2 months or immediately if compromised

## 🚀 Quick Setup Commands

### **Generate and Update Secrets:**
```bash
# Generate new secrets
echo "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")"
echo "SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")"

# Copy to clipboard (Windows)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))" | clip
```

## 🛡️ Verification

### **Check Secret Strength:**
```javascript
// Run this in Node.js to verify your secret
const secret = "your-secret-here";
console.log(`Length: ${secret.length} characters`);
console.log(`Base64: ${Buffer.from(secret, 'base64').length} bytes`);
console.log(`Strong: ${secret.length >= 32 ? '✅ Yes' : '❌ No, use longer'}`);
```

---

**⚠️ SECURITY NOTE:** Always generate new secrets for production deployment!
