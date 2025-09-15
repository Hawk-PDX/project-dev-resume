import { useState, useEffect } from 'react';
import { resumeService, projectsService, skillsService } from '../services/api';
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

    const fetchData = async () => {
        setLoading(true);
        try {
            console.log('🔄 Fetching projects from API...');
            const response = await projectsService.getProjects();
            console.log('✅ Projects fetched:', response.data.length, 'projects');
            console.log('📊 Featured projects:', response.data.filter(p => p.featured).length);
            setData(response.data);
            setError(null); // Clear any previous errors
        } catch (err) {
            console.warn('❌ API failed, using fallback projects:', err.message);
            setData(fallbackProjects);
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

/**
 * Custom hook for fetching skills data categorized by type
 * @returns {Object} Contains skills data, loading state, and error state
 */
export const useSkills = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await skillsService.getSkills();
                setData(response.data);
            } catch (err) {
                console.warn('API failed, using fallback skills:', err.message);
                setData(fallbackSkills);
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
