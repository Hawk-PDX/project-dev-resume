import React, { useState } from 'react';
import { CloudArrowDownIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { projectsService } from '../services/productionApi';

/**
 * Component for bulk importing repositories from multiple GitHub accounts
 * Allows users to fetch repositories from multiple accounts and selectively import them
 */
const BulkImportRepos = ({ onProjectsImported, onClose }) => {
  const [githubAccounts, setGithubAccounts] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1); // 1: Enter accounts, 2: Select repos, 3: Import confirmation

  /**
   * Fetch repositories from the specified GitHub accounts
   */
  const handleFetchRepos = async () => {
    if (!githubAccounts.trim()) {
      setMessage('Please enter at least one GitHub username');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      // Parse accounts from input (comma or newline separated)
      const accounts = githubAccounts
        .split(/[,\n]/)
        .map(account => account.trim())
        .filter(account => account.length > 0);
      
      if (accounts.length === 0) {
        setMessage('Please enter valid GitHub usernames');
        setLoading(false);
        return;
      }

      const response = await projectsService.fetchGitHubRepositories(accounts);
      
      if (response.repositories && response.repositories.length > 0) {
        // Sort repositories by stars and recent updates
        const sortedRepos = response.repositories.sort((a, b) => {
          // Prioritize starred repos, then recent updates
          if (a.stars !== b.stars) return b.stars - a.stars;
          return new Date(b.updated_at) - new Date(a.updated_at);
        });
        
        setRepositories(sortedRepos);
        setStep(2);
        setMessage(`Found ${response.repositories.length} repositories from ${accounts.length} account(s)`);
      } else {
        setMessage('No public repositories found for the specified accounts');
      }
    } catch (error) {
      setMessage('Error fetching repositories: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle repository selection
   */
  const toggleRepoSelection = (repoUrl) => {
    const newSelected = new Set(selectedRepos);
    if (newSelected.has(repoUrl)) {
      newSelected.delete(repoUrl);
    } else {
      newSelected.add(repoUrl);
    }
    setSelectedRepos(newSelected);
  };

  /**
   * Select all repositories
   */
  const selectAllRepos = () => {
    const allUrls = repositories.map(repo => repo.github_url);
    setSelectedRepos(new Set(allUrls));
  };

  /**
   * Clear all selections
   */
  const clearAllSelections = () => {
    setSelectedRepos(new Set());
  };

  /**
   * Import selected repositories as projects
   */
  const handleImportSelected = async () => {
    if (selectedRepos.size === 0) {
      setMessage('Please select at least one repository to import');
      return;
    }

    setImporting(true);
    setMessage('');
    let successCount = 0;
    let errorCount = 0;

    try {
      const selectedRepositories = repositories.filter(repo => selectedRepos.has(repo.github_url));
      
      for (const repo of selectedRepositories) {
        try {
          // First fetch detailed information from GitHub
          const detailedInfo = await projectsService.fetchGitHubProject(repo.github_url);
          
          // Create project with detailed info
          await projectsService.createProject({
            title: detailedInfo.title || repo.title,
            description: detailedInfo.description || repo.description,
            technologies: detailedInfo.technologies || repo.languages || '',
            github_url: repo.github_url,
            github_account: repo.github_account,
            live_url: detailedInfo.live_url || repo.live_url,
            image_url: detailedInfo.image_url || '',
            featured: false, // Let user decide later
            order: 0 // Let user decide later
          });
          
          successCount++;
        } catch (error) {
          console.error(`Error importing ${repo.title}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        setMessage(`Successfully imported ${successCount} project(s)${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
        setStep(3);
        
        // Call parent callback to refresh projects
        if (onProjectsImported) {
          onProjectsImported();
        }
      } else {
        setMessage(`Failed to import projects. ${errorCount} errors occurred.`);
      }
    } catch (error) {
      setMessage('Error importing projects: ' + (error.response?.data?.error || error.message));
    } finally {
      setImporting(false);
    }
  };

  /**
   * Reset the component to initial state
   */
  const handleReset = () => {
    setStep(1);
    setGithubAccounts('');
    setRepositories([]);
    setSelectedRepos(new Set());
    setMessage('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '2rem',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-color)' }}>
            Import from Multiple GitHub Accounts
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-light)'
            }}
          >
            ×
          </button>
        </div>

        {/* Step 1: Enter GitHub Accounts */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: 'var(--text-color)', 
                marginBottom: '0.5rem' 
              }}>
                GitHub Usernames
              </label>
              <textarea
                value={githubAccounts}
                onChange={(e) => setGithubAccounts(e.target.value)}
                placeholder="Enter GitHub usernames (one per line or comma separated)&#10;Example:&#10;your-username1&#10;your-username2"
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit'
                }}
                rows="4"
              />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-light)'
              }}>
                <InformationCircleIcon style={{ height: '1rem', width: '1rem' }} />
                <span>This will fetch all public repositories from the specified accounts</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: 'var(--text-color)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleFetchRepos}
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: loading ? '#9ca3af' : 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <CloudArrowDownIcon style={{ height: '1.25rem', width: '1.25rem' }} />
                {loading ? 'Fetching...' : 'Fetch Repositories'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Repositories */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: 'var(--text-color)' }}>
                  Select Repositories ({repositories.length} found)
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                  {selectedRepos.size} selected for import
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={selectAllRepos}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid var(--primary-color)',
                    backgroundColor: 'transparent',
                    color: 'var(--primary-color)',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Select All
                </button>
                <button
                  onClick={clearAllSelections}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'transparent',
                    color: 'var(--text-color)',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>

            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              marginBottom: '1.5rem'
            }}>
              {repositories.map((repo) => (
                <div
                  key={repo.github_url}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #f3f4f6',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedRepos.has(repo.github_url)}
                    onChange={() => toggleRepoSelection(repo.github_url)}
                    style={{ marginTop: '0.25rem' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-color)', margin: 0 }}>
                        {repo.title}
                      </h4>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        color: 'var(--text-color)',
                        fontSize: '0.75rem',
                        borderRadius: '0.375rem'
                      }}>
                        @{repo.github_account}
                      </span>
                      {repo.is_fork && (
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: 'rgba(255, 193, 7, 0.1)',
                          color: '#b45309',
                          fontSize: '0.75rem',
                          borderRadius: '0.375rem'
                        }}>
                          Fork
                        </span>
                      )}
                    </div>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--text-light)', 
                      margin: '0 0 0.5rem 0',
                      lineHeight: '1.4'
                    }}>
                      {repo.description || 'No description available'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      {repo.languages && <span>📝 {repo.languages}</span>}
                      {repo.stars > 0 && <span>⭐ {repo.stars}</span>}
                      {repo.forks > 0 && <span>🍴 {repo.forks}</span>}
                      <span>📅 {formatDate(repo.updated_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: 'var(--text-color)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
              <button
                onClick={handleImportSelected}
                disabled={importing || selectedRepos.size === 0}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: (importing || selectedRepos.size === 0) ? '#9ca3af' : '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: (importing || selectedRepos.size === 0) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <CheckCircleIcon style={{ height: '1.25rem', width: '1.25rem' }} />
                {importing ? `Importing ${selectedRepos.size} projects...` : `Import ${selectedRepos.size} Selected`}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Import Confirmation */}
        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <CheckCircleIcon style={{ 
              height: '4rem', 
              width: '4rem', 
              color: '#059669', 
              margin: '0 auto 1rem auto' 
            }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-color)', marginBottom: '1rem' }}>
              Import Complete!
            </h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
              Your repositories have been imported as projects. You can now edit them, set featured status, and arrange the order.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={handleReset}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid var(--primary-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--primary-color)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Import More
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div style={{
            padding: '1rem',
            marginTop: '1rem',
            backgroundColor: message.includes('Error') || message.includes('failed') ? '#fee2e2' : '#d1fae5',
            color: message.includes('Error') || message.includes('failed') ? '#dc2626' : '#065f46',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {message.includes('Error') || message.includes('failed') ? (
              <XCircleIcon style={{ height: '1.25rem', width: '1.25rem' }} />
            ) : (
              <InformationCircleIcon style={{ height: '1.25rem', width: '1.25rem' }} />
            )}
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkImportRepos;