import os

def count_images(directory="."):
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'}
    image_count = 0

    for root, _, files in os.walk(directory):
        image_count += sum(1 for file in files if os.path.splitext(file)[1].lower() in image_extensions)

    return image_count

if __name__ == "__main__":
    total_images = count_images()
    print(f"Total images found: {total_images}")
    input("Press any key to exit...")