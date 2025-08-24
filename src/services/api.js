import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
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
};

export const skillsService = {
    getSkills: () => api.get('/skills/'),
};

export const contactService = {
    sendMessage: (data) => api.post('/contact', data),
};

export default api;
