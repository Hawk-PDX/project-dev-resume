#!/bin/bash

# Developer Portfolio Setup Script
# This script automates the setup process for the full-stack developer portfolio

set -e  # Exit on any error

echo "🚀 Starting Developer Portfolio Setup..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v | cut -d'v' -f2)
        print_success "Node.js found: v$NODE_VERSION"
    else
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    # Check Python
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 -c "import sys; print('.'.join(map(str, sys.version_info[:3])))")
        print_success "Python found: $PYTHON_VERSION"
    else
        print_error "Python 3 is not installed. Please install Python 3.10+ from https://www.python.org/"
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm -v)
        print_success "npm found: v$NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        npm install
        print_success "Frontend dependencies installed"
    else
        print_warning "node_modules already exists, skipping npm install"
    fi
    
    # Create frontend environment file if it doesn't exist
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:5000
VITE_GA_ID=your-google-analytics-id  # Optional: for Google Analytics
EOF
        print_success "Frontend .env file created"
    else
        print_warning ".env file already exists, skipping creation"
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        print_success "Python virtual environment created"
    else
        print_warning "venv directory already exists, skipping creation"
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install Python dependencies
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt
        print_success "Backend dependencies installed"
    else
        print_error "requirements.txt not found in backend directory"
        exit 1
    fi
    
    # Create backend environment file if it doesn't exist
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# Backend Environment Variables
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///portfolio.db
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
TO_EMAIL=your-email@example.com
EMAIL_SERVICE=console

# For SMTP (uncomment and configure if needed):
# SMTP_SERVER=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USERNAME=your-email@gmail.com
# SMTP_PASSWORD=your-app-password

# For SendGrid (uncomment and configure if needed):
# SENDGRID_API_KEY=your-sendgrid-api-key
EOF
        print_success "Backend .env file created with secure secret key"
    else
        print_warning ".env file already exists in backend, skipping creation"
    fi
    
    # Initialize database
    print_status "Initializing database..."
    python3 -c "
from run import app, db
with app.app_context():
    db.create_all()
    print('Database tables created successfully!')
"
    
    cd ..
}

# Test the setup
test_setup() {
    print_status "Testing the setup..."
    
    # Start backend in background
    cd backend
    source venv/bin/activate
    python run.py &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 3
    
    # Test backend API
    if curl -s http://localhost:5000/api/health > /dev/null; then
        print_success "Backend API is running and responsive"
    else
        print_error "Backend API is not responding"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    
    # Stop backend
    kill $BACKEND_PID 2>/dev/null
    
    # Test frontend build
    if npm run build > /dev/null 2>&1; then
        print_success "Frontend builds successfully"
    else
        print_error "Frontend build failed"
        exit 1
    fi
}

# Main execution
main() {
    echo "========================================"
    echo "Developer Portfolio Setup Script"
    echo "========================================"
    
    check_prerequisites
    setup_frontend
    setup_backend
    test_setup
    
    echo "========================================"
    print_success "Setup completed successfully! 🎉"
    echo "========================================"
    echo ""
    echo "Next steps:"
    echo "1. Start backend: cd backend && source venv/bin/activate && python run.py"
    echo "2. Start frontend: npm run dev"
    echo "3. Open http://localhost:5173 in your browser"
    echo ""
    echo "Don't forget to:"
    echo "- Update your personal information in the backend"
    echo "- Configure email service if needed"
    echo "- Add your projects and skills"
    echo ""
    echo "Happy coding! 🚀"
}

# Run main function
main "$@"
