import axios from 'axios';

const getApiBaseUrl = () => {
  if (window.location.hostname !== 'localhost') {
    return 'https://portfolio-backend-skva.onrender.com/api';
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
};

const API_BASE_URL = getApiBaseUrl();
console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // long timeout for cold starts
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Retry on server errors (likely cold start)
    if (error.response?.status === 502 || error.response?.status === 503) {
      originalRequest._retry = true;
      await new Promise(resolve => setTimeout(resolve, 3000));
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export const projectsService = {
  getProjects: async () => {
    try {
      const response = await api.get('/projects/');
      return response;
    } catch (error) {
      console.error('Failed to fetch projects:', error.message);
      throw error;
    }
  },

  getFeaturedProjects: async () => {
    const response = await api.get('/projects/featured');
    return response;
  },

  addProject: async (data) => {
    const response = await api.post('/projects/', data);
    return response;
  },

  editProject: async (id, data) => {
    const response = await api.put(`/projects/${id}`, data);
    return response;
  },

  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response;
  },

  fetchFromGitHub: async (githubUrl) => {
    return await api.post('/projects/fetch-github', { github_url: githubUrl });
  },

  fetchGitHubRepositories: async (githubAccounts) => {
    const response = await api.post('/projects/fetch-github-repos', { github_accounts: githubAccounts });
    return response.data;
  },

  fetchGitHubProject: async (githubUrl) => {
    const response = await api.post('/projects/fetch-github', { github_url: githubUrl });
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects/', projectData);
    return response.data;
  }
};

export const resumeService = {
  getPersonalInfo: async () => {
    return await api.get('/resume/personal');
  },

  getExperience: async () => {
    return await api.get('/resume/experience');
  },

  getEducation: async () => {
    return await api.get('/resume/education');
  },

  getCertificates: async () => {
    return await api.get('/resume/certificates');
  },

  getCertificate: async (id) => {
    return await api.get(`/resume/certificates/${id}`);
  },

  createCertificate: async (data) => {
    return await api.post('/resume/certificates', data);
  },

  updateCertificate: async (id, data) => {
    if (!id || id <= 0) {
      throw new Error('Invalid certificate ID');
    }
    return await api.put(`/resume/certificates/${id}`, data);
  },

  deleteCertificate: async (id) => {
    if (!id || id <= 0) {
      throw new Error('Invalid certificate ID');
    }
    return await api.delete(`/resume/certificates/${id}`);
  }
};

export const skillsService = {
  getSkills: async () => {
    return await api.get('/skills/');
  },

  calculateSkills: async (options = {}) => {
    return await api.post('/skills/calculate', options);
  },

  getInsights: async () => {
    return await api.get('/skills/insights');
  },

  getSkill: async (id) => {
    return await api.get(`/skills/${id}`);
  },

  updateSkill: async (id, data) => {
    return await api.put(`/skills/${id}`, data);
  },

  deleteSkill: async (id) => {
    return await api.delete(`/skills/${id}`);
  },

  addSkill: async (data) => {
    return await api.post('/skills/add', data);
  }
};

export default api;