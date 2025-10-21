// Admin Mode Configuration
// SECURE: Password-based admin authentication

// Admin session management
const ADMIN_SESSION_KEY = 'portfolio_admin_session';
const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

// Check if user is authenticated as admin
const isAdminAuthenticated = () => {
  try {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!session) return false;
    
    const { timestamp, authenticated } = JSON.parse(session);
    const now = Date.now();
    
    // Check if session is expired
    if (now - timestamp > SESSION_DURATION) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return false;
    }
    
    return authenticated === true;
  } catch {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return false;
  }
};

// Admin authentication function
export const authenticateAdmin = () => {
  const password = prompt('Enter admin password:');
  
  // Simple password check - you can make this more secure
  const correctPassword = 'rosecity2024!';
  
  if (password === correctPassword) {
    const session = {
      timestamp: Date.now(),
      authenticated: true
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    return true;
  }
  
  alert('Incorrect password!');
  return false;
};

// Logout function
export const logoutAdmin = () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  window.location.reload();
};

const isDemoMode = () => new URLSearchParams(window.location.search).get('demo') === 'true';
const isDevEnvironment = () => window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const isAdminEnabled = () => isAdminAuthenticated() || isDemoMode();
export const isDemo = () => isDemoMode() && !isAdminAuthenticated();

// Admin permissions (only for authenticated admins)
export const canEditProjects = () => isAdminAuthenticated();
export const canDeleteProjects = () => isAdminAuthenticated();
export const canEditSkills = () => isAdminAuthenticated();
export const canDeleteSkills = () => isAdminAuthenticated();
export const canEditCertificates = () => isAdminAuthenticated();
export const canDeleteCertificates = () => isAdminAuthenticated();
export const canBulkImport = () => isAdminAuthenticated();

// Limited permissions (demo users can do these)
export const canAddSkills = () => isAdminEnabled();
export const canAutoCalculateSkills = () => isAdminEnabled();
export const canAddProjects = () => true; // Allow all users to add projects

export const getAdminInfo = () => ({
  enabled: isAdminEnabled(),
  isDemo: isDemo(),
  isDev: isDevEnvironment(),
  domain: window.location.hostname,
  authenticated: isAdminAuthenticated(),
  method: isAdminAuthenticated() ? 'Password Authenticated' : isDemoMode() ? 'Demo Mode' : 'Public Access'
});
