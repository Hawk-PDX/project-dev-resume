import { validateEmail, validatePhone, validateForm } from '../validation';

describe('Validation Utilities', () => {
    describe('validateEmail', () => {
        test('validates correct email addresses', () => {
            expect(validateEmail('test@example.com')).toBe(true);
            expect(validateEmail('user.name@domain.co.uk')).toBe(true);
            expect(validateEmail('first.last@sub.domain.com')).toBe(true);
        });

        test('rejects invalid email addresses', () => {
            expect(validateEmail('invalid')).toBe(false);
            expect(validateEmail('invalid@')).toBe(false);
            expect(validateEmail('@domain.com')).toBe(false);
            expect(validateEmail('test@domain')).toBe(false);
        });
    });

    describe('validatePhone', () => {
        test('validates various phone formats', () => {
            expect(validatePhone('+1234567890')).toBe(true);
            expect(validatePhone('(123) 456-7890')).toBe(true);
            expect(validatePhone('123-456-7890')).toBe(true);
            expect(validatePhone('1234567890')).toBe(true);
        });

        test('rejects invalid phone numbers', () => {
            expect(validatePhone('abc')).toBe(false);
            expect(validatePhone('123-abc-7890')).toBe(false);
        });
    });

    describe('validateForm', () => {
        test('validates complete form data', () => {
            const formData = {
                name: 'John Doe',
                email: 'john@example.com',
                message: 'This is a test message with more than 10 characters'
            };

            const result = validateForm(formData);
            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual({});
        });

        test('detects missing name', () => {
            const formData = {
                name: '',
                email: 'john@example.com',
                message: 'Valid message'
            };

            const result = validateForm(formData);
            expect(result.isValid).toBe(false);
            expect(result.errors.name).toBeDefined();
        });

        test('detects invalid email', () => {
            const formData = {
                name: 'John Doe',
                email: 'invalid-email',
                message: 'Valid message'
            };

            const result = validateForm(formData);
            expect(result.isValid).toBe(false);
            expect(result.errors.email).toBeDefined();
        });

        test('detects short message', () => {
            const formData = {
                name: 'John Doe',
                email: 'john@example.com',
                message: 'Short'
            };

            const result = validateForm(formData);
            expect(result.isValid).toBe(false);
            expect(result.errors.message).toBeDefined();
        });
    });
});
