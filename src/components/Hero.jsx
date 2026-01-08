import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaArrowRight } from 'react-icons/fa';

// --- Components ---

// 1. Magnetic Button Component
const MagneticButton = ({ children, className, style, onClick }) => {
    const buttonRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        setPosition({ x: x * 0.2, y: y * 0.2 }); // Magnetic pull strength
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div
            className="magnetic-area"
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        >
            <button
                className={className}
                style={style}
                onClick={onClick}
            >
                <div className="magnetic-content">
                    {children}
                </div>
            </button>
        </div>
    );
};

// 2. Chromatic Text Component
const ChromaticText = ({ text }) => {
    return (
        <span className="chromatic-wrapper">
            <span className="chromatic-layer" style={{ color: '#ff0000', transform: 'translate(-2px, 0)' }}>{text}</span>
            <span className="chromatic-layer" style={{ color: '#00ff00', transform: 'translate(1px, 0)' }}>{text}</span>
            <span className="chromatic-layer" style={{ color: '#0000ff', transform: 'translate(0, 1px)' }}>{text}</span>
            <span style={{ position: 'relative', zIndex: 2 }}>{text}</span>
        </span>
    );
};

const Hero = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // Mouse Tracking for Spotlight & Perspective
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const { left, top, width, height } = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;

            // Set CSS variables for spotlight calculation
            containerRef.current.style.setProperty('--mouse-x', `${x * 100}%`);
            containerRef.current.style.setProperty('--mouse-y', `${y * 100}%`);

            // Subtle 3D Tilt for container
            const tiltX = (y - 0.5) * 5; // Max 5deg tilt
            const tiltY = (x - 0.5) * -5;
            containerRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <header id="hero" style={{
            position: 'relative',
            height: '100vh',
            minHeight: '800px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            marginTop: '-80px',
            paddingTop: '160px',
            backgroundColor: 'var(--bg-primary)',
            perspective: '1000px' // For 3D tilt
        }}>

            {/* 3D Tilt Wrapper */}
            <div ref={containerRef} className="hero-perspective" style={{
                width: '100vw',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.1s ease-out'
            }}>

                {/* Background Ambience */}
                <div className="aurora-bg" style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70vw',
                    height: '70vw',
                    background: 'radial-gradient(circle, var(--accent-glow) 0%, rgba(0,0,0,0) 60%)',
                    zIndex: 0,
                    pointerEvents: 'none',
                    opacity: 0.6
                }} />

                {/* The Void Grid (Spotlight Reveal) */}
                <div className="void-grid" style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', pointerEvents: 'none' }}>
                    {/* Animated Badge */}
                    <div className="hero-badge" style={{
                        display: 'inline-block',
                        padding: '8px 24px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--accent-glow)',
                        borderRadius: '100px',
                        marginBottom: '32px',
                        fontSize: '14px',
                        color: 'var(--accent-color)',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        pointerEvents: 'auto'
                    }}>
                        <span style={{ marginRight: '8px' }}>✨</span> AI-Powered Writing
                    </div>

                    {/* Main Heading */}
                    <h1 className="hero-title" style={{
                        fontSize: 'clamp(4rem, 10vw, 7rem)',
                        lineHeight: '0.95',
                        marginBottom: '32px',
                        fontWeight: 900,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.04em',
                        pointerEvents: 'auto'
                    }}>
                        REWRITE <br />
                        <span style={{ fontSize: '1.1em' }}><ChromaticText text="THE FUTURE" /></span>
                    </h1>

                    <p className="hero-text" style={{
                        fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                        color: 'var(--text-secondary)',
                        maxWidth: '550px',
                        margin: '0 auto 56px',
                        lineHeight: '1.6',
                        opacity: 0.9,
                        pointerEvents: 'auto'
                    }}>
                        Experience the writing tool used by 30 million+ people.
                        Real-time feedback on tone, clarity, and style.
                    </p>

                    {/* Action Buttons */}
                    <div className="hero-actions" style={{
                        display: 'flex',
                        gap: '24px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        pointerEvents: 'auto'
                    }}>
                        <MagneticButton
                            className="btn-primary"
                            style={{
                                background: '#00ef8b',
                                color: '#000',
                                padding: '24px 56px',
                                borderRadius: '100px',
                                fontSize: '20px',
                                fontWeight: '700',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                lineHeight: '1',
                                border: 'none',
                                minWidth: '220px'
                            }}
                            onClick={() => navigate('/dashboard')}
                        >
                            Start Free
                            <FaArrowRight size={18} />
                        </MagneticButton>

                        <MagneticButton
                            className="btn-secondary"
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                color: '#fff',
                                padding: '24px 56px',
                                borderRadius: '100px',
                                fontSize: '18px',
                                fontWeight: '600',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                lineHeight: '1',
                                cursor: 'pointer',
                                minWidth: '220px'
                            }}
                            onClick={() => navigate('/demo')}
                        >
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FaPlay size={12} color="#000" style={{ marginLeft: '2px' }} />
                            </div>
                            Watch Demo
                        </MagneticButton>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Hero;
