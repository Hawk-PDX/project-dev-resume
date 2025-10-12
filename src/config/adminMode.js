// Admin Mode Configuration
// Simple control for admin and demo features

const isAdminMode = () => import.meta.env.VITE_ADMIN_MODE === 'true';
const isDemoMode = () => new URLSearchParams(window.location.search).get('demo') === 'true';

export const isAdminEnabled = () => isAdminMode() || isDemoMode();
export const isDemo = () => isDemoMode() && !isAdminMode();

export const canEditProjects = () => isAdminMode();
export const canDeleteProjects = () => isAdminMode();
export const canEditSkills = () => isAdminMode();
export const canDeleteSkills = () => isAdminMode();
export const canAddSkills = () => isAdminEnabled();
export const canEditCertificates = () => isAdminMode();
export const canDeleteCertificates = () => isAdminMode();
export const canBulkImport = () => isAdminMode();
export const canAutoCalculateSkills = () => isAdminEnabled();
export const canAddProjects = () => isAdminEnabled();

export const getAdminInfo = () => ({
  enabled: isAdminEnabled(),
  isDemo: isDemo(),
  method: isAdminMode() ? 'Environment Variable' : isDemoMode() ? 'Demo Parameter' : 'Disabled'
});
