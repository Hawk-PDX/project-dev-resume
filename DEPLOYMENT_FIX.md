# Deployment Fix Guide

## Issues Fixed

### 1. **CORS Error**
- **Problem**: "Access-Control-Allow-Origin header is present on the requested resource"
- **Cause**: When Flask returns 500 errors, Flask-CORS doesn't add headers
- **Fix**: Added `@app.after_request` handler to ensure CORS headers are added to ALL responses, including errors

### 2. **Database Schema Error**  
- **Problem**: `psycopg2.errors.UndefinedColumn: column project.demo does not exist`
- **Cause**: Production database missing the `demo` column that exists in the model
- **Fix**: 
  - Updated `run_migrations.py` to use `text()` wrapper for raw SQL queries
  - Removed "emergency bypass" in `get_projects()` that was returning hardcoded data
  - Added proper error handling in `get_featured_projects()`

## Files Modified

1. `backend/app/__init__.py` - Added CORS headers to all responses
2. `backend/app/routes/projects.py` - Removed emergency bypass, fixed database queries
3. `backend/run_migrations.py` - Fixed SQL queries to use text() wrapper

## Deployment Steps

### Option 1: Redeploy on Render (Recommended)
1. Commit and push these changes to GitHub:
   ```bash
   git add .
   git commit -m "Fix CORS headers and database schema issues"
   git push origin main
   ```

2. Trigger a manual deploy on Render dashboard
   - The `startCommand` in `render.yaml` already includes:
     - `fix_demo_column.py` - Adds missing `demo` column
     - `run_migrations.py` - Runs migrations and adds missing columns
     - `seed_db.py` - Populates sample data if needed

3. Check Render logs to verify:
   - ✅ Demo column added successfully
   - ✅ Database migrations completed
   - ✅ Server started successfully

### Option 2: Manual Database Fix (Quick)
If you have access to the production database, you can run this SQL directly:

```sql
-- Add the demo column if it doesn't exist
ALTER TABLE project ADD COLUMN IF NOT EXISTS demo BOOLEAN DEFAULT FALSE;

-- Update existing projects (they're real, not demos)
UPDATE project SET demo = FALSE WHERE demo IS NULL;
```

## Testing the Fix

After deployment, test these endpoints:

1. **GET** `https://portfolio-backend-skva.onrender.com/api/projects/`
   - Should return projects from database (not hardcoded data)
   - Should include `demo` field

2. **GET** `https://portfolio-backend-skva.onrender.com/api/skills/`
   - Should return with CORS headers

3. **DELETE** `https://portfolio-backend-skva.onrender.com/api/projects/1`
   - Should delete project without 500 error
   - Should have CORS headers even if there's an error

## Verifying CORS Headers

Use browser DevTools Network tab or curl:

```bash
curl -I -X OPTIONS \
  -H "Origin: https://rosecitydev.tech" \
  -H "Access-Control-Request-Method: DELETE" \
  https://portfolio-backend-skva.onrender.com/api/projects/1
```

Should see:
```
Access-Control-Allow-Origin: https://rosecitydev.tech
Access-Control-Allow-Methods: GET,PUT,POST,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type,Authorization,Accept,Origin,X-Requested-With
```

## Rollback Plan

If issues persist, you can:

1. Check Render logs for specific error messages
2. SSH into Render service and run:
   ```bash
   cd backend
   python3 fix_demo_column.py
   ```
3. Verify database schema:
   ```bash
   python3 -c "from app import create_app, db; from sqlalchemy import text; app = create_app(); app.app_context().push(); print(db.session.execute(text('SELECT column_name FROM information_schema.columns WHERE table_name=\\'project\\' ORDER BY column_name')).fetchall())"
   ```

## Additional Notes

- The `render.yaml` `startCommand` runs these scripts in order:
  1. `fix_demo_column.py` - Emergency column fix
  2. `run_migrations.py` - Alembic migrations + manual column additions
  3. `seed_db.py` - Sample data population
  4. `gunicorn` - Start server

- CORS is configured for these origins:
  - `https://rosecitydev.tech`
  - `https://www.rosecitydev.tech`
  - `https://portfolio-frontend-zhcd.onrender.com`
  - Local development ports (5001, 5173, 5174, 5175)

- All existing projects will have `demo=False` after migration
- New projects added by non-admin users will have `demo=True`
