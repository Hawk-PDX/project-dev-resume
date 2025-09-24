import axios from 'axios';

// Production-optimized API configuration
const getApiBaseUrl = () => {
  // Always use production URL in production, regardless of env vars
  if (window.location.hostname !== 'localhost') {
    return 'https://portfolio-backend-skva.onrender.com/api';
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
};

const API_BASE_URL = getApiBaseUrl();
console.log('🚀 Production API Base URL:', API_BASE_URL);

// Configure axios instance optimized for production
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // 45 second timeout for Render cold starts
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for debugging and optimization
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request setup error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with retry logic
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url} (${response.status})`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Don't retry if already retried
    if (originalRequest._retry) {
      console.error(`❌ API Failed (final): ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`, error.response?.status, error.message);
      return Promise.reject(error);
    }

    // Retry on 502 (Render cold start) or 503 (service unavailable)
    if (error.response?.status === 502 || error.response?.status === 503) {
      originalRequest._retry = true;
      console.warn(`⏳ API Retry: ${originalRequest.method?.toUpperCase()} ${originalRequest.url} (${error.response.status}) - Render cold start detected`);
      
      // Wait 3 seconds for service to warm up
      await new Promise(resolve => setTimeout(resolve, 3000));
      return api(originalRequest);
    }

    console.error(`❌ API Error: ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`, error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Production-optimized services
export const projectsService = {
  getProjects: async () => {
    try {
      console.log('📋 Fetching all projects...');
      const response = await api.get('/projects/');
      console.log(`📊 Loaded ${response.data.length} projects`);
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch projects:', error.message);
      throw error;
    }
  },

  getFeaturedProjects: async () => {
    try {
      console.log('⭐ Fetching featured projects...');
      const response = await api.get('/projects/featured');
      console.log(`📊 Loaded ${response.data.length} featured projects`);
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch featured projects:', error.message);
      throw error;
    }
  },

  addProject: async (data) => {
    try {
      console.log('➕ Adding new project:', data.title);
      const response = await api.post('/projects/', data);
      console.log('✅ Project added successfully:', response.data.id);
      return response;
    } catch (error) {
      console.error('❌ Failed to add project:', error.message);
      throw error;
    }
  },

  editProject: async (id, data) => {
    try {
      console.log('✏️ Editing project:', id);
      const response = await api.put(`/projects/${id}`, data);
      console.log('✅ Project updated successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to edit project:', error.message);
      throw error;
    }
  },

  deleteProject: async (id) => {
    try {
      console.log('🗑️ Deleting project:', id);
      const response = await api.delete(`/projects/${id}`);
      console.log('✅ Project deleted successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to delete project:', error.message);
      throw error;
    }
  },

  fetchFromGitHub: async (githubUrl) => {
    try {
      console.log('🔗 Fetching from GitHub:', githubUrl);
      const response = await api.post('/projects/fetch-github', { github_url: githubUrl });
      console.log('✅ GitHub data fetched successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch from GitHub:', error.message);
      throw error;
    }
  },

  fetchGitHubRepositories: async (githubAccounts) => {
    try {
      console.log('🔗 Fetching repositories from GitHub accounts:', githubAccounts);
      const response = await api.post('/projects/fetch-github-repos', { github_accounts: githubAccounts });
      console.log(`✅ Fetched ${response.data.total_count} repositories from ${githubAccounts.length} account(s)`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch GitHub repositories:', error.message);
      throw error;
    }
  },

  fetchGitHubProject: async (githubUrl) => {
    try {
      console.log('🔍 Fetching detailed GitHub project info:', githubUrl);
      const response = await api.post('/projects/fetch-github', { github_url: githubUrl });
      console.log('✅ GitHub project details fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch GitHub project details:', error.message);
      throw error;
    }
  },

  createProject: async (projectData) => {
    try {
      console.log('➕ Creating project:', projectData.title);
      const response = await api.post('/projects/', projectData);
      console.log('✅ Project created successfully:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create project:', error.message);
      throw error;
    }
  }
};

export const resumeService = {
  getPersonalInfo: async () => {
    try {
      console.log('👤 Fetching personal info...');
      const response = await api.get('/resume/personal');
      console.log('✅ Personal info loaded');
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch personal info:', error.message);
      throw error;
    }
  },

  getExperience: async () => {
    try {
      console.log('💼 Fetching experience...');
      const response = await api.get('/resume/experience');
      console.log('✅ Experience loaded');
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch experience:', error.message);
      throw error;
    }
  },

  getEducation: async () => {
    try {
      console.log('🎓 Fetching education...');
      const response = await api.get('/resume/education');
      console.log('✅ Education loaded');
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch education:', error.message);
      throw error;
    }
  },

  getCertificates: async () => {
    try {
      console.log('📜 Fetching certificates...');
      const response = await api.get('/resume/certificates');
      console.log('✅ Certificates loaded');
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch certificates:', error.message);
      throw error;
    }
  },

  getCertificate: async (id) => {
    try {
      console.log('🔍 Fetching certificate:', id);
      const response = await api.get(`/resume/certificates/${id}`);
      console.log('✅ Certificate loaded');
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch certificate:', error.message);
      throw error;
    }
  },

  createCertificate: async (data) => {
    try {
      console.log('➕ Creating certificate:', data.course);
      const response = await api.post('/resume/certificates', data);
      console.log('✅ Certificate created successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to create certificate:', error.message);
      throw error;
    }
  },

  updateCertificate: async (id, data) => {
    if (!id || id <= 0) {
      return Promise.reject(new Error('Invalid certificate ID for update'));
    }
    try {
      console.log('✏️ Updating certificate:', id);
      const response = await api.put(`/resume/certificates/${id}`, data);
      console.log('✅ Certificate updated successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to update certificate:', error.message);
      throw error;
    }
  },

  deleteCertificate: async (id) => {
    if (!id || id <= 0) {
      return Promise.reject(new Error('Invalid certificate ID for deletion'));
    }
    try {
      console.log('🗑️ Deleting certificate:', id);
      const response = await api.delete(`/resume/certificates/${id}`);
      console.log('✅ Certificate deleted successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to delete certificate:', error.message);
      throw error;
    }
  }
};

export const skillsService = {
  getSkills: async () => {
    try {
      console.log('🛠️ Fetching skills...');
      const response = await api.get('/skills/');
      console.log('✅ Skills loaded');
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch skills:', error.message);
      throw error;
    }
  },

  calculateSkills: async (options = {}) => {
    try {
      console.log('🔄 Calculating skills from projects...');
      const response = await api.post('/skills/calculate', options);
      console.log('✅ Skills calculated');
      return response;
    } catch (error) {
      console.error('❌ Failed to calculate skills:', error.message);
      throw error;
    }
  },

  getInsights: async () => {
    try {
      console.log('📊 Fetching skills insights...');
      const response = await api.get('/skills/insights');
      console.log('✅ Skills insights loaded');
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch skills insights:', error.message);
      throw error;
    }
  },

  // Get a specific skill by ID
  getSkill: async (id) => {
    try {
      console.log('🔍 Fetching skill:', id);
      const response = await api.get(`/skills/${id}`);
      console.log('✅ Skill loaded');
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch skill:', error.message);
      throw error;
    }
  },

  // Update an existing skill
  updateSkill: async (id, data) => {
    try {
      console.log('✏️ Updating skill:', id);
      const response = await api.put(`/skills/${id}`, data);
      console.log('✅ Skill updated successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to update skill:', error.message);
      throw error;
    }
  },

  // Delete a skill
  deleteSkill: async (id) => {
    try {
      console.log('🗑️ Deleting skill:', id);
      const response = await api.delete(`/skills/${id}`);
      console.log('✅ Skill deleted successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to delete skill:', error.message);
      throw error;
    }
  },

  // Add a new skill manually
  addSkill: async (data) => {
    try {
      console.log('➕ Adding new skill:', data.name);
      const response = await api.post('/skills/add', data);
      console.log('✅ Skill added successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to add skill:', error.message);
      throw error;
    }
  }
};

export default api;