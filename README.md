# Full-Stack Developer Portfolio

A modern, responsive portfolio application that showcases my journey as a full-stack developer. Built with React 19 and Flask, this project demonstrates both technical skills and attention to user experience through dynamic content management and thoughtful design.

🌟 **[Live Demo](https://portfolio-frontend-zhcd.onrender.com)** | 🔗 **[API Documentation](https://portfolio-backend-skva.onrender.com/api)**

## ✨ What Makes This Special

- **Dynamic Content Management**: Full CRUD operations for projects and skills—no code changes needed to update content
- **Multi-Account GitHub Integration**: Showcase projects from multiple GitHub accounts with bulk import capabilities
- **Smart Skills System**: Automatically calculates skill proficiency based on project technologies
- **Responsive Design**: Looks great on every device with mobile-first approach
- **Production Ready**: Deployed with environment-specific configurations and comprehensive error handling
- **Thoughtful UX**: Smooth animations, intuitive navigation, and user-friendly confirmation modals

## 🔧 Built With

**Frontend Experience**
- React 19 with modern hooks and concurrent features
- Vite for lightning-fast development and optimized builds
- React Router for seamless navigation
- Framer Motion bringing components to life with smooth animations
- Tailwind CSS for rapid, responsive styling
- Heroicons for consistent iconography

**Backend Architecture**  
- Flask providing a robust Python API foundation
- SQLAlchemy ORM for elegant database interactions
- PostgreSQL in production, SQLite for local development
- Comprehensive CORS handling for seamless frontend-backend communication

**Quality & Deployment**
- Jest and React Testing Library ensuring frontend reliability
- pytest maintaining backend code quality
- Deployed on Render with production-optimized configurations

## 🚀 Getting Started

**Prerequisites:** Node.js 18+, Python 3.10+

### Quick Setup

**1. Install Dependencies**
```bash
# Frontend
npm install

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**2. Environment Configuration**

Create `.env` in root directory:
```
VITE_API_BASE_URL=http://localhost:5000
```

Create `backend/.env`:
```
FLASK_DEBUG=True
DATABASE_URL=sqlite:///portfolio.db
SECRET_KEY=your-secret-key-for-development
GITHUB_TOKEN=your_github_token_here  # Optional: for higher GitHub API rate limits
```

**3. Initialize Database**
```bash
cd backend
python -c "from run import app, db; app.app_context().push(); db.create_all()"
```

**4. Start Both Servers**
```bash
# Terminal 1 - Backend (port 5000)
cd backend && source venv/bin/activate && python run.py

# Terminal 2 - Frontend (port 5173) 
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and you're ready to go!

## 🚀 GitHub Integration Features

The portfolio includes powerful GitHub integration capabilities to streamline project management:

### Bulk Import from Multiple Accounts
1. Navigate to the "Add New Project" section
2. Click "Bulk Import" to open the multi-account import dialog
3. Enter your GitHub usernames (one per line or comma-separated)
4. Review and select repositories from the fetched list
5. Import selected projects with full metadata extraction

### Benefits for Multiple GitHub Accounts
- **Professional Presentation**: Clear attribution shows which account each project belongs to
- **Complete Portfolio**: Showcase work from different phases of your development journey
- **Time Efficient**: Import multiple projects at once rather than adding them individually
- **Smart Filtering**: Repositories are sorted by popularity and recent activity

### GitHub Account Display
- Projects show GitHub account badges (e.g., `@username1`, `@username2`)
- Clickable badges link directly to GitHub profiles
- Clear visual distinction between projects from different accounts

## 🎨 Making It Your Own

This portfolio comes with sample data to help you get started quickly. Here's how to make it yours:

**Personal Information** 👤  
Update your details in `backend/app/routes/resume.py` - name, experience, education, and contact info.

**Projects Showcase** 💼  
Replace the sample projects in `backend/app/routes/projects.py` with your own work, or use the GitHub import features:

- **Single Import**: Import individual repositories by pasting GitHub URLs
- **Bulk Import**: Import multiple repositories from multiple GitHub accounts at once
- **Account Attribution**: Projects display which GitHub account they belong to
- **Smart Data Extraction**: Automatically pulls project descriptions, technologies, and live URLs

**Skills & Expertise** ⚙️  
Customize your skill set in `backend/app/routes/skills.py`. The smart system will auto-calculate proficiency based on your project technologies.

**Personal Branding** 🎨  
Edit `src/components/Hero.jsx` to update your name, title, and social links. Adjust colors and styling in `src/styles.css` to match your personal brand.

**You're All Set!** ✨  
Once you've updated the data files and run both servers, your personalized portfolio will be live and ready to impress!

---

_Built with attention to detail and a passion for clean, functional design_ 🚀
