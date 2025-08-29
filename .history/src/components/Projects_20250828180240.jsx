import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useProjects } from '../hooks/useData';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ConfirmationModal from './ConfirmationModal';
import { projectsService } from '../services/api';

const Projects = forwardRef((props, ref) => {
  const { data: projects, loading, refresh } = useProjects();
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    project: null
  });
  const [message, setMessage] = useState('');
  
  useImperativeHandle(ref, () => ({
    refresh: refresh
  }));

  const handleEdit = (project) => {
    // This will be handled by the parent component (App.jsx)
    if (props.onEditProject) {
      props.onEditProject(project);
    }
  };

  const handleDeleteClick = (project) => {
    setDeleteModal({
      isOpen: true,
      project: project
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await projectsService.deleteProject(deleteModal.project.id);
      setMessage('Project deleted successfully!');
      refresh(); // Refresh the projects list
      setDeleteModal({ isOpen: false, project: null });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting project: ' + (error.response?.data?.error || error.message));
      setDeleteModal({ isOpen: false, project: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, project: null });
  };
  
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

        {message && (
          <div style={{ 
            padding: '1rem', 
            marginBottom: '2rem', 
            backgroundColor: message.includes('Error') ? '#fee2e2' : '#d1fae5',
            color: message.includes('Error') ? '#dc2626' : '#065f46',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

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
                      <CodeBracketIcon style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.25rem' }} />
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
});

export default Projects;
