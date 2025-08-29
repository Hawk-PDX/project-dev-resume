import React, { useState, useEffect } from 'react';
import { projectsService } from '../services/api';

const AddProject = ({ onProjectAdded, editProject, onCancelEdit }) => {
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
  const [message, setMessage] = useState('');

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
    } else {
      // Reset form when not in edit mode
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
    }
  }, [editProject]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
        setMessage('Project updated successfully!');
      } else {
        // Add new project
        response = await projectsService.addProject(formData);
        setMessage('Project added successfully!');
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
      }
      
      if (onProjectAdded) {
        onProjectAdded(response.data);
      }
    } catch (error) {
      const action = editProject ? 'updating' : 'adding';
      setMessage(`Error ${action} project: ` + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <div style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          {editProject ? 'Edit Project' : 'Add New Project'}
        </h3>
        
        {message && (
          <div style={{ 
            padding: '1rem', 
            marginBottom: '1rem', 
            backgroundColor: message.includes('Error') ? '#fee2e2' : '#d1fae5',
            color: message.includes('Error') ? '#dc2626' : '#065f46',
            borderRadius: '0.5rem'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Technologies (comma-separated)
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
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              GitHub URL
            </label>
            <input
              type="url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Live Demo URL
            </label>
            <input
              type="url"
              name="live_url"
              value={formData.live_url}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Image URL
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              Featured Project
            </label>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Order Priority
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {editProject && (
              <button
                type="button"
                onClick={onCancelEdit}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'transparent',
                  color: 'var(--text-color)',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                Cancel
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: editProject ? 1 : 'none',
                width: editProject ? 'auto' : '100%',
                padding: '0.75rem',
                backgroundColor: loading ? '#9ca3af' : 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading 
                ? (editProject ? 'Updating Project...' : 'Adding Project...')
                : (editProject ? 'Update Project' : 'Add Project')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
