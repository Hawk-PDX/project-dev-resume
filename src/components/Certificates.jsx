import React, { useState } from 'react';
import { useCertificates } from '../hooks/useData';
import CertificateCard from './CertificateCard';
import AddCertificate from './AddCertificate';
import ConfirmationModal from './ConfirmationModal';
import { resumeService } from '../services/api';

const Certificates = () => {
  const { data: certificates, loading, refresh } = useCertificates();
  const [editCertificate, setEditCertificate] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, certificate: null });
  const [message, setMessage] = useState('');

  const handleEdit = (certificate) => {
    setEditCertificate(certificate);
    // Scroll to the form
    document.getElementById('add-certificate')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditCertificate(null);
  };

  const handleDeleteClick = (certificate) => {
    setDeleteModal({ isOpen: true, certificate });
  };

  const handleDeleteConfirm = async () => {
    try {
      await resumeService.deleteCertificate(deleteModal.certificate.id);
      setMessage('Certificate deleted successfully!');
      refresh();
      setDeleteModal({ isOpen: false, certificate: null });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting certificate: ' + (error.response?.data?.error || error.message));
      setDeleteModal({ isOpen: false, certificate: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, certificate: null });
  };

  if (loading) return <div className="py-20 text-center">Loading certificates...</div>;


  return (
    <section id="certificates" className="section" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="section-title">Certificates</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-light)', maxWidth: '42rem', margin: '0 auto' }}>
            Professional certifications and credentials that demonstrate my commitment to continuous learning.
          </p>
        </div>

        {message && (
          <div style={{ 
            padding: '1rem', 
            marginBottom: '2rem', 
            backgroundColor: message.includes('Error') ? '#fee2e2' : '#d1fae5',
            color: message.includes('Error') ? '#dc2626' : '#065f46',
            borderRadius: '0.5rem',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto 2rem auto'
          }}>
            {message}
          </div>
        )}

        <div id="add-certificate">
          <AddCertificate 
            onCertificateAdded={refresh}
            editCertificate={editCertificate}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        {certificates && certificates.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {certificates.map((certificate) => (
              <CertificateCard 
                key={certificate.id} 
                certificate={certificate} 
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p style={{ color: 'var(--text-light)' }}>No certificates to display yet. Add your first certificate above!</p>
          </div>
        )}
      </div>
      
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Certificate"
        message={`Are you sure you want to delete the certificate "${deleteModal.certificate?.course}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDanger={true}
      />
    </section>
  );
};

export default Certificates;
