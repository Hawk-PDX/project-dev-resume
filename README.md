# Developer Portfolio

I built this full-stack portfolio to showcase real development work, not just talk about it. It pulls live data from GitHub, auto-calculates skills from my projects, and handles the quirks of free hosting like cold starts.

**[Live Demo](https://rosecitydev.tech)**

![Portfolio Demo](./public/images/dev-portfolio-SR.gif)

## Features

- **GitHub Integration**: Bulk import projects from multiple accounts, with tech stack detection and live links.
- **Smart Skills**: Auto-calculates proficiency based on project usage, with manual overrides.
- **Admin Mode**: Edit in dev, clean view in prod—no complex auth.
- **Analytics Dashboard**: Track visits and engagement.
- **Cold Start Handling**: Warmup logic, retries, and external monitoring to keep things fast.
- **Responsive Design**: Works on all devices, with real-time updates.

## Tech Stack

**Frontend**: React 19, Vite, Axios, Framer Motion, React Router, Socket.io-client.  
**Backend**: Flask 3.0.3, SQLAlchemy 2.0.43, PostgreSQL, Flask-CORS, Flask-SocketIO.  
**Testing**: Jest (frontend), pytest (backend).  
**Deployment**: Render with Gunicorn.

## Getting Started

**Prerequisites**: Node.js 18+, Python 3.10+, PostgreSQL 13+, Git.

### Setup

1. **Clone & Install**:
   ```bash
   git clone https://github.com/Hawk-PDX/project-dev-resume.git
   cd project-dev-resume
   npm install
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Environment**:
   - Root `.env`: `VITE_API_BASE_URL=http://localhost:5001/api`, Cloudinary keys for images.
   - Backend `.env`: `FLASK_DEBUG=True`, `DATABASE_URL=postgresql://localhost/portfolio_dev`, `SECRET_KEY=...`, optional `GITHUB_TOKEN`.

3. **Database**:
   ```bash
   psql postgres -c "CREATE DATABASE portfolio_dev;"
   cd backend
   python run_migrations.py
   python seed_db.py
   ```

4. **Run**:
   ```bash
   # Backend: cd backend && python run.py
   # Frontend: npm run dev
   ```
   Visit `http://localhost:5173`.

## Project Structure

```
src/              # Frontend components, hooks, services
backend/app/      # Flask routes, models, services
backend/migrations/  # DB schema changes
```

## Deployment

Hosted on Render: Frontend as static site, backend with Gunicorn, PostgreSQL for data. Uses UptimeRobot to prevent cold starts.

## Testing

```bash
npm test          # Frontend
cd backend && pytest  # Backend
```

## Customization

Fork and tweak: Update resume data in `backend/app/routes/resume.py`, hero in `src/components/Hero.jsx`, styles in `src/styles.css`.

## License

MIT—use it for your own portfolio.
