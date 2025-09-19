import { useState, useEffect } from 'react';
import { resumeService, projectsService, skillsService } from '../services/productionApi';
import { fallbackPersonalInfo, fallbackProjects, fallbackSkills, fallbackCertificates } from '../data/fallbackData';

/**
 * Custom hook for fetching personal information
 * @returns {Object} Contains data, loading state, and error state
 */
export const usePersonalInfo = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await resumeService.getPersonalInfo();
                setData(response.data);
            } catch (err) {
                console.warn('API failed, using fallback personal info:', err.message);
                setData(fallbackPersonalInfo);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

/**
 * Custom hook for fetching and managing projects
 * @returns {Object} Contains projects data, loading state, error state, and refresh function
 */
export const useProjects = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isWarmingUp, setIsWarmingUp] = useState(false);

    const fetchData = async (retryCount = 0) => {
        const maxRetries = 2;
        setLoading(true);
        
        // Show warming up message after first retry
        if (retryCount > 0) {
            setIsWarmingUp(true);
        }
        
        try {
            console.log(`🔄 Fetching projects from API... (attempt ${retryCount + 1})`);
            const response = await projectsService.getProjects();
            console.log('✅ Projects fetched:', response.data.length, 'projects');
            console.log('📊 Featured projects:', response.data.filter(p => p.featured).length);
            setData(response.data);
            setError(null); // Clear any previous errors
            setIsWarmingUp(false);
        } catch (err) {
            console.warn(`❌ API failed (attempt ${retryCount + 1}):`, err.message);
            
            // Retry on network errors or 50x errors (Render cold start)
            if (retryCount < maxRetries && (err.code === 'NETWORK_ERROR' || err.response?.status >= 500)) {
                console.log(`⏳ Retrying in 3 seconds... (${retryCount + 1}/${maxRetries})`);
                setTimeout(() => {
                    fetchData(retryCount + 1);
                }, 3000);
                return; // Don't set loading to false yet
            }
            
            // Final fallback after all retries
            console.warn('❌ Using fallback projects after retries failed');
            setData(fallbackProjects);
            setError(err.message);
            setIsWarmingUp(false);
        } finally {
            // Only set loading to false if we're not retrying
            if (retryCount >= maxRetries) {
                setLoading(false);
            } else {
                setTimeout(() => setLoading(false), 100);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, refresh: () => fetchData(0), isWarmingUp };
};

/**
 * Custom hook for fetching skills data categorized by type
 * @returns {Object} Contains skills data, loading state, error state, and refresh function
 */
export const useSkills = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isWarmingUp, setIsWarmingUp] = useState(false);

    const fetchData = async (retryCount = 0) => {
        const maxRetries = 2;
        setLoading(true);
        
        if (retryCount > 0) {
            setIsWarmingUp(true);
        }

        try {
            console.log(`🛠️ Fetching skills from API... (attempt ${retryCount + 1})`);
            const response = await skillsService.getSkills();
            console.log('✅ Skills fetched successfully');
            setData(response.data);
            setError(null);
            setIsWarmingUp(false);
        } catch (err) {
            console.warn(`❌ Skills API failed (attempt ${retryCount + 1}):`, err.message);
            
            if (retryCount < maxRetries && (err.code === 'NETWORK_ERROR' || err.response?.status >= 500)) {
                console.log(`⏳ Retrying skills in 3 seconds... (${retryCount + 1}/${maxRetries})`);
                setTimeout(() => {
                    fetchData(retryCount + 1);
                }, 3000);
                return;
            }
            
            console.warn('❌ Using fallback skills after retries failed');
            setData(fallbackSkills);
            setError(err.message);
            setIsWarmingUp(false);
        } finally {
            if (retryCount >= maxRetries) {
                setLoading(false);
            } else {
                setTimeout(() => setLoading(false), 100);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, refresh: () => fetchData(0), isWarmingUp };
};

/**
 * Custom hook for fetching work experience history
 * @returns {Object} Contains experience data, loading state, and error state
 */
export const useExperience = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await resumeService.getExperience();
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

/**
 * Custom hook for fetching certificates
 * @returns {Object} Contains certificates data, loading state, error state, and refresh function
 */
export const useCertificates = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await resumeService.getCertificates();
            setData(response.data);
        } catch (err) {
            console.warn('API failed, using fallback certificates:', err.message);
            setData(fallbackCertificates);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, refresh: fetchData };
};
