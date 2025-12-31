import React, { useState, useEffect } from 'react';
import { resumeService } from '../services/productionApi';
import { validateCertificateForm } from '../utils/validation';

const AddCertificate = ({ onCertificateAdded, editCertificate, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    entity: '',
    course: '',
    issue_date: '',
    credential_url: '',
    photo_url: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-expand when editing
  React.useEffect(() => {
    if (editCertificate) {
      setFormData({
        entity: editCertificate.entity || '',
        course: editCertificate.course || '',
        issue_date: editCertificate.issue_date || '',
        credential_url: editCertificate.credential_url || '',
        photo_url: editCertificate.photo_url || ''
      });
      setIsExpanded(true);
    } else if (!editCertificate && isExpanded) {
      // Reset form when not editing
      resetForm();
    }
  }, [editCertificate]);


  const resetForm = () => {
    setFormData({
      entity: '',
      course: '',
      issue_date: '',
      credential_url: '',
      photo_url: ''
    });
    setErrors({});
    setIsExpanded(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateCertificateForm({
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
        entity: formData.entity,
        course: formData.course,
        issue_date: formData.issue_date?.trim() || null,
        credential_url: formData.credential_url?.trim() || '',
        photo_url: formData.photo_url?.trim() || ''
      };

      let response;
      if (editCertificate) {
        // Update existing certificate
        if (!editCertificate.id) {
          throw new Error('Invalid certificate: missing ID');
        }
        response = await resumeService.updateCertificate(editCertificate.id, submitData);
      } else {
        // Create new certificate
        response = await resumeService.createCertificate(submitData);
      }

      if (response.status === 201 || response.status === 200) {
        // Reset form using resetForm() to properly clean up all state
        resetForm();
        onCertificateAdded();
        alert(editCertificate ? 'Certificate updated successfully!' : 'Certificate added successfully!');
        
        // Clear edit mode
        if (editCertificate && onCancelEdit) {
          onCancelEdit();
        }
      }
    } catch (error) {
      console.error('Error saving certificate:', error);
      const action = editCertificate ? 'updating' : 'adding';
      alert(error.response?.data?.error || `Failed to ${action.replace('ing', '')} certificate. Please try again.`);
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


  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '2rem auto', overflow: 'hidden' }}>
      {/* Collapsible Header */}
      <div
        onClick={toggleExpanded}
        style={{
          padding: '1.25rem 2rem',
          background: 'linear-gradient(135deg, var(--primary-color) 0%, #2563eb 100%)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none',
          transition: 'all 0.3s ease',
          borderBottom: isExpanded ? '2px solid rgba(255,255,255,0.2)' : 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, var(--primary-color) 100%)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, var(--primary-color) 0%, #2563eb 100%)';
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
            {editCertificate ? 'Edit Certificate' : 'Add Certificate'}
          </h3>
        </div>
        <div style={{
          fontSize: '1.25rem',
          transition: 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          ▼
        </div>
      </div>

      {/* Form Content */}
      <div style={{
        maxHeight: isExpanded ? '2000px' : '0',
        opacity: isExpanded ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
      }}>
        <div style={{ padding: '2rem' }}>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
              Certificate Name *
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
                border: '2px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            {errors.course && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.course}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                Issuing Organization *
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
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              {errors.entity && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.entity}</p>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
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
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
              Verification URL
            </label>
            <input
              type="url"
              name="credential_url"
              value={formData.credential_url}
              onChange={handleChange}
              placeholder="https://example.com/verify/certificate"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
              Certificate Image URL
            </label>
            <input
              type="url"
              name="photo_url"
              value={formData.photo_url}
              onChange={handleChange}
              placeholder="https://example.com/certificate-image.jpg"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            {editCertificate && (
              <button
                type="button"
                onClick={onCancelEdit}
                disabled={isSubmitting}
                style={{
                  padding: '0.875rem 2rem',
                  border: '2px solid #e2e8f0',
                  backgroundColor: 'white',
                  color: '#64748b',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '140px'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.borderColor = '#64748b';
                    e.target.style.color = '#334155';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.color = '#64748b';
                  }
                }}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: isSubmitting ? '#9ca3af' : 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                minWidth: '180px',
                boxShadow: isSubmitting ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }
              }}
            >
              {isSubmitting
                ? (editCertificate ? 'Updating...' : 'Adding...')
                : (editCertificate ? 'Update Certificate' : 'Add Certificate')
              }
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default AddCertificate;
