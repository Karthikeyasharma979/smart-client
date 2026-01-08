import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LuPenTool, LuMenu, LuX } from 'react-icons/lu';
import { FaMoon, FaSun } from 'react-icons/fa';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);
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

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const navLinks = [
        { name: 'Features', path: '/features' },
        { name: 'Blog', path: '/blog' },
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
                border: '1px solid var(--nav-border)',
                padding: '12px 24px',
                borderRadius: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '40px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                pointerEvents: 'auto',
                transition: 'all 0.3s ease',
                width: isMobile ? '100%' : 'auto',
                maxWidth: '1200px',
                opacity: 0,
                transform: 'translateY(-20px)'
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
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, var(--accent-color), #2196F3)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: 'rotate(-10deg)',
                        boxShadow: '0 4px 12px rgba(0, 255, 157, 0.3)'
                    }}>
                        <LuPenTool size={18} color="#000" />
                    </div>
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
                    <button onClick={toggleTheme} style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'color 0.2s'
                    }}>
                        {theme === 'dark' ? <FaSun size={16} /> : <FaMoon size={16} />}
                    </button>

                    {!isMobile && (
                        <button
                            className="btn-primary"
                            style={{ padding: '8px 20px', fontSize: '14px' }}
                            onClick={() => navigate('/dashboard')}
                        >
                            Try Free
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
                        Try Free
                    </button>
                </div>
            )}
        </div>
    );
};

export default Navbar;
