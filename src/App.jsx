import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Compare from './components/Compare';
import About from './components/About';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import FeaturesPage from './components/FeaturesPage';
import BlogPage from './components/BlogPage';
import Dashboard from './components/Dashboard';
import WelcomeScreen from './components/WelcomeScreen';
import { SplineSceneBasic } from './components/SplineSceneBasic';

const Layout = ({ children }) => {
  const location = useLocation();
  // Check if current path starts with /dashboard
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isDashboard && <Navbar />}
      <main style={{ flex: 1 }}>
        {children}
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // 1. Start the 'exit' phase at 4s (animation complete)
    const exitTimer = setTimeout(() => {
      setLoading(false); // Triggers exit animation in WelcomeScreen
    }, 4000);

    // 2. Actually remove WelcomeScreen from DOM after exit animation (e.g. 800ms later)
    const removeTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 4800);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {showWelcome && <WelcomeScreen isExiting={!loading} />}

      <div
        className={loading ? 'app-loading' : 'app-loaded'}
        style={{
          opacity: loading ? 0 : 1,
          /* transition removed to let children animate individually */
          height: loading ? '0' : 'auto', /* Prevent scroll during load */
          overflow: loading ? 'hidden' : 'visible'
        }}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Features />
                  <Compare />
                  <About />
                </>
              } />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<BlogPage />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/demo" element={
                <div className="container py-20 min-h-screen flex items-center justify-center">
                  <SplineSceneBasic />
                </div>
              } />
            </Routes>
          </Layout>
        </Router>
      </div>
    </>
  );
}

export default App;
