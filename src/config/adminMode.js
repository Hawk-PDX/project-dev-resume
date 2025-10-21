// Admin Mode Configuration
// SECURE: Domain-based admin access + demo mode

// SECURE ADMIN DOMAINS - Only these domains get admin access
const ADMIN_DOMAINS = ['localhost', '127.0.0.1', 'rosecitydev.tech'];
const ADMIN_PORTS = [3000, 5173, 5174, 5175]; // Local dev ports

const isSecureAdminDomain = () => {
  const hostname = window.location.hostname;
  const port = parseInt(window.location.port) || (window.location.protocol === 'https:' ? 443 : 80);
  
  // Check if domain is in admin list
  const isDomainAllowed = ADMIN_DOMAINS.some(domain => 
    hostname === domain || hostname.endsWith(domain)
  );
  
  // For localhost, also check port
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return isDomainAllowed && (ADMIN_PORTS.includes(port) || port === 80 || port === 443);
  }
  
  return isDomainAllowed;
};

const isDemoMode = () => new URLSearchParams(window.location.search).get('demo') === 'true';
const isDevEnvironment = () => window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const isAdminEnabled = () => isSecureAdminDomain() || isDemoMode();
export const isDemo = () => isDemoMode() && !isSecureAdminDomain();

// Admin permissions (only for secure domains)
export const canEditProjects = () => isSecureAdminDomain();
export const canDeleteProjects = () => isSecureAdminDomain();
export const canEditSkills = () => isSecureAdminDomain();
export const canDeleteSkills = () => isSecureAdminDomain();
export const canEditCertificates = () => isSecureAdminDomain();
export const canDeleteCertificates = () => isSecureAdminDomain();
export const canBulkImport = () => isSecureAdminDomain();

// Limited permissions (demo users can do these)
export const canAddSkills = () => isAdminEnabled();
export const canAutoCalculateSkills = () => isAdminEnabled();
export const canAddProjects = () => true; // Allow all users to add projects

export const getAdminInfo = () => ({
  enabled: isAdminEnabled(),
  isDemo: isDemo(),
  isDev: isDevEnvironment(),
  domain: window.location.hostname,
  method: isSecureAdminDomain() ? 'Secure Domain' : isDemoMode() ? 'Demo Mode' : 'Public Access'
});
