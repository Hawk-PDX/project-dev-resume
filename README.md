# Full-Stack Developer Portfolio

My portfolio site built with React and Flask. I wanted something that actually shows what I can build, not just talks about it. It pulls from GitHub, has a backend API, and includes some features I think are pretty useful.

**[Live Demo](https://rosecitydev.tech)**

## Live Demo

![Portfolio Demo](./public/images/dev-portfolio-SR.gif)

Check out the live site to see everything in action - GitHub integration, auto-calculated skills, and responsive design.

## What It Does

More than just a static site - built this as a full-stack app to actually showcase real development work:

### Key Features
- **Smart Skills System**: Auto-calculates skill levels based on what's actually in my projects
- **GitHub Integration**: Can import projects from multiple GitHub accounts at once
- **Handles Cold Starts**: Built in warmup logic and retry mechanisms for when the backend spins down
- **Dev/Prod Modes**: Admin features for editing in dev, clean presentation in production
- **Live Data**: Everything updates in real-time across components

### How It's Built
- **React Components**: Reusable pieces with proper separation - easier to test and maintain
- **RESTful API**: Flask backend with error handling that actually works
- **SQLAlchemy**: Database layer that makes schema changes manageable
- **Performance Tweaks**: Tackled the cold start problem, added caching where it matters

## Tech Stack

**Frontend**
- React 19 with hooks
- Vite for builds
- React Router for navigation
- Custom hooks for data fetching and state
- Responsive CSS (Grid + Flexbox)

**Backend**
- Flask (Python)
- SQLAlchemy ORM
- PostgreSQL for all environments
- Flask-CORS for API access

**Testing & Deployment**
- Jest + React Testing Library
- pytest for backend
- Deployed on Render
- GitHub Actions for CI/CD

## Getting Started

**What you'll need:**
- Node.js 18+ and npm
- Python 3.10+ and pip
- PostgreSQL 13+ (see `backend/POSTGRESQL_SETUP.md` for install help)
- Git

### Setup

**1. Clone and Install**
```bash
git clone https://github.com/Hawk-PDX/project-dev-resume.git
cd project-dev-resume

# Frontend dependencies
npm install

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**2. Environment Configuration**

Create `.env` in project root:
```bash
VITE_API_BASE_URL=http://localhost:5001/api

# Cloudinary Configuration (Required for certificate image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
```

Create `backend/.env`:
```bash
FLASK_DEBUG=True
DATABASE_URL=postgresql://localhost/portfolio_dev
SECRET_KEY=your-development-secret-key
GITHUB_TOKEN=your_github_personal_access_token  # Optional but recommended
```

**Setting up Cloudinary for Image Uploads:**

Certificate images are uploaded to Cloudinary (free tier: 25GB storage):

1. Create a free account at [cloudinary.com](https://cloudinary.com/users/register/free)
2. Go to Settings > Upload > Upload presets
3. Click "Add upload preset"
4. Set **Signing Mode** to "Unsigned"
5. Optionally set a folder name (e.g., "certificates")
6. Save and copy the preset name
7. Copy your Cloud name from the dashboard
8. Add both values to your `.env` file

**3. PostgreSQL Setup**

Make sure PostgreSQL is installed and running, then create your dev database:
```bash
psql postgres -c "CREATE DATABASE portfolio_dev;"
```

See `backend/POSTGRESQL_SETUP.md` for detailed setup instructions and troubleshooting.

**4. Database Initialization**
```bash
cd backend
python run_migrations.py
python seed_db.py
```

**5. Development Servers**
```bash
# Terminal 1: Backend API (http://localhost:5001)
cd backend && source venv/bin/activate && python run.py

# Terminal 2: Frontend App (http://localhost:5173)
npm run dev
```

Visit `http://localhost:5173` to see your portfolio in action!

## Features Worth Mentioning

### GitHub Integration
Pulls projects straight from GitHub with some helpful automation:

- Import from multiple GitHub accounts at once
- Shows profile badges so people know where the code lives
- Filters repos by stars and activity
- Grabs tech stack from repo languages
- Parses README files for descriptions and live URLs
- Keeps track of forks vs original repos

**To use it:**
1. Open admin panel in dev mode
2. Hit "Bulk Import" and add GitHub usernames
3. Sort by popularity, pick what you want
4. Import with full metadata

### Skills Management
Figured out how to auto-calculate skill levels from projects:

- Looks at what tech is actually used in your projects
- Weights it based on how often and where it appears
- You can manually override if the auto-calc is off
- Preserves manual changes when you re-run auto-calculation

### Admin Mode
Keeps editing separate from presentation:

- Full admin panel in development
- Clean, read-only view in production
- Can enable with URL param for demos
- Toggle individual features (edit, delete, add, auto-calculate)
- No auth complexity - just environment-based

## Project Structure

### Frontend Architecture
```
src/
├── components/        # Reusable UI components
├── hooks/            # Custom React hooks for data management
├── services/         # API communication layer
├── config/           # Environment and feature configuration
└── styles/           # Global styling and theme variables
```

### Backend Structure
```
backend/
├── app/
│   ├── models.py     # SQLAlchemy database models
│   ├── routes/       # API endpoint definitions
│   └── services/     # Business logic and external integrations
├── migrations/       # Database schema evolution
└── tests/           # Unit and integration tests
```

### How Data Flows
1. User interacts with React components
2. Custom hooks handle state and API calls
3. Service layer makes HTTP requests (with retries)
4. Flask routes process and validate
5. SQLAlchemy talks to the database
6. UI updates automatically

## Deployment

**Production setup:**
- Frontend: Static hosting, optimized bundles
- Backend: Gunicorn WSGI server
- Database: PostgreSQL with connection pooling
- SSL/HTTPS: Auto-managed certificates

**Environments:**
- Dev: PostgreSQL (local), debug mode on
- Prod: PostgreSQL (hosted), optimized logging, health checks
- Config: Environment variables for secrets

## Performance

**Frontend:**
- Code splitting and lazy loading routes
- Tree shaking, minification
- Image lazy loading

**Backend:**
- Database indexes where they matter
- Connection pooling
- Health check endpoints for monitoring
- Usually under 200ms response time

## Testing

**Frontend:**
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

**Backend:**
```bash
cd backend
pytest                    # All tests
pytest -v                 # Verbose output
pytest tests/test_api.py   # Specific test file
```

## Making It Yours

If you want to fork this:

1. Update personal info in `backend/app/routes/resume.py`
2. Edit hero section in `src/components/Hero.jsx`
3. Change colors in `src/styles.css`
4. Add projects manually or import from GitHub

**Config files:**
- Admin features: `src/config/adminMode.js`
- API endpoints: service files in `src/services/`
- Database: `backend/app/models.py`

## What I Learned

- React hooks and modern patterns
- Building RESTful APIs that handle errors properly
- Database design and migrations with SQLAlchemy
- Deploying to production and dealing with cold starts
- Component architecture and keeping code reusable
- Testing both frontend and backend
- Environment-based configuration
- Syncing data between frontend and backend in real-time
- Working with external APIs (GitHub)

## License

MIT License - feel free to use this as a template for your own portfolio.
