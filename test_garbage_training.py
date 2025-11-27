"""
Test script to verify garbage dataset and prepare for training
"""
from pathlib import Path

def check_garbage_dataset():
    """Check if we have the garbage dataset available"""
    print("Checking garbage dataset...")
    
    # Check raw data directory
    data_dir = Path("data/raw")
    if not data_dir.exists():
        print("❌ Data directory not found")
        return False
    
    # Check for garbage folder
    garbage_dir = data_dir / "Garbage"
    if not garbage_dir.exists():
        print("❌ Garbage directory not found")
        return False
    
    # Count garbage images
    garbage_images = list(garbage_dir.glob("*.[jJ][pP][gG]")) + list(garbage_dir.glob("*.[jJ][pP][eE][gG]")) + list(garbage_dir.glob("*.[pP][nN][gG]"))
    print(f"✅ Found {len(garbage_images)} garbage images")
    
    # Check other classes
    classes = ["pothole", "streetlight"]
    for class_name in classes:
        class_dir = data_dir / class_name
        if class_dir.exists():
            images = list(class_dir.glob("*.[jJ][pP][gG]")) + list(class_dir.glob("*.[jJ][pP][eE][gG]")) + list(class_dir.glob("*.[pP][nN][gG]"))
            print(f"✅ Found {len(images)} {class_name} images")
        else:
            print(f"⚠️  {class_name} directory not found")
    
    return len(garbage_images) > 0

def main():
    print("Civic Connect - Garbage Dataset Verification")
    print("=" * 45)
    
    if check_garbage_dataset():
        print("\n✅ Garbage dataset is ready for training!")
        print("\nTo train the garbage detection model, run:")
        print("  train_resnet50_garbage.bat")
        print("\nOr manually execute:")
        print("  cd ml-models/classification")
        print("  py -3.11 train_resnet50_garbage.py")
    else:
        print("\n❌ Garbage dataset not found or incomplete")

if __name__ == "__main__":
    main()