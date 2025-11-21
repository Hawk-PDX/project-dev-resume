# PostgreSQL Setup

Switched from SQLite to PostgreSQL for consistency across dev and production. Here's how to get it running locally.

## Installing PostgreSQL

**On Mac (what I use):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Grab the installer from [postgresql.org](https://www.postgresql.org/download/windows/)

## Setting Up Your Local Database

Once PostgreSQL is installed, create the dev database:

```bash
# Connect to postgres
psql postgres

# Create your database
CREATE DATABASE portfolio_dev;

# Check it's there
\l

# Exit
\q
```

Your `backend/.env` should already be configured for PostgreSQL:
```bash
DATABASE_URL=postgresql://localhost/portfolio_dev
```

This assumes you're connecting as your system user with no password - works fine for local dev.

If you need credentials:
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_dev
```

## Initialize Everything

```bash
cd backend
source venv/bin/activate

# Run migrations to set up tables
python run_migrations.py

# Add some sample data
python seed_db.py
```

## Make Sure It Works

Start the server:
```bash
python run.py
```

Test it:
```bash
curl http://localhost:5001/api/health
```

Should see: `{"status": "healthy", "database": "connected"}`

## Troubleshooting

**PostgreSQL won't start:**
```bash
brew services list  # Check if it's actually running
brew services restart postgresql@15
```

**Database doesn't exist:**
```bash
psql postgres -c "CREATE DATABASE portfolio_dev;"
```

**Can't connect / auth errors:**

Check your PostgreSQL config allows local connections. Find the config file:
```bash
psql postgres -c "SHOW hba_file;"
```

For local dev, you can set it to trust local connections (don't do this in production obviously).

**psycopg2 won't install:**

You probably need the PostgreSQL dev headers:
```bash
brew install postgresql  # Mac
# or
sudo apt install libpq-dev python3-dev  # Linux
```

Then reinstall:
```bash
pip install --force-reinstall psycopg2-binary
```

## Useful PostgreSQL Commands

Connect to your database:
```bash
psql portfolio_dev
```

Once you're in:
```sql
-- See all tables
\dt

-- Check a table's structure
\d project

-- Query data
SELECT * FROM project WHERE featured = true;

-- Exit
\q
```

## Resetting Everything

If you need to start fresh:
```bash
psql postgres -c "DROP DATABASE IF EXISTS portfolio_dev;"
psql postgres -c "CREATE DATABASE portfolio_dev;"

cd backend
python run_migrations.py
python seed_db.py
```

## What About Production?

Production runs PostgreSQL on Render - connection string is in `render.yaml`. It handles SSL, backups, and all that automatically. Main difference is it's hosted and has connection pooling enabled.

## Why PostgreSQL?

SQLite was fine for prototyping, but PostgreSQL gives us:
- Better concurrency (important for production)
- Same database for dev and prod (fewer surprises)
- Better JSON support and full-text search if we need it later
- Actual production-ready features

Plus SQLAlchemy handles both, so the migration was pretty straightforward.
