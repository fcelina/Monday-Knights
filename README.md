# Monday Knights Website Documentation

## Overview
This is the Monday Knights activist community website, converted from the original HTML design into a full-stack React application while preserving the exact original design, content, and aesthetic. The website features blog-style content management, contact forms, and admin functionality.

**Live Website:** https://event-portal-8.preview.emergentagent.com
**Admin Panel:** https://event-portal-8.preview.emergentagent.com/admin

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
- Menu items and navigation
- Form fields and validation
- Pop-up overlays (About Us, Contact Us, Events)
- Admin login and dashboard interface
- JavaScript functionality and interactions

**Common edits you can make:**
- Change menu item text (lines ~160-165)
- Modify form fields and labels (lines ~200-350)
- Update button text and messages
- Add new content sections
- Change background image URL (line ~154)
- Modify contact form fields

**Key sections:**
```javascript
// Menu Items (around line 160)
<div className="menu-item" onClick={() => showOverlay('about')}>About Us</div>
<div className="menu-item" onClick={() => showOverlay('contact')}>Contact Us</div>
<div className="menu-item" onClick={() => showOverlay('events')}>Events and Announcements</div>

// Background Image (around line 154)
<img 
  id="backgroundImage" 
  src="https://i.postimg.cc/JnYv963V/background.jpg" 
  alt="Background" 
/>

// Contact Form Fields (around lines 200-350)
// Individual and Business form structures
```

### 2. `/app/frontend/src/App.css` - Website Styling & Design
**This is your main CSS file**

**What it controls:**
- Colors, fonts, and visual styling
- Menu positioning and hover effects
- Form styling and button appearances
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
#backgroundImage { position: fixed; top: 50%; left: 50%; }

/* Color scheme */
/* Purple accent: #ca6ce6 */
/* Hover purple: #b555d1 */

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

### 3. `/app/backend/server.py` - Database & API Logic
**This handles all backend functionality**

**What it contains:**
- Admin login credentials (lines ~35-36)
- Database models and structure
- API endpoints for contact forms, blog posts, and admin functions
- About Us content management
- Contact form submission handling

**Key sections:**
```python
# Admin Credentials (lines 35-36)
ADMIN_EMAIL = "federico.celina@gmail.com"
ADMIN_PASSWORD = "testingsite"

# Default About Us Content (lines ~180-185)
default_content = {
    "content": "Monday Knights is a grassroots organization..."
}

# API Endpoints
@api_router.post("/contact/individual")  # Individual contact form
@api_router.post("/contact/business")    # Business contact form
@api_router.get("/blog-posts")          # Get blog posts
@api_router.post("/blog-posts")         # Create blog posts
```

**Common edits:**
- Change admin login credentials
- Modify default About Us content
- Add new form fields to contact forms
- Customize email/database field requirements

### 4. Configuration Files

#### `/app/frontend/.env` - Frontend Environment
```
REACT_APP_BACKEND_URL=https://event-portal-8.preview.emergentagent.com
WDS_SOCKET_PORT=443
```
**⚠️ DO NOT MODIFY** - These are configured for your hosting environment

#### `/app/backend/.env` - Backend Environment  
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
```
**⚠️ DO NOT MODIFY** - These are configured for your database

## 🎨 How to Make Common Changes

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

### Change Background Image
**File:** `/app/frontend/src/App.js` (around line 154)
```javascript
src="https://your-new-image-url.com/image.jpg"
```

### Add/Remove Contact Form Fields
**File:** `/app/frontend/src/App.js` (lines ~200-350)
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

### Change Admin Login Credentials
**File:** `/app/backend/server.py` (lines 35-36)
```python
ADMIN_EMAIL = "your-new-email@example.com"
ADMIN_PASSWORD = "your-new-password"
```

## 🔧 Content Management

### Static Content (Requires Code Changes)
- Menu text and navigation
- Form labels and field names
- Button text and messages
- Error messages and validation text
- **Edit in:** `/app/frontend/src/App.js`

### Dynamic Content (Managed via Admin Panel)
- About Us text content
- Blog posts and events
- **Manage at:** https://event-portal-8.preview.emergentagent.com/admin

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

## 🔐 Admin Panel Features

**Access:** https://event-portal-8.preview.emergentagent.com/admin
**Login:** federico.celina@gmail.com / testingsite

**Admin Capabilities:**
- ✅ Update About Us content
- ✅ Create new blog posts/events
- ✅ Edit existing blog posts
- ✅ Delete blog posts
- ✅ View all contact form submissions
- ✅ Change admin login credentials

## 📞 Support

For technical issues or questions about modifying the website:
1. Check this README for common changes
2. All main editable content is in `/app/frontend/src/App.js`
3. All styling is in `/app/frontend/src/App.css`
4. Backend functionality is in `/app/backend/server.py`

## 🎯 Original Design Preserved

This React application maintains 100% of your original HTML design:
- ✅ Black background with original background image
- ✅ Creepster font and purple (#ca6ce6) color scheme  
- ✅ Menu positioning (lower right area)
- ✅ Original About Us text content
- ✅ Mobile responsive design
- ✅ Pop-up overlay styling and behavior
