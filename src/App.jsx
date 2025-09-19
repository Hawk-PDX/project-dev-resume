import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import AllProjects from './components/AllProjects';
import AddProject from './components/AddProject';
import Skills from './components/Skills';
import Certificates from './components/Certificates';
import Footer from './components/Footer';
import { skillsService } from './services/productionApi';
import { initializeWarmup } from './services/warmup';
import './styles.css';

/**
 * Main application component that orchestrates the portfolio layout
 * and manages state for project editing and refresh functionality
 */
import { useEffect } from 'react';

function App() {
  // Ref to access the Projects component's refresh method
  const projectsRefreshRef = useRef(null);
  // Ref to access the AllProjects component's refresh method
  const allProjectsRefreshRef = useRef(null);
  // Ref to access the Skills component's refresh method
  const skillsRefreshRef = useRef(null);
  
  // State to track which project is being edited (if any)
  const [editProject, setEditProject] = useState(null);

  useEffect(() => {
    document.title = 'FS Dev Portfolio';
    
    // Initialize backend warmup to reduce cold start delays
    initializeWarmup();
  }, []);

  /**
   * Handle project addition success - refresh projects list, sync skills, and clear edit mode
   */
  const handleProjectAdded = async () => {
    // Refresh the main Projects component (featured projects on homepage)
    if (projectsRefreshRef.current && projectsRefreshRef.current.refresh) {
      projectsRefreshRef.current.refresh();
    }
    
    // Refresh the AllProjects component (all projects page)
    if (allProjectsRefreshRef.current && allProjectsRefreshRef.current.refresh) {
      allProjectsRefreshRef.current.refresh();
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
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Main portfolio page */}
          <Route path="/" element={
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
              <Skills ref={skillsRefreshRef} onSkillsUpdated={handleSkillsUpdated} />
              <Certificates />
            </main>
          } />
          
          {/* All projects page */}
          <Route path="/projects" element={
            <main style={{ paddingTop: '4rem' }}>
              <AllProjects ref={allProjectsRefreshRef} onEditProject={handleEditProject} />
              <div id="add-project">
                <AddProject 
                  onProjectAdded={handleProjectAdded} 
                  editProject={editProject}
                  onCancelEdit={handleCancelEdit}
                />
              </div>
            </main>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
