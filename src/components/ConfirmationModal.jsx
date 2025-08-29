import React from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Delete",
  cancelText = "Cancel",
  isDanger = true 
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
      }}>
        <h3 style={{ 
          marginBottom: '1rem', 
          color: 'var(--text-color)',
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          {title}
        </h3>
        
        <p style={{ 
          marginBottom: '2rem', 
          color: 'var(--text-light)',
          lineHeight: '1.5'
        }}>
          {message}
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'flex-end' 
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              backgroundColor: 'transparent',
              color: 'var(--text-color)',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              backgroundColor: isDanger ? '#dc2626' : 'var(--primary-color)',
              color: 'white',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
