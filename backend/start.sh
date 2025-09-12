#!/usr/bin/env bash
# start.sh - Render start script for backend

set -o errexit  # exit on error

echo "🚀 Starting Flask backend on Render..."
echo "🌐 Starting Gunicorn server on port $PORT..."

# Start the application with database initialization
exec gunicorn --bind 0.0.0.0:$PORT \
    --workers 2 \
    --timeout 60 \
    --preload \
    run:app
