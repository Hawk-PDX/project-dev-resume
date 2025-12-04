/**
 * Image upload utility for handling certificate and project images
 * Uses Cloudinary for free cloud storage
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Validates an image file before upload
 * @param {File} file - The file to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateImageFile = (file) => {
  // Check if file exists
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Invalid file type. Please upload a JPG, PNG, WEBP, or GIF image.' 
    };
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: 'File size too large. Maximum size is 5MB.' 
    };
  }

  return { isValid: true, error: null };
};

/**
 * Uploads an image file to Cloudinary
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Optional callback for upload progress (0-100)
 * @returns {Promise<string>} - The uploaded image URL
 */
export const uploadImageToCloudinary = async (file, onProgress = null) => {
  // Validate file first
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Check if Cloudinary credentials are configured
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.'
    );
  }

  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'certificates'); // Organize uploads in a folder

  // Upload to Cloudinary
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    
    // Return the secure URL
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

/**
 * Creates a preview URL for a selected file
 * @param {File} file - The file to preview
 * @returns {string} - Object URL for preview
 */
export const createImagePreview = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Revokes an object URL to free up memory
 * @param {string} url - The object URL to revoke
 */
export const revokeImagePreview = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Checks if Cloudinary is properly configured
 * @returns {boolean}
 */
export const isCloudinaryConfigured = () => {
  return !!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET);
};
