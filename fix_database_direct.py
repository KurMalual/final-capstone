import sqlite3
import os
from pathlib import Path

def fix_database():
    """Directly fix the database schema"""
    
    # Get the database path
    db_path = Path(__file__).parent / 'db.sqlite3'
    
    if not db_path.exists():
        print(f"❌ Database not found at {db_path}")
        return False
    
    print(f"🔧 Fixing database at {db_path}...")
    
    try:
        # Connect to the database
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()
        
        # Check current table structure
        cursor.execute("PRAGMA table_info(products_product)")
        columns = [column[1] for column in cursor.fetchall()]
        print(f"Current columns: {columns}")
        
        # Add the image column if it doesn't exist
        if 'image' not in columns:
            print("Adding 'image' column...")
            cursor.execute("ALTER TABLE products_product ADD COLUMN image VARCHAR(100) NULL")
            conn.commit()
            print("✅ Added 'image' column successfully")
        else:
            print("✅ 'image' column already exists")
        
        # Verify the change
        cursor.execute("PRAGMA table_info(products_product)")
        new_columns = [column[1] for column in cursor.fetchall()]
        print(f"Updated columns: {new_columns}")
        
        # Close connection
        conn.close()
        
        print("🎉 Database fix completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error fixing database: {e}")
        return False

if __name__ == '__main__':
    fix_database()
