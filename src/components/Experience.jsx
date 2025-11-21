import React from 'react';
import { useExperience } from '../hooks/useData';

const Experience = () => {
  const { data: experiences, loading } = useExperience();

  if (loading) return <div style={{ padding: '5rem 0', textAlign: 'center' }}>Loading experience...</div>;

  return (
    <section id="experience" className="section" style={{ backgroundColor: 'var(--card-bg)' }}>
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="section-title">Experience</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-light)', maxWidth: '42rem', margin: '0 auto' }}>
            Where I've worked and what I've built
          </p>
        </div>

        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          {experiences.map((exp) => (
            <div key={exp.id} className="card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-color)' }}>{exp.position}</h3>
                  <p style={{ color: 'var(--primary-color)', fontWeight: '500' }}>{exp.company}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'var(--text-light)' }}>
                    {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                  </p>
                </div>
              </div>
              
              <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>{exp.description}</p>
              
              {exp.极technologies && (
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-color)' }}>Technologies:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5极rem' }}>
                    {exp.technologies.split(',').map((tech) => (
                      <span
                        key={tech}
                        style={{ padding: '0.25rem 0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', fontSize: '0.875rem', borderRadius: '9999px' }}
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {exp.achievements && (
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-color)' }}>Key Achievements:</span>
                  <div style={{ marginTop: '0.5rem', color: 'var(--text-light)', whiteSpace: 'pre-line' }}>
                    {exp.achievements}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
