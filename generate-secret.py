#!/usr/bin/env python3
"""
Script to generate a secure secret key for Flask applications.
Run this to generate a SECRET_KEY for your production environment.
"""

import secrets
import sys

def generate_secret_key():
    """Generate a secure random secret key."""
    return secrets.token_hex(32)

if __name__ == "__main__":
    secret_key = generate_secret_key()
    print("Generated SECRET_KEY for production:")
    print(f"SECRET_KEY={secret_key}")
    print("\nCopy this value and set it in your Render environment variables.")
    print("You can also add it to your .env.production file for reference:")
    print(f"SECRET_KEY={secret_key}")
