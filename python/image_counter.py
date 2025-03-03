import os

def get_total_image_size(directory):
    total_size = 0
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'}
    
    for root, _, files in os.walk(directory):
        for file in files:
            if any(file.lower().endswith(ext) for ext in image_extensions):
                file_path = os.path.join(root, file)
                try:
                    total_size += os.path.getsize(file_path)
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
    
    return total_size

def count_images(directory):
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'}
    image_count = 0

    for root, _, files in os.walk(directory):
        image_count += sum(1 for file in files if os.path.splitext(file)[1].lower() in image_extensions)

    return image_count

if __name__ == "__main__":
    current_directory = os.getcwd()
    total_size = get_total_image_size(current_directory)
    total_images = count_images(current_directory)
    print(f"Total images found: {total_images}")
    print(f"Total size of all images: {total_size / (1024 * 1024):.2f} MB")
    input("Press Enter to exit...")
