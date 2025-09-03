# DigitalOcean Deployment Guide

## Prerequisites
- DigitalOcean account
- GitHub repository with your code
- `doctl` CLI tool (optional but recommended)

## Step 1: Environment Variables Setup

### Required Variables
```bash
# Backend Variables
SECRET_KEY=<your-secure-secret-key>
FLASK_ENV=production
ALLOWED_ORIGINS=https://your-frontend-app.ondigitalocean.app

# Frontend Variables
VITE_API_URL=https://your-backend-app.ondigitalocean.app/api
```

## Step 2: Database Setup

### 2.1 Initial Migration
The app will automatically handle database migrations on startup, but you can also run them manually:

```bash
# SSH into your app
doctl apps ssh

# Navigate to backend directory
cd backend

# Run migrations
flask db upgrade
```

### 2.2 Database Backup (Optional)
If you're migrating from SQLite:
1. Export your SQLite data
2. Convert to PostgreSQL format
3. Import to DigitalOcean PostgreSQL

## Step 3: Deployment Steps

### 3.1 Deploy via App Platform
1. Go to DigitalOcean App Platform
2. Click "Create App" → "From Source Code"
3. Select your GitHub repository
4. Choose the branch to deploy
5. Configure as specified in `.do/app.yaml`

### 3.2 Verify Configuration
- Check that all environment variables are set
- Verify database connection string is correct
- Ensure CORS origins are properly configured

## Step 4: Post-Deployment Verification

### 4.1 Backend Health Check
```bash
curl https://your-backend-app.ondigitalocean.app/api/health
```
Expected response:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### 4.2 Frontend Verification
1. Open your frontend URL
2. Check browser console for errors
3. Verify all API calls work
4. Test all CRUD operations

## Troubleshooting

### Database Issues
- Check logs: `doctl apps logs <app-id>`
- Verify DATABASE_URL format
- Ensure migrations ran successfully

### CORS Issues
1. Verify ALLOWED_ORIGINS matches your frontend domain
2. Check browser console for specific CORS errors
3. Ensure protocols match (https)

### Build Failures
1. Check build logs in DigitalOcean dashboard
2. Verify node/python versions in App Platform settings
3. Check package.json and requirements.txt are up to date

## Monitoring

### Logs
```bash
# View app logs
doctl apps logs <app-id>

# View specific component logs
doctl apps logs <app-id> --component backend
```

### Health Monitoring
- Set up DigitalOcean monitoring
- Configure alerts for:
  - High CPU usage
  - Memory issues
  - Failed health checks

## Scaling (if needed)

### Vertical Scaling
1. Go to App Platform settings
2. Adjust resources (CPU/RAM)
3. Save changes

### Horizontal Scaling
1. Enable auto-scaling in App Platform
2. Set min/max instances
3. Configure scaling rules

## Support Resources
- [DigitalOcean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [Flask on App Platform](https://docs.digitalocean.com/developer-center/deploy-a-flask-app/)
- [Vite.js Deployment](https://vitejs.dev/guide/static-deploy.html)

## Common Issues & Solutions

### 502 Bad Gateway
- Check if backend service is running
- Verify health check endpoint
- Check application logs

### Database Connection Issues
- Verify DATABASE_URL is correctly set
- Check if database is accepting connections
- Verify SSL requirements

### Static Asset Issues
- Check build output directory
- Verify static file serving configuration
- Check asset paths in frontend code

Remember to always check the application logs when troubleshooting issues. Most problems can be diagnosed through the logs available in the DigitalOcean dashboard.