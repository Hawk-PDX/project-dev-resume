# Step-by-Step Deployment Guide for Portfolio Application

## Prerequisites
- GitHub account
- Render.com account (free tier available)
- Your code pushed to a GitHub repository

## Step 1: Prepare Your Repository

### 1.1 Commit the deployment files
```bash
git add render-fullstack.yaml .env.production
git commit -m "Add Render deployment configuration"
git push origin main
```

### 1.2 Verify your repository structure
Your repo should contain:
- `render-fullstack.yaml` (deployment config)
- `backend/` (Flask application)
- `src/` (React frontend)
- `package.json` (frontend dependencies)
- `backend/requirements.txt` (backend dependencies)

## Step 2: Set Up Render.com Account

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended for easy integration)
3. Verify your email address

### 2.2 Connect GitHub to Render
1. In Render dashboard, go to Settings → Connected Accounts
2. Connect your GitHub account
3. Authorize Render to access your repositories

## Step 3: Deploy Your Application

### 3.1 Create New Web Service
1. Click "New +" → "Web Service"
2. Select your GitHub repository
3. Choose "Other" for service type (we'll use the YAML config)

### 3.2 Configure Service with YAML
1. In the service creation form:
   - Name: `portfolio-deployment`
   - Environment: Select your repository
   - Build Command: (leave blank - defined in YAML)
   - Start Command: (leave blank - defined in YAML)
   - Plan: Free

2. Scroll down to "Advanced" section
3. Enable "Define using Render.yaml"
4. Set the path to: `render-fullstack.yaml`
5. Click "Create Web Service"

## Step 4: Configure Environment Variables

### 4.1 Set Production Secrets
After deployment starts, go to your service → Environment tab:

**Required Variables:**
- `SECRET_KEY`: Generate a strong random string (you can use: `openssl rand -hex 32` locally)
- `DATABASE_URL`: Will be auto-populated from the PostgreSQL service
- `VITE_API_URL`: Should be `https://portfolio-api.onrender.com/api`

### 4.2 Example Secret Generation
```bash
# Generate a secure secret key
python -c "import secrets; print(secrets.token_hex(32))"
# Output: a1b2c3d4e5f6... (copy this for SECRET_KEY)
```

## Step 5: Monitor Deployment

### 5.1 Check Build Logs
- Go to your service → Logs tab
- Monitor the build process
- Frontend should build successfully
- Backend should install dependencies

### 5.2 Verify Services
1. **Backend API**: Check if `https://portfolio-api.onrender.com/api/health` returns status
2. **Frontend**: Check your main URL (e.g., `https://portfolio-site.onrender.com`)
3. **Database**: Should auto-connect via `DATABASE_URL`

## Step 6: Test Your Deployment

### 6.1 Basic Health Checks
```bash
# Test backend API
curl https://portfolio-api.onrender.com/api/health

# Expected response: {"status": "healthy", "message": "Backend is running"}
```

### 6.2 Frontend Testing
1. Open your frontend URL in browser
2. Verify all sections load properly
3. Test contact form functionality
4. Check that projects and skills display correctly

## Step 7: Custom Domain (Optional)

### 7.1 Add Custom Domain
1. Go to service → Settings → Custom Domains
2. Add your domain name
3. Follow DNS configuration instructions

### 7.2 SSL Certificate
- Render automatically provides SSL certificates
- HTTPS will be enabled automatically

## Troubleshooting Common Issues

### Build Fails
- Check Python/Node version compatibility
- Verify all dependencies in requirements.txt/package.json
- Check build logs for specific errors

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check PostgreSQL service is running
- Ensure database migrations ran successfully

### CORS Errors
- Verify `VITE_API_URL` matches your backend URL
- Check CORS configuration in backend

### Environment Variables
- Double-check all variables are set in Render dashboard
- Ensure no typos in variable names

## Maintenance

### Regular Checks
- Monitor service uptime in Render dashboard
- Check logs periodically for errors
- Keep dependencies updated

### Scaling (If Needed)
- Upgrade to paid plans for more resources
- Add monitoring and alerting
- Implement CDN for static assets

## Support Resources
- Render Documentation: https://render.com/docs
- Render Status Page: https://status.render.com
- GitHub Repository for issues

Your application should now be successfully deployed and accessible to potential employers!
