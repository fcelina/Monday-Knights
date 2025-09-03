import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactUs = () => {
  const [contactType, setContactType] = useState('individual');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  
  const [individualForm, setIndividualForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    privacyAgreed: true
  });

  const [businessForm, setBusinessForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    message: '',
    privacyAgreed: true
  });

  const handleIndividualSubmit = async (e) => {
    e.preventDefault();
    if (!individualForm.privacyAgreed) {
      setMessage({ type: 'error', content: 'Please agree to the privacy policy.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      await axios.post(`${API}/contact/individual`, {
        name: individualForm.name,
        email: individualForm.email,
        phone: individualForm.phone,
        message: individualForm.message,
        privacy_agreed: individualForm.privacyAgreed
      });

      setMessage({ type: 'success', content: 'Thank you for your message! We\'ll get back to you soon.' });
      setIndividualForm({
        name: '',
        email: '',
        phone: '',
        message: '',
        privacyAgreed: true
      });
    } catch (error) {
      setMessage({ type: 'error', content: 'Error sending message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    if (!businessForm.privacyAgreed) {
      setMessage({ type: 'error', content: 'Please agree to the privacy policy.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      await axios.post(`${API}/contact/business`, {
        company_name: businessForm.companyName,
        contact_person: businessForm.contactPerson,
        email: businessForm.email,
        phone: businessForm.phone,
        message: businessForm.message,
        privacy_agreed: businessForm.privacyAgreed
      });

      setMessage({ type: 'success', content: 'Thank you for your message! We\'ll get back to you soon.' });
      setBusinessForm({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        message: '',
        privacyAgreed: true
      });
    } catch (error) {
      setMessage({ type: 'error', content: 'Error sending message. Please try again.' });
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
          Get in Touch
        </div>
      </div>

      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-container">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/about" className="nav-item">About Us</Link>
          <Link to="/contact" className="nav-item active">Contact Us</Link>
          <Link to="/events" className="nav-item">Events and Announcements</Link>
        </div>
      </nav>

      {/* Content */}
      <div className="page-content">
        <div className="card fade-in-up">
          <h2 style={{ color: '#ffd700', marginBottom: '2rem', fontSize: '2.5rem' }}>
            Contact Monday Knights
          </h2>
          
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#e0e0e0', marginBottom: '2rem' }}>
            We'd love to hear from you! Whether you're an individual looking to get involved or 
            a business interested in partnership opportunities, reach out to us using the form below.
          </p>

          {/* Contact Type Selector */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button
                type="button"
                className={`btn ${contactType === 'individual' ? '' : 'btn-secondary'}`}
                onClick={() => setContactType('individual')}
              >
                Individual
              </button>
              <button
                type="button"
                className={`btn ${contactType === 'business' ? '' : 'btn-secondary'}`}
                onClick={() => setContactType('business')}
              >
                Business
              </button>
            </div>
          </div>

          {/* Message Display */}
          {message.content && (
            <div className={`message ${message.type}`}>
              {message.content}
            </div>
          )}

          {/* Individual Contact Form */}
          {contactType === 'individual' && (
            <form onSubmit={handleIndividualSubmit} className="form-container">
              <h3 style={{ color: '#ff6b9d', marginBottom: '1.5rem' }}>Individual Contact</h3>
              
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={individualForm.name}
                  onChange={(e) => setIndividualForm({...individualForm, name: e.target.value})}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-input"
                  value={individualForm.email}
                  onChange={(e) => setIndividualForm({...individualForm, email: e.target.value})}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={individualForm.phone}
                  onChange={(e) => setIndividualForm({...individualForm, phone: e.target.value})}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  className="form-textarea"
                  value={individualForm.message}
                  onChange={(e) => setIndividualForm({...individualForm, message: e.target.value})}
                  placeholder="Tell us how you'd like to get involved or ask any questions..."
                  required
                />
              </div>

              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="individual-privacy"
                  className="checkbox-input"
                  checked={individualForm.privacyAgreed}
                  onChange={(e) => setIndividualForm({...individualForm, privacyAgreed: e.target.checked})}
                />
                <label htmlFor="individual-privacy" className="checkbox-label">
                  By checking this box, you agree to receive communications and share your information with Monday Knights. 
                  Please review our <span 
                    className="privacy-link" 
                    onClick={() => setShowPrivacyPolicy(true)}
                  >
                    Privacy Policy
                  </span> for details.
                </label>
              </div>

              <button 
                type="submit" 
                className="btn" 
                disabled={loading || !individualForm.privacyAgreed}
                style={{ marginTop: '1rem' }}
              >
                {loading ? <div className="loading-spinner"></div> : 'Send Message'}
              </button>
            </form>
          )}

          {/* Business Contact Form */}
          {contactType === 'business' && (
            <form onSubmit={handleBusinessSubmit} className="form-container">
              <h3 style={{ color: '#ff6b9d', marginBottom: '1.5rem' }}>Business Contact</h3>
              
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={businessForm.companyName}
                  onChange={(e) => setBusinessForm({...businessForm, companyName: e.target.value})}
                  placeholder="Enter your company name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Person *</label>
                <input
                  type="text"
                  className="form-input"
                  value={businessForm.contactPerson}
                  onChange={(e) => setBusinessForm({...businessForm, contactPerson: e.target.value})}
                  placeholder="Enter contact person's name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-input"
                  value={businessForm.email}
                  onChange={(e) => setBusinessForm({...businessForm, email: e.target.value})}
                  placeholder="Enter business email address"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={businessForm.phone}
                  onChange={(e) => setBusinessForm({...businessForm, phone: e.target.value})}
                  placeholder="Enter business phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  className="form-textarea"
                  value={businessForm.message}
                  onChange={(e) => setBusinessForm({...businessForm, message: e.target.value})}
                  placeholder="Tell us about your business and how we can work together..."
                  required
                />
              </div>

              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="business-privacy"
                  className="checkbox-input"
                  checked={businessForm.privacyAgreed}
                  onChange={(e) => setBusinessForm({...businessForm, privacyAgreed: e.target.checked})}
                />
                <label htmlFor="business-privacy" className="checkbox-label">
                  By checking this box, you agree to receive communications and share your information with Monday Knights. 
                  Please review our <span 
                    className="privacy-link" 
                    onClick={() => setShowPrivacyPolicy(true)}
                  >
                    Privacy Policy
                  </span> for details.
                </label>
              </div>

              <button 
                type="submit" 
                className="btn" 
                disabled={loading || !businessForm.privacyAgreed}
                style={{ marginTop: '1rem' }}
              >
                {loading ? <div className="loading-spinner"></div> : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Privacy Policy Overlay */}
      {showPrivacyPolicy && (
        <div className="overlay active">
          <div className="overlay-content">
            <button 
              className="close-btn" 
              onClick={() => setShowPrivacyPolicy(false)}
            >
              ×
            </button>
            <h2 style={{ color: '#ffd700', marginBottom: '2rem' }}>Privacy Policy</h2>
            <div style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6', 
              color: '#e0e0e0',
              whiteSpace: 'pre-line',
              maxHeight: '60vh',
              overflowY: 'auto'
            }}>
              Monday Knights Privacy Policy
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

              Monday Knights values your trust. Your privacy is protected and respected.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;