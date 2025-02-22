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
            {"filename": f, "description": ""}
            for f in files if os.path.splitext(f)[1].lower() in IMAGE_EXTENSIONS
        ]
    return file_tree

def load_existing_file_list(output_file):
    if os.path.exists(output_file):
        with open(output_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def update_descriptions(existing_tree, new_tree):
    for path, files in new_tree.items():
        if path not in existing_tree:
            existing_tree[path] = files
        else:
            existing_files = {file["filename"]: file for file in existing_tree[path]}
            for new_file in files:
                if new_file["filename"] in existing_files:
                    new_file["description"] = existing_files[new_file["filename"]]["description"]
    return new_tree

def save_file_list(directory, output_file):
    existing_file_list = load_existing_file_list(output_file)
    new_file_tree = scan_directory(directory)
    updated_file_tree = update_descriptions(existing_file_list, new_file_tree)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(updated_file_tree, f, indent=4)
    print(f"File list saved to {output_file}")

if __name__ == "__main__":
    save_file_list(IMAGE_DIR, OUTPUT_FILE)
