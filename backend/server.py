from fastapi import FastAPI, APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import hashlib
import jwt
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()
SECRET_KEY = "monday_knights_secret_key_2025"

# Admin credentials
ADMIN_EMAIL = "federico.celina@gmail.com"
ADMIN_PASSWORD = "testingsite"

# Email configuration
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
NOTIFICATION_EMAIL = os.environ.get('ADMIN_EMAIL', 'federico.celina@gmail.com')

# Email functions
def send_notification_email(subject: str, content: str):
    """Send notification email to admin"""
    if not SENDGRID_API_KEY:
        print("SendGrid API key not configured, skipping email notification")
        return False
        
    try:
        message = Mail(
            from_email=NOTIFICATION_EMAIL,
            to_emails=[NOTIFICATION_EMAIL],
            subject=subject,
            html_content=content
        )
        
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        return response.status_code == 202
    except Exception as e:
        print(f"Failed to send email notification: {str(e)}")
        return False

# Models
class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminUpdate(BaseModel):
    email: Optional[EmailStr] = None
    current_password: str
    new_password: Optional[str] = None

class AboutUsContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by: str

class AboutUsUpdate(BaseModel):
    content: str

class BlogPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    author: str

class BlogPostCreate(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None

class IndividualContact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    message: str
    privacy_agreed: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)

class IndividualContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str
    privacy_agreed: bool = True

class BusinessContact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_name: str
    contact_person: str
    email: EmailStr
    phone: str
    message: str
    privacy_agreed: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BusinessContactCreate(BaseModel):
    company_name: str
    contact_person: str
    email: EmailStr
    phone: str
    message: str
    privacy_agreed: bool = True

# Helper functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return email
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# API Routes

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

# Also add a route without trailing slash for compatibility
@api_router.get("")
async def root_no_slash():
    return {"message": "Hello World"}

# Admin Authentication
@api_router.post("/admin/login")
async def admin_login(credentials: AdminLogin):
    # Check admin credentials (hardcoded for now)
    if credentials.email == ADMIN_EMAIL and credentials.password == ADMIN_PASSWORD:
        access_token = create_access_token(data={"sub": credentials.email})
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=401, detail="Incorrect email or password")

@api_router.post("/admin/update")
async def update_admin_credentials(update_data: AdminUpdate, current_user: str = Depends(verify_token)):
    global ADMIN_EMAIL, ADMIN_PASSWORD
    
    # Verify current password
    if update_data.current_password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    
    # Update email if provided
    if update_data.email:
        ADMIN_EMAIL = update_data.email
    
    # Update password if provided
    if update_data.new_password:
        ADMIN_PASSWORD = update_data.new_password
    
    return {"message": "Admin credentials updated successfully"}

# About Us Management
@api_router.get("/about-us")
async def get_about_us():
    about_content = await db.about_us.find_one(sort=[("updated_at", -1)])
    if not about_content:
        # Default content - preserving original text
        default_content = {
            "id": str(uuid.uuid4()),
            "content": "Monday Knights is a grassroots organization focused on developing intersectional power. Combining historic strategies with advancements in technology, we seek to reinvigorate and revolutionize community participation, harm reduction and mutual aid systems.\n\nThrough building communal spaces and fostering strong alliances across affinity groups, we aim to create sustainable social and political momentum.",
            "updated_at": datetime.utcnow(),
            "updated_by": "system"
        }
        await db.about_us.insert_one(default_content)
        return AboutUsContent(**default_content)
    return AboutUsContent(**about_content)

@api_router.put("/about-us")
async def update_about_us(content_update: AboutUsUpdate, current_user: str = Depends(verify_token)):
    new_content = {
        "id": str(uuid.uuid4()),
        "content": content_update.content,
        "updated_at": datetime.utcnow(),
        "updated_by": current_user
    }
    await db.about_us.insert_one(new_content)
    return AboutUsContent(**new_content)

# Blog Posts Management
@api_router.get("/blog-posts", response_model=List[BlogPost])
async def get_blog_posts():
    posts = await db.blog_posts.find().sort("created_at", -1).to_list(length=None)
    return [BlogPost(**post) for post in posts]

@api_router.post("/blog-posts", response_model=BlogPost)
async def create_blog_post(post_data: BlogPostCreate, current_user: str = Depends(verify_token)):
    post_dict = post_data.dict()
    post_obj = BlogPost(**post_dict, author=current_user)
    await db.blog_posts.insert_one(post_obj.dict())
    return post_obj

@api_router.get("/blog-posts/{post_id}", response_model=BlogPost)
async def get_blog_post(post_id: str):
    post = await db.blog_posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return BlogPost(**post)

@api_router.put("/blog-posts/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, post_update: BlogPostUpdate, current_user: str = Depends(verify_token)):
    post = await db.blog_posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    update_data = {k: v for k, v in post_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.blog_posts.update_one({"id": post_id}, {"$set": update_data})
    updated_post = await db.blog_posts.find_one({"id": post_id})
    return BlogPost(**updated_post)

@api_router.delete("/blog-posts/{post_id}")
async def delete_blog_post(post_id: str, current_user: str = Depends(verify_token)):
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post deleted successfully"}

# Contact Forms
@api_router.post("/contact/individual", response_model=IndividualContact)
async def submit_individual_contact(contact_data: IndividualContactCreate):
    contact_dict = contact_data.dict()
    contact_obj = IndividualContact(**contact_dict)
    await db.individual_contacts.insert_one(contact_obj.dict())
    return contact_obj

@api_router.post("/contact/business", response_model=BusinessContact)
async def submit_business_contact(contact_data: BusinessContactCreate):
    contact_dict = contact_data.dict()
    contact_obj = BusinessContact(**contact_dict)
    await db.business_contacts.insert_one(contact_obj.dict())
    return contact_obj

@api_router.get("/contact/individual", response_model=List[IndividualContact])
async def get_individual_contacts(current_user: str = Depends(verify_token)):
    contacts = await db.individual_contacts.find().sort("created_at", -1).to_list(length=None)
    return [IndividualContact(**contact) for contact in contacts]

@api_router.get("/contact/business", response_model=List[BusinessContact])
async def get_business_contacts(current_user: str = Depends(verify_token)):
    contacts = await db.business_contacts.find().sort("created_at", -1).to_list(length=None)
    return [BusinessContact(**contact) for contact in contacts]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()