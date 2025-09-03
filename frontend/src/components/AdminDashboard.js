import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  // About Us state
  const [aboutContent, setAboutContent] = useState('');
  const [aboutLoading, setAboutLoading] = useState(false);

  // Blog post state
  const [blogPosts, setBlogPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    image_url: ''
  });
  const [editingPost, setEditingPost] = useState(null);

  // Contact form submissions
  const [individualContacts, setIndividualContacts] = useState([]);
  const [businessContacts, setBusinessContacts] = useState([]);

  // Admin credentials update
  const [credentialsUpdate, setCredentialsUpdate] = useState({
    email: '',
    current_password: '',
    new_password: ''
  });

  useEffect(() => {
    fetchAboutContent();
    fetchBlogPosts();
    fetchContacts();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  const fetchAboutContent = async () => {
    try {
      const response = await axios.get(`${API}/about-us`);
      setAboutContent(response.data.content);
    } catch (error) {
      console.error('Error fetching about content:', error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const response = await axios.get(`${API}/blog-posts`);
      setBlogPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const fetchContacts = async () => {
    try {
      const [individualResponse, businessResponse] = await Promise.all([
        axios.get(`${API}/contact/individual`, getAuthHeaders()),
        axios.get(`${API}/contact/business`, getAuthHeaders())
      ]);
      setIndividualContacts(individualResponse.data);
      setBusinessContacts(businessResponse.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleAboutUpdate = async (e) => {
    e.preventDefault();
    setAboutLoading(true);
    setMessage({ type: '', content: '' });

    try {
      await axios.put(`${API}/about-us`, { content: aboutContent }, getAuthHeaders());
      setMessage({ type: 'success', content: 'About Us content updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', content: 'Error updating About Us content.' });
    } finally {
      setAboutLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const response = await axios.post(`${API}/blog-posts`, newPost, getAuthHeaders());
      setBlogPosts([response.data, ...blogPosts]);
      setNewPost({ title: '', content: '', image_url: '' });
      setMessage({ type: 'success', content: 'Blog post created successfully!' });
    } catch (error) {
      setMessage({ type: 'error', content: 'Error creating blog post.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const response = await axios.put(
        `${API}/blog-posts/${editingPost.id}`, 
        editingPost, 
        getAuthHeaders()
      );
      setBlogPosts(blogPosts.map(post => post.id === editingPost.id ? response.data : post));
      setEditingPost(null);
      setMessage({ type: 'success', content: 'Blog post updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', content: 'Error updating blog post.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`${API}/blog-posts/${postId}`, getAuthHeaders());
      setBlogPosts(blogPosts.filter(post => post.id !== postId));
      setMessage({ type: 'success', content: 'Blog post deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', content: 'Error deleting blog post.' });
    }
  };

  const handleCredentialsUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      await axios.post(`${API}/admin/update`, credentialsUpdate, getAuthHeaders());
      setCredentialsUpdate({ email: '', current_password: '', new_password: '' });
      setMessage({ type: 'success', content: 'Admin credentials updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', content: error.response?.data?.detail || 'Error updating credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          Admin Dashboard
        </div>
      </div>

      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-container">
          <Link to="/" className="nav-item">Home</Link>
          <button onClick={onLogout} className="nav-item" style={{ background: 'none', border: 'none' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Tabs */}
      <div className="page-content">
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            className={`btn ${activeTab === 'about' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('about')}
          >
            About Us Content
          </button>
          <button
            className={`btn ${activeTab === 'blog' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('blog')}
          >
            Blog Posts
          </button>
          <button
            className={`btn ${activeTab === 'contacts' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('contacts')}
          >
            Contact Submissions
          </button>
          <button
            className={`btn ${activeTab === 'settings' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('settings')}
          >
            Admin Settings
          </button>
        </div>

        {/* Message Display */}
        {message.content && (
          <div className={`message ${message.type}`} style={{ marginBottom: '2rem' }}>
            {message.content}
          </div>
        )}

        {/* About Us Content Tab */}
        {activeTab === 'about' && (
          <div className="card fade-in-up">
            <h3 style={{ color: '#ffd700', marginBottom: '1.5rem' }}>Update About Us Content</h3>
            <form onSubmit={handleAboutUpdate}>
              <div className="form-group">
                <label className="form-label">About Us Content</label>
                <textarea
                  className="form-textarea"
                  value={aboutContent}
                  onChange={(e) => setAboutContent(e.target.value)}
                  placeholder="Enter the About Us content..."
                  rows={10}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn" 
                disabled={aboutLoading}
              >
                {aboutLoading ? <div className="loading-spinner"></div> : 'Update About Us'}
              </button>
            </form>
          </div>
        )}

        {/* Blog Posts Tab */}
        {activeTab === 'blog' && (
          <>
            {/* Create New Post */}
            <div className="card fade-in-up">
              <h3 style={{ color: '#ffd700', marginBottom: '1.5rem' }}>
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h3>
              <form onSubmit={editingPost ? handleUpdatePost : handleCreatePost}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingPost ? editingPost.title : newPost.title}
                    onChange={(e) => editingPost ? 
                      setEditingPost({...editingPost, title: e.target.value}) :
                      setNewPost({...newPost, title: e.target.value})
                    }
                    placeholder="Enter post title..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL (optional)</label>
                  <input
                    type="url"
                    className="form-input"
                    value={editingPost ? editingPost.image_url : newPost.image_url}
                    onChange={(e) => editingPost ? 
                      setEditingPost({...editingPost, image_url: e.target.value}) :
                      setNewPost({...newPost, image_url: e.target.value})
                    }
                    placeholder="Enter image URL..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-textarea"
                    value={editingPost ? editingPost.content : newPost.content}
                    onChange={(e) => editingPost ? 
                      setEditingPost({...editingPost, content: e.target.value}) :
                      setNewPost({...newPost, content: e.target.value})
                    }
                    placeholder="Enter post content..."
                    rows={8}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    type="submit" 
                    className="btn" 
                    disabled={loading}
                  >
                    {loading ? <div className="loading-spinner"></div> : 
                     (editingPost ? 'Update Post' : 'Create Post')}
                  </button>
                  {editingPost && (
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setEditingPost(null)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Existing Posts */}
            <div className="card fade-in-up">
              <h3 style={{ color: '#ff6b9d', marginBottom: '1.5rem' }}>Existing Blog Posts</h3>
              {blogPosts.length === 0 ? (
                <p style={{ color: '#e0e0e0', textAlign: 'center', padding: '2rem' }}>
                  No blog posts yet. Create your first post above.
                </p>
              ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {blogPosts.map((post) => (
                    <div key={post.id} style={{
                      padding: '1.5rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <h4 style={{ color: '#ffd700', margin: 0, flex: 1 }}>{post.title}</h4>
                        <span style={{ color: '#888', fontSize: '0.8rem', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                      {post.image_url && (
                        <div style={{ 
                          height: '150px', 
                          backgroundImage: `url(${post.image_url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          borderRadius: '5px',
                          marginBottom: '1rem'
                        }}></div>
                      )}
                      <p style={{ color: '#e0e0e0', marginBottom: '1rem' }}>
                        {post.content.substring(0, 200)}...
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-secondary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                          onClick={() => setEditingPost(post)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn"
                          style={{ 
                            padding: '0.5rem 1rem', 
                            fontSize: '0.9rem',
                            background: 'linear-gradient(45deg, #ff4444, #ff6666)',
                            color: 'white'
                          }}
                          onClick={() => handleDeletePost(post.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Contact Submissions Tab */}
        {activeTab === 'contacts' && (
          <>
            {/* Individual Contacts */}
            <div className="card fade-in-up">
              <h3 style={{ color: '#ffd700', marginBottom: '1.5rem' }}>
                Individual Contact Submissions ({individualContacts.length})
              </h3>
              {individualContacts.length === 0 ? (
                <p style={{ color: '#e0e0e0', textAlign: 'center', padding: '2rem' }}>
                  No individual contact submissions yet.
                </p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {individualContacts.map((contact) => (
                    <div key={contact.id} style={{
                      padding: '1rem',
                      background: 'rgba(255, 107, 157, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 107, 157, 0.2)'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <strong style={{ color: '#ffd700' }}>Name:</strong> {contact.name}
                        </div>
                        <div>
                          <strong style={{ color: '#ffd700' }}>Email:</strong> {contact.email}
                        </div>
                        <div>
                          <strong style={{ color: '#ffd700' }}>Phone:</strong> {contact.phone}
                        </div>
                        <div>
                          <strong style={{ color: '#ffd700' }}>Date:</strong> {formatDate(contact.created_at)}
                        </div>
                      </div>
                      <div>
                        <strong style={{ color: '#ffd700' }}>Message:</strong>
                        <p style={{ color: '#e0e0e0', marginTop: '0.5rem', margin: 0 }}>{contact.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Business Contacts */}
            <div className="card fade-in-up">
              <h3 style={{ color: '#ff6b9d', marginBottom: '1.5rem' }}>
                Business Contact Submissions ({businessContacts.length})
              </h3>
              {businessContacts.length === 0 ? (
                <p style={{ color: '#e0e0e0', textAlign: 'center', padding: '2rem' }}>
                  No business contact submissions yet.
                </p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {businessContacts.map((contact) => (
                    <div key={contact.id} style={{
                      padding: '1rem',
                      background: 'rgba(255, 215, 0, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 215, 0, 0.2)'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <strong style={{ color: '#ffd700' }}>Company:</strong> {contact.company_name}
                        </div>
                        <div>
                          <strong style={{ color: '#ffd700' }}>Contact:</strong> {contact.contact_person}
                        </div>
                        <div>
                          <strong style={{ color: '#ffd700' }}>Email:</strong> {contact.email}
                        </div>
                        <div>
                          <strong style={{ color: '#ffd700' }}>Phone:</strong> {contact.phone}
                        </div>
                        <div>
                          <strong style={{ color: '#ffd700' }}>Date:</strong> {formatDate(contact.created_at)}
                        </div>
                      </div>
                      <div>
                        <strong style={{ color: '#ffd700' }}>Message:</strong>
                        <p style={{ color: '#e0e0e0', marginTop: '0.5rem', margin: 0 }}>{contact.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Admin Settings Tab */}
        {activeTab === 'settings' && (
          <div className="card fade-in-up">
            <h3 style={{ color: '#ffd700', marginBottom: '1.5rem' }}>Update Admin Credentials</h3>
            <p style={{ color: '#e0e0e0', marginBottom: '2rem' }}>
              Update your email address and/or password. You must provide your current password to make changes.
            </p>
            <form onSubmit={handleCredentialsUpdate}>
              <div className="form-group">
                <label className="form-label">New Email (optional)</label>
                <input
                  type="email"
                  className="form-input"
                  value={credentialsUpdate.email}
                  onChange={(e) => setCredentialsUpdate({...credentialsUpdate, email: e.target.value})}
                  placeholder="Enter new email (leave blank to keep current)"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Current Password *</label>
                <input
                  type="password"
                  className="form-input"
                  value={credentialsUpdate.current_password}
                  onChange={(e) => setCredentialsUpdate({...credentialsUpdate, current_password: e.target.value})}
                  placeholder="Enter your current password"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password (optional)</label>
                <input
                  type="password"
                  className="form-input"
                  value={credentialsUpdate.new_password}
                  onChange={(e) => setCredentialsUpdate({...credentialsUpdate, new_password: e.target.value})}
                  placeholder="Enter new password (leave blank to keep current)"
                />
              </div>
              <button 
                type="submit" 
                className="btn" 
                disabled={loading || !credentialsUpdate.current_password}
              >
                {loading ? <div className="loading-spinner"></div> : 'Update Credentials'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;