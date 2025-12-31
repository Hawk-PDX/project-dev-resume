import React, { useState, useEffect } from 'react';
import { getWarmupStatus } from '../services/warmup';

const WarmupBanner = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const hasSeenBanner = sessionStorage.getItem('warmup_banner_dismissed');
    if (hasSeenBanner) {
      return;
    }

    const checkStatus = () => {
      const status = getWarmupStatus();
      if (status.inProgress && !status.completed) {
        setShow(true);
      } else if (status.completed) {
        setShow(false);
      }
    };

    checkStatus();

    const interval = setInterval(checkStatus, 1000);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setShow(false);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setShow(false);
    sessionStorage.setItem('warmup_banner_dismissed', 'true');
  };

  if (!show || dismissed) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '4rem',
      left: 0,
      right: 0,
      backgroundColor: 'rgba(59, 130, 246, 0.95)',
      color: 'white',
      padding: '0.75rem 1rem',
      textAlign: 'center',
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      animation: 'slideDown 0.3s ease-out'
    }}>
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '0.75rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <span style={{ fontSize: '1.25rem' }}>⚡</span>
        <span style={{ fontSize: '0.9rem' }}>
          Loading portfolio data from server... This takes a moment on first visit.
        </span>
        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1.25rem',
            padding: '0 0.5rem',
            lineHeight: 1
          }}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default WarmupBanner;
