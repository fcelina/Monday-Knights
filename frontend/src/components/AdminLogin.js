import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/admin/login`, credentials);
      onLogin(response.data.access_token);
    } catch (error) {
      setError(error.response?.data?.detail || 'Login failed. Please check your credentials.');
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
          Admin Login
        </div>
      </div>

      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-container">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/about" className="nav-item">About Us</Link>
          <Link to="/contact" className="nav-item">Contact Us</Link>
          <Link to="/events" className="nav-item">Events and Announcements</Link>
        </div>
      </nav>

      {/* Content */}
      <div className="page-content" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="card fade-in-up">
          <h2 style={{ color: '#ffd700', marginBottom: '2rem', fontSize: '2rem', textAlign: 'center' }}>
            Admin Access
          </h2>
          
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.6', 
            color: '#e0e0e0', 
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Please login with your administrator credentials to access the content management system.
          </p>

          {error && (
            <div className="message error" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                placeholder="Enter your admin email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn" 
              disabled={loading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {loading ? <div className="loading-spinner"></div> : 'Login'}
            </button>
          </form>

          <div style={{ 
            textAlign: 'center', 
            marginTop: '2rem', 
            padding: '1rem',
            background: 'rgba(255, 215, 0, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 215, 0, 0.2)'
          }}>
            <h4 style={{ color: '#ffd700', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Default Admin Credentials
            </h4>
            <p style={{ color: '#e0e0e0', fontSize: '0.8rem', margin: 0 }}>
              Email: federico.celina@gmail.com<br />
              Password: testingsite
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" className="btn btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;