import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Footer from './components/Footer';
import './styles.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main style={{ paddingTop: '4rem' }}>
        <Hero />
        <About />
        <Projects />
        <Skills />
      </main>
      <Footer />
    </div>
  );
}

export default App;
