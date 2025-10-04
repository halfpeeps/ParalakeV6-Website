# This script needs to be configured for each output JSON file.
import os
import json

# --- CONFIGURATION ---
BASE_IMAGE_DIR = "images/15Promotional-Material/Menu-Background-Pack"  # relative to project root
OUTPUT_JSON_DIR = "data/image_sets"  # where to write json files
URL_PREFIX = "/images/15Promotional-Material/Menu-Background-Pack"  # web path to images
OUTPUT_JSON_NAME = "wallpapers.json"  # output file name

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff"}

def collect_images(root):
    image_paths = []

    for dirpath, _, filenames in os.walk(root):
        for file in filenames:
            ext = os.path.splitext(file)[1].lower()
            if ext in IMAGE_EXTENSIONS:
                abs_path = os.path.join(dirpath, file)
                rel_path = os.path.relpath(abs_path, BASE_IMAGE_DIR)
                web_path = os.path.join(URL_PREFIX, rel_path).replace("\\", "/").lstrip("/") #remove leading /
                image_paths.append(web_path)

    return image_paths

def save_json(image_list, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(image_list, f, indent=2)
    print(f"[+] Saved: {output_path}")

def generate_single_json():
    images = collect_images(BASE_IMAGE_DIR)
    output_file = os.path.join(OUTPUT_JSON_DIR, OUTPUT_JSON_NAME)
    save_json(images, output_file)

if __name__ == "__main__":
    print("[*] Generating image JSON...")
    generate_single_json()
    print("[✓] Done.")
