from flask import Blueprint, request, jsonify, current_app
from app import db
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

logger = logging.getLogger(__name__)

contact_bp = Blueprint('contact', __name__)

class EmailService:
    @staticmethod
    def send_email_via_smtp(name, email, message, to_email):
        """Send email using SMTP"""
        try:
            smtp_server = os.getenv('SMTP_SERVER')
            smtp_port = int(os.getenv('SMTP_PORT', 587))
            smtp_username = os.getenv('SMTP_USERNAME')
            smtp_password = os.getenv('SMTP_PASSWORD')
            from_email = os.getenv('FROM_EMAIL')
            
            msg = MIMEMultipart()
            msg['From'] = from_email
            msg['To'] = to_email
            msg['Subject'] = f'Portfolio Contact Form: {name}'
            
            body = f"""
            New contact form submission:
            
            Name: {name}
            Email: {email}
            
            Message:
            {message}
            
            ---
            Sent from your portfolio website
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(smtp_username, smtp_password)
                server.send_message(msg)
            
            return True
        except Exception as e:
            logger.error(f"SMTP email error: {e}")
            return False

    @staticmethod
    def send_email_via_console(name, email, message, to_email):
        """Log email to console (for development)"""
        print(f"\n=== PORTFOLIO CONTACT FORM ===\n")
        print(f"From: {name} <{email}>")
        print(f"To: {to_email}")
        print(f"Message:\n{message}\n")
        print("=== END ===\n")
        return True

def get_email_service():
    """Get the appropriate email service based on configuration"""
    email_service = os.getenv('EMAIL_SERVICE', 'console').lower()
    
    if email_service == 'smtp':
        return EmailService.send_email_via_smtp
    elif email_service == 'sendgrid':
        # Placeholder for SendGrid integration
        return EmailService.send_email_via_console
    elif email_service == 'mailgun':
        # Placeholder for Mailgun integration
        return EmailService.send_email_via_console
    else:
        return EmailService.send_email_via_console

@contact_bp.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submissions"""
    try:
        data = request.get_json()
        
        # Basic validation
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        name = data['name']
        email = data['email']
        message = data['message']
        to_email = os.getenv('TO_EMAIL')
        
        if not to_email:
            return jsonify({'error': 'Email configuration missing'}), 500
        
        # Get email service and send message
        send_email = get_email_service()
        success = send_email(name, email, message, to_email)
        
        if success:
            logger.info(f"Contact form submitted by {name} ({email})")
            return jsonify({
                'message': 'Thank you for your message! I will get back to you soon.',
                'success': True
            }), 200
        else:
            return jsonify({
                'error': 'Failed to send message. Please try again later.',
                'success': False
            }), 500
            
    except Exception as e:
        logger.error(f"Contact form error: {e}")
        return jsonify({
            'error': 'An unexpected error occurred. Please try again.',
            'success': False
        }), 500
