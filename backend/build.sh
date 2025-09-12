#!/usr/bin/env bash
# build.sh - Render build script for backend

set -o errexit  # exit on error

echo "🔧 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Dependencies installed successfully!"
echo "🚀 Ready for deployment!"
