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
    
    # Check if Heroku CLI is installed
    success, _, _ = run_command("heroku --version")
    if not success:
        print("❌ Heroku CLI not found. Please install it first.")
        sys.exit(1)
    
    # Set environment variables
    env_vars = {
        "DEBUG": "False",
        "SECRET_KEY": "your-production-secret-key-here",
        "CORS_ALLOW_CREDENTIALS": "True",
    }
    
    for key, value in env_vars.items():
        print(f"🔧 Setting {key}...")
        success, stdout, stderr = run_command(f'heroku config:set {key}="{value}"')
        if success:
            print(f"✅ {key} set successfully")
        else:
            print(f"❌ Failed to set {key}: {stderr}")
    
    print("\n🌐 Current Heroku config:")
    success, stdout, stderr = run_command("heroku config")
    if success:
        print(stdout)
    else:
        print(f"❌ Failed to get config: {stderr}")
    
    print("\n✅ Heroku configuration update complete!")

if __name__ == "__main__":
    main()
