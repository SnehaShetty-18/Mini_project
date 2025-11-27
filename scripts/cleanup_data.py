#!/usr/bin/env python3
"""
Script to clean up remaining data organization issues
"""

import os
import shutil
from pathlib import Path

# Use absolute path
BASE_DIR = Path("e:/mini/civic-connect")

def cleanup_remaining_files():
    """Move remaining files from Garbage to garbage directory"""
    base_path = BASE_DIR / "data" / "raw"
    garbage_source = base_path / "Garbage"
    garbage_dest = base_path / "garbage"
    
    if garbage_source.exists() and garbage_dest.exists():
        moved_count = 0
        for file_path in garbage_source.iterdir():
            if file_path.is_file():
                destination = garbage_dest / file_path.name
                # Handle duplicate names by adding a suffix
                counter = 1
                original_destination = destination
                while destination.exists():
                    name_parts = file_path.name.split('.')
                    if len(name_parts) > 1:
                        new_name = f"{'.'.join(name_parts[:-1])}_{counter}.{name_parts[-1]}"
                    else:
                        new_name = f"{file_path.name}_{counter}"
                    destination = garbage_dest / new_name
                    counter += 1
                
                shutil.move(str(file_path), str(destination))
                moved_count += 1
        print(f"Moved {moved_count} remaining files from Garbage to garbage directory")
        
        # Remove the empty Garbage directory
        if not any(garbage_source.iterdir()):
            garbage_source.rmdir()
            print("Removed empty Garbage directory")

def main():
    """Main function to clean up data"""
    print("Cleaning up remaining data organization issues...")
    print("=" * 50)
    
    cleanup_remaining_files()
    
    print("=" * 50)
    print("Data cleanup complete!")

if __name__ == "__main__":
    main()