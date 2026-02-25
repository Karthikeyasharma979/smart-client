import React, { useEffect } from 'react';
import jayanthImg from '../assets/team/jayanth.png';
import siddarthaImg from '../assets/team/siddartha.jpg';

const AboutPage = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ paddingTop: '100px', background: 'var(--bg-primary)', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{ padding: '80px 0', textAlign: 'center' }}>
                <div className="container">
                    <h1 style={{ fontSize: '4rem', marginBottom: '24px', color: 'var(--text-primary)' }}>
                        We Are <span className="glow-text" style={{ color: 'var(--accent-color)' }}>Smart Text Analyzer</span>
                    </h1>
                    <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                        Our mission is to improve lives by improving communication. Every day, we help millions of people and thousands of enterprises communicate with confidence.
                    </p>
                </div>
            </section>

            {/* Stats Section (Reused Style) */}
            <section style={{ padding: '80px 0', background: 'rgba(255,255,255,0.02)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
                        {[
                            { label: 'Powerful Tools', value: '5' },
                            { label: 'AI Personas', value: '3' },
                            { label: 'Unified Platform', value: '1' }
                        ].map((stat, i) => (
                            <div key={i} style={{ flex: 1, minWidth: '200px' }}>
                                <div style={{
                                    fontSize: '5rem',
                                    fontWeight: 800,
                                    color: 'transparent',
                                    WebkitTextStroke: '1px var(--text-secondary)',
                                    marginBottom: '16px',
                                    fontFamily: 'monospace'
                                }}>
                                    {stat.value}
                                </div>
                                <p style={{ color: 'var(--accent-color)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section style={{ padding: '100px 0' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '60px', textAlign: 'center', color: 'var(--text-primary)' }}>Our Core Values</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        {[
                            { title: 'Eager', desc: 'We are curious, open to learning, and always striving to improve.' },
                            { title: 'Empathetic', desc: 'We seek to understand others’ perspectives and help them succeed.' },
                            { title: 'Remarkable', desc: 'We simply don’t settle for "good enough". We aim for excellence.' }
                        ].map((value, idx) => (
                            <div key={idx} className="glass-panel" style={{ padding: '40px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--accent-color)' }}>{value.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Dummy Section */}
            <section style={{ padding: '80px 0', background: 'rgba(255,255,255,0.02)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '60px', color: 'var(--text-primary)' }}>Meet the Leadership</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                        {[
                            { name: 'Jayanth', role: 'Team Member', image: jayanthImg },
                            { name: 'Siddartha', role: 'Team Member', image: siddarthaImg },
                            { name: 'Karthik', role: 'Team Member', image: null }
                        ].map((member, i) => (
                            <div key={i} style={{ width: '250px' }}>
                                <div style={{
                                    width: '200px',
                                    height: '200px',
                                    borderRadius: '50%',
                                    background: 'var(--glass-bg)',
                                    border: '2px solid var(--accent-color)',
                                    margin: '0 auto 24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '3rem',
                                    color: 'var(--text-secondary)',
                                    overflow: 'hidden'
                                }}>
                                    {member.image ? (
                                        <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333', color: '#fff' }}>
                                            {member.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '8px' }}>{member.name}</h4>
                                <p style={{ color: 'var(--text-secondary)' }}>{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
