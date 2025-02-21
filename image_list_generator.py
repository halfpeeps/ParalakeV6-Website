import os
import json


IMAGE_DIR = "images"
OUTPUT_FILE = "file_list.json"

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"}

def scan_directory(directory):
    file_tree = {}
    
    for root, _, files in os.walk(directory):
        relative_path = os.path.relpath(root, directory).replace("\\", "/") #fix problem with paths
        if relative_path == ".":
            relative_path = ""
        
        file_tree[relative_path] = [
            f for f in files if os.path.splitext(f)[1].lower() in IMAGE_EXTENSIONS
        ]
    
    return file_tree

def save_file_list(directory, output_file):
    file_tree = scan_directory(directory)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(file_tree, f, indent=4)
    print(f"File list saved to {output_file}")

if __name__ == "__main__":
    save_file_list(IMAGE_DIR, OUTPUT_FILE)
