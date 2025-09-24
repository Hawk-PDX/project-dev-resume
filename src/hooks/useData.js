import { useState, useEffect } from 'react';
import { resumeService, projectsService, skillsService } from '../services/productionApi';
import { fallbackPersonalInfo, fallbackProjects, fallbackSkills, fallbackCertificates } from '../data/fallbackData';

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
            const response = await projectsService.getProjects();
            setData(response.data);
            setError(null);
            setIsWarmingUp(false);
        } catch (err) {
            
            if (retryCount < maxRetries && (err.code === 'NETWORK_ERROR' || err.response?.status >= 500)) {
                setTimeout(() => {
                    fetchData(retryCount + 1);
                }, 3000);
                return;
            }
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
            const response = await skillsService.getSkills();
            setData(response.data);
            setError(null);
            setIsWarmingUp(false);
        } catch (err) {
            
            if (retryCount < maxRetries && (err.code === 'NETWORK_ERROR' || err.response?.status >= 500)) {
                setTimeout(() => {
                    fetchData(retryCount + 1);
                }, 3000);
                return;
            }
            
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

export const useCertificates = () => {
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
            const response = await resumeService.getCertificates();
            setData(response.data);
            setError(null);
            setIsWarmingUp(false);
        } catch (err) {
            
            if (retryCount < maxRetries && (err.code === 'NETWORK_ERROR' || err.response?.status >= 500)) {
                setTimeout(() => {
                    fetchData(retryCount + 1);
                }, 3000);
                return;
            }
            
            setData(fallbackCertificates);
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
