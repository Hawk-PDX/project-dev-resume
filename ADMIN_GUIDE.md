# Portfolio Admin Interface Guide

This guide explains how to use your portfolio's built-in admin interface to manage content after deployment.

## 🔗 Accessing Your Portfolio

- **Development**: http://localhost:5173 (frontend) + http://localhost:5001 (backend)
- **Production**: Your DigitalOcean App Platform domain

## 📋 Available Admin Features

Your portfolio includes admin controls embedded directly in the frontend for managing:

1. **Projects** - Add, edit, delete, and reorder projects
2. **Certificates** - View existing certificates (read-only in current implementation)
3. **Skills** - Static display (managed via backend routes)
4. **Experience & Education** - Static display (managed via backend routes or database seeding)

---

## 🚀 Managing Projects

### Adding a New Project

1. **Scroll down** to the "Add New Project" section (or click projects and scroll)
2. **Fill out the form** with your project details:
   - **Title** (required): Project name
   - **Description**: Brief description of the project
   - **Technologies**: Comma-separated list (e.g., "React, Flask, Python, PostgreSQL")
   - **GitHub URL**: Link to your GitHub repository
   - **Live Demo URL**: Link to deployed/live version
   - **Image URL**: Link to project screenshot/thumbnail
   - **Featured Project**: Check to display in featured projects section
   - **Order Priority**: Number for ordering (higher = appears first)

3. **Click "Add Project"** to save

**Example Project Entry:**
```
Title: E-commerce Platform
Description: Full-stack e-commerce application with user auth and payment processing
Technologies: React, Node.js, MongoDB, Stripe API
GitHub URL: https://github.com/HawkPDX/ecommerce-app
Live Demo URL: https://mystore.herokuapp.com
Featured: ✓ (checked)
Order Priority: 3
```

### Editing an Existing Project

1. **Find the project** in the Projects section
2. **Click the pencil icon** (✏️) on the project card
3. **Auto-scroll** happens to the form, which now shows "Edit Project"
4. **Modify** the fields you want to change
5. **Click "Update Project"** to save changes
6. **Click "Cancel"** to exit edit mode without saving

### Deleting a Project

1. **Find the project** you want to remove
2. **Click the trash icon** (🗑️) on the project card  
3. **Confirm deletion** in the popup modal
4. The project is **permanently removed** (cannot be undone)

### Project Display Features

- **Featured projects** appear in the main Projects section
- **Non-featured projects** are still stored but may not display prominently
- **Project ordering** is controlled by the "Order Priority" field (higher numbers first)
- **Technology tags** automatically create styled badges from comma-separated values
- **GitHub and Live Demo links** show as clickable icons when provided

---

## 📜 Managing Other Content

### Certificates

**Current Status**: Read-only display
- Certificates are shown in the Certificates section
- To add/edit certificates, you need to:
  1. Use the backend API directly, or
  2. Add them via database seeding script, or  
  3. Use a database admin tool

### Skills

**Current Status**: Static display managed in backend routes
- Skills are categorized into: Frontend, Backend, Database, Tools
- Each skill has a proficiency level (1-5)
- To modify skills:
  1. Edit `backend/app/routes/skills.py` fallback data, or
  2. Add to database via seeding script

### Experience & Education

**Current Status**: Static display from backend routes
- Shows work experience and educational background
- To modify:
  1. Edit the fallback data in `backend/app/routes/resume.py`, or
  2. Use the database seeding script to populate real data

---

## 🎛️ Admin Interface Tips

### Form Validation
- **Title is required** for projects
- **URL fields** validate proper URL format
- **Order Priority** accepts numbers only

### Visual Feedback
- **Success messages** appear in green when operations succeed
- **Error messages** appear in red if something goes wrong
- **Loading states** show "Adding Project..." / "Updating Project..." during saves

### Best Practices

**Project Management:**
- Use **descriptive titles** that clearly identify your projects
- Keep **descriptions concise** but informative (1-2 sentences)
- List **key technologies** used, separated by commas
- Use **order priority** to highlight your best work (higher numbers = top placement)
- Mark your **best projects as featured**

**URL Guidelines:**
- **GitHub URLs** should link to the actual repository
- **Live Demo URLs** should point to working deployments
- **Image URLs** should be publicly accessible (consider using GitHub raw URLs or image hosting)

**Organization:**
- **Regular cleanup** - Remove outdated projects periodically  
- **Keep current** - Update project descriptions and technologies as you enhance them
- **Quality over quantity** - Feature your best 4-6 projects rather than everything

---

## 🔧 Troubleshooting

### "Project not found" Error
- The project may have been deleted by another session
- Refresh the page and try again

### Form not clearing after submission
- This is normal for edit mode
- Use "Cancel" button to exit edit mode
- For new projects, form clears automatically on successful submission

### Changes not appearing immediately
- Try refreshing your browser
- Check browser console for any JavaScript errors
- Ensure your backend API is running and accessible

### Database Connection Issues
- In production, check DigitalOcean App Platform logs
- In development, ensure your backend server is running on port 5001

---

## 🚀 Future Enhancements

Currently planned or possible improvements:

### Near Term
- **Certificates management** - Full CRUD interface for certificates
- **Image upload** - Direct image uploads instead of URL links
- **Drag & drop reordering** - Visual project reordering

### Advanced Features
- **Experience/Education forms** - Admin interface for work history and education
- **Skills management** - Interface to add/edit/remove skills
- **Personal info editor** - Update contact information and bio
- **Bulk operations** - Import/export project data
- **Preview mode** - See changes before publishing

---

## 📞 Support & Development

### Local Development
```bash
# Frontend (http://localhost:5173)
npm run dev

# Backend (http://localhost:5001)  
cd backend
source venv/bin/activate
python run.py
```

### Database Management
```bash
# Seed database with current data
cd backend
source venv/bin/activate
python seed_db.py

# Reset database (clears all data)
# Navigate to: backend/portfolio.db and delete file, then restart backend
```

### Deployment
- **Automatic deployment** via GitHub push to main branch
- **Database migrations** run automatically on DigitalOcean
- **Health checks** available at `/api/health` endpoint

---

This admin interface allows you to maintain your portfolio content easily without needing to modify code or directly access the database. The interface is designed to be intuitive and provides immediate feedback for all operations.