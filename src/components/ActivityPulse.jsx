import React from 'react';

// --- New Creative Widget: Activity Pulse ---
const ActivityPulse = () => {
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
            borderRadius: '24px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            height: '100%',
            minHeight: '200px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>System Status</h3>
                <div style={{
                    padding: '4px 12px',
                    borderRadius: '100px',
                    background: 'rgba(0, 255, 157, 0.1)',
                    border: '1px solid rgba(0, 255, 157, 0.2)',
                    color: '#00FF9D',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00FF9D', animation: 'pulse 1s infinite' }} />
                    Online
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px', paddingBottom: '10px' }}>
                {bars.map((bar) => (
                    <div
                        key={bar.id}
                        style={{
                            flex: 1,
                            background: 'linear-gradient(to top, var(--accent-color), transparent)',
                            borderRadius: '4px',
                            height: bar.height,
                            opacity: 0.6,
                            animation: `activityWave 2s infinite ease-in-out ${bar.delay}s`
                        }}
                    />
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>Server Load</span>
                <span>Optimal</span>
            </div>
        </div>
    );
};


export default ActivityPulse;
