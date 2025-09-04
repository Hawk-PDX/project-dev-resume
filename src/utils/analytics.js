// Simplified analytics utility for contact form tracking
// Only includes functions actually used in the application

// Basic event tracking function
const trackEvent = (category, action, label = '') => {
    // Console logging for development
    console.log(`Analytics: ${category} - ${action}`, { label });

    // Add your preferred analytics service here
    // Example: Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
        });
    }
};

// Contact form submission tracking (only function actually used)
export const trackContactFormSubmission = (success = true) => {
    trackEvent('Contact', 'Form Submission', success ? 'Success' : 'Failure');
};
