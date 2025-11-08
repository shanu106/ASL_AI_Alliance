# from project root
npm install            # install project deps

# Option A: install system ffmpeg
# macOS (Homebrew)
brew install ffmpeg

# Debian/Ubuntu
sudo apt update
sudo apt install -y ffmpeg

# Option B: use bundled ffmpeg binary (preferred if you can't install system packages)
npm install --save ffmpeg-static

# Ensure clips folder exists and contains the letter mp4 files, e.g. a.mp4..z.mp4
mkdir -p clips
ls clips

# Start the server
node index.js
# or add to package.json scripts: "start": "node index.js" and run:
npm start