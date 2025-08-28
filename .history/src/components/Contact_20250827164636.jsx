import React, { useState } from 'react';
import { usePersonalInfo } from '../hooks/useData';
import { validateForm } from '../utils/validation';
import { contactService } from '../services/api';
import { trackContactFormSubmission } from '../utils/analytics';

const Contact = () => {
  const { data: personalInfo } = usePersonalInfo();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const response = await contactService.sendMessage(formData);
      
      if (response.data.success) {
        // Reset form
        setFormData({ name: '', email: '', message: '' });
        trackContactFormSubmission(true);
        alert(response.data.message || 'Thank you for your message! I will get back to you soon.');
      } else {
        trackContactFormSubmission(false);
        alert(response.data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      trackContactFormSubmission(false);
      alert(error.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="section" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="section-title">Get In Touch</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-light)', maxWidth: '42rem', margin: '0 auto' }}>
            Have a project in mind or want to collaborate? Let's connect!
          </p>
        </div>

        <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-color)', marginBottom: '0.25rem' }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                style={{ marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', fontSize: '1rem' }}
              />
              {errors.name && <p style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-color)', marginBottom: '0.25rem' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                style={{ marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', fontSize: '1rem' }}
              />
              {errors.email && <p style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="message" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-color)', marginBottom: '0.25rem' }}>
                Message
              </label>
              <textarea
                name="message"
                id="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                style={{ marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', fontSize: '1rem' }}
              />
              {errors.message && <p style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0.5rem 1rem', border: '1px solid transparent', borderRadius: '0.375rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontSize: '0.875rem', fontWeight: '500', color: 'white', backgroundColor: 'var(--primary-color)', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.5 : 1 }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>

          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>Or reach out directly:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {personalInfo?.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  style={{ color: 'var(--primary-color)', display: 'block' }}
                >
                  {personalInfo.email}
                </a>
              )}
              {personalInfo?.phone && (
                <p style={{ color: 'var(--text-light)' }}>{personalInfo.phone}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
