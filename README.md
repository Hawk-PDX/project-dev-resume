# Developer Portfolio

A modern, responsive full-stack developer portfolio built with React and Flask. Features a clean design, project showcase, and skills display.

## 🚀 Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern Tech Stack**: React 19, Vite, Flask, SQLAlchemy
- **Project Showcase**: Display your projects with descriptions and links
- **Skills Section**: Highlight your technical skills and expertise
- **Simple Setup**: Easy to customize with your personal information

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Framer Motion (animations)
- Heroicons
- Tailwind CSS
- Axios (API calls)

### Backend
- Flask
- SQLAlchemy (ORM)
- SQLite/PostgreSQL
- Email integration (SMTP/SendGrid)

### Testing
- Jest (frontend)
- React Testing Library
- pytest (backend)
- pytest-flask

## 📦 Installation & Setup Guide

### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Python 3.10+** - [Download here](https://www.python.org/downloads/)
- **npm** package manager

### Step 1: Install Frontend Dependencies
```bash
npm install
```

### Step 2: Install Backend Dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 3: Environment Setup
Create a `.env` file in the root directory:
```bash
VITE_API_BASE_URL=http://localhost:5000
```

Create a `.env` file in the backend directory:
```bash
FLASK_DEBUG=True
DATABASE_URL=sqlite:///portfolio.db
SECRET_KEY=your-secret-key-for-development
```

### Step 4: Initialize Database
```bash
cd backend
python -c "
from run import app, db
with app.app_context():
    db.create_all()
    print('Database tables created successfully!')
"
```

### Step 5: Start Development Servers
**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python run.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Your portfolio will be available at: http://localhost:5173

## 🎨 Personalization Guide

### 1. Update Personal Information
Edit the sample data in `backend/app/routes/resume.py`:
- Personal info: Update the default return values in `get_personal_info()`
- Experience: Update the sample data in `get_experience()`
- Education: Update the sample data in `get_education()`

### 2. Add Your Projects
Update the sample data in `backend/app/routes/projects.py`:
```python
# Replace the sample projects with your own
PROJECTS = [
    {
        "id": 1,
        "title": "Your Project Name",
        "description": "Your project description...",
        "technologies": "React, Python, Flask",
        "github_url": "https://github.com/yourusername/project",
        "live_url": "https://your-project.com",
        "image_url": "/api/static/images/project.jpg",
        "featured": True,
        "order": 1
    }
]
```

### 3. Customize Your Skills
Update the sample data in `backend/app/routes/skills.py`:
```python
# Replace with your actual skills
SKILLS = [
    {"name": "Your Skill", "level": 5, "category": "frontend"},
    {"name": "Another Skill", "level": 4, "category": "backend"}
]
```

### 4. Update Hero Section
Edit `src/components/Hero.jsx` to update:
- Your name and title
- Your personal description
- Your social media links

### 5. Styling Customization
- Global styles: `src/styles.css`
- Component-specific styles: Edit individual component files
- Colors: Update CSS variables in `src/index.css`

## 🚀 Quick Start

1. Follow the installation steps above
2. Update the sample data in the backend routes
3. Customize the frontend components with your information
4. Run both servers and your portfolio is ready!

---

**Happy Coding! 🚀**
