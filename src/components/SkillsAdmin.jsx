import React, { useState, useEffect } from 'react';
import { skillsService } from '../services/api';

const SkillsAdmin = ({ onSkillsUpdated }) => {
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [insights, setInsights] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'frontend',
    level: 3
  });

  useEffect(() => {
    loadSkills();
    loadInsights();
  }, []);

  const loadSkills = async () => {
    try {
      const response = await skillsService.getSkills();
      setSkills(response.data);
    } catch (error) {
      setMessage('Error loading skills: ' + error.message);
    }
  };

  const loadInsights = async () => {
    try {
      const response = await skillsService.getInsights();
      setInsights(response.data);
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const handleAutoCalculate = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await skillsService.calculateSkills({
        preserve_manual_overrides: true
      });
      
      if (response.data.status === 'success') {
        setMessage(`✅ Skills updated! Added: ${response.data.added}, Updated: ${response.data.updated}, Preserved: ${response.data.preserved}`);
        loadSkills();
        loadInsights();
        if (onSkillsUpdated) onSkillsUpdated();
      } else {
        setMessage(`❌ ${response.data.message}`);
      }
    } catch (error) {
      setMessage('Error calculating skills: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForceRecalculate = async () => {
    if (!window.confirm('This will override all manual skill levels with calculated values. Are you sure?')) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await skillsService.calculateSkills({
        preserve_manual_overrides: false
      });
      
      if (response.data.status === 'success') {
        setMessage(`✅ All skills recalculated! Added: ${response.data.added}, Updated: ${response.data.updated}`);
        loadSkills();
        loadInsights();
        if (onSkillsUpdated) onSkillsUpdated();
      }
    } catch (error) {
      setMessage('Error recalculating skills: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSkill = (skill) => {
    setEditingSkill({
      ...skill,
      originalLevel: skill.level
    });
  };

  const handleUpdateSkill = async (skillData) => {
    try {
      await skillsService.updateSkill(skillData.id, {
        name: skillData.name,
        category: skillData.category,
        level: parseInt(skillData.level),
        order: parseInt(skillData.order || 0)
      });
      
      setMessage('✅ Skill updated successfully!');
      setEditingSkill(null);
      loadSkills();
      if (onSkillsUpdated) onSkillsUpdated();
    } catch (error) {
      setMessage('Error updating skill: ' + error.message);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }
    
    try {
      await skillsService.deleteSkill(skillId);
      setMessage('✅ Skill deleted successfully!');
      loadSkills();
      if (onSkillsUpdated) onSkillsUpdated();
    } catch (error) {
      setMessage('Error deleting skill: ' + error.message);
    }
  };

  const handleAddSkill = async () => {
    try {
      await skillsService.addSkill(newSkill);
      setMessage('✅ Skill added successfully!');
      setNewSkill({ name: '', category: 'frontend', level: 3 });
      loadSkills();
      if (onSkillsUpdated) onSkillsUpdated();
    } catch (error) {
      setMessage('Error adding skill: ' + error.message);
    }
  };

  const categories = ['frontend', 'backend', 'database', 'tools', 'mobile', 'data'];
  const skillCategories = Object.keys(skills);

  return (
    <section id="skills-admin" className="section" style={{ backgroundColor: 'var(--card-bg)' }}>
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="section-title">Skills Administration</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-light)', maxWidth: '42rem', margin: '0 auto' }}>
            Manage your technical skills with hybrid auto-calculation from projects
          </p>
        </div>

        {message && (
          <div style={{
            padding: '1rem',
            marginBottom: '2rem',
            backgroundColor: message.includes('Error') || message.includes('❌') ? '#fee2e2' : '#d1fae5',
            color: message.includes('Error') || message.includes('❌') ? '#dc2626' : '#065f46',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {/* Auto-Calculation Controls */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Auto-Calculate Skills from Projects</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
              Automatically generate skills based on technologies used in your projects.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button
                onClick={handleAutoCalculate}
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: loading ? '#9ca3af' : 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Calculating...' : 'Smart Update (Preserve Manual)'}
              </button>
              
              <button
                onClick={handleForceRecalculate}
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: loading ? '#9ca3af' : '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                Force Recalculate All
              </button>
            </div>

            {insights && (
              <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                <strong>Current Status:</strong> {insights.total_skills} skills, {insights.total_technologies} technologies from {insights.total_projects} projects
                {insights.missing_skills.length > 0 && (
                  <span> | <strong>{insights.missing_skills.length}</strong> technologies not in skills yet</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Add New Skill */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Add New Skill</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.25rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.25rem'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Level</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({...newSkill, level: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.25rem'
                  }}
                />
              </div>
              <button
                onClick={handleAddSkill}
                disabled={!newSkill.name}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: newSkill.name ? 'var(--primary-color)' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: newSkill.name ? 'pointer' : 'not-allowed'
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Skills List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {skillCategories.map((category) => (
            <div key={category} className="card">
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: 'var(--text-color)', 
                  marginBottom: '1rem', 
                  textTransform: 'capitalize' 
                }}>
                  {category}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {skills[category]?.map((skill) => (
                    <div key={skill.id || skill.name}>
                      {editingSkill && editingSkill.id === skill.id ? (
                        <SkillEditForm 
                          skill={editingSkill}
                          onSave={handleUpdateSkill}
                          onCancel={() => setEditingSkill(null)}
                          categories={categories}
                        />
                      ) : (
                        <SkillDisplayItem 
                          skill={skill}
                          onEdit={() => handleEditSkill(skill)}
                          onDelete={() => handleDeleteSkill(skill.id)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SkillDisplayItem = ({ skill, onEdit, onDelete }) => (
  <div style={{ 
    border: '1px solid var(--border-color)', 
    borderRadius: '0.375rem', 
    padding: '0.75rem',
    backgroundColor: skill.manual_override ? '#fef3c7' : 'transparent'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
      <div>
        <span style={{ fontWeight: '500' }}>{skill.name}</span>
        {skill.manual_override && (
          <span style={{ fontSize: '0.75rem', color: '#d97706', marginLeft: '0.5rem' }}>
            (Manual)
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        <button 
          onClick={onEdit}
          style={{
            padding: '0.25rem',
            border: '1px solid #d1d5db',
            backgroundColor: 'transparent',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '0.75rem'
          }}
        >
          ✏️
        </button>
        {skill.id && (
          <button 
            onClick={onDelete}
            style={{
              padding: '0.25rem',
              border: '1px solid #fecaca',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.75rem'
            }}
          >
            🗑️
          </button>
        )}
      </div>
    </div>
    
    <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
      Level: {skill.level}/5
      {skill.project_count > 0 && ` • Used in ${skill.project_count} project${skill.project_count !== 1 ? 's' : ''}`}
    </div>
    
    <div style={{ width: '100%', backgroundColor: 'var(--border-color)', borderRadius: '9999px', height: '0.25rem' }}>
      <div
        style={{ 
          backgroundColor: skill.manual_override ? '#d97706' : 'var(--primary-color)', 
          height: '0.25rem', 
          borderRadius: '9999px', 
          width: `${(skill.level / 5) * 100}%` 
        }}
      ></div>
    </div>
  </div>
);

const SkillEditForm = ({ skill, onSave, onCancel, categories }) => {
  const [editData, setEditData] = useState({ ...skill });

  const handleSave = () => {
    onSave(editData);
  };

  return (
    <div style={{ 
      border: '2px solid var(--primary-color)', 
      borderRadius: '0.375rem', 
      padding: '1rem',
      backgroundColor: 'var(--background-color)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Name</label>
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({...editData, name: e.target.value})}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Category</label>
            <select
              value={editData.category}
              onChange={(e) => setEditData({...editData, category: e.target.value})}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '0.875rem'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Level</label>
            <input
              type="number"
              min="1"
              max="5"
              value={editData.level}
              onChange={(e) => setEditData({...editData, level: parseInt(e.target.value)})}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '0.875rem'
              }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              backgroundColor: 'transparent',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsAdmin;