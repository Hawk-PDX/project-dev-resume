import React from 'react';

const Hero = () => {
  return (
    <section 
      id="hero" 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: '4rem',
        backgroundImage: 'url("/images/RCD-Logo.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1
        }}
      />
      
      <div 
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%'
        }}
      >
      <div className="container">
        <div className="text-center">
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
          }}>
            Garrett Hawkins
          </h1>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            color: '#f0f9ff',
            marginBottom: '2rem',
            lineHeight: '1.2',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)'
          }}>
            Full Stack Developer
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            color: '#e2e8f0',
            maxWidth: '600px',
            margin: '0 auto 2rem auto',
            lineHeight: '1.6',
            padding: '0 1rem',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
          }}>
            Full-stack engineer building production-ready applications with React, Python, and Flask. I turn ideas into scalable, well-architected web solutions.
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <a
              href="#projects"
              className="btn btn-primary"
              style={{ 
                minWidth: '200px',
                width: '100%',
                textAlign: 'center'
              }}
            >
              View Projects
            </a>
            <a
              href="#certificates"
              className="btn btn-secondary"
              style={{ 
                minWidth: '200px',
                width: '100%',
                textAlign: 'center'
              }}
            >
              View Certificates
            </a>
          </div>

          <div style={{
            marginTop: '3rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <a 
              href="https://github.com/Hawk-PDX" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: '#ffffff',
                transition: 'color 0.2s ease, transform 0.2s ease',
                filter: 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.8))'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#f59e0b'
                e.target.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#ffffff'
                e.target.style.transform = 'scale(1)'
              }}
            >
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href="https://linkedin.com/in/hawkpdx" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: '#ffffff',
                transition: 'color 0.2s ease, transform 0.2s ease',
                filter: 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.8))'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#f59e0b'
                e.target.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#ffffff'
                e.target.style.transform = 'scale(1)'
              }}
            >
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.896zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Hero;
