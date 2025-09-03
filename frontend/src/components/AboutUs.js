import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AboutUs = () => {
  const [aboutContent, setAboutContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await axios.get(`${API}/about-us`);
      setAboutContent(response.data.content);
    } catch (error) {
      console.error('Error fetching about content:', error);
      setAboutContent('Welcome to Monday Knights - a community dedicated to making a positive impact through activism and social engagement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="background-pattern"></div>
      
      {/* Header */}
      <div className="monday-knights-header">
        <div className="monday-knights-logo fade-in-up">
          MONDAY KNIGHTS
        </div>
        <div className="monday-knights-subtitle fade-in-up">
          About Our Mission
        </div>
      </div>

      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-container">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/about" className="nav-item active">About Us</Link>
          <Link to="/contact" className="nav-item">Contact Us</Link>
          <Link to="/events" className="nav-item">Events and Announcements</Link>
        </div>
      </nav>

      {/* Content */}
      <div className="page-content">
        <div className="card fade-in-up">
          <h2 style={{ color: '#ffd700', marginBottom: '2rem', fontSize: '2.5rem' }}>
            About Monday Knights
          </h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="loading-spinner"></div>
              <p style={{ marginTop: '1rem' }}>Loading content...</p>
            </div>
          ) : (
            <div style={{ 
              fontSize: '1.1rem', 
              lineHeight: '1.8', 
              color: '#e0e0e0',
              whiteSpace: 'pre-line'
            }}>
              {aboutContent}
            </div>
          )}
        </div>

        <div className="card fade-in-up">
          <h3 style={{ color: '#ff6b9d', marginBottom: '1.5rem' }}>Our Values</h3>
          <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
            <div style={{ 
              padding: '1.5rem', 
              background: 'rgba(255, 107, 157, 0.1)', 
              borderRadius: '10px',
              border: '1px solid rgba(255, 107, 157, 0.2)'
            }}>
              <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>Community First</h4>
              <p style={{ color: '#e0e0e0' }}>
                We believe in the power of community and collective action to create meaningful change.
              </p>
            </div>
            <div style={{ 
              padding: '1.5rem', 
              background: 'rgba(255, 215, 0, 0.1)', 
              borderRadius: '10px',
              border: '1px solid rgba(255, 215, 0, 0.2)'
            }}>
              <h4 style={{ color: '#ff6b9d', marginBottom: '0.5rem' }}>Authentic Action</h4>
              <p style={{ color: '#e0e0e0' }}>
                We are committed to taking genuine, impactful actions that align with our core values.
              </p>
            </div>
            <div style={{ 
              padding: '1.5rem', 
              background: 'rgba(138, 43, 226, 0.1)', 
              borderRadius: '10px',
              border: '1px solid rgba(138, 43, 226, 0.2)'
            }}>
              <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>Inclusive Growth</h4>
              <p style={{ color: '#e0e0e0' }}>
                We foster an environment where everyone can contribute and grow together.
              </p>
            </div>
          </div>
        </div>

        <div className="card fade-in-up">
          <h3 style={{ color: '#ffd700', marginBottom: '1.5rem' }}>Join Our Movement</h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#e0e0e0', marginBottom: '2rem' }}>
            Ready to be part of something bigger? Connect with us and help shape the future of our community.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn">Get in Touch</Link>
            <Link to="/events" className="btn btn-secondary">View Events</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;