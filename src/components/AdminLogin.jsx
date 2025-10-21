import React, { useState } from 'react';
import { authenticateAdmin, logoutAdmin, getAdminInfo } from '../config/adminMode';

const AdminLogin = () => {
  const [adminInfo, setAdminInfo] = useState(getAdminInfo());

  const handleLogin = () => {
    if (authenticateAdmin()) {
      setAdminInfo(getAdminInfo());
      window.location.reload(); // Refresh to show admin interface
    }
  };

  const handleLogout = () => {
    logoutAdmin();
  };

  if (adminInfo.authenticated) {
    return (
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <span>🔐 Admin Mode Active</span>
        <button
          onClick={handleLogout}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      zIndex: 9999
    }}>
      <button
        onClick={handleLogin}
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        title="Admin Login"
      >
        🔑 Admin
      </button>
    </div>
  );
};

export default AdminLogin;