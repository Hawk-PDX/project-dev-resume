import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const CertificateCard = ({ certificate, onEdit, onDelete }) => {
    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {certificate.photo_url && (
                <div style={{ marginBottom: '1rem' }}>
                    <img 
                        src={certificate.photo_url} 
                        alt={`${certificate.course} certificate`}
                        style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '0.375rem',
                            border: '1px solid #e5e7eb'
                        }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            )}
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

            <div style={{ marginTop: 'auto' }}>
                {/* Certificate Details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
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
                
                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                    <button
                        onClick={() => onEdit && onEdit(certificate)}
                        className="icon-button"
                        style={{
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            backgroundColor: 'transparent',
                            color: 'var(--text-color)',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title="Edit Certificate"
                    >
                        <PencilIcon style={{ height: '1rem', width: '1rem' }} />
                    </button>
                    
                    <button
                        onClick={() => onDelete && onDelete(certificate)}
                        className="icon-button"
                        style={{
                            padding: '0.5rem',
                            border: '1px solid #fecaca',
                            backgroundColor: '#fef2f2',
                            color: '#dc2626',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title="Delete Certificate"
                    >
                        <TrashIcon style={{ height: '1rem', width: '1rem' }} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CertificateCard;
