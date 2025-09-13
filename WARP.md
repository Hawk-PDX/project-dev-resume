# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a full-stack developer portfolio application built with React 19 frontend and Flask backend. The architecture is designed as a modern web application with separate API and client services for local development.

## Development Commands

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage report
npm test:coverage

# Preview production build locally
npm run preview
```

### Backend Development
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start development server (runs on http://localhost:5001 by default)
python run.py

# Start on specific port
python run.py --port 5000

# Run backend tests
pytest

# Run tests with verbose output
pytest -v

# Initialize database (creates tables)
python -c "
from run import app, db
with app.app_context():
    db.create_all()
    print('Database tables created successfully!')
"
```

### Database Operations
```bash
cd backend

# Access Flask shell with pre-loaded models
flask shell

# Run simple database test
python test_db_simple.py
```

### Running Both Services
The application requires both frontend and backend running simultaneously:
1. Terminal 1: `cd backend && source venv/bin/activate && python run.py`
2. Terminal 2: `npm run dev`

## Architecture Overview

### Full-Stack Separation
- **Frontend**: React SPA served by Vite dev server
- **Backend**: Flask REST API with SQLAlchemy ORM
- **Database**: SQLite for local development
- **Communication**: RESTful API calls between frontend and backend

### Backend Architecture (Flask)
- **Application Factory Pattern**: `backend/app/__init__.py` creates Flask app with extensions
- **Blueprint Organization**: Routes organized in `backend/app/routes/` by feature:
  - `resume.py`: Personal info, experience, education endpoints
  - `projects.py`: Project CRUD operations
  - `skills.py`: Skills management
- **Models**: SQLAlchemy models in `backend/app/models.py` define database schema
- **Database**: Uses Flask-Migrate for schema versioning

### Frontend Architecture (React)
- **Component-based**: Single-page application with component organization in `src/components/`
- **State Management**: Local React state with useRef for cross-component communication
- **API Layer**: Axios-based service calls from components
- **Routing**: Single page with scroll-based navigation (no React Router in current implementation)
- **Styling**: Tailwind CSS with custom CSS in `src/styles.css`

### Key Architectural Patterns

#### Backend Patterns
- **Factory Pattern**: `create_app()` function initializes Flask app with all extensions
- **Blueprint Pattern**: Feature-based route organization
- **Environment-based Configuration**: Uses python-dotenv for environment variables
- **Health Check Pattern**: `/api/health` endpoint for monitoring
- **CORS Handling**: Configured for local development origins

#### Frontend Patterns
- **Ref-based Communication**: Projects component exposes refresh method via ref
- **Form State Management**: AddProject component handles both create and edit modes
- **Error Boundaries**: Basic error handling with ErrorBoundary component
- **Responsive Design**: Mobile-first approach with Tailwind classes

### Database Schema
Key entities with relationships:
- `PersonalInfo`: Basic profile information
- `Experience`: Work history with company, position, dates
- `Education`: Academic background
- `Project`: Portfolio projects with metadata (GitHub, live URLs, featured status)
- `Skill`: Technical skills with categories and proficiency levels

All models include ordering fields (`order`) for custom sorting and timestamps where relevant.

### Local Development
- **Database**: SQLite for simple local development
- **CORS**: Localhost origins for frontend/backend communication
- **Build**: Vite dev server for hot reload during development
- **Environment**: `.env` files for both frontend and backend configurations

## Environment Configuration

### Frontend Environment (.env in root)
```bash
VITE_API_BASE_URL=http://localhost:5000
```

### Backend Environment (backend/.env)
```bash
FLASK_DEBUG=True
DATABASE_URL=sqlite:///portfolio.db
SECRET_KEY=your-secret-key-change-this-in-production
```

## Testing Strategy

### Frontend Testing
- **Framework**: Jest with React Testing Library
- **Environment**: jsdom for DOM testing
- **Coverage**: Configured thresholds in `jest.config.js`
- **File Mocking**: Static assets mocked via `__mocks__/fileMock.js`

### Backend Testing
- **Framework**: pytest with pytest-flask
- **Configuration**: `backend/pytest.ini` defines test discovery
- **Test Location**: `backend/tests/` directory
- **Database**: Separate test database configuration


## Code Customization Patterns

When personalizing this portfolio:
1. **Sample Data**: Routes contain hardcoded sample data that should be replaced
2. **Database Seeding**: No automatic seeding - data is served from route files
3. **Component Updates**: Hero, About components contain placeholder content
4. **Styling**: CSS custom properties and Tailwind classes for consistent theming

## Development Workflow Notes

- Backend runs on port 5001 by default (to avoid conflicts)
- Frontend development server proxies API calls to backend
- Database is automatically created on first run
- CORS is pre-configured for common development ports
- Build process optimizes for production with code splitting and minification
