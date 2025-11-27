#!/usr/bin/env python3
"""
Script to organize raw data for Civic Connect ML models
This script will reorganize your data into the proper structure:
data/raw/
├── pothole/
├── garbage/
├── streetlight/
└── water_leak/
"""

import os
import shutil
from pathlib import Path
import glob

# Use absolute path
BASE_DIR = Path("e:/mini/civic-connect")

def create_directories():
    """Create the required directory structure"""
    base_path = BASE_DIR / "data" / "raw"
    categories = ["pothole", "garbage", "streetlight", "water_leak"]
    
    for category in categories:
        category_path = base_path / category
        category_path.mkdir(parents=True, exist_ok=True)
        print(f"Created directory: {category_path}")

def move_pothole_images():
    """Move pothole images to the pothole directory"""
    base_path = BASE_DIR / "data" / "raw"
    pothole_source = base_path / "pothole_image_data" / "Pothole_Image_Data"
    
    if pothole_source.exists():
        image_count = 0
        for image_file in pothole_source.glob("*.jpg"):
            destination = base_path / "pothole" / image_file.name
            shutil.move(str(image_file), str(destination))
            image_count += 1
        print(f"Moved {image_count} pothole images")
    else:
        print("Pothole source directory not found")

def move_garbage_images():
    """Move garbage images to the garbage directory"""
    base_path = BASE_DIR / "data" / "raw"
    
    # Move from the Garbage directory
    garbage_source = base_path / "Garbage"
    if garbage_source.exists():
        image_count = 0
        for image_file in garbage_source.glob("*.jpg"):
            destination = base_path / "garbage" / image_file.name
            shutil.move(str(image_file), str(destination))
            image_count += 1
        print(f"Moved {image_count} garbage images from Garbage directory")
    
    # Move from the trash directory
    trash_source = base_path / "trash" / "trash"
    if trash_source.exists():
        image_count = 0
        for image_file in trash_source.glob("*.jpg"):
            # Rename to avoid conflicts
            new_name = f"trash_{image_file.name}"
            destination = base_path / "garbage" / new_name
            shutil.move(str(image_file), str(destination))
            image_count += 1
        print(f"Moved {image_count} garbage images from trash directory")
    
    # Move from the Garbage directory that still has files
    if garbage_source.exists():
        image_count = 0
        for image_file in garbage_source.glob("*.jpg"):
            destination = base_path / "garbage" / image_file.name
            shutil.move(str(image_file), str(destination))
            image_count += 1
        print(f"Moved {image_count} remaining garbage images from Garbage directory")

def move_streetlight_images():
    """Create placeholder for streetlight images - you can add these manually"""
    print("Streetlight directory created - please add streetlight images manually")

def move_water_leak_images():
    """Create placeholder for water leak images - you can add these manually"""
    print("Water leak directory created - please add water leak images manually")

def remove_annotation_files():
    """Remove annotation files that are not needed for training"""
    base_path = BASE_DIR / "data" / "raw"
    
    # Remove XML files from Garbage directory
    garbage_dir = base_path / "Garbage"
    if garbage_dir.exists():
        xml_count = 0
        for xml_file in garbage_dir.glob("*.xml"):
            xml_file.unlink()
            xml_count += 1
        print(f"Removed {xml_count} XML files from Garbage directory")
    
    # Remove annotation directory
    annotation_dir = base_path / "annotation"
    if annotation_dir.exists():
        shutil.rmtree(annotation_dir)
        print("Removed annotation directory")
    
    # Remove original nested directories
    pothole_data_dir = base_path / "pothole_image_data"
    if pothole_data_dir.exists():
        shutil.rmtree(pothole_data_dir)
        print("Removed pothole_image_data directory")
    
    trash_dir = base_path / "trash"
    if trash_dir.exists():
        shutil.rmtree(trash_dir)
        print("Removed trash directory")
    
    # Remove the Garbage directory if it's empty
    if garbage_dir.exists() and not any(garbage_dir.iterdir()):
        garbage_dir.rmdir()
        print("Removed empty Garbage directory")

def move_remaining_garbage_images():
    """Move remaining garbage images that might be in unexpected locations"""
    base_path = BASE_DIR / "data" / "raw"
    garbage_source = base_path / "Garbage"
    
    if garbage_source.exists():
        # Move all remaining files in the Garbage directory to garbage category
        garbage_count = 0
        for file_path in garbage_source.iterdir():
            if file_path.is_file() and file_path.suffix.lower() in ['.jpg', '.jpeg', '.png']:
                destination = base_path / "garbage" / file_path.name
                shutil.move(str(file_path), str(destination))
                garbage_count += 1
        print(f"Moved {garbage_count} remaining garbage images")

def main():
    """Main function to organize all data"""
    print("Organizing Civic Connect raw data...")
    print("=" * 40)
    
    # Create proper directory structure
    create_directories()
    
    # Move images to proper categories
    move_pothole_images()
    move_garbage_images()
    move_remaining_garbage_images()
    move_streetlight_images()
    move_water_leak_images()
    
    # Clean up annotation files and original directories
    remove_annotation_files()
    
    print("=" * 40)
    print("Data organization complete!")
    print("Your data is now organized in the proper structure for training.")

if __name__ == "__main__":
    main()