#!/usr/bin/env python3
"""
Data Preparation Script for Civic Connect ML Models
This script demonstrates how to prepare data for training the ML models.
"""

import os
import shutil
from PIL import Image
import numpy as np

def create_directory_structure(base_dir):
    """Create the directory structure for training data"""
    classes = ['pothole', 'garbage', 'streetlight', 'water_leak', 'other']
    splits = ['train', 'val', 'test']
    
    for split in splits:
        split_dir = os.path.join(base_dir, split)
        os.makedirs(split_dir, exist_ok=True)
        
        for cls in classes:
            cls_dir = os.path.join(split_dir, cls)
            os.makedirs(cls_dir, exist_ok=True)
    
    print(f"Created directory structure in {base_dir}")

def resize_images(source_dir, target_dir, size=(224, 224)):
    """Resize images to a consistent size"""
    if not os.path.exists(source_dir):
        print(f"Source directory {source_dir} does not exist")
        return
    
    os.makedirs(target_dir, exist_ok=True)
    
    for filename in os.listdir(source_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            source_path = os.path.join(source_dir, filename)
            target_path = os.path.join(target_dir, filename)
            
            try:
                with Image.open(source_path) as img:
                    # Resize image
                    img_resized = img.resize(size)
                    # Convert to RGB if necessary
                    if img_resized.mode != 'RGB':
                        img_resized = img_resized.convert('RGB')
                    # Save resized image
                    img_resized.save(target_path)
            except Exception as e:
                print(f"Error processing {filename}: {e}")
    
    print(f"Resized images from {source_dir} to {target_dir}")

def split_dataset(source_dir, train_dir, val_dir, test_dir, split_ratios=(0.7, 0.2, 0.1)):
    """Split dataset into train, validation, and test sets"""
    train_ratio, val_ratio, test_ratio = split_ratios
    
    for class_name in os.listdir(source_dir):
        class_dir = os.path.join(source_dir, class_name)
        if not os.path.isdir(class_dir):
            continue
        
        # Get all images in class directory
        images = [f for f in os.listdir(class_dir) 
                 if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        
        # Shuffle images
        np.random.shuffle(images)
        
        # Calculate split indices
        train_end = int(len(images) * train_ratio)
        val_end = int(len(images) * (train_ratio + val_ratio))
        
        # Split images
        train_images = images[:train_end]
        val_images = images[train_end:val_end]
        test_images = images[val_end:]
        
        # Copy images to respective directories
        for img in train_images:
            src = os.path.join(class_dir, img)
            dst = os.path.join(train_dir, class_name, img)
            shutil.copy2(src, dst)
        
        for img in val_images:
            src = os.path.join(class_dir, img)
            dst = os.path.join(val_dir, class_name, img)
            shutil.copy2(src, dst)
        
        for img in test_images:
            src = os.path.join(class_dir, img)
            dst = os.path.join(test_dir, class_name, img)
            shutil.copy2(src, dst)
    
    print("Dataset split completed")

def main():
    """Main function to demonstrate data preparation"""
    print("Civic Connect Data Preparation Script")
    print("=" * 40)
    print("This script demonstrates how to prepare data for training ML models.")
    print("\nIn a real implementation, you would:")
    print("1. Organize your raw images in class-specific directories")
    print("2. Resize images to a consistent size")
    print("3. Split the dataset into train/validation/test sets")
    print("4. Apply any necessary preprocessing")
    print("\nExample usage:")
    print("python prepare_data.py --source_dir ../data/raw --target_dir ../data/processed")

if __name__ == "__main__":
    main()