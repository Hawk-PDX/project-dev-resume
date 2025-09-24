import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { useSkills } from '../hooks/useData';
import { skillsService } from '../services/productionApi';
import { isAdminEnabled, canEditSkills, canDeleteSkills, canAddSkills, canAutoCalculateSkills } from '../config/adminMode';

const Skills = forwardRef((props, ref) => {
  const { data: skills, loading, refresh, isWarmingUp } = useSkills();
  const [showAdmin, setShowAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const [insights, setInsights] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'frontend',
    level: 3
  });
  const [adminLoading, setAdminLoading] = useState(false);
  
  useImperativeHandle(ref, () => ({
    refresh: refresh
  }));

  useEffect(() => {
    if (showAdmin) {
      loadInsights();
    }
  }, [showAdmin]);

  const loadInsights = async () => {
    try {
      const response = await skillsService.getInsights();
      setInsights(response.data);
    } catch (error) {
      console.warn('Skills insights temporarily unavailable:', error.message);
      setInsights({
        total_projects: 0,
        total_technologies: 0,
        total_skills: 0,
        missing_skills: [],
        unused_skills: [],
        project_tech_distribution: {}
      });
    }
  };

  const handleAutoCalculate = async () => {
    setAdminLoading(true);
    setMessage('');
    
    try {
      const response = await skillsService.calculateSkills({
        preserve_manual_overrides: true
      });
      
      if (response.data.status === 'success') {
        setMessage(`Skills updated! Added: ${response.data.added}, Updated: ${response.data.updated}, Preserved: ${response.data.preserved}`);
        refresh();
        loadInsights();
        if (props.onSkillsUpdated) props.onSkillsUpdated();
      } else {
        setMessage(`Error: ${response.data.message}`);
      }
    } catch (error) {
      setMessage('Error calculating skills: ' + error.message);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleForceRecalculate = async () => {
    if (!window.confirm('This will override all manual skill levels with calculated values. Are you sure?')) {
      return;
    }
    
    setAdminLoading(true);
    
    try {
      const response = await skillsService.calculateSkills({
        preserve_manual_overrides: false
      });
      
      if (response.data.status === 'success') {
        setMessage(`All skills recalculated! Added: ${response.data.added}, Updated: ${response.data.updated}`);
        refresh();
        loadInsights();
        if (props.onSkillsUpdated) props.onSkillsUpdated();
      }
    } catch (error) {
      setMessage('Error recalculating skills: ' + error.message);
    } finally {
      setAdminLoading(false);
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
      
      setMessage('Skill updated successfully!');
      setEditingSkill(null);
      refresh();
      if (props.onSkillsUpdated) props.onSkillsUpdated();
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
      setMessage('Skill deleted successfully!');
      refresh();
      if (props.onSkillsUpdated) props.onSkillsUpdated();
    } catch (error) {
      setMessage('Error deleting skill: ' + error.message);
    }
  };

  const handleAddSkill = async () => {
    try {
      await skillsService.addSkill(newSkill);
      setMessage('Skill added successfully!');
      setNewSkill({ name: '', category: 'frontend', level: 3 });
      refresh();
      if (props.onSkillsUpdated) props.onSkillsUpdated();
    } catch (error) {
      setMessage('Error adding skill: ' + error.message);
    }
  };

  if (loading) {
    return (
      <section id="skills" className="section" style={{ backgroundColor: 'var(--background-color)' }}>
        <div className="container">
          <div className="py-20 text-center">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <div style={{ fontSize: '1.125rem', color: 'var(--text-color)', marginBottom: '0.5rem' }}>
              {isWarmingUp ? 'Warming up server...' : 'Loading skills...'}
            </div>
            {isWarmingUp && (
              <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                This may take up to 30 seconds on first visit
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  const skillCategories = Object.keys(skills);
  const categories = ['frontend', 'backend', 'database', 'tools', 'mobile', 'data'];

  return (
    <section id="skills" className="section" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="section-title">Technical Skills</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-light)', maxWidth: '42rem', margin: '0 auto' }}>
            Technologies and tools I work with - with smart auto-calculation from projects
          </p>
          
          {/* Admin Toggle Button */}
          {isAdminEnabled() && (
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: showAdmin ? 'var(--primary-color)' : 'transparent',
                color: showAdmin ? 'white' : 'var(--primary-color)',
                border: '2px solid var(--primary-color)',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {showAdmin ? 'Hide Admin Panel' : 'Show Admin Panel'}
            </button>
          )}
        </div>

        {/* Admin Panel */}
        {isAdminEnabled() && showAdmin && (
          <div style={{ marginBottom: '3rem' }}>
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
            {canAutoCalculateSkills() && (
              <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-color)' }}>Auto-Calculate Skills from Projects</h3>
                  <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                    Automatically generate skills based on technologies used in your projects.
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    marginBottom: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <button
                      onClick={handleAutoCalculate}
                      disabled={adminLoading}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: adminLoading ? '#9ca3af' : 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: adminLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {adminLoading ? 'Calculating...' : 'Smart Update (Preserve Manual)'}
                    </button>
                    
                    <button
                      onClick={handleForceRecalculate}
                      disabled={adminLoading}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: adminLoading ? '#9ca3af' : '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: adminLoading ? 'not-allowed' : 'pointer'
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

            )}

            {/* Add New Skill */}
            {canAddSkills() && (
              <div className="card" style={{ marginBottom: '2rem' }}>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-color)' }}>Add New Skill</h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: '1rem', 
                  alignItems: 'end'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name</label>
                    <input
                      type="text"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.25rem',
                        backgroundColor: 'var(--background-color)',
                        color: 'var(--text-color)'
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
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.25rem',
                        backgroundColor: 'var(--background-color)',
                        color: 'var(--text-color)'
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
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.25rem',
                        backgroundColor: 'var(--background-color)',
                        color: 'var(--text-color)'
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
            )}
          </div>
        )}

        {/* Skills Display */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {skillCategories.map((category) => (
            <div key={category} className="card">
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-color)', marginBottom: '1rem', textTransform: 'capitalize' }}>
                {category}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {skills[category]?.map((skill) => (
                  <div key={skill.id || skill.name}>
                    {showAdmin && editingSkill && editingSkill.id === skill.id ? (
                      <SkillEditForm 
                        skill={editingSkill}
                        onSave={handleUpdateSkill}
                        onCancel={() => setEditingSkill(null)}
                        categories={categories}
                      />
                    ) : (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: 'var(--text-color)' }}>{skill.name}</span>
                            {skill.manual_override && (
                              <span style={{ fontSize: '0.7rem', color: '#d97706', backgroundColor: '#fef3c7', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>
                                Manual
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: 'var(--text-light)' }}>{skill.level}/5</span>
                            {isAdminEnabled() && showAdmin && (
                              <div style={{ display: 'flex', gap: '0.25rem' }}>
                                {canEditSkills() && (
                                  <button 
                                    onClick={() => handleEditSkill(skill)}
                                    style={{
                                      padding: '0.25rem',
                                      border: '1px solid var(--border-color)',
                                      backgroundColor: 'transparent',
                                      borderRadius: '0.25rem',
                                      cursor: 'pointer',
                                      fontSize: '0.75rem'
                                    }}
                                  >
                                    ✏️
                                  </button>
                                )}
                                {canDeleteSkills() && skill.id && (
                                  <button 
                                    onClick={() => handleDeleteSkill(skill.id)}
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
                            )}
                          </div>
                        </div>
                        <div style={{ width: '100%', backgroundColor: 'var(--border-color)', borderRadius: '9999px', height: '0.5rem' }}>
                          <div
                            style={{ 
                              backgroundColor: skill.manual_override ? '#d97706' : 'var(--primary-color)', 
                              height: '0.5rem', 
                              borderRadius: '9999px', 
                              width: `${(skill.level / 5) * 100}%` 
                            }}
                          ></div>
                        </div>
                        {showAdmin && skill.project_count > 0 && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                            Used in {skill.project_count} project{skill.project_count !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

// Skill Edit Form Component
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
      backgroundColor: 'var(--background-color)',
      marginBottom: '0.5rem'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: 'var(--text-color)' }}>Name</label>
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({...editData, name: e.target.value})}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid var(--border-color)',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              backgroundColor: 'var(--background-color)',
              color: 'var(--text-color)'
            }}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: 'var(--text-color)' }}>Category</label>
            <select
              value={editData.category}
              onChange={(e) => setEditData({...editData, category: e.target.value})}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                backgroundColor: 'var(--background-color)',
                color: 'var(--text-color)'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: 'var(--text-color)' }}>Level</label>
            <input
              type="number"
              min="1"
              max="5"
              value={editData.level}
              onChange={(e) => setEditData({...editData, level: parseInt(e.target.value)})}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                backgroundColor: 'var(--background-color)',
                color: 'var(--text-color)'
              }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--border-color)',
              backgroundColor: 'transparent',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: 'var(--text-color)'
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

export default Skills;
