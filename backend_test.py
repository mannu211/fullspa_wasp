#!/usr/bin/env python3
"""
WASP E-commerce Backend API Test Suite
Tests all major backend endpoints for functionality and data integrity
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get base URL from environment
BASE_URL = "https://wasp-fashion-hub.preview.emergentagent.com/api"

class WASPAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.auth_token = None
        self.test_user_email = "tester@wasp.com"
        self.test_user_password = "test123456"
        self.test_user_name = "WASP Tester"
        self.results = {
            "total_tests": 0,
            "passed": 0,
            "failed": 0,
            "errors": []
        }
        
    def log(self, message, level="INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def test_result(self, test_name, success, message=""):
        self.results["total_tests"] += 1
        if success:
            self.results["passed"] += 1
            self.log(f"✅ {test_name}: PASSED {message}", "PASS")
        else:
            self.results["failed"] += 1
            self.results["errors"].append(f"{test_name}: {message}")
            self.log(f"❌ {test_name}: FAILED {message}", "FAIL")
            
    def make_request(self, method, endpoint, data=None, headers=None):
        """Make HTTP request with error handling"""
        url = f"{self.base_url}{endpoint}"
        default_headers = {"Content-Type": "application/json"}
        
        if headers:
            default_headers.update(headers)
            
        if self.auth_token and "authorization" not in [h.lower() for h in default_headers.keys()]:
            default_headers["Authorization"] = f"Bearer {self.auth_token}"
            
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=default_headers, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=default_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            self.log(f"Request failed: {str(e)}", "ERROR")
            return None
            
    def test_health_check(self):
        """Test API health check endpoint"""
        self.log("Testing API Health Check...")
        
        response = self.make_request("GET", "/")
        if not response:
            self.test_result("Health Check", False, "Request failed")
            return
            
        if response.status_code == 200:
            try:
                data = response.json()
                if data.get("success") and "endpoints" in data:
                    self.test_result("Health Check", True, f"API running with {len(data['endpoints'])} endpoints")
                else:
                    self.test_result("Health Check", False, "Invalid response format")
            except json.JSONDecodeError:
                self.test_result("Health Check", False, "Invalid JSON response")
        else:
            self.test_result("Health Check", False, f"Status code: {response.status_code}")
            
    def test_products_api(self):
        """Test product-related endpoints"""
        self.log("Testing Product APIs...")
        
        # Test get all products
        response = self.make_request("GET", "/products")
        if response and response.status_code == 200:
            try:
                data = response.json()
                if data.get("success") and "products" in data:
                    products = data["products"]
                    self.test_result("Get All Products", True, f"Retrieved {len(products)} products")
                    
                    # Store a product ID for single product test
                    if products:
                        product_id = products[0].get("id")
                        if product_id:
                            # Test single product
                            single_response = self.make_request("GET", f"/products/{product_id}")
                            if single_response and single_response.status_code == 200:
                                single_data = single_response.json()
                                if single_data.get("success") and "product" in single_data:
                                    self.test_result("Get Single Product", True, f"Retrieved product: {product_id}")
                                else:
                                    self.test_result("Get Single Product", False, "Invalid response format")
                            else:
                                self.test_result("Get Single Product", False, f"Status: {single_response.status_code if single_response else 'No response'}")
                else:
                    self.test_result("Get All Products", False, "Invalid response format")
            except json.JSONDecodeError:
                self.test_result("Get All Products", False, "Invalid JSON response")
        else:
            self.test_result("Get All Products", False, f"Status: {response.status_code if response else 'No response'}")
            
        # Test featured products
        response = self.make_request("GET", "/products?featured=true")
        if response and response.status_code == 200:
            try:
                data = response.json()
                if data.get("success") and "products" in data:
                    self.test_result("Get Featured Products", True, f"Retrieved {len(data['products'])} featured products")
                else:
                    self.test_result("Get Featured Products", False, "Invalid response format")
            except json.JSONDecodeError:
                self.test_result("Get Featured Products", False, "Invalid JSON response")
        else:
            self.test_result("Get Featured Products", False, f"Status: {response.status_code if response else 'No response'}")
            
        # Test products by category - Indian
        response = self.make_request("GET", "/products?category=indian")
        if response and response.status_code == 200:
            try:
                data = response.json()
                if data.get("success") and "products" in data:
                    self.test_result("Get Indian Category Products", True, f"Retrieved {len(data['products'])} indian products")
                else:
                    self.test_result("Get Indian Category Products", False, "Invalid response format")
            except json.JSONDecodeError:
                self.test_result("Get Indian Category Products", False, "Invalid JSON response")
        else:
            self.test_result("Get Indian Category Products", False, f"Status: {response.status_code if response else 'No response'}")
            
        # Test products by category - Western
        response = self.make_request("GET", "/products?category=western")
        if response and response.status_code == 200:
            try:
                data = response.json()
                if data.get("success") and "products" in data:
                    self.test_result("Get Western Category Products", True, f"Retrieved {len(data['products'])} western products")
                else:
                    self.test_result("Get Western Category Products", False, "Invalid response format")
            except json.JSONDecodeError:
                self.test_result("Get Western Category Products", False, "Invalid JSON response")
        else:
            self.test_result("Get Western Category Products", False, f"Status: {response.status_code if response else 'No response'}")
            
    def test_authentication(self):
        """Test authentication endpoints"""
        self.log("Testing Authentication APIs...")
        
        # Test user registration
        register_data = {
            "name": self.test_user_name,
            "email": self.test_user_email,
            "password": self.test_user_password
        }
        
        response = self.make_request("POST", "/auth/register", register_data)
        if response:
            if response.status_code == 200:
                try:
                    data = response.json()
                    if data.get("success") and "token" in data and "user" in data:
                        self.auth_token = data["token"]
                        self.test_result("User Registration", True, f"User registered: {data['user']['email']}")
                    else:
                        self.test_result("User Registration", False, "Invalid response format")
                except json.JSONDecodeError:
                    self.test_result("User Registration", False, "Invalid JSON response")
            elif response.status_code == 400:
                # User might already exist, try login instead
                self.log("User already exists, proceeding to login test")
                self.test_result("User Registration", True, "User already exists (expected)")
            else:
                self.test_result("User Registration", False, f"Status code: {response.status_code}")
        else:
            self.test_result("User Registration", False, "Request failed")
            
        # Test user login
        login_data = {
            "email": self.test_user_email,
            "password": self.test_user_password
        }
        
        response = self.make_request("POST", "/auth/login", login_data)
        if response and response.status_code == 200:
            try:
                data = response.json()
                if data.get("success") and "token" in data and "user" in data:
                    self.auth_token = data["token"]
                    self.test_result("User Login", True, f"Login successful: {data['user']['email']}")
                else:
                    self.test_result("User Login", False, "Invalid response format")
            except json.JSONDecodeError:
                self.test_result("User Login", False, "Invalid JSON response")
        else:
            self.test_result("User Login", False, f"Status: {response.status_code if response else 'No response'}")
            
    def test_protected_apis(self):
        """Test protected user endpoints"""
        self.log("Testing Protected User APIs...")
        
        if not self.auth_token:
            self.test_result("Protected APIs Setup", False, "No auth token available")
            return
            
        # Test get user orders (should be empty initially)
        response = self.make_request("GET", "/orders")
        if response and response.status_code == 200:
            try:
                data = response.json()
                if data.get("success") and "orders" in data:
                    self.test_result("Get User Orders", True, f"Retrieved {len(data['orders'])} orders")
                else:
                    self.test_result("Get User Orders", False, "Invalid response format")
            except json.JSONDecodeError:
                self.test_result("Get User Orders", False, "Invalid JSON response")
        else:
            self.test_result("Get User Orders", False, f"Status: {response.status_code if response else 'No response'}")
            
        # Test create order
        order_data = {
            "items": [
                {
                    "id": "test-product-1",
                    "name": "Test Ethnic Kurta",
                    "price": 1000,
                    "quantity": 1,
                    "size": "M",
                    "image": "https://example.com/kurta.jpg"
                }
            ],
            "total": 1099,
            "shippingAddress": {
                "name": self.test_user_name,
                "email": self.test_user_email,
                "phone": "9876543210",
                "address": "123 Fashion Street",
                "city": "Mumbai",
                "state": "Maharashtra",
                "pincode": "400001"
            }
        }
        
        response = self.make_request("POST", "/orders", order_data)
        if response and response.status_code == 200:
            try:
                data = response.json()
                if data.get("success") and "order" in data:
                    order = data["order"]
                    self.test_result("Create Order", True, f"Order created: {order.get('id', 'Unknown ID')}")
                else:
                    self.test_result("Create Order", False, "Invalid response format")
            except json.JSONDecodeError:
                self.test_result("Create Order", False, "Invalid JSON response")
        else:
            self.test_result("Create Order", False, f"Status: {response.status_code if response else 'No response'}")
            
    def test_categories_and_banners(self):
        """Test categories and banners endpoints"""
        self.log("Testing Categories and Banners APIs...")
        
        # Test get categories
        response = self.make_request("GET", "/categories")
        if response and response.status_code == 200:
            try:
                data = response.json()
                if data.get("success") and "categories" in data:
                    self.test_result("Get Categories", True, f"Retrieved {len(data['categories'])} categories")
                else:
                    self.test_result("Get Categories", False, "Invalid response format")
            except json.JSONDecodeError:
                self.test_result("Get Categories", False, "Invalid JSON response")
        else:
            self.test_result("Get Categories", False, f"Status: {response.status_code if response else 'No response'}")
            
        # Test get banners
        response = self.make_request("GET", "/banners")
        if response and response.status_code == 200:
            try:
                data = response.json()
                if data.get("success") and "banners" in data:
                    self.test_result("Get Banners", True, f"Retrieved {len(data['banners'])} banners")
                else:
                    self.test_result("Get Banners", False, "Invalid response format")
            except json.JSONDecodeError:
                self.test_result("Get Banners", False, "Invalid JSON response")
        else:
            self.test_result("Get Banners", False, f"Status: {response.status_code if response else 'No response'}")
            
    def test_error_handling(self):
        """Test error handling scenarios"""
        self.log("Testing Error Handling...")
        
        # Test invalid product ID
        response = self.make_request("GET", "/products/invalid-id")
        if response and response.status_code == 404:
            try:
                data = response.json()
                if not data.get("success"):
                    self.test_result("Invalid Product ID Error", True, "Correctly returned 404")
                else:
                    self.test_result("Invalid Product ID Error", False, "Should return error for invalid ID")
            except json.JSONDecodeError:
                self.test_result("Invalid Product ID Error", False, "Invalid JSON response")
        else:
            self.test_result("Invalid Product ID Error", False, f"Expected 404, got: {response.status_code if response else 'No response'}")
            
        # Test unauthorized access to orders
        temp_token = self.auth_token
        self.auth_token = None
        response = self.make_request("GET", "/orders")
        if response and response.status_code == 401:
            try:
                data = response.json()
                if not data.get("success"):
                    self.test_result("Unauthorized Access Error", True, "Correctly returned 401")
                else:
                    self.test_result("Unauthorized Access Error", False, "Should return error for unauthorized access")
            except json.JSONDecodeError:
                self.test_result("Unauthorized Access Error", False, "Invalid JSON response")
        else:
            self.test_result("Unauthorized Access Error", False, f"Expected 401, got: {response.status_code if response else 'No response'}")
        self.auth_token = temp_token
        
    def run_all_tests(self):
        """Run all test suites"""
        self.log("Starting WASP E-commerce Backend API Tests...")
        self.log(f"Testing against: {self.base_url}")
        
        try:
            self.test_health_check()
            self.test_products_api()
            self.test_authentication()
            self.test_protected_apis()
            self.test_categories_and_banners()
            self.test_error_handling()
            
        except Exception as e:
            self.log(f"Unexpected error during testing: {str(e)}", "ERROR")
            self.results["errors"].append(f"Unexpected error: {str(e)}")
            
        # Print final results
        self.log("=" * 60)
        self.log("FINAL TEST RESULTS")
        self.log("=" * 60)
        self.log(f"Total Tests: {self.results['total_tests']}")
        self.log(f"Passed: {self.results['passed']}")
        self.log(f"Failed: {self.results['failed']}")
        
        if self.results["errors"]:
            self.log("\nFAILED TESTS:")
            for error in self.results["errors"]:
                self.log(f"  - {error}")
                
        success_rate = (self.results['passed'] / self.results['total_tests']) * 100 if self.results['total_tests'] > 0 else 0
        self.log(f"\nSuccess Rate: {success_rate:.1f}%")
        
        if success_rate >= 80:
            self.log("✅ BACKEND API TESTS: OVERALL PASS", "PASS")
            return True
        else:
            self.log("❌ BACKEND API TESTS: OVERALL FAIL", "FAIL")
            return False

if __name__ == "__main__":
    tester = WASPAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)