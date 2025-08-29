import React, { useRef, useState } from 'react';
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
  const [editProject, setEditProject] = useState(null);

  const handleProjectAdded = () => {
    if (projectsRefreshRef.current && projectsRefreshRef.current.refresh) {
      projectsRefreshRef.current.refresh();
    }
    setEditProject(null); // Clear edit mode after successful operation
  };

  const handleEditProject = (project) => {
    setEditProject(project);
    // Scroll to the AddProject section
    document.getElementById('add-project')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditProject(null);
  };

  return (
    <div className="App">
      <Navbar />
      <main style={{ paddingTop: '4rem' }}>
        <Hero />
        <About />
        <Projects ref={projectsRefreshRef} onEditProject={handleEditProject} />
        <div id="add-project">
          <AddProject 
            onProjectAdded={handleProjectAdded} 
            editProject={editProject}
            onCancelEdit={handleCancelEdit}
          />
        </div>
        <Skills />
      </main>
      <Footer />
    </div>
  );
}

export default App;
