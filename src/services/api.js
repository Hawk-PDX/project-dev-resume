import axios from 'axios';

// Base URL for API requests - uses environment variable with localhost fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
console.log('API_BASE_URL:', API_BASE_URL);

// Configure axios instance with base settings
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 second timeout for requests (increased for Render cold starts)
});

// Intercept requests to handle any pre-request logic
api.interceptors.request.use(
    (config) => config,
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add retry functionality for temporary server errors
const retryRequest = async (config, retryCount = 0) => {
    const maxRetries = 2;
    const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 5000); // Exponential backoff, max 5s
    
    try {
        return await api(config);
    } catch (error) {
        if (retryCount < maxRetries && error.response?.status >= 500) {
            console.warn(`API request failed (${error.response?.status}), retrying in ${retryDelay}ms... (${retryCount + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return retryRequest(config, retryCount + 1);
        }
        throw error;
    }
};

// Intercept responses to handle errors consistently across the app
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Retry logic for 500 errors if not already retried
        if (error.response?.status >= 500 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                return await retryRequest(originalRequest, 0);
            } catch (retryError) {
                // If retry fails, continue with original error handling
                error = retryError;
            }
        }
        
        if (error.response) {
            // Server responded with an error status (4xx, 5xx)
            console.error('API Error:', error.response.status, error.response.data);
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

    // Get a specific certificate by ID
    getCertificate: (id) => api.get(`/resume/certificates/${id}`),

    // Create a new certificate
    createCertificate: (data) => api.post('/resume/certificates', data),

    // Update an existing certificate
    updateCertificate: (id, data) => {
        if (!id || id <= 0) {
            return Promise.reject(new Error('Invalid certificate ID for update'));
        }
        return api.put(`/resume/certificates/${id}`, data);
    },

    // Delete a certificate
    deleteCertificate: (id) => {
        if (!id || id <= 0) {
            return Promise.reject(new Error('Invalid certificate ID for deletion'));
        }
        return api.delete(`/resume/certificates/${id}`);
    },
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

    // Fetch project data from GitHub URL
    fetchFromGitHub: (githubUrl) => api.post('/projects/fetch-github', { github_url: githubUrl }),
};

// Service for skills data
export const skillsService = {
    // Get all skills categorized by type (frontend, backend, etc.)
    getSkills: () => api.get('/skills/'),

    // Auto-calculate skills from projects
    calculateSkills: (options = {}) => api.post('/skills/calculate', options),

    // Get insights about skills and project alignment
    getInsights: () => api.get('/skills/insights'),

    // Get a specific skill by ID
    getSkill: (id) => api.get(`/skills/${id}`),

    // Update an existing skill
    updateSkill: (id, data) => api.put(`/skills/${id}`, data),

    // Delete a skill
    deleteSkill: (id) => api.delete(`/skills/${id}`),

    // Add a new skill manually
    addSkill: (data) => api.post('/skills/add', data),
};

// Service for contact form submissions
export const contactService = {
    // Send a message through the contact form
    sendMessage: (data) => api.post('/contact', data),
};

export default api;
