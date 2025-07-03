import os
import django
import sqlite3

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

def fix_education_database():
    """Fix the education database schema by adding missing columns"""
    
    # Get the database path
    from django.conf import settings
    db_path = settings.DATABASES['default']['NAME']
    
    print(f"Fixing database at: {db_path}")
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if education tables exist
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'education_%';")
        tables = cursor.fetchall()
        print(f"Found education tables: {tables}")
        
        # Check if video_file column exists
        cursor.execute("PRAGMA table_info(education_educationalvideo)")
        columns = [column[1] for column in cursor.fetchall()]
        print(f"Current columns in education_educationalvideo: {columns}")
        
        # Add missing columns if they don't exist
        if 'video_file' not in columns:
            print("Adding video_file column...")
            cursor.execute("ALTER TABLE education_educationalvideo ADD COLUMN video_file VARCHAR(100) NULL")
        
        if 'thumbnail_file' not in columns:
            print("Adding thumbnail_file column...")
            cursor.execute("ALTER TABLE education_educationalvideo ADD COLUMN thumbnail_file VARCHAR(100) NULL")
        
        if 'video_url' not in columns:
            print("Adding video_url column...")
            cursor.execute("ALTER TABLE education_educationalvideo ADD COLUMN video_url VARCHAR(200) NULL")
        
        if 'thumbnail_url' not in columns:
            print("Adding thumbnail_url column...")
            cursor.execute("ALTER TABLE education_educationalvideo ADD COLUMN thumbnail_url VARCHAR(200) NULL")
        
        if 'updated_at' not in columns:
            print("Adding updated_at column...")
            cursor.execute("ALTER TABLE education_educationalvideo ADD COLUMN updated_at DATETIME NULL")
        
        # Check if created_at column exists in VideoCategory
        cursor.execute("PRAGMA table_info(education_videocategory)")
        category_columns = [column[1] for column in cursor.fetchall()]
        print(f"Current columns in education_videocategory: {category_columns}")
        
        if 'created_at' not in category_columns:
            print("Adding created_at column to VideoCategory...")
            cursor.execute("ALTER TABLE education_videocategory ADD COLUMN created_at DATETIME NULL")
        
        # Commit changes
        conn.commit()
        print("Database fixed successfully!")
        
        # Verify the changes
        cursor.execute("PRAGMA table_info(education_educationalvideo)")
        new_columns = [column[1] for column in cursor.fetchall()]
        print(f"Updated columns in education_educationalvideo: {new_columns}")
        
        cursor.execute("PRAGMA table_info(education_videocategory)")
        new_category_columns = [column[1] for column in cursor.fetchall()]
        print(f"Updated columns in education_videocategory: {new_category_columns}")
        
    except Exception as e:
        print(f"Error fixing database: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    fix_education_database()
