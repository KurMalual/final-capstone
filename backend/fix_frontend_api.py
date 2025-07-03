#!/usr/bin/env python3
"""
Fix Frontend API Integration
"""
import os
import re

def fix_api_config():
    """Fix the API configuration file"""
    api_config_path = os.path.join("frontend", "src", "config", "api.js")
    
    if not os.path.exists(api_config_path):
        print(f"Error: Could not find API config file at {api_config_path}")
        return False
    
    try:
        with open(api_config_path, 'r') as f:
            content = f.read()
        
        # Fix education endpoints - remove extra "api/" in the path
        content = re.sub(
            r'EDUCATION:\s*{[^}]*}',
            '''EDUCATION: {
    VIDEOS: `${API_BASE_URL}/api/education/videos/`,
    CATEGORIES: `${API_BASE_URL}/api/education/categories/`,
  }''',
            content,
            flags=re.DOTALL
        )
        
        with open(api_config_path, 'w') as f:
            f.write(content)
        
        print("✅ Fixed API config file")
        return True
        
    except Exception as e:
        print(f"Error fixing API config: {e}")
        return False

def fix_farmer_dashboard():
    """Fix the FarmerDashboard component"""
    dashboard_path = os.path.join("frontend", "src", "pages", "FarmerDashboard.js")
    
    if not os.path.exists(dashboard_path):
        print(f"Error: Could not find FarmerDashboard component at {dashboard_path}")
        return False
    
    try:
        with open(dashboard_path, 'r') as f:
            content = f.read()
        
        # Replace hardcoded URLs with API_ENDPOINTS
        content = content.replace(
            'const categoriesResponse = await axios.get("http://localhost:8000/api/education/categories/")',
            'const categoriesResponse = await axios.get(API_ENDPOINTS.EDUCATION.CATEGORIES)'
        )
        
        content = re.sub(
            r'const videosUrl = selectedCategory\s*\?\s*`http://localhost:8000/api/education/videos/\?category=\${selectedCategory}`\s*:\s*"http://localhost:8000/api/education/videos/"',
            'const videosUrl = selectedCategory ? `${API_ENDPOINTS.EDUCATION.VIDEOS}?category=${selectedCategory}` : API_ENDPOINTS.EDUCATION.VIDEOS',
            content
        )
        
        content = content.replace(
            'axios.post(`http://localhost:8000/api/education/videos/${video.id}/view/`)',
            'axios.post(`${API_ENDPOINTS.EDUCATION.VIDEOS}${video.id}/view/`)'
        )
        
        with open(dashboard_path, 'w') as f:
            f.write(content)
        
        print("✅ Fixed FarmerDashboard component")
        return True
        
    except Exception as e:
        print(f"Error fixing FarmerDashboard: {e}")
        return False

def main():
    print("=== Fixing Frontend API Integration ===\n")
    
    print("Fixing API endpoints in frontend code...")
    success1 = fix_api_config()
    
    print("Fixing FarmerDashboard component...")
    success2 = fix_farmer_dashboard()
    
    if success1 and success2:
        print("\n✅ All fixes applied successfully!")
        print("Please restart your frontend development server.")
    else:
        print("\n❌ Some fixes could not be applied. Please check the errors above.")

if __name__ == "__main__":
    main()
