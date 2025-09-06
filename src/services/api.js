import axios from 'axios';

// Base URL for API requests - uses environment variable with localhost fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Configure axios instance with base settings
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 second timeout for requests
});

// Intercept requests to handle any pre-request logic
api.interceptors.request.use(
    (config) => config,
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Intercept responses to handle errors consistently across the app
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with an error status (4xx, 5xx)
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            // Request was made but no response received (network issues)
            console.error('Network Error:', error.message);
        } else {
            // Something else went wrong in setting up the request
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// Service for resume-related API calls
export const resumeService = {
    // Get personal information (name, contact details, etc.)
    getPersonalInfo: () => api.get('/resume/personal'),

    // Get work experience history
    getExperience: () => api.get('/resume/experience'),

    // Get education background
    getEducation: () => api.get('/resume/education'),

    // Get certificates
    getCertificates: () => api.get('/resume/certificates'),

    // Create a new certificate
    createCertificate: (data) => api.post('/resume/certificates', data),
};

// Service for project management operations
export const projectsService = {
    // Get all projects
    getProjects: () => api.get('/projects/'),

    // Get only featured projects
    getFeaturedProjects: () => api.get('/projects/featured'),

    // Get a specific project by ID
    getProject: (id) => api.get(`/projects/${id}`),

    // Create a new project
    addProject: (data) => api.post('/projects/', data),

    // Update an existing project
    editProject: (id, data) => api.put(`/projects/${id}`, data),

    // Delete a project
    deleteProject: (id) => api.delete(`/projects/${id}`),
};

// Service for skills data
export const skillsService = {
    // Get all skills categorized by type (frontend, backend, etc.)
    getSkills: () => api.get('/skills/'),
};

// Service for contact form submissions
export const contactService = {
    // Send a message through the contact form
    sendMessage: (data) => api.post('/contact', data),
};

export default api;
