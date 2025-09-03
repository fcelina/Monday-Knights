import requests
import sys
import json
from datetime import datetime

class MondayKnightsAPITester:
    def __init__(self, base_url="https://event-portal-8.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.created_blog_post_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        default_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            default_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            default_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=default_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=default_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2, default=str)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test API health check"""
        return self.run_test("Health Check", "GET", "", 200)

    def test_admin_login(self):
        """Test admin login with correct credentials"""
        login_data = {
            "email": "federico.celina@gmail.com",
            "password": "testingsite"
        }
        success, response = self.run_test("Admin Login", "POST", "admin/login", 200, data=login_data)
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_admin_login_invalid(self):
        """Test admin login with invalid credentials"""
        login_data = {
            "email": "wrong@email.com",
            "password": "wrongpassword"
        }
        return self.run_test("Admin Login (Invalid)", "POST", "admin/login", 401, data=login_data)

    def test_get_about_us(self):
        """Test getting about us content"""
        return self.run_test("Get About Us", "GET", "about-us", 200)

    def test_update_about_us(self):
        """Test updating about us content (requires auth)"""
        if not self.token:
            print("❌ Skipping - No admin token available")
            return False
        
        update_data = {
            "content": f"Updated Monday Knights content - Test at {datetime.now()}"
        }
        return self.run_test("Update About Us", "PUT", "about-us", 200, data=update_data)

    def test_get_blog_posts(self):
        """Test getting all blog posts"""
        return self.run_test("Get Blog Posts", "GET", "blog-posts", 200)

    def test_create_blog_post(self):
        """Test creating a blog post (requires auth)"""
        if not self.token:
            print("❌ Skipping - No admin token available")
            return False
        
        blog_data = {
            "title": f"Test Blog Post - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "content": "This is a test blog post created during API testing.",
            "image_url": "https://example.com/test-image.jpg"
        }
        success, response = self.run_test("Create Blog Post", "POST", "blog-posts", 200, data=blog_data)
        if success and 'id' in response:
            self.created_blog_post_id = response['id']
            print(f"   Created blog post ID: {self.created_blog_post_id}")
        return success

    def test_get_single_blog_post(self):
        """Test getting a single blog post"""
        if not self.created_blog_post_id:
            print("❌ Skipping - No blog post ID available")
            return False
        
        return self.run_test("Get Single Blog Post", "GET", f"blog-posts/{self.created_blog_post_id}", 200)

    def test_update_blog_post(self):
        """Test updating a blog post (requires auth)"""
        if not self.token or not self.created_blog_post_id:
            print("❌ Skipping - No admin token or blog post ID available")
            return False
        
        update_data = {
            "title": f"Updated Test Blog Post - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "content": "This blog post has been updated during API testing."
        }
        return self.run_test("Update Blog Post", "PUT", f"blog-posts/{self.created_blog_post_id}", 200, data=update_data)

    def test_submit_individual_contact(self):
        """Test submitting individual contact form"""
        contact_data = {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "phone": "+1234567890",
            "message": "This is a test message from individual contact form.",
            "privacy_agreed": True
        }
        return self.run_test("Submit Individual Contact", "POST", "contact/individual", 200, data=contact_data)

    def test_submit_business_contact(self):
        """Test submitting business contact form"""
        contact_data = {
            "company_name": "Test Company Ltd",
            "contact_person": "Jane Smith",
            "email": "jane.smith@testcompany.com",
            "phone": "+1987654321",
            "message": "This is a test message from business contact form.",
            "privacy_agreed": True
        }
        return self.run_test("Submit Business Contact", "POST", "contact/business", 200, data=contact_data)

    def test_get_individual_contacts(self):
        """Test getting individual contacts (requires auth)"""
        if not self.token:
            print("❌ Skipping - No admin token available")
            return False
        
        return self.run_test("Get Individual Contacts", "GET", "contact/individual", 200)

    def test_get_business_contacts(self):
        """Test getting business contacts (requires auth)"""
        if not self.token:
            print("❌ Skipping - No admin token available")
            return False
        
        return self.run_test("Get Business Contacts", "GET", "contact/business", 200)

    def test_delete_blog_post(self):
        """Test deleting a blog post (requires auth)"""
        if not self.token or not self.created_blog_post_id:
            print("❌ Skipping - No admin token or blog post ID available")
            return False
        
        return self.run_test("Delete Blog Post", "DELETE", f"blog-posts/{self.created_blog_post_id}", 200)

def main():
    print("🚀 Starting Monday Knights API Testing...")
    print("=" * 60)
    
    tester = MondayKnightsAPITester()
    
    # Test sequence
    test_results = []
    
    # Basic health check
    test_results.append(("Health Check", tester.test_health_check()))
    
    # Authentication tests
    test_results.append(("Admin Login (Valid)", tester.test_admin_login()))
    test_results.append(("Admin Login (Invalid)", tester.test_admin_login_invalid()))
    
    # About Us tests
    test_results.append(("Get About Us", tester.test_get_about_us()))
    test_results.append(("Update About Us", tester.test_update_about_us()))
    
    # Blog posts tests
    test_results.append(("Get Blog Posts", tester.test_get_blog_posts()))
    test_results.append(("Create Blog Post", tester.test_create_blog_post()))
    test_results.append(("Get Single Blog Post", tester.test_get_single_blog_post()))
    test_results.append(("Update Blog Post", tester.test_update_blog_post()))
    
    # Contact forms tests
    test_results.append(("Submit Individual Contact", tester.test_submit_individual_contact()))
    test_results.append(("Submit Business Contact", tester.test_submit_business_contact()))
    
    # Admin contact viewing tests
    test_results.append(("Get Individual Contacts", tester.test_get_individual_contacts()))
    test_results.append(("Get Business Contacts", tester.test_get_business_contacts()))
    
    # Cleanup - delete test blog post
    test_results.append(("Delete Blog Post", tester.test_delete_blog_post()))
    
    # Print final results
    print("\n" + "=" * 60)
    print("📊 FINAL TEST RESULTS")
    print("=" * 60)
    
    failed_tests = []
    for test_name, (success, _) in test_results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}")
        if not success:
            failed_tests.append(test_name)
    
    print(f"\n📈 Summary: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if failed_tests:
        print(f"\n❌ Failed tests:")
        for test in failed_tests:
            print(f"   - {test}")
        return 1
    else:
        print("\n🎉 All tests passed!")
        return 0

if __name__ == "__main__":
    sys.exit(main())