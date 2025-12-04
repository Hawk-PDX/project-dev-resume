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
import AdminLogin from './components/AdminLogin';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import { skillsService } from './services/productionApi';
import { initializeWarmup } from './services/warmup';
import { isAdminEnabled, canAddProjects } from './config/adminMode';
import analyticsService from './services/analyticsService';
import './styles.css';
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

    initializeWarmup();

    setTimeout(() => {
      analyticsService.trackPageView('/');
    }, 100);
  }, []);

  const handleProjectAdded = async () => {
    if (projectsRefreshRef.current && projectsRefreshRef.current.refresh) {
      projectsRefreshRef.current.refresh();
    }

    if (allProjectsRefreshRef.current && allProjectsRefreshRef.current.refresh) {
      allProjectsRefreshRef.current.refresh();
    }

    try {
      await skillsService.calculateSkills({ preserve_manual_overrides: true });
      if (skillsRefreshRef.current && skillsRefreshRef.current.refresh) {
        skillsRefreshRef.current.refresh();
      }
    } catch (error) {
      console.error('Error syncing skills:', error);
    }

    setEditProject(null);
  };

  const handleEditProject = (project) => {
    setEditProject(project);
    document.getElementById('add-project')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditProject(null);
  };

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
              {canAddProjects() && (
                <div id="add-project">
                  <AddProject
                    onProjectAdded={handleProjectAdded}
                    editProject={editProject}
                    onCancelEdit={handleCancelEdit}
                  />
                </div>
              )}
              <Skills ref={skillsRefreshRef} onSkillsUpdated={handleSkillsUpdated} />
              <Certificates />
            </main>
          } />
          
          {/* All projects page */}
          <Route path="/projects" element={
            <main style={{ paddingTop: '4rem' }}>
              <AllProjects ref={allProjectsRefreshRef} onEditProject={handleEditProject} />
              {canAddProjects() && (
                <div id="add-project">
                  <AddProject
                    onProjectAdded={handleProjectAdded}
                    editProject={editProject}
                    onCancelEdit={handleCancelEdit}
                  />
                </div>
              )}
            </main>
          } />
          
          {/* Analytics Dashboard - Admin Only */}
          {isAdminEnabled() && (
            <Route path="/analytics" element={
              <main style={{ paddingTop: '4rem' }}>
                <AnalyticsDashboard isVisible={true} />
              </main>
            } />
          )}
        </Routes>
        <Footer />
        <AdminLogin />
      </div>
    </Router>
  );
}

export default App;
