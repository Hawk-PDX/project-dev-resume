/**
 * Analytics Service for Portfolio Application
 * 
 * Handles:
 * - Session tracking and event collection
 * - Real-time WebSocket communication
 * - User interaction monitoring
 * - Performance metrics collection
 */

import axios from 'axios';
import { io } from 'socket.io-client';

class AnalyticsService {
    constructor() {
        this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
        this.socket = null;
        this.sessionId = null;
        this.eventQueue = [];
        this.isInitialized = false;
        this.listeners = {};
        
        // Initialize analytics
        this.init();
    }

    /**
     * Initialize analytics service
     */
    async init() {
        try {
            await this.createSession();
            this.setupWebSocket();
            this.setupEventListeners();
            this.startPerformanceMonitoring();
            this.isInitialized = true;
            
            console.log('🎯 Analytics service initialized successfully');
        } catch (error) {
            console.error('Analytics initialization failed:', error);
        }
    }

    /**
     * Create or resume analytics session
     */
    async createSession() {
        try {
            // Check if we have an existing session in localStorage
            const existingSessionId = localStorage.getItem('analytics_session_id');
            
            const sessionData = {
                session_id: existingSessionId,
                referrer: document.referrer,
                screen_resolution: `${screen.width}x${screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                language: navigator.language
            };

            const response = await axios.post(`${this.apiBaseUrl}/analytics/session`, sessionData);
            
            if (response.data.success) {
                this.sessionId = response.data.session_id;
                localStorage.setItem('analytics_session_id', this.sessionId);
                console.log('📊 Analytics session created:', this.sessionId);
            }
        } catch (error) {
            console.error('Failed to create analytics session:', error);
        }
    }

    /**
     * Setup WebSocket connection for real-time updates
     */
    setupWebSocket() {
        try {
            const socketUrl = this.apiBaseUrl.replace('/api', '');
            this.socket = io(`${socketUrl}/analytics`, {
                transports: ['websocket', 'polling'],
                forceNew: true
            });

            this.socket.on('connect', () => {
                console.log('🔌 Analytics WebSocket connected');
            });

            this.socket.on('disconnect', () => {
                console.log('🔌 Analytics WebSocket disconnected');
            });

            this.socket.on('error', (error) => {
                console.error('Analytics WebSocket error:', error);
            });

            // Listen for real-time updates
            this.socket.on('metrics_update', (data) => {
                this.emit('metricsUpdate', data);
            });

            this.socket.on('health_update', (data) => {
                this.emit('healthUpdate', data);
            });

            this.socket.on('event_update', (data) => {
                this.emit('eventUpdate', data);
            });

        } catch (error) {
            console.error('WebSocket setup failed:', error);
        }
    }

    /**
     * Setup automatic event listeners
     */
    setupEventListeners() {
        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            this.trackEvent({
                event_type: document.hidden ? 'page_blur' : 'page_focus',
                event_category: 'engagement',
                page_path: window.location.pathname
            });
        });

        // Page unload
        window.addEventListener('beforeunload', () => {
            this.trackEvent({
                event_type: 'page_unload',
                event_category: 'navigation',
                page_path: window.location.pathname,
                time_on_page: Math.floor((Date.now() - this.pageStartTime) / 1000)
            });
        });

        // Scroll tracking
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
                );
                
                if (scrollPercent >= 25 && !this.scrollMilestones?.includes(25)) {
                    this.trackScrollMilestone(25);
                }
                if (scrollPercent >= 50 && !this.scrollMilestones?.includes(50)) {
                    this.trackScrollMilestone(50);
                }
                if (scrollPercent >= 75 && !this.scrollMilestones?.includes(75)) {
                    this.trackScrollMilestone(75);
                }
                if (scrollPercent >= 90 && !this.scrollMilestones?.includes(90)) {
                    this.trackScrollMilestone(90);
                }
            }, 250);
        });

        this.scrollMilestones = [];
    }

    /**
     * Start performance monitoring
     */
    startPerformanceMonitoring() {
        this.pageStartTime = Date.now();

        // Track page load performance
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            this.trackEvent({
                event_type: 'page_performance',
                event_category: 'performance',
                page_path: window.location.pathname,
                page_load_time: loadTime,
                metadata: {
                    dns_time: perfData.domainLookupEnd - perfData.domainLookupStart,
                    connect_time: perfData.connectEnd - perfData.connectStart,
                    response_time: perfData.responseEnd - perfData.requestStart,
                    dom_ready: perfData.domContentLoadedEventEnd - perfData.navigationStart
                }
            });
        });
    }

    /**
     * Track custom events
     */
    async trackEvent(eventData) {
        if (!this.sessionId) {
            this.eventQueue.push(eventData);
            return;
        }

        try {
            const payload = {
                session_id: this.sessionId,
                timestamp: new Date().toISOString(),
                page_path: window.location.pathname,
                ...eventData
            };

            await axios.post(`${this.apiBaseUrl}/analytics/event`, payload);
        } catch (error) {
            console.error('Failed to track event:', error);
        }
    }

    /**
     * Track page views
     */
    trackPageView(pagePath = null) {
        const path = pagePath || window.location.pathname;
        
        this.trackEvent({
            event_type: 'page_view',
            event_category: 'navigation',
            event_label: document.title,
            page_path: path,
            metadata: {
                referrer: document.referrer,
                user_agent: navigator.userAgent
            }
        });

        // Reset scroll milestones for new page
        this.scrollMilestones = [];
        this.pageStartTime = Date.now();
    }

    /**
     * Track project interactions
     */
    trackProjectClick(projectTitle, projectUrl = null) {
        this.trackEvent({
            event_type: 'project_click',
            event_category: 'interaction',
            event_label: projectTitle,
            metadata: {
                project_url: projectUrl,
                click_position: this.getClickPosition()
            }
        });
    }

    /**
     * Track skill interactions
     */
    trackSkillInteraction(skillName, interactionType = 'hover') {
        this.trackEvent({
            event_type: `skill_${interactionType}`,
            event_category: 'interaction',
            event_label: skillName,
            metadata: {
                interaction_type: interactionType
            }
        });
    }

    /**
     * Track contact interactions
     */
    trackContactInteraction(contactType, contactValue = null) {
        this.trackEvent({
            event_type: 'contact_interaction',
            event_category: 'engagement',
            event_label: contactType,
            metadata: {
                contact_value: contactValue
            }
        });
    }

    /**
     * Track GitHub link clicks
     */
    trackGitHubClick(repoName, repoUrl) {
        this.trackEvent({
            event_type: 'github_click',
            event_category: 'external_link',
            event_label: repoName,
            metadata: {
                repo_url: repoUrl
            }
        });
    }

    /**
     * Track scroll milestones
     */
    trackScrollMilestone(percent) {
        this.scrollMilestones.push(percent);
        this.trackEvent({
            event_type: 'scroll_milestone',
            event_category: 'engagement',
            event_label: `${percent}%`,
            metadata: {
                scroll_percent: percent,
                page_height: document.body.scrollHeight,
                viewport_height: window.innerHeight
            }
        });
    }

    /**
     * Track form interactions
     */
    trackFormInteraction(formName, action, fieldName = null) {
        this.trackEvent({
            event_type: 'form_interaction',
            event_category: 'engagement',
            event_label: `${formName}_${action}`,
            metadata: {
                form_name: formName,
                action: action,
                field_name: fieldName
            }
        });
    }

    /**
     * Get real-time analytics metrics
     */
    async getRealTimeMetrics() {
        try {
            const response = await axios.get(`${this.apiBaseUrl}/analytics/metrics/realtime`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch real-time metrics:', error);
            return null;
        }
    }

    /**
     * Get historical analytics data
     */
    async getHistoricalMetrics(days = 30) {
        try {
            const response = await axios.get(`${this.apiBaseUrl}/analytics/metrics/historical?days=${days}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch historical metrics:', error);
            return null;
        }
    }

    /**
     * Export analytics data
     */
    async exportData(format = 'json', days = 30) {
        try {
            const response = await axios.post(`${this.apiBaseUrl}/analytics/export`, {
                format: format,
                days: days
            });
            return response.data;
        } catch (error) {
            console.error('Failed to export analytics data:', error);
            return null;
        }
    }

    /**
     * Subscribe to WebSocket events
     */
    subscribeToEvents(eventTypes) {
        if (this.socket) {
            this.socket.emit('subscribe_to_events', { event_types: eventTypes });
        }
    }

    /**
     * Request manual metrics update
     */
    requestMetricsUpdate() {
        if (this.socket) {
            this.socket.emit('request_metrics_update');
        }
    }

    /**
     * Request system health check
     */
    requestHealthCheck() {
        if (this.socket) {
            this.socket.emit('request_health_check');
        }
    }

    // Event emitter functionality
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }

    /**
     * Get click position relative to viewport
     */
    getClickPosition() {
        // This would be set by click event handlers
        return {
            x: this.lastClickX || 0,
            y: this.lastClickY || 0
        };
    }

    /**
     * Update last click position
     */
    updateClickPosition(event) {
        this.lastClickX = event.clientX;
        this.lastClickY = event.clientY;
    }

    /**
     * Disconnect analytics service
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
        this.isInitialized = false;
        console.log('📊 Analytics service disconnected');
    }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;
export { AnalyticsService };