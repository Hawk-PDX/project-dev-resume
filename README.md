# Full-Stack Developer Portfolio

A production-ready portfolio application showcasing modern web development practices, full-stack architecture, and professional deployment strategies. This project demonstrates advanced React patterns, backend API design, and thoughtful user experience implementation.

🌟 **[Live Portfolio](https://rosecitydev.tech)** | 🚀 **Professional Portfolio Website**

## 🎬 Live Demo

![Portfolio Demo](./public/images/dev-portfolio-SR.gif)

*Experience the full interactive portfolio with real-time GitHub integration, dynamic skills calculation, and responsive design in action.*

## 🎯 Project Highlights

This portfolio goes beyond a simple website—it's a comprehensive full-stack application that demonstrates production-level development skills:

### Technical Innovation
- **Intelligent Skills System**: Auto-calculates proficiency levels based on project technologies
- **Multi-Source GitHub Integration**: Bulk import projects from multiple GitHub accounts
- **Advanced Loading Strategies**: Smart backend warmup and retry mechanisms for optimal performance
- **Environment-Aware Configuration**: Seamless development-to-production workflow
- **Real-Time Data Synchronization**: Live updates across all portfolio components

### Architecture Excellence
- **Component-Driven Design**: Reusable, testable React components with proper separation of concerns
- **API-First Approach**: RESTful backend services with comprehensive error handling
- **Database Abstraction**: SQLAlchemy ORM with migration support for schema evolution
- **Production Optimization**: Cold start mitigation, caching strategies, and performance monitoring

## 🛠️ Technology Stack

**Frontend Development**
- **React 19** - Latest features including concurrent rendering and improved hooks
- **Vite** - Modern build tool for fast development and optimized production bundles  
- **React Router** - Client-side routing with dynamic navigation
- **Custom Hooks** - Reusable logic for data fetching, state management, and UI interactions
- **Responsive CSS** - Mobile-first design with CSS Grid and Flexbox

**Backend Engineering**
- **Flask** - Lightweight, extensible Python web framework
- **SQLAlchemy** - Database ORM with relationship modeling and query optimization
- **PostgreSQL** - Production database with robust data integrity
- **Flask-CORS** - Cross-origin resource sharing with security considerations
- **Environment Management** - Configuration-driven deployment strategies

**Development & Deployment**
- **Jest & React Testing Library** - Comprehensive frontend test coverage
- **pytest** - Backend unit testing with fixtures and mocking
- **Render** - Cloud deployment with automatic scaling and SSL
- **GitHub Actions** - Continuous integration and deployment automation

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ and pip
- Git for version control

### Installation & Setup

**1. Clone and Install**
```bash
git clone <your-repo-url>
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
```

Create `backend/.env`:
```bash
FLASK_DEBUG=True
DATABASE_URL=sqlite:///portfolio_local.db
SECRET_KEY=your-development-secret-key
GITHUB_TOKEN=your_github_personal_access_token  # Optional but recommended
```

**3. Database Initialization**
```bash
cd backend
python -c "from run import app, db; app.app_context().push(); db.create_all(); print('Database initialized successfully!')"
```

**4. Development Servers**
```bash
# Terminal 1: Backend API (http://localhost:5001)
cd backend && source venv/bin/activate && python run.py

# Terminal 2: Frontend App (http://localhost:5173)
npm run dev
```

Visit `http://localhost:5173` to see your portfolio in action!

## 🎨 Advanced Features

### GitHub Integration System
The portfolio includes sophisticated GitHub integration for streamlined project management:

**Multi-Account Support**
- Import projects from multiple GitHub accounts simultaneously
- Visual account attribution with clickable profile badges
- Smart repository filtering by stars, activity, and relevance

**Intelligent Data Extraction**
- Automatic technology stack detection from repository languages
- README parsing for project descriptions and live URLs
- Fork detection and repository metadata preservation

**Bulk Import Workflow**
1. Access the admin panel (development mode)
2. Use "Bulk Import" to specify multiple GitHub usernames
3. Review fetched repositories with sorting by popularity
4. Selectively import projects with full metadata

### Skills Management System
**Auto-Calculation Engine**
- Analyzes project technologies to determine skill proficiency
- Weighted scoring based on project complexity and usage frequency
- Manual override capability for specialized skills

**Smart Preservation Logic**
- Maintains manually set skill levels during auto-updates
- Conflict resolution between calculated and manual values
- Historical tracking of skill progression

### Admin Mode Architecture
**Environment-Based Control**
- Development mode: Full admin functionality enabled
- Production mode: Clean, read-only portfolio interface
- URL parameter override for demonstrations

**Granular Permissions**
- Feature-specific toggles (edit, delete, add, auto-calculate)
- Component-level visibility controls
- Safe data protection without authentication complexity

## 🏗️ Architecture Deep Dive

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

### Data Flow Pattern
1. **React Components** trigger user interactions
2. **Custom Hooks** manage state and API communication
3. **Service Layer** handles HTTP requests with retry logic
4. **Flask Routes** process requests and validate data
5. **SQLAlchemy Models** interact with PostgreSQL database
6. **Real-time Updates** refresh UI components automatically

## 🚀 Deployment Strategy

### Production Environment
- **Frontend**: Served via static hosting with optimized bundles
- **Backend**: Python WSGI server with gunicorn
- **Database**: PostgreSQL with connection pooling
- **SSL/HTTPS**: Automatic certificate management
- **CDN**: Asset delivery optimization

### Environment Management
- **Development**: SQLite database, debug mode enabled
- **Production**: PostgreSQL, optimized logging, health monitoring
- **Configuration**: Environment variables for sensitive data
- **Secrets**: Secure handling of API keys and database credentials

## 📊 Performance Optimizations

### Frontend Performance
- **Code Splitting**: Lazy loading of route components
- **Bundle Optimization**: Tree shaking and minification
- **Caching Strategy**: Service worker for offline capability
- **Image Optimization**: Responsive images with lazy loading

### Backend Performance
- **Database Queries**: Optimized with proper indexing
- **API Response Time**: Sub-200ms average response times
- **Connection Pooling**: Efficient database connection management
- **Health Monitoring**: Endpoint uptime and performance tracking

## 🧪 Testing Strategy

### Frontend Testing
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Backend Testing
```bash
cd backend
pytest                    # All tests
pytest -v                 # Verbose output
pytest tests/test_api.py   # Specific test file
```

## 🎯 Customization Guide

### Personal Branding
1. Update personal information in `backend/app/routes/resume.py`
2. Modify hero section content in `src/components/Hero.jsx`
3. Customize color scheme in `src/styles.css`
4. Add your own project data or use GitHub import features

### Feature Configuration
- Enable/disable admin features in `src/config/adminMode.js`
- Adjust API endpoints in service files
- Modify database models for additional data fields
- Customize component styling to match your brand

### Environment Setup
- Development: Full admin features for content management
- Production: Clean, professional presentation
- Demo Mode: URL parameter activation for showcasing capabilities

## 📈 What This Demonstrates

**Technical Skills**
- Modern React development with hooks and concurrent features
- RESTful API design with proper HTTP methods and status codes
- Database modeling with relationships and constraints
- Production deployment with performance optimization

**Software Engineering Practices**
- Component-driven architecture with reusable code
- Test-driven development with comprehensive coverage
- Environment-specific configuration management
- Error handling and user experience considerations

**Problem-Solving Abilities**
- Complex data synchronization between frontend and backend
- Performance optimization for production environments
- User interface design with accessibility considerations
- Integration challenges with external APIs (GitHub)

---

**This portfolio represents a complete full-stack development project, demonstrating both technical expertise and attention to professional software development practices.**