// Basic analytics utility for tracking page views and events
// Replace with your preferred analytics service (Google Analytics, Plausible, etc.)

export const trackPageView = (path) => {
    // Basic page view tracking
    console.log(`Page view: ${path}`);

    // Example: Google Analytics implementation
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', process.env.VITE_GA_ID, {
            page_path: path,
        });
    }

    // Example: Plausible implementation
    if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('pageview');
    }
};

export const trackEvent = (category, action, label = '', value = null) => {
    // Basic event tracking
    console.log(`Event: ${category} - ${action}`, { label, value });

    // Example: Google Analytics implementation
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }

    // Example: Plausible implementation
    if (typeof window !== 'undefined' && window.plausible) {
        window.plausible(action, {
            props: {
                category: category,
                label: label,
                value: value,
            },
        });
    }
};

export const trackContactFormSubmission = (success = true) => {
    trackEvent('Contact', 'Form Submission', success ? 'Success' : 'Failure');
};

export const trackProjectView = (projectTitle) => {
    trackEvent('Projects', 'View Project', projectTitle);
};

export const trackDownloadResume = () => {
    trackEvent('Resume', 'Download');
};

// Initialize analytics (call this in your main App component)
export const initAnalytics = () => {
    if (typeof window !== 'undefined') {
        // Add any initialization logic here
        console.log('Analytics initialized');

        // Track initial page view
        trackPageView(window.location.pathname);
    }
};
