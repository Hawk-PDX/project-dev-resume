# 🚀 Deploy to Render (Recommended Alternative to DigitalOcean)

## Why Render?
- ✅ **Much more reliable** than DigitalOcean
- ✅ **Zero Docker configuration** needed
- ✅ **Free tier** available for portfolios
- ✅ **Automatic deployments** on git push
- ✅ **Built-in database** support

## 📋 Step-by-Step Deployment

### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with your GitHub account (connects automatically)

### 2. Deploy Backend (Flask API)
1. **Click "New +" → "Web Service"**
2. **Connect GitHub repository**: `Hawk-PDX/project-dev-resume`
3. **Configure:**
   - **Name**: `portfolio-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && gunicorn --bind 0.0.0.0:$PORT run:app`
   - **Auto-Deploy**: `Yes`

4. **Environment Variables** (Add these):
   ```
   FLASK_ENV=production
   SECRET_KEY=your-secret-key-here
   ALLOWED_ORIGINS=https://your-frontend-url.onrender.com
   DATABASE_URL=<will be set automatically when you add database>
   ```

### 3. Create Database
1. **Go to Dashboard → "New +" → "PostgreSQL"**
2. **Configure:**
   - **Name**: `portfolio-db`
   - **Database Name**: `portfolio`
   - **User**: `postgres`
   - **Plan**: `Free` (perfect for portfolio)

3. **Copy the Internal Database URL** and add it to your backend service as `DATABASE_URL`

### 4. Deploy Frontend (React)
1. **Click "New +" → "Static Site"**
2. **Connect same GitHub repository**
3. **Configure:**
   - **Name**: `portfolio-frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
   - **Auto-Deploy**: `Yes`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

### 5. Database Setup
After both services are deployed:

1. **Go to backend service → "Shell"**
2. **Run database setup**:
   ```bash
   flask db upgrade
   python seed_db.py
   ```

## 🎯 Expected Results
- **Backend**: `https://portfolio-backend-xyz.onrender.com`
- **Frontend**: `https://portfolio-frontend-xyz.onrender.com`
- **Database**: Managed PostgreSQL with your data

## 💰 Cost Comparison
- **Render Free Tier**: $0/month (perfect for portfolios)
- **DigitalOcean**: $12+/month (and doesn't work!)

## 🚀 Benefits Over DigitalOcean
1. **Just Works** - No Docker configuration hell
2. **Free Tier** - Actually free for portfolio sites
3. **Better Support** - Real documentation that works
4. **Automatic SSL** - HTTPS out of the box
5. **Git Integration** - Deploy on push (actually works)
6. **Reliability** - 99.9% uptime vs your DigitalOcean failures

---

## Alternative: One-Click Railway Deployment

If Render doesn't work, try [Railway](https://railway.app):

1. **Connect GitHub repo**
2. **Railway auto-detects** your Flask + React setup
3. **Deploys automatically** with zero configuration
4. **Built-in database** included

**Railway is even simpler** but has a smaller free tier.