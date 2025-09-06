import React, { useState } from 'react';
import { resumeService } from '../services/api';
import { validateForm } from '../utils/validation';

const AddCertificate = ({ onCertificateAdded }) => {
  const [formData, setFormData] = useState({
    entity: '',
    course: '',
    topics: '',
    description: '',
    credit_hrs: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm({
      entity: formData.entity,
      course: formData.course
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const submitData = {
        ...formData,
        credit_hrs: formData.credit_hrs ? parseInt(formData.credit_hrs) : null,
        issue_date: formData.issue_date || null,
        expiry_date: formData.expiry_date || null
      };

      const response = await resumeService.createCertificate(submitData);

      if (response.status === 201) {
        // Reset form
        setFormData({
          entity: '',
          course: '',
          topics: '',
          description: '',
          credit_hrs: '',
          issue_date: '',
          expiry_date: '',
          credential_id: '',
          credential_url: ''
        });
        setIsExpanded(false);
        onCertificateAdded();
        alert('Certificate added successfully!');
      }
    } catch (error) {
      console.error('Error adding certificate:', error);
      alert(error.response?.data?.error || 'Failed to add certificate. Please try again.');
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
    <div className="card" style={{ marginBottom: '2rem', maxWidth: '800px', margin: '2rem auto' }}>
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-color)', margin: 0 }}>
            Add New Certificate
          </h3>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-primary"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            {isExpanded ? 'Cancel' : 'Add Certificate'}
          </button>
        </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Issuing Entity *
            </label>
            <input
              type="text"
              name="entity"
              required
              value={formData.entity}
              onChange={handleChange}
              placeholder="e.g., Coursera, Google, AWS"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
            {errors.entity && <p style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.entity}</p>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Course/Certificate Name *
            </label>
            <input
              type="text"
              name="course"
              required
              value={formData.course}
              onChange={handleChange}
              placeholder="e.g., Google Data Analytics Professional Certificate"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
            {errors.course && <p style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.course}</p>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Credential ID
            </label>
            <input
              type="text"
              name="credential_id"
              value={formData.credential_id}
              onChange={handleChange}
              placeholder="e.g., ABC123456"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Credit Hours
            </label>
            <input
              type="number"
              name="credit_hrs"
              value={formData.credit_hrs}
              onChange={handleChange}
              placeholder="e.g., 160"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Issue Date
            </label>
            <input
              type="date"
              name="issue_date"
              value={formData.issue_date}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Expiry Date
            </label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="credential_url" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-color)', marginBottom: '0.25rem' }}>
              Credential URL
            </label>
            <input
              type="url"
              name="credential_url"
              id="credential_url"
              value={formData.credential_url}
              onChange={handleChange}
              placeholder="https://example.com/verify/ABC123456"
              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', fontSize: '1rem' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="topics" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-color)', marginBottom: '0.25rem' }}>
              Topics Covered
            </label>
            <input
              type="text"
              name="topics"
              id="topics"
              value={formData.topics}
              onChange={handleChange}
              placeholder="e.g., Data Analysis, SQL, Tableau, R Programming"
              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', fontSize: '1rem' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="description" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-color)', marginBottom: '0.25rem' }}>
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the certificate and what you learned..."
              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', fontSize: '1rem' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              style={{
                backgroundColor: 'var(--border-color)',
                color: 'var(--text-color)',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.5 : 1
              }}
            >
              {isSubmitting ? 'Adding...' : 'Add Certificate'}
            </button>
          </div>
        </form>
      )}
      </div>
    </div>
  );
};

export default AddCertificate;
