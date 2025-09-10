export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePhone = (phone) => {
    const re = /^\+?[\d\s-()]+$/;
    return re.test(phone);
};

export const validateForm = (formData) => {
    const errors = {};

    if (!formData.name || formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
    }

    if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!formData.message || formData.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateCertificateForm = (formData) => {
    const errors = {};

    if (!formData.entity || formData.entity.trim().length < 2) {
        errors.entity = 'Issuing entity must be at least 2 characters';
    }

    if (!formData.course || formData.course.trim().length < 2) {
        errors.course = 'Course name must be at least 2 characters';
    }

    if (formData.credential_url && formData.credential_url.trim() !== '') {
        try {
            new URL(formData.credential_url);
        } catch {
            errors.credential_url = 'Please enter a valid URL';
        }
    }

    if (formData.issue_date && formData.expiry_date) {
        const issueDate = new Date(formData.issue_date);
        const expiryDate = new Date(formData.expiry_date);
        if (issueDate >= expiryDate) {
            errors.expiry_date = 'Expiry date must be after issue date';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
