import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const Compare = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const comparisons = [
        {
            title: "Clarity",
            before: "The meeting was good and we talked about a lot of stuff.",
            after: "The session was productive, covering a wide range of topics."
        },
        {
            title: "Confidence",
            before: "I think we should maybe try to do this if that's okay.",
            after: "We should implement this strategy to achieve our goals."
        },
        {
            title: "Tone",
            before: "You made a mistake in the report.",
            after: "The report contains a few inaccuracies that need review."
        }
    ];

    return (
        <section id="compare" style={{ padding: '100px 0', background: 'var(--bg-primary)' }}>
            <div className="container">
                <h2 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '60px', color: 'var(--text-primary)' }}>
                    See the <span className="glow-text" style={{ color: 'var(--accent-color)' }}>Difference</span>
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '40px', alignItems: 'center' }}>
                    {/* Controls */}
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '16px', overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? '10px' : 0 }}>
                        {comparisons.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className="glass-panel"
                                style={{
                                    padding: '24px',
                                    cursor: 'pointer',
                                    border: activeTab === index ? '1px solid var(--accent-color)' : '1px solid var(--glass-border)',
                                    background: activeTab === index ? 'rgba(0, 255, 157, 0.05)' : 'transparent',
                                    minWidth: isMobile ? '200px' : 'auto',
                                    flexShrink: 0
                                }}
                            >
                                <h3 style={{ fontSize: '1.25rem', color: activeTab === index ? 'var(--accent-color)' : 'var(--text-primary)', marginBottom: '4px' }}>
                                    {item.title}
                                </h3>
                            </div>
                        ))}
                    </div>

                    {/* Visualizer */}
                    <div className="glass-panel" style={{
                        padding: '40px',
                        minHeight: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        position: 'relative',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)'
                    }}>
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{
                                textTransform: 'uppercase',
                                fontSize: '0.8rem',
                                color: '#FF5F56',
                                letterSpacing: '0.1em',
                                marginBottom: '8px'
                            }}>Before</div>
                            <p style={{
                                fontSize: '1.5rem',
                                color: 'var(--text-secondary)',
                                textDecoration: 'line-through',
                                textDecorationColor: '#FF5F56'
                            }}>
                                {comparisons[activeTab].before}
                            </p>
                        </div>

                        <div style={{
                            width: '2px',
                            height: '40px',
                            background: 'var(--glass-border)',
                            margin: '0 auto 32px'
                        }} />

                        <div>
                            <div style={{
                                textTransform: 'uppercase',
                                fontSize: '0.8rem',
                                color: 'var(--accent-color)',
                                letterSpacing: '0.1em',
                                marginBottom: '8px'
                            }}>After</div>
                            <p style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                                {comparisons[activeTab].after}
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '120px' }}>
                    <h3 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '60px', color: 'var(--text-primary)' }}>
                        Outsmart the <span className="glow-text" style={{ color: 'var(--accent-color)' }}>Competition</span>
                    </h3>

                    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                <thead>
                                    <tr style={{ background: 'var(--table-header-bg)' }}>
                                        <th style={{ padding: '24px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500 }}>Features</th>
                                        <th style={{ padding: '24px', textAlign: 'center', color: 'var(--accent-color)', fontSize: '1.1rem' }}>Smart Text Analyzer</th>
                                        <th style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Basic Tools</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { feature: 'Grammar & Spelling', us: true, them: true },
                                        { feature: 'Tone Detection', us: true, them: false },
                                        { feature: 'Full-Sentence Rewrites', us: true, them: false },
                                        { feature: 'Custom Style Guides', us: true, them: false },
                                        { feature: 'Plagiarism Detection', us: true, them: 'Limited' },
                                    ].map((row, i) => (
                                        <tr key={i} style={{ borderTop: '1px solid var(--table-border)' }}>
                                            <td style={{ padding: '24px', color: 'var(--text-primary)', fontWeight: 500 }}>{row.feature}</td>
                                            <td style={{ padding: '24px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <div style={{
                                                        width: '32px', height: '32px', borderRadius: '50%',
                                                        background: 'var(--accent-glow)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        <FaCheck color="var(--accent-color)" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                {row.them === true ? (
                                                    <FaCheck color="var(--text-secondary)" />
                                                ) : row.them === false ? (
                                                    <FaTimes color="var(--text-secondary)" />
                                                ) : (
                                                    <span style={{ fontSize: '0.9rem' }}>{row.them}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Compare;
