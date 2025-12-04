import React, { useState, useEffect } from 'react';
import { resumeService } from '../services/productionApi';
import { validateCertificateForm } from '../utils/validation';
import { canEditCertificates } from '../config/adminMode';
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
        topics: formData.topics || null,
        description: formData.description || null,
        credential_id: formData.credential_id || null,
        credential_url: formData.credential_url || null,
        photo_url: uploadedImageUrl || formData.photo_url || null,
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

  return (
    <div className="card" style={{ marginBottom: '2rem', maxWidth: '800px', margin: '2rem auto' }}>
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-color)', margin: 0 }}>
            {editCertificate ? 'Edit Certificate' : 'Add New Certificate'}
          </h3>
          {!editCertificate && (
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
          )}
        </div>

        {(isExpanded || editCertificate) && (
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
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
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
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* Certificate Image Upload Section */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Certificate Image
            </label>
            
            {/* Toggle between Upload and URL */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setImageInputMode('upload')}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  backgroundColor: imageInputMode === 'upload' ? 'var(--primary-color)' : '#f3f4f6',
                  color: imageInputMode === 'upload' ? 'white' : 'var(--text-color)',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                📤 Upload Image
              </button>
              <button
                type="button"
                onClick={() => setImageInputMode('url')}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  backgroundColor: imageInputMode === 'url' ? 'var(--primary-color)' : '#f3f4f6',
                  color: imageInputMode === 'url' ? 'white' : 'var(--text-color)',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                🔗 Use URL
              </button>
            </div>

            {imageInputMode === 'upload' ? (
              <div>
                {!isCloudinaryConfigured() && (
                  <div style={{ 
                    padding: '0.75rem', 
                    marginBottom: '0.75rem', 
                    backgroundColor: '#fef3c7', 
                    color: '#92400e',
                    borderRadius: '0.375rem',
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
                    border: '2px dashed #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    cursor: isCloudinaryConfigured() ? 'pointer' : 'not-allowed',
                    backgroundColor: isCloudinaryConfigured() ? 'white' : '#f9fafb'
                  }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
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
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
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
                padding: '0.75rem', 
                backgroundColor: '#fee2e2', 
                color: '#dc2626',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}>
                {imageUploadError}
              </div>
            )}
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
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
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
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
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => {
                if (editCertificate && onCancelEdit) {
                  onCancelEdit();
                } else {
                  setIsExpanded(false);
                }
              }}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                backgroundColor: 'transparent',
                color: 'var(--text-color)',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploadingImage}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: (isSubmitting || uploadingImage) ? '#9ca3af' : 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: (isSubmitting || uploadingImage) ? 'not-allowed' : 'pointer'
              }}
            >
              {uploadingImage 
                ? '⏳ Uploading Image...'
                : isSubmitting 
                  ? (editCertificate ? 'Updating Certificate...' : 'Adding Certificate...')
                  : (editCertificate ? 'Update Certificate' : 'Add Certificate')
              }
            </button>
          </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddCertificate;
