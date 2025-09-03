import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="page-container">
      <div className="background-pattern"></div>
      
      {/* Header */}
      <div className="monday-knights-header">
        <div className="monday-knights-logo fade-in-up">
          MONDAY KNIGHTS
        </div>
        <div className="monday-knights-subtitle fade-in-up">
          Privacy Policy
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
      <div className="page-content">
        <div className="card fade-in-up">
          <h2 style={{ color: '#ffd700', marginBottom: '2rem', fontSize: '2.5rem' }}>
            Privacy Policy
          </h2>
          
          <div style={{ 
            fontSize: '1rem', 
            lineHeight: '1.8', 
            color: '#e0e0e0',
            whiteSpace: 'pre-line'
          }}>
            Monday Knights Privacy Policy
            Effective Date: 09/01/2025

            Monday Knights ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, store, and protect your information.

            <h3 style={{ color: '#ff6b9d', marginTop: '2rem', marginBottom: '1rem' }}>What Information We Collect</h3>
            We may collect the following types of information:

            Personal Information: such as your name, email address, mailing address, phone number, and other details you provide when you contact us, donate, register for events, or sign up for newsletters.

            Non-Personal Information: including your browser type, device, IP address, and how you use our website.

            <h3 style={{ color: '#ff6b9d', marginTop: '2rem', marginBottom: '1rem' }}>How We Use Your Information</h3>
            We use your information solely to:

            • Communicate with you regarding our programs, events, and updates.
            • Process donations and provide donation receipts.
            • Respond to your inquiries.
            • Improve our services and website functionality.

            <h3 style={{ color: '#ff6b9d', marginTop: '2rem', marginBottom: '1rem' }}>No Sale or Marketing Use</h3>
            We will never sell, rent, or trade your personal information.
            Your information will not be used for marketing purposes or shared with third parties for advertising. Monday Knights only uses your information to fulfill our non-profit mission and communicate with you as described above.

            <h3 style={{ color: '#ff6b9d', marginTop: '2rem', marginBottom: '1rem' }}>Cookies and Tracking</h3>
            Our website may use cookies for analytics and essential functionality. You may disable cookies through your browser settings.

            <h3 style={{ color: '#ff6b9d', marginTop: '2rem', marginBottom: '1rem' }}>Information Sharing</h3>
            We may share your details only:

            • With service providers who process donations and communications on our behalf, under strict confidentiality agreements.
            • If required by law or legal process.

            <h3 style={{ color: '#ff6b9d', marginTop: '2rem', marginBottom: '1rem' }}>Data Security</h3>
            We safeguard your information through physical, administrative, and technical measures and restrict access to authorized personnel only.

            <h3 style={{ color: '#ff6b9d', marginTop: '2rem', marginBottom: '1rem' }}>Children's Privacy</h3>
            We do not knowingly collect personal data from children under 13.

            <h3 style={{ color: '#ff6b9d', marginTop: '2rem', marginBottom: '1rem' }}>Your Choices</h3>
            You may:

            • Opt out of non-essential communications at any time.
            • Request access, correction, or deletion of your information by contacting us at federico.celina@gmail.com.

            <h3 style={{ color: '#ff6b9d', marginTop: '2rem', marginBottom: '1rem' }}>Policy Updates</h3>
            We may update this Privacy Policy from time to time. Any changes will be posted at this website with a new effective date.

            <h3 style={{ color: '#ff6b9d', marginTop: '2rem', marginBottom: '1rem' }}>Contact Us</h3>
            If you have questions about this policy, please contact us at:
            federico.celina@gmail.com

            Monday Knights values your trust. Your privacy is protected and respected.
          </div>
        </div>

        <div className="card fade-in-up" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h3 style={{ color: '#ffd700', marginBottom: '1rem' }}>Questions About Our Privacy Policy?</h3>
          <p style={{ color: '#e0e0e0', marginBottom: '2rem' }}>
            If you have any questions or concerns about how we handle your data, 
            please don't hesitate to reach out to us.
          </p>
          <Link to="/contact" className="btn">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;