import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from django.contrib.sessions.models import Session

def clear_sessions():
    """Clear all sessions to fix corruption issues"""
    print("🧹 Clearing all sessions...")
    
    session_count = Session.objects.count()
    Session.objects.all().delete()
    
    print(f"✅ Cleared {session_count} sessions")
    print("🔄 Please restart your Django server")

if __name__ == '__main__':
    clear_sessions()
