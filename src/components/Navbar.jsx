import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isAdminEnabled } from '../config/adminMode';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navigation = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Certificates', href: '#certificates' },
  ];
  
  const routeNavigation = [
    { name: 'All Projects', href: '/projects' },
    ...(isAdminEnabled() ? [{ name: 'Analytics', href: '/analytics' }] : []),
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '2px solid #334155',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      padding: isMobile ? '1rem 0.5rem' : '1.5rem 1rem',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '4rem'
        }}>
          <div>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#60a5fa',
              textShadow: '0 0 20px rgba(96, 165, 250, 0.5)'
            }}>Portfolio</span>
          </div>
          
          {!isMobile && (
            <div>
              <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}>
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    style={{
                      color: '#93c5fd',
                      fontWeight: '500',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      border: '1px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#ffffff';
                      e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.5)';
                      e.target.style.borderColor = '#60a5fa';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#93c5fd';
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.borderColor = 'transparent';
                    }}
                  >
                    {item.name}
                  </a>
                ))}
                {routeNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    style={{
                      color: '#93c5fd',
                      fontWeight: '500',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      border: '1px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#ffffff';
                      e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.5)';
                      e.target.style.borderColor = '#60a5fa';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#93c5fd';
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.borderColor = 'transparent';
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {isMobile && (
            <div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  color: '#93c5fd',
                  padding: '0.5rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.5rem'
                }}
              >
                {isOpen ? '✕' : '☰'}
              </button>
            </div>
          )}
        </div>
      </div>

      {isOpen && isMobile && (
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.98)',
          borderBottom: '2px solid #334155',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ padding: '1rem' }}>
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                style={{
                  color: '#93c5fd',
                  fontWeight: '500',
                  display: 'block',
                  padding: '0.75rem 1rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  borderRadius: '0.375rem',
                  border: '1px solid transparent'
                }}
                onClick={handleLinkClick}
                onMouseEnter={(e) => {
                  e.target.style.color = '#ffffff';
                  e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.5)';
                  e.target.style.borderColor = '#60a5fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#93c5fd';
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = 'transparent';
                }}
              >
                {item.name}
              </a>
            ))}
            {routeNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                style={{
                  color: '#93c5fd',
                  fontWeight: '500',
                  display: 'block',
                  padding: '0.75rem 1rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  borderRadius: '0.375rem',
                  border: '1px solid transparent'
                }}
                onClick={handleLinkClick}
                onMouseEnter={(e) => {
                  e.target.style.color = '#ffffff';
                  e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.5)';
                  e.target.style.borderColor = '#60a5fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#93c5fd';
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = 'transparent';
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
