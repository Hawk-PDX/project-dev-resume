import React, { useState, useEffect } from 'react';
import { resumeService } from '../services/productionApi';
import { validateCertificateForm } from '../utils/validation';
import {
  uploadImageToCloudinary,
  validateImageFile,
  createImagePreview,
  revokeImagePreview,
  isCloudinaryConfigured
} from '../utils/imageUpload';

const AddCertificate = ({ onCertificateAdded, editCertificate, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    entity: '',
    course: '',
    topics: '',
    description: '',
    credit_hrs: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: '',
    photo_url: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' or 'url'

  // Auto-expand when editing
  React.useEffect(() => {
    if (editCertificate) {
      setFormData({
        entity: editCertificate.entity || '',
        course: editCertificate.course || '',
        topics: editCertificate.topics || '',
        description: editCertificate.description || '',
        credit_hrs: editCertificate.credit_hrs || '',
        issue_date: editCertificate.issue_date || '',
        expiry_date: editCertificate.expiry_date || '',
        credential_id: editCertificate.credential_id || '',
        credential_url: editCertificate.credential_url || '',
        photo_url: editCertificate.photo_url || ''
      });
      setImagePreview(editCertificate.photo_url || null);
      setIsExpanded(true);
    } else if (!editCertificate && isExpanded) {
      // Reset form when not editing
      resetForm();
    }
  }, [editCertificate]);

  // Cleanup image preview on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        revokeImagePreview(imagePreview);
      }
    };
  }, [imagePreview]);

  const resetForm = () => {
    setFormData({
      entity: '',
      course: '',
      topics: '',
      description: '',
      credit_hrs: '',
      issue_date: '',
      expiry_date: '',
      credential_id: '',
      credential_url: '',
      photo_url: ''
    });
    setErrors({});
    setIsExpanded(false);
    setSelectedFile(null);
    if (imagePreview) {
      revokeImagePreview(imagePreview);
    }
    setImagePreview(null);
    setImageUploadError(null);
    setImageInputMode('upload');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateCertificateForm({
      entity: formData.entity,
      course: formData.course,
      credential_url: formData.credential_url,
      issue_date: formData.issue_date,
      expiry_date: formData.expiry_date
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setImageUploadError(null);

    // Upload image if a file is selected
    let uploadedImageUrl = formData.photo_url;
    if (selectedFile && imageInputMode === 'upload') {
      try {
        setUploadingImage(true);
        uploadedImageUrl = await uploadImageToCloudinary(selectedFile);
      } catch (error) {
        setImageUploadError(error.message);
        setIsSubmitting(false);
        setUploadingImage(false);
        return;
      } finally {
        setUploadingImage(false);
      }
    }

    try {
      const submitData = {
        entity: formData.entity,
        course: formData.course,
        topics: formData.topics || '',
        description: formData.description || '',
        credential_id: formData.credential_id || '',
        credential_url: formData.credential_url || '',
        photo_url: uploadedImageUrl || formData.photo_url || '',
        credit_hrs: formData.credit_hrs ? parseInt(formData.credit_hrs) : null,
        issue_date: formData.issue_date || null,
        expiry_date: formData.expiry_date || null
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
          credential_url: '',
          photo_url: ''
        });
        setIsExpanded(false);
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

  const handleImageFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate the file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setImageUploadError(validation.error);
      setSelectedFile(null);
      setImagePreview(null);
      return;
    }

    // Clear any previous errors
    setImageUploadError(null);
    
    // Set the file and create preview
    setSelectedFile(file);
    const preview = createImagePreview(file);
    
    // Revoke old preview if it exists
    if (imagePreview && imagePreview.startsWith('blob:')) {
      revokeImagePreview(imagePreview);
    }
    
    setImagePreview(preview);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (imagePreview) {
      revokeImagePreview(imagePreview);
    }
    setImagePreview(null);
    setFormData({ ...formData, photo_url: '' });
    setImageUploadError(null);
    
    // Reset file input
    const fileInput = document.getElementById('certificate-image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
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
                Course Name *
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
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
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
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
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

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
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
              Credential URL
            </label>
            <input
              type="url"
              name="credential_url"
              value={formData.credential_url}
              onChange={handleChange}
              placeholder="https://example.com/verify/ABC123456"
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

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
              Certificate Image
            </label>

            {/* Toggle between Upload and URL */}
            <div style={{ display: 'inline-flex', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', padding: '0.25rem', marginBottom: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setImageInputMode('upload')}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  backgroundColor: imageInputMode === 'upload' ? 'var(--primary-color)' : 'transparent',
                  color: imageInputMode === 'upload' ? 'white' : 'var(--text-color)',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setImageInputMode('url')}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  backgroundColor: imageInputMode === 'url' ? 'var(--primary-color)' : 'transparent',
                  color: imageInputMode === 'url' ? 'white' : 'var(--text-color)',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                Image URL
              </button>
            </div>

            {imageInputMode === 'upload' ? (
              <div>
                {!isCloudinaryConfigured() && (
                  <div style={{
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '0.5rem',
                    borderLeft: '4px solid #f59e0b',
                    fontSize: '0.875rem'
                  }}>
                    ⚠️ Image upload requires Cloudinary configuration. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.
                  </div>
                )}

                <input
                  id="certificate-image-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleImageFileSelect}
                  disabled={!isCloudinaryConfigured()}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    cursor: isCloudinaryConfigured() ? 'pointer' : 'not-allowed',
                    backgroundColor: isCloudinaryConfigured() ? '#f8fafc' : '#f9fafb'
                  }}
                />
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                  Supported formats: JPG, PNG, WEBP, GIF (max 5MB)
                </p>
              </div>
            ) : (
              <input
                type="url"
                name="photo_url"
                value={formData.photo_url}
                onChange={handleChange}
                placeholder="https://example.com/certificate-photo.jpg"
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
            )}

            {/* Image Preview */}
            {(imagePreview || formData.photo_url) && (
              <div style={{ marginTop: '1rem', position: 'relative' }}>
                <img
                  src={imagePreview || formData.photo_url}
                  alt="Certificate preview"
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    setImageUploadError('Failed to load image preview');
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  ✕ Remove
                </button>
              </div>
            )}

            {/* Image Upload Error */}
            {imageUploadError && (
              <div style={{
                marginTop: '0.5rem',
                padding: '1rem',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                borderRadius: '0.5rem',
                borderLeft: '4px solid #dc2626',
                fontSize: '0.875rem'
              }}>
                {imageUploadError}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
              Topics Covered
            </label>
            <input
              type="text"
              name="topics"
              value={formData.topics}
              onChange={handleChange}
              placeholder="e.g., Data Analysis, SQL, Tableau, R Programming"
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
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the certificate and what you learned..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                resize: 'vertical',
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
                disabled={isSubmitting || uploadingImage}
                style={{
                  padding: '0.875rem 2rem',
                  border: '2px solid #e2e8f0',
                  backgroundColor: 'white',
                  color: '#64748b',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: (isSubmitting || uploadingImage) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '140px'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && !uploadingImage) {
                    e.target.style.borderColor = '#64748b';
                    e.target.style.color = '#334155';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting && !uploadingImage) {
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
              disabled={isSubmitting || uploadingImage}
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: (isSubmitting || uploadingImage) ? '#9ca3af' : 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: (isSubmitting || uploadingImage) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                minWidth: '180px',
                boxShadow: (isSubmitting || uploadingImage) ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting && !uploadingImage) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting && !uploadingImage) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }
              }}
            >
              {uploadingImage
                ? 'Uploading Image...'
                : isSubmitting
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
