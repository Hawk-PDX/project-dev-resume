/**
 * Real-Time Analytics Dashboard Component
 * 
 * Features:
 * - Live visitor count and session tracking
 * - Real-time event stream
 * - System health monitoring
 * - Interactive charts and metrics
 * - Data export functionality
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChartBarIcon, 
    EyeIcon, 
    ClockIcon, 
    DevicePhoneMobileIcon,
    ComputerDesktopIcon,
    ArrowTrendingUpIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ArrowDownTrayIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import analyticsService from '../../services/analyticsService';

const AnalyticsDashboard = ({ isVisible = false }) => {
    // State management
    const [metrics, setMetrics] = useState({
        active_visitors: 0,
        today_sessions: 0,
        today_events: 0,
        popular_projects: [],
        popular_skills: [],
        system_health: { status: 'unknown' }
    });
    
    const [historicalData, setHistoricalData] = useState([]);
    const [recentEvents, setRecentEvents] = useState([]);
    const [systemHealth, setSystemHealth] = useState({ status: 'unknown' });
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    // Load initial data
    useEffect(() => {
        if (isVisible) {
            loadInitialData();
            setupRealtimeUpdates();
        }
        
        return () => {
            cleanupRealtimeUpdates();
        };
    }, [isVisible]);

    const loadInitialData = async () => {
        setIsLoading(true);
        try {
            // Load real-time metrics
            const realtimeData = await analyticsService.getRealTimeMetrics();
            if (realtimeData?.success) {
                setMetrics(realtimeData.data);
                setSystemHealth(realtimeData.data.system_health);
            }

            // Load historical data
            const historicalResult = await analyticsService.getHistoricalMetrics(7); // Last 7 days
            if (historicalResult?.success) {
                setHistoricalData(historicalResult.data.daily_data);
            }

            setLastUpdate(new Date());
        } catch (error) {
            console.error('Failed to load analytics data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const setupRealtimeUpdates = () => {
        // Subscribe to real-time updates
        analyticsService.on('metricsUpdate', handleMetricsUpdate);
        analyticsService.on('healthUpdate', handleHealthUpdate);
        analyticsService.on('eventUpdate', handleEventUpdate);
        
        // Subscribe to specific events
        analyticsService.subscribeToEvents(['project_click', 'skill_hover', 'page_view']);
    };

    const cleanupRealtimeUpdates = () => {
        analyticsService.off('metricsUpdate', handleMetricsUpdate);
        analyticsService.off('healthUpdate', handleHealthUpdate);
        analyticsService.off('eventUpdate', handleEventUpdate);
    };

    const handleMetricsUpdate = useCallback((data) => {
        setMetrics(data);
        setLastUpdate(new Date());
    }, []);

    const handleHealthUpdate = useCallback((data) => {
        setSystemHealth(data);
    }, []);

    const handleEventUpdate = useCallback((eventData) => {
        setRecentEvents(prev => [eventData, ...prev.slice(0, 9)]); // Keep last 10 events
    }, []);

    const refreshData = () => {
        analyticsService.requestMetricsUpdate();
        analyticsService.requestHealthCheck();
    };

    const exportData = async () => {
        try {
            const exportResult = await analyticsService.exportData('json', 30);
            if (exportResult?.success) {
                // Create and download file
                const dataStr = JSON.stringify(exportResult.data, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Failed to export analytics data:', error);
        }
    };

    const getHealthColor = (status) => {
        switch (status) {
            case 'healthy': return 'text-green-500';
            case 'warning': return 'text-yellow-500';
            case 'critical': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getHealthIcon = (status) => {
        switch (status) {
            case 'healthy': return CheckCircleIcon;
            case 'warning': return ExclamationTriangleIcon;
            case 'critical': return ExclamationTriangleIcon;
            default: return ClockIcon;
        }
    };

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 bg-gray-900 bg-opacity-95 flex items-center justify-center p-4"
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <ChartBarIcon className="w-8 h-8" />
                                Real-Time Analytics Dashboard
                            </h1>
                            <p className="text-blue-100 mt-1">
                                {lastUpdate ? `Last updated: ${lastUpdate.toLocaleTimeString()}` : 'Loading...'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={refreshData}
                                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors"
                                title="Refresh Data"
                            >
                                <ArrowPathIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={exportData}
                                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors"
                                title="Export Data"
                            >
                                <ArrowDownTrayIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 px-6 flex-shrink-0">
                    <nav className="flex space-x-6">
                        {['overview', 'events', 'performance'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Key Metrics */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <MetricCard
                                            title="Active Visitors"
                                            value={metrics.active_visitors}
                                            icon={EyeIcon}
                                            color="text-green-600"
                                            bgColor="bg-green-50"
                                        />
                                        <MetricCard
                                            title="Today's Sessions"
                                            value={metrics.today_sessions}
                                            icon={DevicePhoneMobileIcon}
                                            color="text-blue-600"
                                            bgColor="bg-blue-50"
                                        />
                                        <MetricCard
                                            title="Total Events"
                                            value={metrics.today_events}
                                            icon={ArrowTrendingUpIcon}
                                            color="text-purple-600"
                                            bgColor="bg-purple-50"
                                        />
                                        <MetricCard
                                            title="System Health"
                                            value={systemHealth.status}
                                            icon={getHealthIcon(systemHealth.status)}
                                            color={getHealthColor(systemHealth.status)}
                                            bgColor="bg-gray-50"
                                        />
                                    </div>

                                    {/* Popular Content */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <PopularContentCard
                                            title="Top Projects"
                                            items={metrics.popular_projects}
                                            valueLabel="clicks"
                                        />
                                        <PopularContentCard
                                            title="Popular Skills"
                                            items={metrics.popular_skills}
                                            valueLabel="interactions"
                                        />
                                    </div>

                                    {/* System Health Details */}
                                    {systemHealth.cpu && (
                                        <SystemHealthCard health={systemHealth} />
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'events' && (
                                <motion.div
                                    key="events"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <EventStreamCard events={recentEvents} />
                                </motion.div>
                            )}

                            {activeTab === 'performance' && (
                                <motion.div
                                    key="performance"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <HistoricalChart data={historicalData} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className={`${bgColor} rounded-lg p-6 border border-gray-200`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className={`text-2xl font-semibold ${color} mt-1`}>
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
            </div>
            <Icon className={`w-8 h-8 ${color}`} />
        </div>
    </div>
);

// Popular Content Card Component
const PopularContentCard = ({ title, items, valueLabel }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        {items.length > 0 ? (
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 truncate flex-1 mr-2">
                            {item.name || item.title}
                        </span>
                        <span className="text-sm font-medium text-blue-600">
                            {item[valueLabel]} {valueLabel}
                        </span>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500 text-sm">No data available</p>
        )}
    </div>
);

// System Health Card Component
const SystemHealthCard = ({ health }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <HealthMetric label="CPU Usage" value={health.cpu} unit="%" />
            <HealthMetric label="Memory Usage" value={health.memory} unit="%" />
            <HealthMetric label="Disk Usage" value={health.disk} unit="%" />
        </div>
    </div>
);

// Health Metric Component
const HealthMetric = ({ label, value, unit }) => {
    const getColor = (val) => {
        if (val > 80) return 'text-red-600 bg-red-50';
        if (val > 60) return 'text-yellow-600 bg-yellow-50';
        return 'text-green-600 bg-green-50';
    };

    return (
        <div className={`p-3 rounded-lg ${getColor(value)}`}>
            <p className="text-xs font-medium opacity-75">{label}</p>
            <p className="text-lg font-semibold">{value?.toFixed(1)}{unit}</p>
        </div>
    );
};

// Event Stream Card Component
const EventStreamCard = ({ events }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Event Stream</h3>
        {events.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {events.map((event, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="font-medium text-sm text-gray-900">
                                    {event.event_type.replace('_', ' ')}
                                </p>
                                {event.event_label && (
                                    <p className="text-xs text-gray-600">{event.event_label}</p>
                                )}
                            </div>
                            <span className="text-xs text-gray-500">
                                {new Date(event.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500 text-sm">No recent events</p>
        )}
    </div>
);

// Historical Chart Component (simplified for now)
const HistoricalChart = ({ data }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Overview</h3>
        {data.length > 0 ? (
            <div className="space-y-4">
                {data.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-sm">
                            {new Date(day.date).toLocaleDateString()}
                        </span>
                        <div className="flex gap-4 text-sm">
                            <span>Visitors: <span className="font-medium text-blue-600">{day.visitors}</span></span>
                            <span>Sessions: <span className="font-medium text-green-600">{day.sessions}</span></span>
                            <span>Events: <span className="font-medium text-purple-600">{day.page_views}</span></span>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500 text-sm">No historical data available</p>
        )}
    </div>
);

export default AnalyticsDashboard;