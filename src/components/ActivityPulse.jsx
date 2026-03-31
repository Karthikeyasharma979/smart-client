import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// --- New Creative Widget: Activity Pulse ---
const ActivityPulse = () => {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const checkStatus = async () => {
            try {
                // Short timeout to avoid hanging fetches on completely dead ports
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);
                
                const res = await fetch(`${API_URL}/health`, { signal: controller.signal });
                clearTimeout(timeoutId);
                
                if (isMounted) setIsOnline(res.ok);
            } catch (err) {
                if (isMounted) setIsOnline(false);
            }
        };

        // Initial check
        checkStatus();
        
        // Check every 5 seconds
        const interval = setInterval(checkStatus, 5000);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    // Generate random bars for the visualization
    const bars = React.useMemo(() => Array.from({ length: 12 }, (_, i) => ({
        id: i,
        height: Math.random() * 40 + 20 + '%',
        delay: i * 0.1
    })), []);

    return (
        <div style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderColor: isOnline ? 'var(--glass-border)' : 'rgba(255, 95, 86, 0.3)',
            borderRadius: '24px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            height: '100%',
            minHeight: '200px',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>System Status</h3>
                <div style={{
                    padding: '4px 12px',
                    borderRadius: '100px',
                    background: isOnline ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 95, 86, 0.1)',
                    border: isOnline ? '1px solid rgba(0, 255, 157, 0.2)' : '1px solid rgba(255, 95, 86, 0.2)',
                    color: isOnline ? '#00FF9D' : '#FF5F56',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        background: isOnline ? '#00FF9D' : '#FF5F56', 
                        animation: isOnline ? 'pulse 1s infinite' : 'none',
                        boxShadow: isOnline ? '0 0 8px #00FF9D' : '0 0 8px #FF5F56'
                    }} />
                    {isOnline ? 'Online' : 'Offline'}
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px', paddingBottom: '10px' }}>
                {bars.map((bar) => (
                    <div
                        key={bar.id}
                        style={{
                            flex: 1,
                            background: isOnline ? 'linear-gradient(to top, var(--accent-color), transparent)' : 'linear-gradient(to top, #FF5F56, transparent)',
                            borderRadius: '4px',
                            height: isOnline ? bar.height : '10%',
                            opacity: isOnline ? 0.6 : 0.3,
                            animation: isOnline ? `activityWave 2s infinite ease-in-out ${bar.delay}s` : 'none',
                            transition: 'all 0.5s ease'
                        }}
                    />
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: isOnline ? 'var(--text-secondary)' : '#FF5F56' }}>
                <span>Server Load</span>
                <span>{isOnline ? 'Optimal' : 'Disconnected'}</span>
            </div>
        </div>
    );
};

export default ActivityPulse;
