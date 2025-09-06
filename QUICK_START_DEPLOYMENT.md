# Quick Start Deployment and Personalization Guide

## Personalizing Your Resume Template

This project uses a backend database to store your personal information. If the database is empty, the app shows default placeholder data as a template. This allows you to personalize your resume without affecting the template for other users.

### Adding Your Personal Information

1. Ensure your backend environment is set up and the database is initialized.

2. Use the provided script to add your personal information to the database:

```bash
python backend/scripts/add_personal_info.py
```

3. Edit the script `backend/scripts/add_personal_info.py` to replace the placeholder values with your actual personal details before running.

4. Once added, the frontend will fetch and display your personal information instead of the placeholder template.

### Updating Your Information

- To update your personal info, you can either:
  - Modify the database directly (e.g., via a database client).
  - Extend the backend with API endpoints or an admin interface (not included by default).

### Keeping the Template Ideal for Others

- If other developers clone this project and do not add personal info to their database, they will see the default placeholder template.
- This approach keeps the project reusable as a template while allowing personal customization.

## Running the Project

- Follow the main README.md for instructions on running the backend and frontend servers.
- Make sure environment variables like `VITE_API_URL` are set correctly to point to your backend API.

## Support

For any questions or issues, please refer to the project documentation or contact the maintainer.
