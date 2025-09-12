#!/usr/bin/env bash
# build.sh - Render build script for backend

set -o errexit  # exit on error

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run database migrations
echo "Running database migrations..."
flask db upgrade

# Seed database with initial data
echo "Seeding database..."
python seed_db.py

echo "Build completed successfully!"