import subprocess
import sys
import os
import string

# Path to your Blender executable
BLENDER_PATH = "/Applications/Blender.app/Contents/MacOS/Blender"  # adjust if on Windows/Linux

# Files
BLEND_FILE = "final_hello.blend"
SCRIPTS_DIR = "/Users/shahnawajrangrej/Desktop/AI_Alliance/gestures_blender/ALPHABATES"

def run_gesture(script_file):
    filename = os.path.basename(script_file)
    output_file = f"{os.path.splitext(filename)[0]}.mp4"

    # Blender command
    cmd = [
        BLENDER_PATH,
        "-b", BLEND_FILE,
        "-P", script_file,
        "--",
        output_file
    ]

    print("🚀 Running:", " ".join(cmd))
    subprocess.run(cmd, check=True)

if __name__ == "__main__":
    # Loop through A–Z
    for letter in string.ascii_lowercase:  # 'a' to 'z'
        script_path = os.path.join(SCRIPTS_DIR, f"{letter}.py")
        if os.path.exists(script_path):
            run_gesture(script_path)
        else:
            print(f"⚠️ Script not found: {script_path}")