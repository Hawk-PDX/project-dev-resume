import React from 'react';
import { useCertificates } from '../hooks/useData';
import CertificateCard from './CertificateCard';
import AddCertificate from './AddCertificate';

const Certificates = () => {
  const { data: certificates, loading, refresh } = useCertificates();

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

        <AddCertificate onCertificateAdded={refresh} />

        {certificates && certificates.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {certificates.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p style={{ color: 'var(--text-light)' }}>No certificates to display yet. Add your first certificate above!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Certificates;
