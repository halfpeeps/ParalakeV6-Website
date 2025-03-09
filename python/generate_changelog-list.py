import os
import json

def generate_changelog_list(directory):
    changelog_entries = []
    
    # Iterate over all JSON files in the changelogs directory
    for filename in sorted(os.listdir(directory), reverse=True):
        if filename.endswith(".json"):
            filepath = os.path.join(directory, filename)
            
            # Read the JSON file to extract metadata
            with open(filepath, "r", encoding="utf-8") as file:
                try:
                    data = json.load(file)
                    changelog_entries.append({
                        "file": filename,
                        "date": data.get("date", "Unknown Date")
                    })
                except json.JSONDecodeError:
                    print(f"Skipping invalid JSON file: {filename}")
    
    # Save to changelog-list.json
    output_path = os.path.join(directory, "../changelog-list.json")
    with open(output_path, "w", encoding="utf-8") as output_file:
        json.dump(changelog_entries, output_file, indent=4)
    
    print("changelog-list.json generated successfully.")

# Run the function
if __name__ == "__main__":
    generate_changelog_list("changelogs")
