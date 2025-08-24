import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

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

export default api;
