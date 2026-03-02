# Monday Knights Website Documentation

## Overview
This is the Monday Knights activist community website, converted from the original HTML design into a full-stack React application while preserving the exact original design aesthetic. The website features blog-style content management, contact forms with Instagram integration, and comprehensive admin functionality.

**Live Website:** https://knights-deploy.preview.emergentagent.com *(Note: Rename to monday-knights recommended)*
**Admin Panel:** https://knights-deploy.preview.emergentagent.com/admin

## 🏗️ Project Structure

```
/app/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── App.js     # Main website content & layout (HTML equivalent)
│   │   ├── App.css    # All website styling (CSS equivalent)
│   │   └── index.js   # Entry point (don't edit)
│   ├── package.json   # Frontend dependencies
│   └── .env          # Frontend environment variables
├── backend/           # FastAPI backend server
│   ├── server.py     # API endpoints & database logic
│   ├── requirements.txt # Backend dependencies
│   └── .env          # Backend environment variables
└── README.md         # This documentation file
```

## 📁 Main Files for Editing

### 1. `/app/frontend/src/App.js` - Website Content & Structure
**This is your main "HTML" file equivalent**

**What it contains:**
- All website content and layout structure
- Menu items and navigation (About Us, Contact Us, Events and Announcements)
- Contact Us sub-menu with "Subscribe to Email List" and "Follow Us" options
- Instagram integration with logo and link
- Form fields and validation
- Pop-up overlays and modals
- Admin login and dashboard interface
- JavaScript functionality and interactions

