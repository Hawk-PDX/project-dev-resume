// Service to handle backend warmup on app load
// This helps reduce Render cold start issues by pinging the backend early

const BACKEND_URL = 'https://portfolio-backend-skva.onrender.com';

let warmupInProgress = false;
let warmupCompleted = false;

/**
 * Warm up the backend by making a health check request
 * This should be called when the app loads to reduce cold start delays
 */
export const warmupBackend = async () => {
  if (warmupInProgress || warmupCompleted) {
    console.log('🌡️ Backend warmup already in progress or completed');
    return;
  }

  warmupInProgress = true;
  console.log('🔥 Starting backend warmup...');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      // Don't cache health checks
      cache: 'no-cache'
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend warmup completed successfully:', data);
      warmupCompleted = true;
    } else {
      console.warn('⚠️ Backend warmup returned non-200 status:', response.status);
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('⏱️ Backend warmup timed out after 30 seconds');
    } else {
      console.warn('❌ Backend warmup failed:', error.message);
    }
  } finally {
    warmupInProgress = false;
  }
};

/**
 * Get the current warmup status
 */
export const getWarmupStatus = () => ({
  inProgress: warmupInProgress,
  completed: warmupCompleted
});

/**
 * Preload critical endpoints to warm up the entire backend
 * This is more aggressive and loads actual data
 */
export const preloadCriticalData = async () => {
  if (!warmupCompleted) {
    console.log('🔥 Warming up backend first...');
    await warmupBackend();
  }

  console.log('📊 Preloading critical data endpoints...');
  
  const endpoints = [
    '/api/projects/',
    '/api/skills/',
    '/api/resume/personal'
  ];

  const preloadPromises = endpoints.map(async (endpoint) => {
    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Cache for 5 minutes to avoid unnecessary requests
        cache: 'default'
      });
      
      if (response.ok) {
        console.log(`✅ Preloaded: ${endpoint}`);
        return await response.json();
      } else {
        console.warn(`⚠️ Failed to preload ${endpoint}:`, response.status);
        return null;
      }
    } catch (error) {
      console.warn(`❌ Error preloading ${endpoint}:`, error.message);
      return null;
    }
  });

  try {
    const results = await Promise.allSettled(preloadPromises);
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
    console.log(`🎯 Preloaded ${successCount}/${endpoints.length} critical endpoints`);
    return results;
  } catch (error) {
    console.error('❌ Critical data preload failed:', error);
    return [];
  }
};

/**
 * Initialize warmup process when the app starts
 * This should be called in App.jsx or main.jsx
 */
export const initializeWarmup = () => {
  // Only run in production (when not localhost)
  if (window.location.hostname === 'localhost') {
    console.log('🏠 Localhost detected - skipping backend warmup');
    return;
  }

  console.log('🚀 Initializing backend warmup for production...');
  
  // Start warmup immediately
  warmupBackend();
  
  // Preload critical data after a short delay
  setTimeout(() => {
    preloadCriticalData();
  }, 2000);
};

export default {
  warmupBackend,
  preloadCriticalData,
  initializeWarmup,
  getWarmupStatus
};