import json
from datetime import datetime

# Path to JSON file
file_path = "reflections.json"

# Ask user for input
reflection = input("Enter your reflection: ")

# Create a dictionary for the entry
entry = {
    "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "reflection": reflection
}

# Load existing data
try:
    with open(file_path, "r") as f:
        data = json.load(f)
except FileNotFoundError:
    data = []

# Append new entry
data.append(entry)

# Save back to JSON file
with open(file_path, "w") as f:
    json.dump(data, f, indent=4)

print("Reflection saved successfully!")
