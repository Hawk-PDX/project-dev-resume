import React from 'react';

const CertificateCard = ({ certificate }) => {
    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    {certificate.course}
                </h3>
                <p style={{ color: 'var(--primary-color)', fontWeight: '500', marginBottom: '0.5rem' }}>
                    {certificate.entity}
                </p>
                {certificate.credential_id && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                        Credential ID: {certificate.credential_id}
                    </p>
                )}
            </div>

            {certificate.description && (
                <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1rem', flexGrow: 1 }}>
                    {certificate.description}
                </p>
            )}

            {certificate.topics && (
                <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-color)', marginBottom: '0.25rem' }}>
                        Topics Covered:
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                        {certificate.topics}
                    </p>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div>
                    {certificate.issue_date && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                            Issued: {new Date(certificate.issue_date).toLocaleDateString()}
                        </p>
                    )}
                    {certificate.credit_hrs && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                            {certificate.credit_hrs} Credit Hours
                        </p>
                    )}
                </div>
                {certificate.credential_url && (
                    <a
                        href={certificate.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: 'var(--primary-color)',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            textDecoration: 'none'
                        }}
                    >
                        Verify →
                    </a>
                )}
            </div>
        </div>
    );
};

export default CertificateCard;
