import React from 'react';
import { useSkills } from '../hooks/useData';

const Skills = () => {
  const { data: skills, loading } = useSkills();

  if (loading) return <div className="py-20 text-center">Loading skills...</div>;

  const skillCategories = Object.keys(skills);

  return (
    <section id="skills" className="section" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="section-title">Technical Skills</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-light)', maxWidth: '42rem', margin: '0 auto' }}>
            Technologies and tools I work with:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {skillCategories.map((category) => (
            <div key={category} className="card">
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-color)', marginBottom: '1rem', textTransform: 'capitalize' }}>
                {category}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {skills[category]?.map((skill) => (
                  <div key={skill.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-color)' }}>{skill.name}</span>
                      <span style={{ color: 'var(--text-light)' }}>{skill.level}/5</span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: 'var(--border-color)', borderRadius: '9999px', height: '0.5rem' }}>
                      <div
                        style={{ backgroundColor: 'var(--primary-color)', height: '0.5rem', borderRadius: '9999px', width: `${(skill.level / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
