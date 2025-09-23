# Contributing to Full-Stack Developer Portfolio

Thank you for your interest in contributing to this project! This portfolio application serves as both a functional portfolio website and a demonstration of modern full-stack development practices.

## 🎯 Types of Contributions

We welcome various types of contributions:

- **Bug fixes** - Help identify and resolve issues
- **Feature enhancements** - Improve existing functionality
- **Documentation improvements** - Make the project more accessible
- **Performance optimizations** - Enhance speed and efficiency
- **Security improvements** - Strengthen the application
- **Testing enhancements** - Improve test coverage and reliability

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+ and pip
- Git for version control

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/project-dev-resume.git
   cd project-dev-resume
   ```

2. **Set up the development environment**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Set up backend
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` in the project root
   - Create `backend/.env` with development settings (see README.md)

4. **Initialize the database**
   ```bash
   cd backend
   python -c "from run import app, db; app.app_context().push(); db.create_all()"
   ```

5. **Run the development servers**
   ```bash
   # Terminal 1: Backend (http://localhost:5001)
   cd backend && source venv/bin/activate && python run.py
   
   # Terminal 2: Frontend (http://localhost:5173)
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style

**Frontend (React/JavaScript)**
- Use ESLint configuration provided in the project
- Follow React best practices and hooks patterns
- Prefer functional components over class components
- Use meaningful component and variable names

**Backend (Python/Flask)**
- Follow PEP 8 style guidelines
- Use type hints where appropriate
- Maintain clear separation between routes, models, and services
- Write descriptive docstrings for functions and classes

### Commit Guidelines

- Use clear, descriptive commit messages
- Follow the format: `type(scope): brief description`
- Examples:
  - `feat(skills): add auto-calculation for project skills`
  - `fix(api): resolve GitHub integration rate limiting`
  - `docs(readme): update installation instructions`
  - `test(frontend): add Hero component tests`

### Testing Requirements

**Before submitting a pull request:**

- Run frontend tests: `npm test`
- Run backend tests: `cd backend && pytest`
- Ensure all tests pass and maintain coverage standards
- Add tests for new features or bug fixes

### Branch Naming

- `feature/description-of-feature`
- `bugfix/description-of-bug`
- `docs/description-of-documentation-change`
- `test/description-of-test-improvement`

## 🔧 Project Architecture

### Frontend Structure
```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── services/       # API communication layer
├── config/         # Configuration and feature flags
└── styles/         # Global styling and themes
```

### Backend Structure
```
backend/
├── app/
│   ├── models.py   # Database models
│   ├── routes/     # API endpoints
│   └── services/   # Business logic
├── tests/          # Unit and integration tests
└── migrations/     # Database schema changes
```

## 🚦 Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the guidelines above
3. **Write or update tests** for your changes
4. **Run the full test suite** to ensure nothing breaks
5. **Update documentation** if needed
6. **Create a pull request** with:
   - Clear description of changes
   - Reference to any related issues
   - Screenshots for UI changes
   - Notes about breaking changes (if any)

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Other (please describe)

## Testing
- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated (if applicable)
- [ ] No breaking changes (or clearly documented)
```

## 🐛 Reporting Issues

When reporting bugs, please include:

- **Environment details** (OS, browser, Node.js/Python versions)
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Error messages** or console logs
- **Screenshots** (if applicable)

## 💡 Suggesting Features

For feature requests, please provide:

- **Clear description** of the proposed feature
- **Use case** - why would this be valuable?
- **Implementation ideas** (if you have any)
- **Potential challenges** or considerations

## 📖 Areas for Contribution

Some specific areas where contributions are especially welcome:

### Frontend Enhancements
- Mobile responsiveness improvements
- Accessibility features (ARIA labels, keyboard navigation)
- Performance optimizations (lazy loading, caching)
- UI/UX improvements
- Additional portfolio sections or features

### Backend Improvements
- API performance optimizations
- Enhanced GitHub integration features
- Additional data export/import formats
- Security enhancements
- Database optimization

### DevOps & Tooling
- CI/CD pipeline improvements
- Docker containerization
- Additional deployment options
- Monitoring and logging enhancements

### Documentation
- Tutorial content for customization
- API documentation
- Deployment guides for different platforms
- Code examples and usage patterns

## 🤝 Code of Conduct

This project follows a standard code of conduct to ensure a welcoming environment:

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Assume good intentions
- Follow the community guidelines

## 📞 Getting Help

If you need help or have questions:

- **Check existing issues** for similar questions
- **Review the documentation** in README.md and WARP.md
- **Create a discussion** for general questions
- **Open an issue** for specific bugs or feature requests

## 🙏 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Project documentation
- Release notes (for significant contributions)

Thank you for contributing to making this project better! 🚀