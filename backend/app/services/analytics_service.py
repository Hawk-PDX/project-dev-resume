"""
Real-Time Analytics Service for Portfolio Application

This service handles:
- Session tracking and user identification
- Event collection and processing
- Real-time metrics calculation
- Performance monitoring
- WebSocket communication for live updates
"""

import uuid
import json
import psutil
import time
from datetime import datetime, date, timedelta
from typing import Dict, List, Optional, Any
from flask import request, current_app
from sqlalchemy import func, desc, and_
from app import db, socketio
from app.models import (
    AnalyticsSession, AnalyticsEvent, AnalyticsMetrics, 
    SystemHealth, Project, Skill
)

class AnalyticsService:
    """Comprehensive analytics service for portfolio tracking"""
    
    @staticmethod
    def create_or_update_session(session_data: Dict[str, Any]) -> AnalyticsSession:
        """Create new session or update existing one"""
        session_id = session_data.get('session_id')
        
        if session_id:
            session = AnalyticsSession.query.get(session_id)
            if session:
                # Update existing session
                session.last_activity = datetime.utcnow()
                session.page_views += 1
                session.total_time_seconds = int(
                    (datetime.utcnow() - session.started_at).total_seconds()
                )
                db.session.commit()
                return session
        
        # Create new session
        session = AnalyticsSession(
            id=str(uuid.uuid4()),
            ip_address=AnalyticsService._get_client_ip(),
            user_agent=request.headers.get('User-Agent', ''),
            referrer=session_data.get('referrer', ''),
            country=session_data.get('country', ''),
            city=session_data.get('city', ''),
            device_type=AnalyticsService._detect_device_type(),
            browser=AnalyticsService._detect_browser(),
            os=AnalyticsService._detect_os(),
            screen_resolution=session_data.get('screen_resolution', ''),
            page_views=1
        )
        
        db.session.add(session)
        db.session.commit()
        
        # Emit real-time update
        AnalyticsService._emit_session_update(session)
        
        return session
    
    @staticmethod
    def track_event(session_id: str, event_data: Dict[str, Any]) -> AnalyticsEvent:
        """Track a specific user interaction event"""
        event = AnalyticsEvent(
            session_id=session_id,
            event_type=event_data.get('event_type', 'unknown'),
            event_category=event_data.get('event_category', 'general'),
            event_label=event_data.get('event_label', ''),
            page_path=event_data.get('page_path', ''),
            element_id=event_data.get('element_id', ''),
            event_metadata=event_data.get('metadata', {}),
            page_load_time=event_data.get('page_load_time'),
            time_on_page=event_data.get('time_on_page')
        )
        
        db.session.add(event)
        db.session.commit()
        
        # Update session activity
        session = AnalyticsSession.query.get(session_id)
        if session:
            session.last_activity = datetime.utcnow()
            db.session.commit()
        
        # Emit real-time event update
        AnalyticsService._emit_event_update(event)
        
        return event
    
    @staticmethod
    def get_real_time_metrics() -> Dict[str, Any]:
        """Get current real-time metrics"""
        now = datetime.utcnow()
        today = date.today()
        
        # Active sessions (last 5 minutes)
        active_threshold = now - timedelta(minutes=5)
        active_sessions = AnalyticsSession.query.filter(
            and_(
                AnalyticsSession.last_activity >= active_threshold,
                AnalyticsSession.is_active == True
            )
        ).count()
        
        # Today's metrics
        today_sessions = AnalyticsSession.query.filter(
            func.date(AnalyticsSession.started_at) == today
        ).count()
        
        today_events = AnalyticsEvent.query.join(AnalyticsSession).filter(
            func.date(AnalyticsSession.started_at) == today
        ).count()
        
        # Popular content today
        popular_projects = db.session.query(
            AnalyticsEvent.event_label,
            func.count(AnalyticsEvent.id).label('clicks')
        ).filter(
            and_(
                AnalyticsEvent.event_type == 'project_click',
                func.date(AnalyticsEvent.timestamp) == today
            )
        ).group_by(AnalyticsEvent.event_label).order_by(desc('clicks')).limit(5).all()
        
        popular_skills = db.session.query(
            AnalyticsEvent.event_label,
            func.count(AnalyticsEvent.id).label('interactions')
        ).filter(
            and_(
                AnalyticsEvent.event_type.in_(['skill_hover', 'skill_click']),
                func.date(AnalyticsEvent.timestamp) == today
            )
        ).group_by(AnalyticsEvent.event_label).order_by(desc('interactions')).limit(5).all()
        
        # System health
        system_health = AnalyticsService._get_system_health()
        
        return {
            'timestamp': now.isoformat(),
            'active_visitors': active_sessions,
            'today_sessions': today_sessions,
            'today_events': today_events,
            'popular_projects': [{'name': p[0], 'clicks': p[1]} for p in popular_projects],
            'popular_skills': [{'name': s[0], 'interactions': s[1]} for s in popular_skills],
            'system_health': system_health
        }
    
    @staticmethod
    def get_historical_metrics(days: int = 30) -> Dict[str, Any]:
        """Get historical analytics data"""
        end_date = date.today()
        start_date = end_date - timedelta(days=days)
        
        metrics = AnalyticsMetrics.query.filter(
            and_(
                AnalyticsMetrics.date >= start_date,
                AnalyticsMetrics.date <= end_date
            )
        ).order_by(AnalyticsMetrics.date).all()
        
        # Format data for charts
        daily_data = []
        for metric in metrics:
            daily_data.append({
                'date': metric.date.isoformat(),
                'visitors': metric.unique_visitors,
                'sessions': metric.total_sessions,
                'page_views': metric.total_page_views,
                'avg_duration': metric.avg_session_duration,
                'bounce_rate': metric.bounce_rate,
                'project_clicks': metric.project_clicks,
                'skill_interactions': metric.skill_interactions
            })
        
        # Summary statistics
        total_visitors = sum(m.unique_visitors for m in metrics)
        total_sessions = sum(m.total_sessions for m in metrics)
        avg_duration = sum(m.avg_session_duration for m in metrics) / len(metrics) if metrics else 0
        
        return {
            'daily_data': daily_data,
            'summary': {
                'total_visitors': total_visitors,
                'total_sessions': total_sessions,
                'avg_session_duration': avg_duration,
                'period_days': days
            }
        }
    
    @staticmethod
    def calculate_daily_metrics(target_date: date = None) -> AnalyticsMetrics:
        """Calculate and store daily aggregated metrics"""
        if not target_date:
            target_date = date.today() - timedelta(days=1)  # Previous day
        
        # Get or create metrics record
        metrics = AnalyticsMetrics.query.filter_by(date=target_date).first()
        if not metrics:
            metrics = AnalyticsMetrics(date=target_date)
            db.session.add(metrics)
        
        # Calculate metrics for the day
        day_sessions = AnalyticsSession.query.filter(
            func.date(AnalyticsSession.started_at) == target_date
        ).all()
        
        if day_sessions:
            metrics.unique_visitors = len(set(s.ip_address for s in day_sessions))
            metrics.total_sessions = len(day_sessions)
            metrics.total_page_views = sum(s.page_views for s in day_sessions)
            metrics.avg_session_duration = sum(s.total_time_seconds for s in day_sessions) / len(day_sessions)
            
            # Bounce rate (sessions with only 1 page view)
            bounce_sessions = sum(1 for s in day_sessions if s.page_views == 1)
            metrics.bounce_rate = (bounce_sessions / len(day_sessions)) * 100
        
        # Event-based metrics
        day_events = AnalyticsEvent.query.join(AnalyticsSession).filter(
            func.date(AnalyticsEvent.timestamp) == target_date
        ).all()
        
        metrics.project_clicks = sum(1 for e in day_events if e.event_type == 'project_click')
        metrics.skill_interactions = sum(1 for e in day_events if e.event_type.startswith('skill_'))
        metrics.github_clicks = sum(1 for e in day_events if e.event_type == 'github_click')
        metrics.contact_interactions = sum(1 for e in day_events if e.event_type.startswith('contact_'))
        
        # Top content
        project_clicks = {}
        skill_views = {}
        page_views = {}
        
        for event in day_events:
            if event.event_type == 'project_click':
                project_clicks[event.event_label] = project_clicks.get(event.event_label, 0) + 1
            elif event.event_type.startswith('skill_'):
                skill_views[event.event_label] = skill_views.get(event.event_label, 0) + 1
            elif event.event_type == 'page_view':
                page_views[event.page_path] = page_views.get(event.page_path, 0) + 1
        
        metrics.top_projects = [{'title': k, 'clicks': v} for k, v in 
                               sorted(project_clicks.items(), key=lambda x: x[1], reverse=True)[:10]]
        metrics.top_skills_viewed = [{'name': k, 'views': v} for k, v in 
                                    sorted(skill_views.items(), key=lambda x: x[1], reverse=True)[:10]]
        metrics.top_pages = [{'path': k, 'views': v} for k, v in 
                            sorted(page_views.items(), key=lambda x: x[1], reverse=True)[:10]]
        
        # Device and browser breakdown
        if day_sessions:
            device_counts = {}
            browser_counts = {}
            
            for session in day_sessions:
                device_counts[session.device_type] = device_counts.get(session.device_type, 0) + 1
                browser_counts[session.browser] = browser_counts.get(session.browser, 0) + 1
            
            metrics.device_breakdown = device_counts
            metrics.browser_breakdown = browser_counts
        
        metrics.updated_at = datetime.utcnow()
        db.session.commit()
        
        return metrics
    
    @staticmethod
    def log_system_health() -> SystemHealth:
        """Log current system health metrics"""
        health = SystemHealth(
            cpu_usage=psutil.cpu_percent(interval=1),
            memory_usage=psutil.virtual_memory().percent,
            disk_usage=psutil.disk_usage('/').percent,
            active_connections=AnalyticsService._get_active_connections(),
            avg_response_time=0,  # To be calculated from request middleware
            error_count=0,  # To be tracked by error handlers
            db_connections=0,  # To be implemented based on your DB pool
            db_query_time=0,  # To be tracked by query middleware
            status=AnalyticsService._determine_health_status()
        )
        
        db.session.add(health)
        db.session.commit()
        
        # Emit health update
        socketio.emit('health_update', {
            'cpu': health.cpu_usage,
            'memory': health.memory_usage,
            'disk': health.disk_usage,
            'status': health.status,
            'timestamp': health.timestamp.isoformat()
        }, namespace='/analytics')
        
        return health
    
    @staticmethod
    def export_data(format_type: str = 'json', date_range: tuple = None) -> Dict[str, Any]:
        """Export analytics data in specified format"""
        if not date_range:
            end_date = date.today()
            start_date = end_date - timedelta(days=30)
            date_range = (start_date, end_date)
        
        # Fetch data
        sessions = AnalyticsSession.query.filter(
            func.date(AnalyticsSession.started_at).between(*date_range)
        ).all()
        
        events = AnalyticsEvent.query.join(AnalyticsSession).filter(
            func.date(AnalyticsEvent.timestamp).between(*date_range)
        ).all()
        
        metrics = AnalyticsMetrics.query.filter(
            AnalyticsMetrics.date.between(*date_range)
        ).all()
        
        export_data = {
            'export_timestamp': datetime.utcnow().isoformat(),
            'date_range': {
                'start': date_range[0].isoformat(),
                'end': date_range[1].isoformat()
            },
            'sessions': [AnalyticsService._serialize_session(s) for s in sessions],
            'events': [AnalyticsService._serialize_event(e) for e in events],
            'daily_metrics': [AnalyticsService._serialize_metrics(m) for m in metrics]
        }
        
        return export_data
    
    # Private helper methods
    @staticmethod
    def _get_client_ip() -> str:
        """Extract client IP address"""
        if request.environ.get('HTTP_X_FORWARDED_FOR'):
            return request.environ['HTTP_X_FORWARDED_FOR'].split(',')[0].strip()
        elif request.environ.get('HTTP_X_REAL_IP'):
            return request.environ['HTTP_X_REAL_IP']
        else:
            return request.environ.get('REMOTE_ADDR', 'unknown')
    
    @staticmethod
    def _detect_device_type() -> str:
        """Detect device type from user agent"""
        user_agent = request.headers.get('User-Agent', '').lower()
        if 'mobile' in user_agent:
            return 'mobile'
        elif 'tablet' in user_agent or 'ipad' in user_agent:
            return 'tablet'
        else:
            return 'desktop'
    
    @staticmethod
    def _detect_browser() -> str:
        """Detect browser from user agent"""
        user_agent = request.headers.get('User-Agent', '').lower()
        if 'chrome' in user_agent:
            return 'Chrome'
        elif 'firefox' in user_agent:
            return 'Firefox'
        elif 'safari' in user_agent:
            return 'Safari'
        elif 'edge' in user_agent:
            return 'Edge'
        else:
            return 'Other'
    
    @staticmethod
    def _detect_os() -> str:
        """Detect operating system from user agent"""
        user_agent = request.headers.get('User-Agent', '').lower()
        if 'windows' in user_agent:
            return 'Windows'
        elif 'mac' in user_agent:
            return 'macOS'
        elif 'linux' in user_agent:
            return 'Linux'
        elif 'ios' in user_agent:
            return 'iOS'
        elif 'android' in user_agent:
            return 'Android'
        else:
            return 'Other'
    
    @staticmethod
    def _get_system_health() -> Dict[str, Any]:
        """Get current system health snapshot"""
        try:
            return {
                'cpu': psutil.cpu_percent(interval=0.1),
                'memory': psutil.virtual_memory().percent,
                'disk': psutil.disk_usage('/').percent,
                'status': 'healthy'  # Simplified for demo
            }
        except:
            return {'status': 'error'}
    
    @staticmethod
    def _get_active_connections() -> int:
        """Get count of active connections"""
        return AnalyticsSession.query.filter(
            and_(
                AnalyticsSession.last_activity >= datetime.utcnow() - timedelta(minutes=5),
                AnalyticsSession.is_active == True
            )
        ).count()
    
    @staticmethod
    def _determine_health_status() -> str:
        """Determine overall system health status"""
        try:
            cpu = psutil.cpu_percent(interval=0.1)
            memory = psutil.virtual_memory().percent
            
            if cpu > 80 or memory > 85:
                return 'critical'
            elif cpu > 60 or memory > 70:
                return 'warning'
            else:
                return 'healthy'
        except:
            return 'unknown'
    
    @staticmethod
    def _emit_session_update(session: AnalyticsSession):
        """Emit session update via WebSocket"""
        socketio.emit('session_update', {
            'session_id': session.id,
            'device_type': session.device_type,
            'browser': session.browser,
            'timestamp': session.started_at.isoformat()
        }, namespace='/analytics')
    
    @staticmethod
    def _emit_event_update(event: AnalyticsEvent):
        """Emit event update via WebSocket"""
        socketio.emit('event_update', {
            'event_type': event.event_type,
            'event_category': event.event_category,
            'event_label': event.event_label,
            'timestamp': event.timestamp.isoformat()
        }, namespace='/analytics')
    
    @staticmethod
    def _serialize_session(session: AnalyticsSession) -> Dict[str, Any]:
        """Serialize session for export"""
        return {
            'id': session.id,
            'ip_address': session.ip_address[:8] + '***',  # Anonymize
            'device_type': session.device_type,
            'browser': session.browser,
            'os': session.os,
            'started_at': session.started_at.isoformat(),
            'total_time_seconds': session.total_time_seconds,
            'page_views': session.page_views
        }
    
    @staticmethod
    def _serialize_event(event: AnalyticsEvent) -> Dict[str, Any]:
        """Serialize event for export"""
        return {
            'event_type': event.event_type,
            'event_category': event.event_category,
            'event_label': event.event_label,
            'page_path': event.page_path,
            'timestamp': event.timestamp.isoformat(),
            'metadata': event.event_metadata
        }
    
    @staticmethod
    def _serialize_metrics(metrics: AnalyticsMetrics) -> Dict[str, Any]:
        """Serialize metrics for export"""
        return {
            'date': metrics.date.isoformat(),
            'unique_visitors': metrics.unique_visitors,
            'total_sessions': metrics.total_sessions,
            'total_page_views': metrics.total_page_views,
            'avg_session_duration': metrics.avg_session_duration,
            'bounce_rate': metrics.bounce_rate,
            'project_clicks': metrics.project_clicks,
            'skill_interactions': metrics.skill_interactions,
            'top_projects': metrics.top_projects,
            'top_skills_viewed': metrics.top_skills_viewed,
            'device_breakdown': metrics.device_breakdown,
            'browser_breakdown': metrics.browser_breakdown
        }