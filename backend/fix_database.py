#!/usr/bin/env python
import os
import sys
import sqlite3
import django
from pathlib import Path

# Add the backend directory to Python path
sys.path.append(str(Path(__file__).parent))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from django.conf import settings

def fix_database():
    """Fix the database schema issues"""
    
    db_path = settings.DATABASES['default']['NAME']
    print(f"🔧 Fixing database at {db_path}...")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if the image column exists in products_product table
    cursor.execute("PRAGMA table_info(products_product)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'image' not in columns:
        print("Adding 'image' column to products_product table...")
        try:
            cursor.execute("ALTER TABLE products_product ADD COLUMN image varchar(100) NULL")
            conn.commit()
            print("✅ Added 'image' column successfully")
        except sqlite3.OperationalError as e:
            print(f"⚠️ Error adding column: {e}")
    else:
        print("✅ 'image' column already exists")
    
    # Create education tables if they don't exist
    print("Creating education app tables if they don't exist...")
    
    try:
        # Create VideoCategory table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS education_videocategory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            created_at DATETIME NOT NULL
        )
        """)
        
        # Create EducationalVideo table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS education_educationalvideo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(200) NOT NULL,
            description TEXT NOT NULL,
            video_file VARCHAR(100) NOT NULL,
            thumbnail VARCHAR(100) NULL,
            duration VARCHAR(10) NULL,
            views INTEGER NOT NULL,
            is_active BOOLEAN NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            category_id INTEGER NOT NULL,
            FOREIGN KEY (category_id) REFERENCES education_videocategory (id)
        )
        """)
        
        # Create VideoView table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS education_videoview (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            viewed_at DATETIME NOT NULL,
            user_id INTEGER NOT NULL,
            video_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users_user (id),
            FOREIGN KEY (video_id) REFERENCES education_educationalvideo (id),
            UNIQUE (video_id, user_id)
        )
        """)
        
        conn.commit()
        print("✅ Education tables created successfully")
    except sqlite3.OperationalError as e:
        print(f"⚠️ Error creating tables: {e}")
    
    # Close connection
    conn.close()
    
    print("🎉 Database fix completed!")
    return True

if __name__ == '__main__':
    fix_database()
