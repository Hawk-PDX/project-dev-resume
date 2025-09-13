import React from 'react';
import { usePersonalInfo } from '../hooks/useData';

const About = () => {
  const { data: personalInfo, loading } = usePersonalInfo();

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <section id="about" className="section" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="section-title">About Me</h2>
        </div>
        
        <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-light)', lineHeight: '1.75' }}>
            {personalInfo?.summary || 'Full-stack developer passionate about creating innovative solutions while streamlining production, cutting back on "clutter" and maintaining a responsive, well-rounded, product.'}
          </p>
          
          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', textAlign: 'left' }} className="auto-grid">
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-color)', marginBottom: '0.5rem' }}>Contact Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-light)' }}>
                <p><strong>Email:</strong> {personalInfo?.email || 'hawkpdx@icloud.com'}</p>
                <p><strong>Location:</strong> {personalInfo?.location || 'Portland, Oregon'}</p>
                {personalInfo?.phone && <p><strong>Phone:</strong> {personalInfo.phone}</p>}
              </div>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-color)', marginBottom: '0.5rem' }}>Connect With Me</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {personalInfo?.github && (
                  <a href={personalInfo.github} style={{ color: 'var(--primary-color)', display: 'block' }}>
                    GitHub  
                  </a> 
                )}
                {personalInfo?.linkedin && (
                  <a href={personalInfo.linkedin} style={{ color: 'var(--primary-color)', display: 'block' }}>
                    LinkedIn   
                  </a>
                )}
                {personalInfo?.website && (
                  <a href={personalInfo.website} style={{ color: 'var(--primary-color)', display: 'block' }}>
                    Personal Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
