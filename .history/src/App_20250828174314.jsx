import React, { useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import AddProject from './components/AddProject';
import Skills from './components/Skills';
import Footer from './components/Footer';
import './styles.css';

function App() {
  const projectsRefreshRef = useRef(null);

  const handleProjectAdded = () => {
    if (projectsRefreshRef.current) {
      projectsRefreshRef.current();
    }
  };

  return (
    <div className="App">
      <Navbar />
      <main style={{ paddingTop: '4rem' }}>
        <Hero />
        <About />
        <Projects ref={projectsRefreshRef} />
        <AddProject onProjectAdded={handleProjectAdded} />
        <Skills />
      </main>
      <Footer />
    </div>
  );
}

export default App;
