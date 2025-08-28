from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Sample data for portfolio
PROJECTS = [
    {
        "id": 1,
        "title": "E-Commerce Platform",
        "description": "Full-stack e-commerce application with React and Node.js",
        "technologies": ["React", "Node.js", "MongoDB", "Express"],
        "github_url": "https://github.com/yourusername/ecommerce-platform",
        "live_url": "https://your-ecommerce-app.vercel.app"
    },
    {
        "id": 2,
        "title": "Task Management App",
        "description": "Productivity app with drag-and-drop functionality",
        "technologies": ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
        "github_url": "https://github.com/yourusername/task-manager",
        "live_url": "https://your-task-app.vercel.app"
    }
]

SKILLS = [
    {"name": "React", "level": "Advanced", "category": "Frontend"},
    {"name": "Python", "level": "Advanced", "category": "Backend"},
    {"name": "JavaScript", "level": "Advanced", "category": "Frontend"},
    {"name": "Flask", "level": "Intermediate", "category": "Backend"},
    {"name": "SQL", "level": "Intermediate", "category": "Database"},
    {"name": "Git", "level": "Advanced", "category": "Tools"}
]

@app.route('/api/projects', methods=['GET'])
def get_projects():
    return jsonify(PROJECTS)

@app.route('/api/skills', methods=['GET'])
def get_skills():
    return jsonify(SKILLS)

@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')
        
        # Basic validation
        if not all([name, email, message]):
            return jsonify({"error": "All fields are required"}), 400
        
        # In a real application, you would send an email here
        # For demo purposes, we'll just log the contact request
        print(f"Contact request from: {name} <{email}>")
        print(f"Message: {message}")
        
        return jsonify({"message": "Thank you for your message! I'll get back to you soon."}), 200
        
    except Exception as e:
        return jsonify({"error": "An error occurred while processing your request"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('FLASK_ENV') == 'development')
