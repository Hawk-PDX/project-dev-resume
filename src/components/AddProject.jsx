import React, { useState, useEffect } from 'react';
import { projectsService } from '../services/productionApi';

const AddProject = ({ onProjectAdded, editProject, onCancelEdit }) => {
  const [mode, setMode] = useState('manual'); // 'manual' or 'github'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    github_url: '',
    live_url: '',
    image_url: '',
    featured: false,
    order: 0
  });
  const [loading, setLoading] = useState(false);
  const [fetchingGithub, setFetchingGithub] = useState(false);
  const [message, setMessage] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  useEffect(() => {
    if (editProject) {
      setFormData({
        title: editProject.title || '',
        description: editProject.description || '',
        technologies: editProject.technologies || '',
        github_url: editProject.github_url || '',
        live_url: editProject.live_url || '',
        image_url: editProject.image_url || '',
        featured: editProject.featured || false,
        order: editProject.order || 0
      });
      setGithubUrl(editProject.github_url || '');
      setMode('manual'); // Always start in manual mode for edits
    } else {
      // Reset form when not in edit mode
      resetForm();
    }
  }, [editProject]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      github_url: '',
      live_url: '',
      image_url: '',
      featured: false,
      order: 0
    });
    setGithubUrl('');
    setMode('manual');
    setMessage('');
  };

  const handleFetchFromGithub = async () => {
    if (!githubUrl.trim()) {
      setMessage('Please enter a GitHub URL');
      return;
    }

    setFetchingGithub(true);
    setMessage('');

    try {
      const response = await projectsService.fetchFromGitHub(githubUrl.trim());
      const githubData = response.data;
      
      setFormData(githubData);
      setMode('manual'); // Switch to manual mode so user can edit
      setMessage('✅ Project data fetched successfully! Review and adjust as needed.');
    } catch (error) {
      console.error('GitHub fetch error:', error);
      setMessage('❌ Failed to fetch from GitHub: ' + (error.response?.data?.error || error.message));
    } finally {
      setFetchingGithub(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGithubUrlChange = (e) => {
    setGithubUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let response;
      if (editProject) {
        // Edit existing project
        response = await projectsService.editProject(editProject.id, formData);
        setMessage('✅ Project updated successfully! Changes will be visible immediately.');
      } else {
        // Add new project
        response = await projectsService.addProject(formData);
        setMessage('✅ Project added successfully! The page will automatically refresh to show your new project.');
        resetForm();
      }
      
      if (onProjectAdded) {
        onProjectAdded(response.data);
      }
      
      // Provide immediate visual feedback that project was added
      setTimeout(() => {
        // Scroll to projects section to show the newly added project
        const projectsSection = document.getElementById('projects') || document.getElementById('all-projects');
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500); // Small delay to allow refresh to complete
    } catch (error) {
      const action = editProject ? 'updating' : 'adding';
      setMessage(`Error ${action} project: ` + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          {editProject ? 'Edit Project' : 'Add New Project'}
        </h3>

        {/* Mode Selection */}
        {!editProject && (
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', padding: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setMode('github')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: mode === 'github' ? 'var(--primary-color)' : 'transparent',
                  color: mode === 'github' ? 'white' : 'var(--text-color)',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🚀 Quick Add from GitHub
              </button>
              <button
                type="button"
                onClick={() => setMode('manual')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: mode === 'manual' ? 'var(--primary-color)' : 'transparent',
                  color: mode === 'manual' ? 'white' : 'var(--text-color)',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ✏️ Manual Entry
              </button>
            </div>
          </div>
        )}

        {/* GitHub Quick Add Section */}
        {mode === 'github' && !editProject && (
          <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '2px dashed #cbd5e1' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--primary-color)', fontSize: '1.1rem' }}>🔗 Import from GitHub</h4>
            <p style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
              Paste your GitHub repository URL and we'll automatically extract the project details, cover image, and technologies!
            </p>
            
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <input
                type="url"
                placeholder="https://github.com/username/repository"
                value={githubUrl}
                onChange={handleGithubUrlChange}
                disabled={fetchingGithub}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={handleFetchFromGithub}
                disabled={fetchingGithub || !githubUrl.trim()}
                style={{
                  padding: '0.875rem 1.5rem',
                  backgroundColor: fetchingGithub ? '#9ca3af' : 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: fetchingGithub || !githubUrl.trim() ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                  minWidth: '120px'
                }}
              >
                {fetchingGithub ? '⏳ Fetching...' : '🚀 Import'}
              </button>
            </div>
          </div>
        )}
        
        {message && (
          <div style={{ 
            padding: '1rem', 
            marginBottom: '1.5rem', 
            backgroundColor: message.includes('❌') ? '#fee2e2' : '#d1fae5',
            color: message.includes('❌') ? '#dc2626' : '#065f46',
            borderRadius: '0.5rem',
            borderLeft: `4px solid ${message.includes('❌') ? '#dc2626' : '#10b981'}`,
            fontSize: '0.875rem'
          }}>
            {message}
          </div>
        )}

        {/* Manual Form */}
        {(mode === 'manual' || editProject) && (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                  🏷️ Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="My Awesome Project"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                  ⭐ Featured
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    style={{ transform: 'scale(1.2)' }}
                  />
                </label>
                <div style={{ marginTop: '0.25rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                    🎯 Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                    Higher numbers appear first in featured projects (max 6 shown)
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                📝 Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Brief description of your project..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                🪄 Technologies
              </label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="React, Flask, Python, PostgreSQL"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                  🔗 GitHub URL
                </label>
                <input
                  type="url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                  🌐 Live Demo URL
                </label>
                <input
                  type="url"
                  name="live_url"
                  value={formData.live_url}
                  onChange={handleChange}
                  placeholder="https://demo.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                  🖼️ Cover Image URL
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://image.com/cover.jpg"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              {editProject && (
                <button
                  type="button"
                  onClick={onCancelEdit}
                  disabled={loading}
                  style={{
                    padding: '0.875rem 2rem',
                    border: '2px solid #e2e8f0',
                    backgroundColor: 'white',
                    color: '#64748b',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    minWidth: '140px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#64748b';
                    e.target.style.color = '#334155';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.color = '#64748b';
                  }}
                >
                  ❌ Cancel
                </button>
              )}
              
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.875rem 2rem',
                  backgroundColor: loading ? '#9ca3af' : 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '160px',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                  }
                }}
              >
                {loading 
                  ? (editProject ? '⏳ Updating...' : '⏳ Adding...')
                  : (editProject ? '✨ Update Project' : '🎉 Add Project')
                }
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddProject;