**Common edits you can make:**
- Change menu item text (lines ~160-165)
- Modify contact sub-menu options (lines ~180-280)
- Update Instagram link (currently: https://www.instagram.com/monday_knights_nyc/)
- Change background image URL (line ~154)
- Modify contact form fields and labels

**Key sections:**
```javascript
// Menu Items (around line 160)
<div className="menu-item" onClick={() => showOverlay('about')}>About Us</div>
<div className="menu-item" onClick={() => showOverlay('contact')}>Contact Us</div>
<div className="menu-item" onClick={() => showOverlay('events')}>Events and Announcements</div>

// Background Image (around line 154)
<img 
  id="backgroundImage" 
  src="https://customer-assets.emergentagent.com/job_event-portal-8/artifacts/a8xh0uxg_New%20Background.png" 
  alt="Background" 
/>

// Contact Sub-Menu Structure (around lines 180-280)
// "Subscribe to Email List" -> Individual/Business forms
// "Follow Us" -> Instagram logo and link
```

### 2. `/app/frontend/src/App.css` - Website Styling & Design
**This is your main CSS file**

**What it controls:**
- Colors, fonts, and visual styling
- Menu positioning and hover effects
- Background image sizing and positioning
- Form styling and button appearances
- Contact sub-menu styling
- Instagram logo styling
- Responsive design for mobile devices
- Pop-up overlay styling
- Admin panel styling

**Key style classes:**
```css
/* Menu positioning and styling */
.menu-container { margin-top: 50vh; margin-left: 10vw; }
.menu-item { font-family: 'Creepster', cursive; color: white; }
.menu-item:hover { color: #ca6ce6; }

/* Background image positioning */
#backgroundImage { 
    position: fixed; 
    top: 50%; 
    left: 50%; 
    width: auto;
    height: 100vh;
    max-width: 100vw;
    object-fit: cover;
}

/* Color scheme */
/* Purple accent: #ca6ce6 */
/* Gold accent: #ffd700 */
/* Hover purple: #b555d1 */

/* Contact menu styling */
.contact-menu-item { transition: transform 0.3s ease; }
.contact-menu-item:hover { box-shadow: 0 10px 25px rgba(202, 108, 230, 0.3); }

/* Form styling */
.form-input, .form-select { background: white; color: black; }
.save-btn { background: #ca6ce6; }

/* Mobile responsive */
@media (max-width: 768px) { /* Mobile styles */ }
```

**Common edits:**
- Change colors by replacing `#ca6ce6` (purple) with your preferred color
- Modify fonts by changing `'Creepster', cursive` or `Arial, sans-serif`
- Adjust menu positioning by editing `.menu-container` margins
- Change button styles in `.save-btn` and related classes
- Update background image sizing in `#backgroundImage`

### 3. `/app/backend/server.py` - Database & API Logic
**This handles all backend functionality**

**What it contains:**
- Admin login credentials (lines ~37-38)
- Database models and structure
- API endpoints for contact forms, blog posts, and admin functions
- About Us content management
- Contact form submission handling
- Email notification system

**Key sections:**
```python
# Admin Credentials (lines 37-38)
ADMIN_EMAIL = "MondayKnightsNYC@proton.me"
ADMIN_PASSWORD = "Kn1ghtMark3t!!"

# Default About Us Content (lines ~180-185)
default_content = {
    "content": "Action Aid Community\n\nMonday Knights is an affinity group based on..."
}

# API Endpoints
@api_router.post("/contact/individual")  # Individual contact form
@api_router.post("/contact/business")    # Business contact form
@api_router.get("/blog-posts")          # Get blog posts
@api_router.post("/blog-posts")         # Create blog posts
```

**Common edits:**
- Change admin login credentials (lines 37-38)
- Modify default About Us content
- Add new form fields to contact forms
- Customize email notification settings
- Update notification email address

### 4. Configuration Files

#### `/app/frontend/.env` - Frontend Environment
```
REACT_APP_BACKEND_URL=https://knights-deploy.preview.emergentagent.com
WDS_SOCKET_PORT=443
```
**⚠️ DO NOT MODIFY** - These are configured for your hosting environment

#### `/app/backend/.env` - Backend Environment  
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
SENDGRID_API_KEY=""
ADMIN_EMAIL="MondayKnightsNYC@proton.me"
```
**⚠️ DO NOT MODIFY** - These are configured for your database (except SENDGRID_API_KEY)

## 🎨 How to Make Common Changes

### Change Admin Login Credentials
**File:** `/app/backend/server.py` (lines 37-38)
```python
ADMIN_EMAIL = "your-new-email@example.com"
ADMIN_PASSWORD = "your-new-password"
```

### Change Background Image
**File:** `/app/frontend/src/App.js` (around line 154)
```javascript
src="https://your-new-image-url.com/image.jpg"
```

### Update Instagram Link
**File:** `/app/frontend/src/App.js` (search for "instagram.com")
```javascript
href="https://www.instagram.com/your_new_handle/"
```

### Change Colors
**File:** `/app/frontend/src/App.css`
1. Find all instances of `#ca6ce6` (current purple)
2. Replace with your preferred color
3. Also update `#b555d1` (hover purple) to a darker shade of your color

### Change Menu Items
**File:** `/app/frontend/src/App.js` (around line 160)
```javascript
<div className="menu-item" onClick={() => showOverlay('about')}>Your New Text</div>
```

### Modify Contact Sub-Menu
**File:** `/app/frontend/src/App.js` (lines ~200-250)
- Update "Subscribe to Email List" text
- Update "Follow Us" text
- Modify social media integrations

### Add/Remove Contact Form Fields
**File:** `/app/frontend/src/App.js` (lines ~300-500)
1. Find the individual or business form section
2. Add new form fields following the existing pattern:
```javascript
<div className="form-group">
  <label className="form-label">New Field Label</label>
  <input 
    type="text" 
    className="form-input" 
    value={formData.newField || ''} 
    onChange={(e) => handleInputChange('newField', e.target.value)}
  />
</div>
```

## 🔧 Content Management

### Static Content (Requires Code Changes)
- Menu text and navigation
- Contact sub-menu options
- Instagram links and social media
- Form labels and field names
- Button text and messages
- Error messages and validation text
- **Edit in:** `/app/frontend/src/App.js`

### Dynamic Content (Managed via Admin Panel)
- About Us text content
- Blog posts and events
- **Manage at:** https://knights-deploy.preview.emergentagent.com/admin

## 📱 Database Collections

The website automatically creates and manages these database collections:

1. **about_us** - Stores About Us content versions
2. **blog_posts** - Stores Events & Announcements posts
3. **individual_contacts** - Stores individual contact form submissions
4. **business_contacts** - Stores business contact form submissions

## 🚀 Making Changes Live

1. **Edit the appropriate file** (App.js for content, App.css for styling)
2. **Save the file** - Changes appear automatically (hot reload enabled)
3. **For backend changes** - The server restarts automatically
4. **For GitHub sync** - May require manual redeployment (see troubleshooting below)

## 🔐 Admin Panel Features

**Access:** https://knights-deploy.preview.emergentagent.com/admin
**Login:** MondayKnightsNYC@proton.me / Kn1ghtMark3t!!

**Admin Capabilities:**
- ✅ Update About Us content
- ✅ Create new blog posts/events with images
- ✅ Edit existing blog posts (title, content, images)
- ✅ Delete blog posts
- ✅ View all contact form submissions (Individual and Business)
- ✅ View contact details with clickable email addresses
- ✅ Change admin login credentials

## 📞 Contact System Features

### Contact Us Sub-Menu Structure:
1. **Subscribe to Email List**
   - Leads to Individual/Business contact forms
   - Includes privacy policy agreement
   - Stores submissions in database
   - Sends email notifications (if SendGrid configured)

2. **Follow Us**
   - Instagram logo with branding colors
   - Links to: https://www.instagram.com/monday_knights_nyc/
   - Mobile-friendly (opens app on mobile, new tab on desktop)
   - Shows @monday_knights_nyc handle

### Email Notifications:
- **Individual Contact:** "New Individual Contact Entry - Monday Knights"
- **Business Contact:** "New Business Contact Entry - Monday Knights"
- **Includes:** Full contact details and link to admin panel
- **Requires:** SendGrid API key configuration

## 🔧 GitHub Sync & Deployment

### Current Known Issue:
Changes made in GitHub may not automatically reflect in the deployed preview site. This requires manual intervention.

### Troubleshooting GitHub Sync:
1. **Check Auto-Deploy Settings:** Look for continuous deployment options in Emergent dashboard
2. **Manual Redeploy:** Use "Redeploy" or "Sync" buttons if available
3. **Branch Verification:** Ensure the correct GitHub branch is connected
4. **Environment Variables:** Admin credentials and settings may need manual updating

### For Future Deployments:
- Consider creating new deployment named "monday-knights"
- Ensure GitHub integration is properly configured
- Test admin credentials after each deployment

## 📊 Current Website Features

### ✅ **Working Features:**
- **Updated Background:** Monday Knights artistic design
- **Contact Sub-Menu:** Subscribe to Email List + Follow Us options
- **Instagram Integration:** Logo, link, mobile app support
- **About Us Content:** "Action Aid Community" text
- **Events System:** Blog posts with proper image sizing
- **Admin Panel:** Full content management system
- **Database Storage:** All form submissions tracked
- **Mobile Responsive:** Works on all devices
- **Email Notifications:** Ready (needs SendGrid API key)

### ⚙️ **Optional Setup:**
- **SendGrid Email:** For automatic notifications
- **Custom Domain:** For production deployment
- **GitHub Auto-Sync:** For seamless updates

## 📞 Support

For technical issues or questions about modifying the website:
1. Check this README for common changes
2. All main editable content is in `/app/frontend/src/App.js`
3. All styling is in `/app/frontend/src/App.css`
4. Backend functionality is in `/app/backend/server.py`
5. For deployment issues: Contact Emergent Support on Discord

## 🎯 Original Design Preserved

This React application maintains 100% of your original HTML design aesthetic:
- ✅ Black background with updated Monday Knights artistic image
- ✅ Creepster font and purple (#ca6ce6) + gold (#ffd700) color scheme  
- ✅ Menu positioning (lower right area)
- ✅ Original responsive design behavior
- ✅ Pop-up overlay styling and interactions
- ✅ Enhanced with modern functionality while preserving visual identity
