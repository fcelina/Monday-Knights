#!/usr/bin/env python3

import requests
import sys
from datetime import datetime
import json

class MondayKnightsAPITester:
    def __init__(self, base_url="https://knights-deploy.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_base}{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ FAILED - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.text
                    print(f"   Response: {error_data}")
                except:
                    pass
                return False, {}

        except requests.exceptions.RequestException as e:
            print(f"❌ FAILED - Network Error: {str(e)}")
            return False, {}
        except Exception as e:
            print(f"❌ FAILED - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "/",
            200
        )
        return success

    def test_admin_login(self):
        """Test admin login and get token"""
        credentials = {
            "email": "MondayKnightsNYC@proton.me",
            "password": "Kn1ghtMark3t!!"
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "/admin/login",
            200,
            data=credentials
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token received: {self.token[:20]}...")
            return True
        return False

    def test_about_us_get(self):
        """Test getting About Us content"""
        success, response = self.run_test(
            "Get About Us Content",
            "GET",
            "/about-us",
            200
        )
        if success and 'content' in response:
            print(f"   Content length: {len(response['content'])} characters")
            return True
        return success

    def test_blog_posts_get(self):
        """Test getting blog posts"""
        success, response = self.run_test(
            "Get Blog Posts",
            "GET",
            "/blog-posts",
            200
        )
        if success:
            posts_count = len(response) if isinstance(response, list) else 0
            print(f"   Blog posts found: {posts_count}")
            return True
        return success

    def test_individual_contact_submit(self):
        """Test individual contact form submission"""
        timestamp = datetime.now().strftime("%H%M%S")
        contact_data = {
            "name": f"Test Individual {timestamp}",
            "email": f"test.individual.{timestamp}@example.com",
            "phone": "(555) 123-4567",
            "message": "Test individual contact form submission",
            "privacy_agreed": True
        }
        
        success, response = self.run_test(
            "Submit Individual Contact",
            "POST",
            "/contact/individual",
            200,
            data=contact_data
        )
        
        if success and 'id' in response:
            print(f"   Contact ID: {response['id']}")
            return True
        return success

    def test_business_contact_submit(self):
        """Test business contact form submission"""
        timestamp = datetime.now().strftime("%H%M%S")
        contact_data = {
            "company_name": f"Test Company {timestamp}",
            "contact_person": f"Test Business Contact {timestamp}",
            "email": f"test.business.{timestamp}@example.com",
            "phone": "(555) 987-6543",
            "message": "Test business contact form submission",
            "privacy_agreed": True
        }
        
        success, response = self.run_test(
            "Submit Business Contact",
            "POST",
            "/contact/business",
            200,
            data=contact_data
        )
        
        if success and 'id' in response:
            print(f"   Contact ID: {response['id']}")
            return True
        return success

    def test_get_individual_contacts_protected(self):
        """Test getting individual contacts (admin protected)"""
        if not self.token:
            print("❌ SKIPPED - No admin token available")
            return False
            
        success, response = self.run_test(
            "Get Individual Contacts (Admin Protected)",
            "GET",
            "/contact/individual",
            200
        )
        
        if success:
            contacts_count = len(response) if isinstance(response, list) else 0
            print(f"   Individual contacts found: {contacts_count}")
            return True
        return success

    def test_get_business_contacts_protected(self):
        """Test getting business contacts (admin protected)"""
        if not self.token:
            print("❌ SKIPPED - No admin token available")
            return False
            
        success, response = self.run_test(
            "Get Business Contacts (Admin Protected)",
            "GET",
            "/contact/business",
            200
        )
        
        if success:
            contacts_count = len(response) if isinstance(response, list) else 0
            print(f"   Business contacts found: {contacts_count}")
            return True
        return success

    def test_blog_post_create_protected(self):
        """Test creating a blog post (admin protected)"""
        if not self.token:
            print("❌ SKIPPED - No admin token available")
            return False
            
        timestamp = datetime.now().strftime("%H%M%S")
        post_data = {
            "title": f"Test Event {timestamp}",
            "content": "This is a test event post created by automated testing.",
            "image_url": "https://via.placeholder.com/300x200?text=Test+Event"
        }
        
        success, response = self.run_test(
            "Create Blog Post (Admin Protected)",
            "POST",
            "/blog-posts",
            200,
            data=post_data
        )
        
        if success and 'id' in response:
            print(f"   Blog post ID: {response['id']}")
            # Store the ID for potential cleanup
            self.test_post_id = response['id']
            return True
        return success

def main():
    print("🚀 Starting Monday Knights API Testing")
    print("="*60)
    
    tester = MondayKnightsAPITester()
    
    # Test basic API functionality
    tests = [
        tester.test_root_endpoint,
        tester.test_about_us_get,
        tester.test_blog_posts_get,
        tester.test_individual_contact_submit,
        tester.test_business_contact_submit,
    ]
    
    # Run basic tests
    for test in tests:
        test()
    
    # Test admin functionality
    print("\n" + "="*60)
    print("🔐 Testing Admin Protected Endpoints")
    print("="*60)
    
    if tester.test_admin_login():
        admin_tests = [
            tester.test_get_individual_contacts_protected,
            tester.test_get_business_contacts_protected,
            tester.test_blog_post_create_protected,
        ]
        
        for test in admin_tests:
            test()
    
    # Print final results
    print("\n" + "="*60)
    print("📊 FINAL TEST RESULTS")
    print("="*60)
    print(f"Tests run: {tester.tests_run}")
    print(f"Tests passed: {tester.tests_passed}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 ALL TESTS PASSED!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} TEST(S) FAILED")
        return 1

if __name__ == "__main__":
    sys.exit(main())