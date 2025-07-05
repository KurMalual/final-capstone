#!/usr/bin/env python3
"""
Script to update Heroku environment variables for CORS configuration
"""

import subprocess
import sys

def run_command(command):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def main():
    print("🚀 Updating Heroku CORS configuration...")
    print("=" * 50)
    
    # Set environment variables
    env_vars = {
        'DEBUG': 'False',
        'CORS_ALLOW_CREDENTIALS': 'True',
        'ALLOWED_HOSTS': 'smart-farm-advisory-d46b4015b13a.herokuapp.com,localhost,127.0.0.1',
    }
    
    for key, value in env_vars.items():
        command = f'heroku config:set {key}="{value}"'
        print(f"Setting {key}...")
        success, stdout, stderr = run_command(command)
        
        if success:
            print(f"✅ {key} set successfully")
        else:
            print(f"❌ Failed to set {key}: {stderr}")
    
    print("\n🔍 Current Heroku config:")
    success, stdout, stderr = run_command("heroku config")
    if success:
        print(stdout)
    else:
        print(f"❌ Failed to get config: {stderr}")
    
    print("\n🚀 Restarting Heroku app...")
    success, stdout, stderr = run_command("heroku restart")
    if success:
        print("✅ App restarted successfully")
    else:
        print(f"❌ Failed to restart: {stderr}")

if __name__ == "__main__":
    main()
