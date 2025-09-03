import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EventsAnnouncements = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await axios.get(`${API}/blog-posts`);
      setBlogPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="page-container">
      <div className="background-pattern"></div>
      
      {/* Header with Monday Knights Header Image */}
      <div className="monday-knights-header" style={{
        background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://customer-assets.emergentagent.com/job_b07a96d4-5313-4d4e-bfd4-4751b0b0c282/artifacts/x1t36jj6_Monday%20Knights%20Header.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className="monday-knights-logo fade-in-up">
          MONDAY KNIGHTS
        </div>
        <div className="monday-knights-subtitle fade-in-up">
          Events & Announcements
        </div>
      </div>

      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-container">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/about" className="nav-item">About Us</Link>
          <Link to="/contact" className="nav-item">Contact Us</Link>
          <Link to="/events" className="nav-item active">Events and Announcements</Link>
        </div>
      </nav>

      {/* Content */}
      <div className="page-content">
        <div className="card fade-in-up">
          <h2 style={{ color: '#ffd700', marginBottom: '1rem', fontSize: '2.5rem' }}>
            Latest Updates
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#e0e0e0', marginBottom: '2rem' }}>
            Stay informed about our latest events, announcements, and community updates. 
            Join us in our ongoing efforts to create positive change.
          </p>
        </div>

        {loading ? (
          <div className="card fade-in-up" style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '1rem', color: '#e0e0e0' }}>Loading posts...</p>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="card fade-in-up" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3 style={{ color: '#ff6b9d', marginBottom: '1rem' }}>No Posts Yet</h3>
            <p style={{ color: '#e0e0e0', marginBottom: '2rem' }}>
              We're working on exciting content for you. Check back soon for updates!
            </p>
            <Link to="/contact" className="btn">Get Notified</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {blogPosts.map((post) => (
              <div key={post.id} className="card fade-in-up" style={{ cursor: 'pointer' }}>
                {post.image_url && (
                  <div style={{ 
                    marginBottom: '1.5rem',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    height: '250px',
                    background: `url(${post.image_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}></div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ 
                    color: '#ffd700', 
                    marginBottom: '0.5rem',
                    fontSize: '1.5rem',
                    flex: 1
                  }}>
                    {post.title}
                  </h3>
                  <span style={{ 
                    color: '#ff6b9d', 
                    fontSize: '0.9rem',
                    background: 'rgba(255, 107, 157, 0.1)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 107, 157, 0.2)',
                    whiteSpace: 'nowrap',
                    marginLeft: '1rem'
                  }}>
                    {formatDate(post.created_at)}
                  </span>
                </div>
                
                <div style={{ 
                  color: '#e0e0e0', 
                  fontSize: '1rem', 
                  lineHeight: '1.6',
                  marginBottom: '1rem'
                }}>
                  {post.content.length > 300 ? (
                    <>
                      {post.content.substring(0, 300)}...
                      <button 
                        style={{ 
                          color: '#ffd700', 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          marginLeft: '0.5rem'
                        }}
                        onClick={() => setSelectedPost(post)}
                      >
                        Read More
                      </button>
                    </>
                  ) : (
                    post.content
                  )}
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>
                    By {post.author}
                  </span>
                  {post.content.length > 300 && (
                    <button 
                      className="btn btn-secondary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      onClick={() => setSelectedPost(post)}
                    >
                      Read Full Post
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="card fade-in-up" style={{ textAlign: 'center', marginTop: '3rem' }}>
          <h3 style={{ color: '#ff6b9d', marginBottom: '1rem' }}>Stay Connected</h3>
          <p style={{ color: '#e0e0e0', marginBottom: '2rem' }}>
            Don't miss out on important updates and upcoming events. 
            Get in touch with us to stay informed about all Monday Knights activities.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn">Contact Us</Link>
            <Link to="/about" className="btn btn-secondary">Learn More</Link>
          </div>
        </div>
      </div>

      {/* Full Post Modal */}
      {selectedPost && (
        <div className="overlay active">
          <div className="overlay-content" style={{ maxWidth: '800px' }}>
            <button 
              className="close-btn" 
              onClick={() => setSelectedPost(null)}
            >
              ×
            </button>
            
            {selectedPost.image_url && (
              <div style={{ 
                marginBottom: '2rem',
                borderRadius: '10px',
                overflow: 'hidden',
                height: '300px',
                background: `url(${selectedPost.image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
            )}
            
            <h2 style={{ color: '#ffd700', marginBottom: '1rem' }}>
              {selectedPost.title}
            </h2>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ color: '#ff6b9d' }}>
                By {selectedPost.author}
              </span>
              <span style={{ color: '#888' }}>
                {formatDate(selectedPost.created_at)}
              </span>
            </div>
            
            <div style={{ 
              color: '#e0e0e0', 
              fontSize: '1.1rem', 
              lineHeight: '1.8',
              whiteSpace: 'pre-line'
            }}>
              {selectedPost.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsAnnouncements;