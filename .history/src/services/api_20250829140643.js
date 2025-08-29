import axios from 'axios';

// Base URL for API requests - uses environment variable with localhost fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Configure axios instance with base settings
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 second timeout for requests
});

// Add request interceptor for error handling
api.interceptors.request.use(
    (config) => config,
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', error.message);
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export const resumeService = {
    getPersonalInfo: () => api.get('/resume/personal'),
    getExperience: () => api.get('/resume/experience'),
    getEducation: () => api.get('/resume/education'),
};

export const projectsService = {
    getProjects: () => api.get('/projects/'),
    getFeaturedProjects: () => api.get('/projects/featured'),
    getProject: (id) => api.get(`/projects/${id}`),
    addProject: (data) => api.post('/projects/', data),
    editProject: (id, data) => api.put(`/projects/${id}`, data),
    deleteProject: (id) => api.delete(`/projects/${id}`),
};

export const skillsService = {
    getSkills: () => api.get('/skills/'),
};

export const contactService = {
    sendMessage: (data) => api.post('/contact', data),
};

export default api;
