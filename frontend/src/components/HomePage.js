import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="page-container">
      <div className="background-pattern"></div>
      
      {/* Header */}
      <div className="monday-knights-header">
        <div className="monday-knights-logo fade-in-up">
          MONDAY KNIGHTS
        </div>
        <div className="monday-knights-subtitle fade-in-up">
          EST. 2025
        </div>
      </div>

      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-container">
          <Link to="/about" className="nav-item">About Us</Link>
          <Link to="/contact" className="nav-item">Contact Us</Link>
          <Link to="/events" className="nav-item">Events and Announcements</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="page-content">
        <div className="card fade-in-up">
          <h2 style={{ color: '#ffd700', marginBottom: '1rem', fontSize: '2rem' }}>
            Welcome to Monday Knights
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#e0e0e0' }}>
            Join our community of passionate activists and changemakers. Together, we work towards 
            creating positive social impact and fostering meaningful connections that drive real change 
            in our communities.
          </p>
        </div>

        <div className="card fade-in-up">
          <h3 style={{ color: '#ff6b9d', marginBottom: '1rem' }}>Get Involved</h3>
          <p style={{ marginBottom: '2rem', color: '#e0e0e0' }}>
            Ready to make a difference? Explore our pages to learn more about our mission, 
            upcoming events, and how you can contribute to our cause.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/about" className="btn">Learn About Us</Link>
            <Link to="/events" className="btn btn-secondary">View Events</Link>
            <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
          </div>
        </div>
      </div>

      {/* Admin Link */}
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        opacity: '0.5',
        fontSize: '0.8rem'
      }}>
        <Link 
          to="/admin/login" 
          style={{ 
            color: '#666', 
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '5px',
            background: 'rgba(0,0,0,0.5)'
          }}
        >
          Admin
        </Link>
      </div>
    </div>
  );
};

export default HomePage;