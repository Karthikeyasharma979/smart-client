import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LuPenTool, LuMenu, LuX } from 'react-icons/lu';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setMenuOpen(false);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const navLinks = [
        { name: 'Features', path: '/features' },
        { name: 'About Us', path: '/about' },
    ];

    return (
        <div style={{
            position: 'fixed',
            top: '32px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 1000,
            pointerEvents: 'none',
            padding: '0 20px'
        }}>
            <nav className="nav-appear" style={{
                background: 'var(--nav-bg)',
                backdropFilter: 'blur(16px)',
                padding: '12px 24px',
                borderRadius: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '40px',
                pointerEvents: 'auto',
                transition: 'all 0.3s ease',
                width: isMobile ? '100%' : 'auto',
                maxWidth: '800px', // Smaller width for pill look
                opacity: 0,
                transform: 'translateY(-20px)',
                border: '1px solid rgba(0, 255, 157, 0.2)', // Green tint border
                boxShadow: '0 0 20px rgba(0, 255, 157, 0.1)' // Green glow
            }}>
                {/* Logo */}
                <div
                    onClick={() => navigate('/')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--text-primary)',
                        cursor: 'pointer'
                    }}
                >
                    <img src={logo} alt="Logo" style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'contain',
                        borderRadius: '4px'
                    }} />
                    {!isMobile && <span style={{ fontWeight: 700, letterSpacing: '-0.02em', fontSize: '1.1rem' }}>Smart Text Analyzer</span>}
                    {isMobile && <span style={{ fontWeight: 700, letterSpacing: '-0.02em', fontSize: '1.1rem' }}>S.T.A.</span>}
                </div>

                {/* Desktop Menu */}
                {!isMobile && (
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-secondary)',
                                fontSize: '14px',
                                fontWeight: 500,
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                            onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                        >
                            Home
                        </button>
                        {navLinks.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-secondary)',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Right Side Actions */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>

                    {!isMobile && (
                        <button
                            className="btn-primary"
                            style={{ padding: '8px 20px', fontSize: '14px' }}
                            onClick={() => navigate('/dashboard')}
                        >
                            Open Editor
                        </button>
                    )}

                    {/* Mobile Hamburger */}
                    {isMobile && (
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                padding: '4px'
                            }}
                        >
                            {menuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
                        </button>
                    )}
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobile && menuOpen && (
                <div style={{
                    position: 'fixed',
                    top: '90px',
                    left: '20px',
                    right: '20px',
                    background: 'var(--nav-bg)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--nav-border)',
                    borderRadius: '24px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    pointerEvents: 'auto',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    zIndex: 999
                }}>
                    <button
                        onClick={() => { navigate('/'); setMenuOpen(false); }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            fontSize: '18px',
                            fontWeight: 600,
                            textAlign: 'left',
                            padding: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        Home
                    </button>
                    {navLinks.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => { navigate(item.path); setMenuOpen(false); }}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                fontSize: '18px',
                                fontWeight: 600,
                                textAlign: 'left',
                                padding: '12px',
                                cursor: 'pointer'
                            }}
                        >
                            {item.name}
                        </button>
                    ))}
                    <div style={{ height: '1px', background: 'var(--nav-border)', margin: '8px 0' }} />
                    <button
                        className="btn-primary"
                        onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}
                        style={{ width: '100%', justifyContent: 'center', display: 'flex' }}
                    >
                        Open Editor
                    </button>
                </div>
            )}
        </div>
    );
};

export default Navbar;
