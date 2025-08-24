import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navigation = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div className="container">
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
              color: 'var(--primary-color)'
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
                      color: 'var(--text-color)',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-color)'}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {isMobile && (
            <div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  color: 'var(--text-color)',
                  padding: '0.5rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.25rem'
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
          backgroundColor: 'var(--background-color)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ padding: '1rem' }}>
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                style={{
                  color: 'var(--text-color)',
                  display: 'block',
                  padding: '0.75rem 1rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease'
                }}
                onClick={() => setIsOpen(false)}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-color)'}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
