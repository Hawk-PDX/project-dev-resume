# Contact form functionality has been removed to simplify the project
# This file is kept for potential future use

from flask import Blueprint, jsonify

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/contact', methods=['GET'])
def contact_info():
    """Return contact information (kept for reference)"""
    return jsonify({
        'message': 'Contact form functionality has been disabled. Please use direct email or other contact methods.',
        'status': 'disabled'
    })
