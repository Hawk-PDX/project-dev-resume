import React from 'react';
import { usePersonalInfo } from '../hooks/useData';

const Footer = () => {
  const { data: personalInfo } = usePersonalInfo();

  return (
    <footer style={{ backgroundColor: '#111827', color: 'white', padding: '3rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            {personalInfo?.name || 'Garrett Hawkins'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
            {personalInfo?.email && (
              <a href={`mailto:${personalInfo.email}`} style={{ color: '#d1d5db' }}>
                {personalInfo.email}
            </a>
            )}
            {personalInfo?.phone && (
              <span style={{ color: '#d1d5db' }}>{personalInfo.phone}</span>
            )}
            {personalInfo?.linkedin && (
              <a href={personalInfo.linkedin} style={{ color: '#d1d5db' }}>
                LinkedIn
              </a>
            )}
            {personalInfo?.github && (
              <a href={personalInfo.github} style={{ color: '#d1d5db' }}>
                GitHub
              </a>
            )}
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            © 2025 {personalInfo?.name || 'Garrett Hawkins'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
