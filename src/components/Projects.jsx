import React from 'react';
import { useProjects } from '../hooks/useData';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const Projects = () => {
  const { data: projects, loading } = useProjects();
  
  console.log("Projects data:", JSON.stringify(projects, null, 2)); // Log the projects data in a readable format
  const uniqueProjects = projects.filter((project, index, self) =>
    index === self.findIndex((p) => p.id === project.id)
  ); // Ensure unique projects
  
  console.log("Unique Projects data:", JSON.stringify(uniqueProjects, null, 2)); // Log the unique projects data in a readable format

  if (loading) return <div className="py-20 text-center">Loading projects...</div>;

  return (
    <section id="projects" className="section" style={{ backgroundColor: 'var(--card-bg)' }}>
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="section-title">Featured Projects</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-light)', maxWidth: '42rem', margin: '0 auto' }}>
            Here are some of my recent projects that showcase my skills and experience:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {uniqueProjects.map((project) => (
            <div key={project.id} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ height: '12rem', background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>{project.title}</span>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-color)', marginBottom: '0.5rem' }}>{project.title}</h3>
                <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>{project.description}</p>
                
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-color)' }}>Technologies:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {project.technologies?.split(',').map((tech) => (
                      <span
                        key={tech}
                        style={{ padding: '0.25rem 0.5rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', fontSize: '0.75rem', borderRadius: '9999px' }}
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      style={{ display: 'flex', alignItems: 'center', color: 'var(--text-light)' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.25rem' }}>GitHub</span>
                      Code
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      style={{ display: 'flex', alignItems: 'center', color: 'var(--text-light)' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ArrowTopRightOnSquareIcon style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.25rem' }} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
