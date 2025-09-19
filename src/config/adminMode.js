// Admin Mode Configuration
// Controls whether admin features (edit/delete) are visible and functional

/**
 * Environment-based admin mode detection
 * You can control this through environment variables or simple toggles
 */

// Method 1: Environment Variable Control (Recommended)
const isAdminMode = () => {
  // Set VITE_ADMIN_MODE=true in your local .env for development
  // Leave undefined/false for production
  return import.meta.env.VITE_ADMIN_MODE === 'true';
};

// Method 2: Hostname-based Control (Alternative)
const isAdminModeByHostname = () => {
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1';
};

// Method 3: URL Parameter Control (Demo purposes)
const isAdminModeByParam = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('admin') === 'true';
};

// Method 4: Konami Code / Secret Key (Fun approach)
let konamiSequence = [];
const konamiCode = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

const initializeKonamiCode = (callback) => {
  document.addEventListener('keydown', (e) => {
    konamiSequence.push(e.code);
    konamiSequence = konamiSequence.slice(-konamiCode.length);
    
    if (JSON.stringify(konamiSequence) === JSON.stringify(konamiCode)) {
      console.log('🎮 Konami Code activated! Admin mode enabled.');
      callback(true);
      konamiSequence = []; // Reset
    }
  });
};

// Current admin mode configuration
const ADMIN_CONFIG = {
  // Choose your preferred method:
  enabled: isAdminMode(), // Environment-based (recommended)
  
  // Or combine methods for flexibility:
  // enabled: isAdminMode() || isAdminModeByHostname() || isAdminModeByParam(),
  
  // Feature-specific controls
  features: {
    editProjects: true,
    deleteProjects: true,
    editSkills: true,
    deleteSkills: true,
    addSkills: true,
    editCertificates: true,
    deleteCertificates: true,
    bulkImport: true,
    skillsAutoCalculate: true
  }
};

// Helper functions for components
export const isAdminEnabled = () => ADMIN_CONFIG.enabled;

export const canEditProjects = () => ADMIN_CONFIG.enabled && ADMIN_CONFIG.features.editProjects;
export const canDeleteProjects = () => ADMIN_CONFIG.enabled && ADMIN_CONFIG.features.deleteProjects;
export const canEditSkills = () => ADMIN_CONFIG.enabled && ADMIN_CONFIG.features.editSkills;
export const canDeleteSkills = () => ADMIN_CONFIG.enabled && ADMIN_CONFIG.features.deleteSkills;
export const canAddSkills = () => ADMIN_CONFIG.enabled && ADMIN_CONFIG.features.addSkills;
export const canEditCertificates = () => ADMIN_CONFIG.enabled && ADMIN_CONFIG.features.editCertificates;
export const canDeleteCertificates = () => ADMIN_CONFIG.enabled && ADMIN_CONFIG.features.deleteCertificates;
export const canBulkImport = () => ADMIN_CONFIG.enabled && ADMIN_CONFIG.features.bulkImport;
export const canAutoCalculateSkills = () => ADMIN_CONFIG.enabled && ADMIN_CONFIG.features.skillsAutoCalculate;

// Admin mode info for display
export const getAdminInfo = () => ({
  enabled: ADMIN_CONFIG.enabled,
  method: import.meta.env.VITE_ADMIN_MODE ? 'Environment Variable' : 'Disabled',
  features: ADMIN_CONFIG.features
});

// Konami code setup
export const setupKonamiCode = (onActivate) => {
  if (typeof onActivate === 'function') {
    initializeKonamiCode(onActivate);
  }
};

export default {
  isAdminEnabled,
  canEditProjects,
  canDeleteProjects,
  canEditSkills,
  canDeleteSkills,
  canAddSkills,
  canEditCertificates,
  canDeleteCertificates,
  canBulkImport,
  canAutoCalculateSkills,
  getAdminInfo,
  setupKonamiCode
};