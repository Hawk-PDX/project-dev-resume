import React, { useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import AddProject from './components/AddProject';
import Skills from './components/Skills';
import SkillsAdmin from './components/SkillsAdmin';
import Certificates from './components/Certificates';
import Footer from './components/Footer';
import { skillsService } from './services/api';
import './styles.css';

/**
 * Main application component that orchestrates the portfolio layout
 * and manages state for project editing and refresh functionality
 */
import { useEffect } from 'react';

function App() {
  // Ref to access the Projects component's refresh method
  const projectsRefreshRef = useRef(null);
  // Ref to access the Skills component's refresh method
  const skillsRefreshRef = useRef(null);
  
  // State to track which project is being edited (if any)
  const [editProject, setEditProject] = useState(null);

  useEffect(() => {
    document.title = 'FS Dev Portfolio';
  }, []);

  /**
   * Handle project addition success - refresh projects list, sync skills, and clear edit mode
   */
  const handleProjectAdded = async () => {
    if (projectsRefreshRef.current && projectsRefreshRef.current.refresh) {
      projectsRefreshRef.current.refresh();
    }
    
    // Auto-sync skills when projects change
    try {
      await skillsService.calculateSkills({ preserve_manual_overrides: true });
      if (skillsRefreshRef.current && skillsRefreshRef.current.refresh) {
        skillsRefreshRef.current.refresh();
      }
    } catch (error) {
      console.error('Error syncing skills:', error);
    }
    
    setEditProject(null); // Clear edit mode after successful operation
  };

  /**
   * Handle project edit initiation - set the project to edit and scroll to form
   * @param {Object} project - The project object to edit
   */
  const handleEditProject = (project) => {
    setEditProject(project);
    // Scroll to the AddProject section for better UX
    document.getElementById('add-project')?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Handle canceling project edit - clear the edit state
   */
  const handleCancelEdit = () => {
    setEditProject(null);
  };

  /**
   * Handle skills refresh - used by SkillsAdmin component
   */
  const handleSkillsUpdated = () => {
    if (skillsRefreshRef.current && skillsRefreshRef.current.refresh) {
      skillsRefreshRef.current.refresh();
    }
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
        <Skills ref={skillsRefreshRef} />
        <SkillsAdmin onSkillsUpdated={handleSkillsUpdated} />
        <Certificates />
      </main>
      <Footer />
    </div>
  );
}

export default App;
