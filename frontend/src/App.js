import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Main Website Component (preserving original design)
const MondayKnightsWebsite = () => {
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [aboutContent, setAboutContent] = useState("Monday Knights is a grassroots organization focused on developing intersectional power. Combining historic strategies with advancements in technology, we seek to reinvigorate and revolutionize community participation, harm reduction and mutual aid systems.\n\nThrough building communal spaces and fostering strong alliances across affinity groups, we aim to create sustainable social and political momentum.");
  const [userType, setUserType] = useState('');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [formData, setFormData] = useState({});
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAboutContent();
    fetchBlogPosts();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await axios.get(`${API}/about-us`);
      if (response.data.content) {
        setAboutContent(response.data.content);
      }
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

  const showOverlay = (overlayName) => {
    setActiveOverlay(overlayName);
  };

  const closeOverlay = () => {
    setActiveOverlay(null);
    setUserType('');
    setFormData({});
    setMessage('');
  };

  const showDynamicForm = (type) => {
    setUserType(type);
    setFormData({ privacyAgreed: true }); // Pre-check privacy agreement
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPhoneNumber = (value) => {
    let cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length >= 3) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }
    return cleaned;
  };

  const saveForm = async () => {
    setLoading(true);
    setMessage('');

    // Check if privacy policy is agreed
    if (!formData.privacyAgreed) {
      setMessage('Please agree to the privacy policy.');
      setLoading(false);
      return;
    }

    try {
      let submitData;
      let endpoint;

      if (userType === 'individual') {
        // Validate required fields
        if (!formData.name || !formData.email) {
          setMessage('Please fill in all mandatory fields.');
          setLoading(false);
          return;
        }

        submitData = {
          name: `${formData.name} ${formData.lastName || ''}`.trim(),
          email: formData.email,
          phone: formData.phone || '',
          message: formData.message || 'Contact form submission',
          privacy_agreed: formData.privacyAgreed
        };
        endpoint = 'contact/individual';
      } else if (userType === 'business') {
        // Validate required fields
        if (!formData.name || !formData.businessName || !formData.businessEmail) {
          setMessage('Please fill in all mandatory fields.');
          setLoading(false);
          return;
        }

        submitData = {
          company_name: formData.businessName,
          contact_person: `${formData.name} ${formData.lastName || ''}`.trim(),
          email: formData.businessEmail,
          phone: formData.businessPhone || '',
          message: formData.message || 'Business contact form submission',
          privacy_agreed: formData.privacyAgreed
        };
        endpoint = 'contact/business';
      }

      await axios.post(`${API}/${endpoint}`, submitData);
      setMessage('Form saved successfully!');
      setTimeout(() => {
        closeOverlay();
      }, 2000);
    } catch (error) {
      setMessage('Error saving form. Please try again.');
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
    <div className="app-container">
      {/* Original Background Image */}
      <img 
        id="backgroundImage" 
        src="https://i.postimg.cc/JnYv963V/background.jpg" 
        alt="Background" 
        style={{ display: 'block' }}
      />
      
      {/* Menu Container - preserving original positioning */}
      <div className="menu-container">
        <div className="menu-item" onClick={() => showOverlay('about')}>About Us</div>
        <div className="menu-item" onClick={() => showOverlay('contact')}>Contact Us</div>
        <div className="menu-item" onClick={() => showOverlay('events')}>Events and Announcements</div>
      </div>

      {/* About Us Overlay - preserving original content */}
      {activeOverlay === 'about' && (
        <div className="overlay" onClick={(e) => e.target.className === 'overlay' && closeOverlay()}>
          <div className="overlay-content">
            <button className="close-btn" onClick={closeOverlay}>&times;</button>
            <div className="about-text">
              {aboutContent}
            </div>
          </div>
        </div>
      )}

      {/* Contact Us Overlay - preserving original form structure */}
      {activeOverlay === 'contact' && (
        <div className="overlay" onClick={(e) => e.target.className === 'overlay' && closeOverlay()}>
          <div className="overlay-content">
            <button className="close-btn" onClick={closeOverlay}>&times;</button>
            
            {message && (
              <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}

            <form id="contactForm">
              <div className="form-group">
                <label className="form-label">Are you an individual or business?</label>
                <select 
                  className="form-select" 
                  value={userType} 
                  onChange={(e) => showDynamicForm(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="individual">Individual</option>
                  <option value="business">Business</option>
                </select>
              </div>
              
              {/* Dynamic Form */}
              {userType === 'individual' && (
                <div className="dynamic-form">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.name || ''} 
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.lastName || ''} 
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={formData.email || ''} 
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      placeholder="(xxx) xxx-xxxx" 
                      value={formData.phone || ''} 
                      onChange={(e) => handleInputChange('phone', formatPhoneNumber(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message (optional)</label>
                    <textarea 
                      className="form-input" 
                      rows="4"
                      value={formData.message || ''} 
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us how you'd like to get involved..."
                    />
                  </div>
                  
                  {/* Privacy Policy Checkbox */}
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="individual-privacy"
                      checked={formData.privacyAgreed !== undefined ? formData.privacyAgreed : true}
                      onChange={(e) => handleInputChange('privacyAgreed', e.target.checked)}
                    />
                    <label htmlFor="individual-privacy" className="checkbox-label">
                      By checking this box, you agree to receive communications and share your information with Monday Knights. 
                      Please review our <span className="privacy-link" onClick={() => setShowPrivacyPolicy(true)}>Privacy Policy</span> for details.
                    </label>
                  </div>
                </div>
              )}

              {userType === 'business' && (
                <div className="dynamic-form">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.name || ''} 
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.lastName || ''} 
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.businessName || ''} 
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Contact Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={formData.businessEmail || ''} 
                      onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Phone Number</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      placeholder="(xxx) xxx-xxxx" 
                      value={formData.businessPhone || ''} 
                      onChange={(e) => handleInputChange('businessPhone', formatPhoneNumber(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message (optional)</label>
                    <textarea 
                      className="form-input" 
                      rows="4"
                      value={formData.message || ''} 
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us about your business and how we can work together..."
                    />
                  </div>
                  
                  {/* Privacy Policy Checkbox */}
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="business-privacy"
                      checked={formData.privacyAgreed !== undefined ? formData.privacyAgreed : true}
                      onChange={(e) => handleInputChange('privacyAgreed', e.target.checked)}
                    />
                    <label htmlFor="business-privacy" className="checkbox-label">
                      By checking this box, you agree to receive communications and share your information with Monday Knights. 
                      Please review our <span className="privacy-link" onClick={() => setShowPrivacyPolicy(true)}>Privacy Policy</span> for details.
                    </label>
                  </div>
                </div>
              )}
              
              {userType && (
                <button 
                  type="button" 
                  className={`save-btn ${loading ? 'loading' : ''}`}
                  onClick={saveForm}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Events and Announcements Overlay */}
      {activeOverlay === 'events' && (
        <div className="overlay" onClick={(e) => e.target.className === 'overlay' && closeOverlay()}>
          <div className="overlay-content events-content">
            <button className="close-btn" onClick={closeOverlay}>&times;</button>
            
            {/* Monday Knights Header Image */}
            <div className="events-header">
              <img 
                src="https://customer-assets.emergentagent.com/job_b07a96d4-5313-4d4e-bfd4-4751b0b0c282/artifacts/x1t36jj6_Monday%20Knights%20Header.jpg" 
                alt="Monday Knights Header" 
                className="events-header-img"
              />
            </div>
            
            <div className="about-text">
              <h3 style={{ color: '#ca6ce6', marginBottom: '20px' }}>Events and Announcements</h3>
              
              {blogPosts.length === 0 ? (
                <p>No events or announcements yet. Check back soon for updates!</p>
              ) : (
                <div className="blog-posts">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="blog-post">
                      {post.image_url && (
                        <img src={post.image_url} alt={post.title} className="blog-post-image" />
                      )}
                      <h4 className="blog-post-title">{post.title}</h4>
                      <p className="blog-post-date">{formatDate(post.created_at)}</p>
                      <div className="blog-post-content">{post.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="overlay" onClick={(e) => e.target.className === 'overlay' && setShowPrivacyPolicy(false)}>
          <div className="overlay-content privacy-content">
            <button className="close-btn" onClick={() => setShowPrivacyPolicy(false)}>&times;</button>
            <div className="about-text">
              <h3 style={{ color: '#ca6ce6', marginBottom: '20px' }}>Privacy Policy</h3>
              <div style={{ whiteSpace: 'pre-line', fontSize: '14px', lineHeight: '1.6' }}>
                {`Monday Knights Privacy Policy
Effective Date: 09/01/2025

Monday Knights ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, store, and protect your information.

What Information We Collect
We may collect the following types of information:

Personal Information: such as your name, email address, mailing address, phone number, and other details you provide when you contact us, donate, register for events, or sign up for newsletters.

Non-Personal Information: including your browser type, device, IP address, and how you use our website.

How We Use Your Information
We use your information solely to:

Communicate with you regarding our programs, events, and updates.

Process donations and provide donation receipts.

Respond to your inquiries.

Improve our services and website functionality.

No Sale or Marketing Use
We will never sell, rent, or trade your personal information.
Your information will not be used for marketing purposes or shared with third parties for advertising. Monday Knights only uses your information to fulfill our non-profit mission and communicate with you as described above.

Cookies and Tracking
Our website may use cookies for analytics and essential functionality. You may disable cookies through your browser settings.

Information Sharing
We may share your details only:

With service providers who process donations and communications on our behalf, under strict confidentiality agreements.

If required by law or legal process.

Data Security
We safeguard your information through physical, administrative, and technical measures and restrict access to authorized personnel only.

Children's Privacy
We do not knowingly collect personal data from children under 13.

Your Choices
You may:

Opt out of non-essential communications at any time.

Request access, correction, or deletion of your information by contacting us at federico.celina@gmail.com.

Policy Updates
We may update this Privacy Policy from time to time. Any changes will be posted at this website with a new effective date.

Contact Us
If you have questions about this policy, please contact us at:
federico.celina@gmail.com

Monday Knights values your trust. Your privacy is protected and respected.`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Link (hidden) */}
      <div className="admin-link">
        <a href="/admin" style={{ color: 'transparent', fontSize: '1px' }}>Admin</a>
      </div>
    </div>
  );
};

// Admin Components
const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
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
    <div className="admin-container">
      <div className="admin-form">
        <h2>Admin Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p><a href="/">Back to Website</a></p>
      </div>
    </div>
  );
};

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [aboutContent, setAboutContent] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', image_url: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAboutContent();
    fetchBlogPosts();
  }, []);

  const getAuthHeaders = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
  });

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

  const updateAboutContent = async () => {
    setLoading(true);
    try {
      await axios.put(`${API}/about-us`, { content: aboutContent }, getAuthHeaders());
      setMessage('About Us content updated successfully!');
    } catch (error) {
      setMessage('Error updating About Us content.');
    } finally {
      setLoading(false);
    }
  };

  const createBlogPost = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/blog-posts`, newPost, getAuthHeaders());
      setNewPost({ title: '', content: '', image_url: '' });
      fetchBlogPosts();
      setMessage('Blog post created successfully!');
    } catch (error) {
      setMessage('Error creating blog post.');
    } finally {
      setLoading(false);
    }
  };

  const deleteBlogPost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await axios.delete(`${API}/blog-posts/${postId}`, getAuthHeaders());
      fetchBlogPosts();
      setMessage('Blog post deleted successfully!');
    } catch (error) {
      setMessage('Error deleting blog post.');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-dashboard">
        <div className="admin-header">
          <h2>Monday Knights Admin Dashboard</h2>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>

        <div className="admin-tabs">
          <button 
            className={activeTab === 'about' ? 'active' : ''} 
            onClick={() => setActiveTab('about')}
          >
            About Us
          </button>
          <button 
            className={activeTab === 'events' ? 'active' : ''} 
            onClick={() => setActiveTab('events')}
          >
            Events & Posts
          </button>
        </div>

        {message && <div className="admin-message">{message}</div>}

        {activeTab === 'about' && (
          <div className="tab-content">
            <h3>Update About Us Content</h3>
            <textarea
              value={aboutContent}
              onChange={(e) => setAboutContent(e.target.value)}
              rows="10"
              placeholder="Enter About Us content..."
            />
            <button onClick={updateAboutContent} disabled={loading}>
              {loading ? 'Updating...' : 'Update About Us'}
            </button>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="tab-content">
            <h3>Create New Post</h3>
            <input
              type="text"
              placeholder="Post Title"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={newPost.image_url}
              onChange={(e) => setNewPost({...newPost, image_url: e.target.value})}
            />
            <textarea
              placeholder="Post Content"
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              rows="6"
            />
            <button onClick={createBlogPost} disabled={loading}>
              {loading ? 'Creating...' : 'Create Post'}
            </button>

            <h3>Existing Posts</h3>
            <div className="blog-posts-admin">
              {blogPosts.map((post) => (
                <div key={post.id} className="blog-post-admin">
                  <h4>{post.title}</h4>
                  <p>{post.content.substring(0, 100)}...</p>
                  <button onClick={() => deleteBlogPost(post.id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setIsAdminLoggedIn(true);
    }

    // Simple routing
    const path = window.location.pathname;
    setCurrentPath(path);
  }, []);

  const handleAdminLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAdminLoggedIn(true);
    setCurrentPath('/admin/dashboard');
    window.history.pushState({}, '', '/admin/dashboard');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
    setCurrentPath('/');
    window.history.pushState({}, '', '/');
  };

  // Simple routing without React Router to preserve original structure
  if (currentPath === '/admin' || currentPath === '/admin/login') {
    if (isAdminLoggedIn) {
      return <AdminDashboard onLogout={handleAdminLogout} />;
    } else {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }
  }

  if (currentPath === '/admin/dashboard') {
    if (isAdminLoggedIn) {
      return <AdminDashboard onLogout={handleAdminLogout} />;
    } else {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }
  }

  return <MondayKnightsWebsite />;
}

export default App;