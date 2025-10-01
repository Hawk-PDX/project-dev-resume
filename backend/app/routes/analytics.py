"""
Analytics API Routes with Real-Time WebSocket Support

Provides comprehensive analytics endpoints for:
- Session tracking and management
- Event collection and real-time streaming
- Historical metrics and reporting
- Data export and visualization
- System health monitoring
"""

import json
from datetime import datetime, date, timedelta
from flask import Blueprint, request, jsonify, current_app
from flask_socketio import emit, join_room, leave_room
from app import db, socketio
from app.services.analytics_service import AnalyticsService
from app.models import AnalyticsSession, AnalyticsEvent, AnalyticsMetrics, SystemHealth

# Create blueprint
analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')

# REST API Endpoints
@analytics_bp.route('/session', methods=['POST'])
def create_session():
    """Create or update analytics session"""
    try:
        data = request.get_json()
        session = AnalyticsService.create_or_update_session(data)
        
        return jsonify({
            'success': True,
            'session_id': session.id,
            'message': 'Session created/updated successfully'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Session creation error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/event', methods=['POST'])
def track_event():
    """Track analytics event"""
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        
        if not session_id:
            return jsonify({'success': False, 'error': 'Session ID required'}), 400
        
        event = AnalyticsService.track_event(session_id, data)
        
        return jsonify({
            'success': True,
            'event_id': event.id,
            'message': 'Event tracked successfully'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Event tracking error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/metrics/realtime', methods=['GET'])
def get_realtime_metrics():
    """Get real-time analytics metrics"""
    try:
        metrics = AnalyticsService.get_real_time_metrics()
        return jsonify({
            'success': True,
            'data': metrics
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Real-time metrics error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/metrics/historical', methods=['GET'])
def get_historical_metrics():
    """Get historical analytics data"""
    try:
        days = request.args.get('days', 30, type=int)
        metrics = AnalyticsService.get_historical_metrics(days)
        
        return jsonify({
            'success': True,
            'data': metrics
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Historical metrics error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/metrics/calculate', methods=['POST'])
def calculate_daily_metrics():
    """Manually trigger daily metrics calculation"""
    try:
        data = request.get_json() or {}
        target_date_str = data.get('date')
        
        if target_date_str:
            target_date = datetime.strptime(target_date_str, '%Y-%m-%d').date()
        else:
            target_date = None
        
        metrics = AnalyticsService.calculate_daily_metrics(target_date)
        
        return jsonify({
            'success': True,
            'data': {
                'date': metrics.date.isoformat(),
                'unique_visitors': metrics.unique_visitors,
                'total_sessions': metrics.total_sessions,
                'message': 'Daily metrics calculated successfully'
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Metrics calculation error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/health', methods=['GET'])
def get_system_health():
    """Get system health metrics"""
    try:
        health = AnalyticsService.log_system_health()
        
        return jsonify({
            'success': True,
            'data': {
                'cpu_usage': health.cpu_usage,
                'memory_usage': health.memory_usage,
                'disk_usage': health.disk_usage,
                'status': health.status,
                'timestamp': health.timestamp.isoformat()
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"System health error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/export', methods=['POST'])
def export_analytics():
    """Export analytics data"""
    try:
        data = request.get_json() or {}
        format_type = data.get('format', 'json')
        days = data.get('days', 30)
        
        end_date = date.today()
        start_date = end_date - timedelta(days=days)
        
        export_data = AnalyticsService.export_data(format_type, (start_date, end_date))
        
        return jsonify({
            'success': True,
            'data': export_data
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Export error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/sessions/active', methods=['GET'])
def get_active_sessions():
    """Get currently active sessions"""
    try:
        threshold = datetime.utcnow() - timedelta(minutes=5)
        sessions = AnalyticsSession.query.filter(
            AnalyticsSession.last_activity >= threshold,
            AnalyticsSession.is_active == True
        ).all()
        
        session_data = []
        for session in sessions:
            session_data.append({
                'id': session.id,
                'device_type': session.device_type,
                'browser': session.browser,
                'os': session.os,
                'started_at': session.started_at.isoformat(),
                'last_activity': session.last_activity.isoformat(),
                'page_views': session.page_views,
                'total_time': session.total_time_seconds
            })
        
        return jsonify({
            'success': True,
            'data': {
                'active_count': len(sessions),
                'sessions': session_data
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Active sessions error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/events/recent', methods=['GET'])
def get_recent_events():
    """Get recent events for live feed"""
    try:
        limit = request.args.get('limit', 50, type=int)
        hours = request.args.get('hours', 24, type=int)
        
        threshold = datetime.utcnow() - timedelta(hours=hours)
        events = AnalyticsEvent.query.filter(
            AnalyticsEvent.timestamp >= threshold
        ).order_by(AnalyticsEvent.timestamp.desc()).limit(limit).all()
        
        event_data = []
        for event in events:
            event_data.append({
                'id': event.id,
                'event_type': event.event_type,
                'event_category': event.event_category,
                'event_label': event.event_label,
                'page_path': event.page_path,
                'timestamp': event.timestamp.isoformat(),
                'session_device': event.session.device_type if event.session else 'unknown'
            })
        
        return jsonify({
            'success': True,
            'data': {
                'count': len(events),
                'events': event_data
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Recent events error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

# WebSocket Event Handlers
@socketio.on('connect', namespace='/analytics')
def analytics_connect():
    """Handle analytics dashboard connection"""
    print(f"Analytics client connected: {request.sid}")
    join_room('analytics_room')
    
    # Send initial data
    try:
        metrics = AnalyticsService.get_real_time_metrics()
        emit('initial_metrics', metrics)
    except Exception as e:
        current_app.logger.error(f"Initial metrics error: {str(e)}")
        emit('error', {'message': 'Failed to load initial metrics'})

@socketio.on('disconnect', namespace='/analytics')
def analytics_disconnect():
    """Handle analytics dashboard disconnection"""
    print(f"Analytics client disconnected: {request.sid}")
    leave_room('analytics_room')

@socketio.on('subscribe_to_events', namespace='/analytics')
def subscribe_to_events(data):
    """Subscribe to specific event types"""
    try:
        event_types = data.get('event_types', [])
        if event_types:
            join_room('event_subscribers')
            emit('subscription_confirmed', {
                'event_types': event_types,
                'message': 'Subscribed to real-time events'
            })
        else:
            emit('error', {'message': 'No event types specified'})
            
    except Exception as e:
        current_app.logger.error(f"Event subscription error: {str(e)}")
        emit('error', {'message': 'Subscription failed'})

@socketio.on('request_metrics_update', namespace='/analytics')
def request_metrics_update():
    """Request immediate metrics update"""
    try:
        metrics = AnalyticsService.get_real_time_metrics()
        emit('metrics_update', metrics)
    except Exception as e:
        current_app.logger.error(f"Metrics update error: {str(e)}")
        emit('error', {'message': 'Failed to update metrics'})

@socketio.on('request_health_check', namespace='/analytics')
def request_health_check():
    """Request system health check"""
    try:
        health = AnalyticsService.log_system_health()
        emit('health_update', {
            'cpu': health.cpu_usage,
            'memory': health.memory_usage,
            'disk': health.disk_usage,
            'status': health.status,
            'timestamp': health.timestamp.isoformat()
        })
    except Exception as e:
        current_app.logger.error(f"Health check error: {str(e)}")
        emit('error', {'message': 'Health check failed'})

# Background Tasks for Real-Time Updates
def broadcast_metrics_update():
    """Broadcast real-time metrics to all connected clients"""
    try:
        metrics = AnalyticsService.get_real_time_metrics()
        socketio.emit('metrics_update', metrics, namespace='/analytics', room='analytics_room')
    except Exception as e:
        current_app.logger.error(f"Metrics broadcast error: {str(e)}")

def broadcast_health_update():
    """Broadcast system health update"""
    try:
        health = AnalyticsService.log_system_health()
        socketio.emit('health_update', {
            'cpu': health.cpu_usage,
            'memory': health.memory_usage,
            'disk': health.disk_usage,
            'status': health.status,
            'timestamp': health.timestamp.isoformat()
        }, namespace='/analytics', room='analytics_room')
    except Exception as e:
        current_app.logger.error(f"Health broadcast error: {str(e)}")

def broadcast_event_update(event_data):
    """Broadcast new event to subscribers"""
    try:
        socketio.emit('event_update', event_data, namespace='/analytics', room='event_subscribers')
    except Exception as e:
        current_app.logger.error(f"Event broadcast error: {str(e)}")

# Utility functions for external use
def emit_custom_event(event_type, data):
    """Emit custom event to analytics namespace"""
    socketio.emit(event_type, data, namespace='/analytics', room='analytics_room')

def get_analytics_stats():
    """Get basic analytics statistics for admin panel"""
    try:
        today = date.today()
        
        # Today's stats
        today_sessions = AnalyticsSession.query.filter(
            db.func.date(AnalyticsSession.started_at) == today
        ).count()
        
        # Active sessions (last 30 minutes)
        active_threshold = datetime.utcnow() - timedelta(minutes=30)
        active_sessions = AnalyticsSession.query.filter(
            AnalyticsSession.last_activity >= active_threshold,
            AnalyticsSession.is_active == True
        ).count()
        
        # Total events today
        today_events = AnalyticsEvent.query.join(AnalyticsSession).filter(
            db.func.date(AnalyticsEvent.timestamp) == today
        ).count()
        
        return {
            'today_sessions': today_sessions,
            'active_sessions': active_sessions,
            'today_events': today_events,
            'status': 'healthy'
        }
        
    except Exception as e:
        current_app.logger.error(f"Analytics stats error: {str(e)}")
        return {
            'today_sessions': 0,
            'active_sessions': 0,
            'today_events': 0,
            'status': 'error'
        }