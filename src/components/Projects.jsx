import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useProjects } from '../hooks/useData';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';
import { projectsService } from '../services/productionApi';
import { canEditProjects, canDeleteProjects } from '../config/adminMode';
import analyticsService from '../services/analyticsService';

const Projects = forwardRef((props, ref) => {
  const { data: projects, loading, refresh, isWarmingUp } = useProjects();
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
  
  // console.log("Projects data:", JSON.stringify(projects, null, 2)); // Log the projects data in a readable format
  const uniqueProjects = projects.filter((project, index, self) =>
    index === self.findIndex((p) => p.id === project.id)
  ); // Ensure unique projects
  
  // Sort all projects by order and created date, then take top 8
  const displayedProjects = uniqueProjects
    .sort((a, b) => b.order - a.order || new Date(b.created_at) - new Date(a.created_at)) // Sort by order descending, then by created_at descending
    .slice(0, 8); // Take top 8
  
  // console.log("Displayed Projects data:", JSON.stringify(displayedProjects, null, 2)); // Log the displayed projects data

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <div style={{ fontSize: '1.125rem', color: 'var(--text-color)', marginBottom: '0.5rem' }}>
          {isWarmingUp ? 'Warming up server...' : 'Loading projects...'}
        </div>
        {isWarmingUp && (
          <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
            This may take up to 30 seconds on first visit
          </div>
        )}
      </div>
    );
  }

  return (
    <section id="projects" className="section" style={{ backgroundColor: 'var(--card-bg)' }}>
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="section-title">Featured Projects</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-light)', maxWidth: '42rem', margin: '0 auto 1.5rem auto' }}>
            Some recent work I've been building:
          </p>
          
          {/* View All Projects Link */}
          <Link 
            to="/projects"
            className="inline-flex items-center gap-2 text-primary-color hover:text-blue-700 transition-colors"
            style={{ 
              color: 'var(--primary-color)', 
              textDecoration: 'none', 
              fontSize: '1rem', 
              fontWeight: '500',
              padding: '0.5rem 1rem',
              border: '1px solid var(--primary-color)',
              borderRadius: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--primary-color)';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'var(--primary-color)';
            }}
          >
            <EyeIcon style={{ height: '1.25rem', width: '1.25rem' }} />
            View All {uniqueProjects.length} Projects
          </Link>
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
          {displayedProjects.map((project) => (
            <div key={project.id} className="card" style={{ overflow: 'hidden', position: 'relative' }}>
              {/* Featured Badge */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'rgba(255, 215, 0, 0.9)',
                color: '#b45309',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600',
                zIndex: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                border: '1px solid rgba(255, 215, 0, 0.3)'
              }}>
                ⭐ Featured
              </div>

              <div style={{ height: '12rem', background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center', padding: '1rem' }}>{project.title}</span>
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

                {/* GitHub Account Badge */}
                {project.github_account && (
                  <div style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-color)' }}>GitHub:</span>
                    <a
                      href={`https://github.com/${project.github_account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        color: 'var(--text-color)',
                        fontSize: '0.75rem',
                        borderRadius: '0.375rem',
                        textDecoration: 'none',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                      }}
                    >
                      @{project.github_account}
                    </a>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }} className="project-actions">
                  <div style={{ display: 'flex', gap: '1rem' }} className="project-links">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        style={{ display: 'flex', alignItems: 'center', color: 'var(--text-light)' }}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => analyticsService.trackGitHubClick(project.title, project.github_url)}
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
                        onClick={() => analyticsService.trackProjectClick(project.title, project.live_url)}
                      >
                        <ArrowTopRightOnSquareIcon style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.25rem' }} />
                        Live Demo
                      </a>
                    )}
                  </div>
                  
                  {(canEditProjects() || canDeleteProjects()) && (
                    <div style={{ display: 'flex', gap: '0.5rem' }} className="project-admin-buttons">
                      {canEditProjects() && (
                        <button
                          onClick={() => handleEdit(project)}
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
                          title="Edit Project"
                        >
                          <PencilIcon style={{ height: '1rem', width: '1rem' }} />
                        </button>
                      )}
                      
                      {canDeleteProjects() && (
                        <button
                          onClick={() => handleDeleteClick(project)}
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
                          title="Delete Project"
                        >
                          <TrashIcon style={{ height: '1rem', width: '1rem' }} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteModal.project?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDanger={true}
      />
    </section>
  );
});

export default Projects;
