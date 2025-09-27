import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import MinimalLayout from './components/layout/MinimalLayout';
import ModelShowcasePage from './pages/ModelShowcasePage';
import ExperiencePage from './pages/ExperiencePage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';

interface AppProps {
  // Define any global props here
}

/**
 * Main application component that sets up routing and theme context.
 * @param {AppProps} props - The props for the App component.
 * @returns {JSX.Element} - The rendered application.
 */
const App: React.FC<AppProps> = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Apply theme to the document body for global CSS variables
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MinimalLayout><ModelShowcasePage /></MinimalLayout>} />
        <Route path="/experience" element={<MinimalLayout><ExperiencePage /></MinimalLayout>} />
        <Route path="/contact" element={<MinimalLayout><ContactPage /></MinimalLayout>} />
        <Route path="/about" element={<MinimalLayout><AboutPage /></MinimalLayout>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;