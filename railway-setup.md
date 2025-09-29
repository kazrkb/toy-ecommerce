# Deploy to Railway - Step by Step

## Prerequisites
1. GitHub account
2. Railway account (sign up at railway.app)

## Steps:

### 1. Prepare Your Code
```bash
# Make sure your project is ready
npm install
```

### 2. Create railway.json (optional but recommended)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 3. Environment Variables to Set in Railway:
- `NODE_ENV=production`
- `PORT=3000` (Railway will override this)
- `DB_HOST=` (Railway MySQL host)
- `DB_USER=` (Railway MySQL user)
- `DB_PASSWORD=` (Railway MySQL password)
- `DB_NAME=toy_ecommerce`
- `SESSION_SECRET=your-secret-key-here`

### 4. Deploy Steps:
1. Push your code to GitHub
2. Go to railway.app
3. Click "Start a New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Add MySQL database service
7. Configure environment variables
8. Deploy!

Your site will be live at: `https://your-project-name.up.railway.app`