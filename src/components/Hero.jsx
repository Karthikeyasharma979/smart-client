

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlay, LuArrowRight, LuSparkles, LuExternalLink, LuX } from 'react-icons/lu';
import DigitalWave from './DigitalWave';

// ---------- Video Modal ----------
// Replace DEMO_VIDEO_URL with your YouTube embed, Vimeo embed, or a direct .mp4 URL
const DEMO_VIDEO_URL = 'https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&rel=0';
// Example Vimeo: 'https://player.vimeo.com/video/YOUR_VIDEO_ID?autoplay=1'
// Example local: '/demo.mp4'

const VideoModal = ({ onClose }) => {
    const isEmbed = DEMO_VIDEO_URL.includes('youtube') || DEMO_VIDEO_URL.includes('vimeo');

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '20px',
                animation: 'fadeInBackdrop 0.3s ease'
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '900px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,255,157,0.15)',
                    border: '1px solid rgba(0,255,157,0.25)',
                    animation: 'scaleInModal 0.3s cubic-bezier(0.175,0.885,0.32,1.275)'
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '16px', right: '16px',
                        zIndex: 10,
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        width: '40px', height: '40px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#fff',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,0,0,0.5)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
                >
                    <LuX size={20} />
                </button>

                {/* Video */}
                {isEmbed ? (
                    <iframe
                        src={DEMO_VIDEO_URL}
                        title="Demo Video"
                        style={{ width: '100%', aspectRatio: '16/9', border: 'none', display: 'block' }}
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <video
                        src={DEMO_VIDEO_URL}
                        controls
                        autoPlay
                        style={{ width: '100%', aspectRatio: '16/9', display: 'block', background: '#000' }}
                    />
                )}
            </div>
        </div>
    );
};

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
        setPosition({ x: x * 0.2, y: y * 0.2 });
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
            <button className={className} style={style} onClick={onClick}>
                <div className="magnetic-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    {children}
                </div>
            </button>
        </div>
    );
};

// 2. Chromatic Text Component (Enhanced)
const ChromaticText = ({ text }) => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = (clientX - (left + width / 2)) / width; // -0.5 to 0.5
        const y = (clientY - (top + height / 2)) / height;

        setOffset({ x: x * 5, y: y * 5 }); // Max 5px offset
    };

    const handleMouseLeave = () => {
        setOffset({ x: 0, y: 0 });
    };

    return (
        <span
            className="chromatic-wrapper"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ display: 'inline-block', position: 'relative', cursor: 'default' }}
        >
            <span className="chromatic-layer" style={{
                color: '#ff0000',
                transform: `translate(${-2 + offset.x}px, ${offset.y}px)`,
                position: 'absolute',
                left: 0,
                top: 0,
                mixBlendMode: 'screen',
                opacity: 0.7
            }}>{text}</span>
            <span className="chromatic-layer" style={{
                color: '#00ff00',
                transform: `translate(${1 + offset.x * -1}px, ${offset.y * -1}px)`,
                position: 'absolute',
                left: 0,
                top: 0,
                mixBlendMode: 'screen',
                opacity: 0.7
            }}>{text}</span>
            <span className="chromatic-layer" style={{
                color: '#0000ff',
                transform: `translate(${offset.x}px, ${1 + offset.y}px)`,
                position: 'absolute',
                left: 0,
                top: 0,
                mixBlendMode: 'screen',
                opacity: 0.7
            }}>{text}</span>
            <span style={{ position: 'relative', zIndex: 2 }}>{text}</span>
        </span>
    );
};

const Hero = () => {
    const navigate = useNavigate();
    const [showVideo, setShowVideo] = useState(false);

    return (
        <>
        {showVideo && <VideoModal onClose={() => setShowVideo(false)} />}
        <div style={{
            height: '100vh',
            position: 'relative',
            background: 'var(--bg-primary)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>

            {/* Background Elements */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <DigitalWave />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.95) 100%)', // Darker edges for focus
                    pointerEvents: 'none'
                }} />
            </div>

            {/* TEXT LAYER */}
            <div className="hero-text-layer" style={{
                position: 'relative',
                zIndex: 20,
                textAlign: 'center', // Centered
                width: '100%',
                maxWidth: '1280px',
                padding: '0 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // Centered
                justifyContent: 'center'
            }}>
                {/* Animated Badge */}
                <div className="hero-badge" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '8px 24px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--accent-glow)',
                    borderRadius: '100px',
                    marginBottom: '32px',
                    fontSize: '14px',
                    color: 'var(--accent-color)',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                    gap: '8px'
                }}>
                    <span style={{ color: '#76ff03' }}>AI-Powered</span> <span style={{ color: '#fff' }}>Writing</span>
                </div>

                <h1 className="hero-title" style={{
                    fontSize: 'clamp(3.5rem, 8vw, 7rem)', // Larger font
                    lineHeight: '0.9',
                    marginBottom: '32px',
                    fontWeight: 900,
                    color: '#fff',
                    letterSpacing: '-0.02em',
                    textShadow: '0 0 20px rgba(118, 255, 3, 0.3)',
                    fontFamily: "'Inter', sans-serif"
                }}>
                    <div className="glitch-wrapper">
                        <span className="glitch" data-text="REWRITE THE FUTURE">REWRITE THE FUTURE</span>
                    </div>
                </h1>

                <p className="hero-text" style={{
                    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                    color: '#a0a0a0',
                    maxWidth: '600px',
                    margin: '0 auto 48px auto', // Center margin
                    lineHeight: '1.6',
                    opacity: 0.9,
                }}>
                    Your AI-powered writing assistant — built for clarity, tone, and style.
                    Analyze, rewrite, and perfect your content in seconds.
                </p>

                <div className="hero-actions" style={{
                    display: 'flex',
                    gap: '24px',
                    justifyContent: 'center', // Center align
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <MagneticButton
                        className="btn-primary"
                        style={{
                            background: '#76ff03', // Neon Lime
                            color: '#000',
                            padding: '12px 32px',
                            borderRadius: '100px',
                            fontSize: '16px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            border: 'none',
                            minWidth: '160px',
                            cursor: 'pointer',
                            boxShadow: '0 0 20px rgba(118, 255, 3, 0.4)'
                        }}
                        onClick={() => navigate('/dashboard')}
                    >
                        Open Editor
                        <LuExternalLink size={18} />
                    </MagneticButton>

                </div>
            </div>
        </div>
        </>
    );
};

export default Hero;
