#!/usr/bin/env python3
"""
Final cleanup script to remove the Garbage directory
"""

import shutil
from pathlib import Path
import os

# Use relative path based on script location
BASE_DIR = Path(__file__).parent.parent

def remove_garbage_directory():
    """Remove the Garbage directory"""
    garbage_dir = BASE_DIR / "data" / "raw" / "Garbage"
    
    if garbage_dir.exists():
        try:
            shutil.rmtree(garbage_dir)
            print("Successfully removed the Garbage directory")
        except Exception as e:
            print(f"Error removing Garbage directory: {e}")
    else:
        print("Garbage directory does not exist")

def check_final_structure():
    """Check the final directory structure"""
    base_path = BASE_DIR / "data" / "raw"
    print("\nFinal directory structure:")
    print("=" * 30)
    
    for item in base_path.iterdir():
        if item.is_dir():
            file_count = len(list(item.iterdir()))
            print(f"{item.name}/ ({file_count} items)")

if __name__ == "__main__":
    remove_garbage_directory()
    check_final_structure()