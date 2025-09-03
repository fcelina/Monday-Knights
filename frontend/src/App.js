import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Components
import HomePage from './components/HomePage';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import EventsAnnouncements from './components/EventsAnnouncements';
import PrivacyPolicy from './components/PrivacyPolicy';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleAdminLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/events" element={<EventsAnnouncements />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route 
            path="/admin/login" 
            element={
              isAdminLoggedIn ? 
              <Navigate to="/admin/dashboard" /> : 
              <AdminLogin onLogin={handleAdminLogin} />
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              isAdminLoggedIn ? 
              <AdminDashboard onLogout={handleAdminLogout} /> : 
              <Navigate to="/admin/login" />
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;