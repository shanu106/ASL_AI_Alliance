# Use Ubuntu as base to support both Node and Python
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# -------------------------------
# Install Python + FFmpeg + tools
# -------------------------------
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    python3-pip \
    ffmpeg \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# -------------------------------
# Install Node.js (v20 LTS)
# -------------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# -------------------------------
# Set working directory
# -------------------------------
WORKDIR /app

# -------------------------------
# Copy package files and install Node deps
# -------------------------------
COPY package*.json ./

# The preinstall script now sees Python in PATH ✅
RUN npm install --omit=dev

# -------------------------------
# Copy and install Python deps
# -------------------------------
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# -------------------------------
# Copy the rest of your project
# -------------------------------
COPY . .

# -------------------------------
# Expose your app port
# -------------------------------
EXPOSE 8000

# -------------------------------
# Start command
# -------------------------------
CMD ["npm", "start"]