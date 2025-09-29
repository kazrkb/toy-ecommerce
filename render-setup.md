# Deploy to Render - Step by Step

## Prerequisites
1. GitHub account
2. Render account (sign up at render.com)

## Steps:

### 1. Push to GitHub
Make sure your code is in a GitHub repository

### 2. Create Web Service on Render
1. Go to render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: toy-ecommerce
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. Environment Variables:
- `NODE_ENV=production`
- `DB_HOST=` (from Render PostgreSQL)
- `DB_USER=` (from Render PostgreSQL)
- `DB_PASSWORD=` (from Render PostgreSQL)
- `DB_NAME=toy_ecommerce`
- `SESSION_SECRET=your-secret-key`

### 4. Add PostgreSQL Database
1. Create new PostgreSQL database on Render
2. Copy connection details to your web service environment variables

### 5. Update Database Config
You'll need to modify your database connection to work with PostgreSQL instead of MySQL.

Your site will be live at: `https://your-app-name.onrender.com`