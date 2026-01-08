import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuPenTool } from 'react-icons/lu';
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    const navigate = useNavigate();
    return (
        <footer id="footer" style={{ padding: '80px 0 40px', background: 'var(--bg-primary)', borderTop: '1px solid var(--glass-border)' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* Call to Action Area */}
                <div className="glass-panel" style={{
                    width: '100%',
                    padding: '60px',
                    textAlign: 'center',
                    marginBottom: '80px',
                    background: 'linear-gradient(135deg, rgba(0,255,157,0.1) 0%, rgba(0,0,0,0) 100%)',
                    border: '1px solid rgba(0,255,157,0.2)'
                }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', color: 'var(--text-primary)' }}>Ready to write the future?</h2>
                    <button
                        className="btn-primary"
                        style={{ padding: '16px 48px', fontSize: '1.2rem' }}
                        onClick={() => window.location.href = '/signup'}
                    > {/* Using window.location to ensure robust redirection */}
                        Get Started Now
                    </button>
                </div>

                {/* Links & Socials */}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '40px', marginBottom: '60px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', marginBottom: '24px' }}>
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
                            <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Smart Text Analyzer</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '300px' }}>
                            The AI writing partner that helps you find the words you need.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
                        {[
                            { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Business'] },
                            { title: 'Company', links: ['About', 'Careers', 'Blog', 'Contact'] },
                            { title: 'Resources', links: ['Community', 'Help Center', 'Partners', 'Status'] }
                        ].map((col, i) => (
                            <div key={i}>
                                <h4 style={{ color: 'var(--text-primary)', marginBottom: '24px' }}>{col.title}</h4>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0 }}>
                                    {col.links.map((link, j) => (
                                        <li key={j}>
                                            {link === 'About' ? (
                                                <Link
                                                    to="/about"
                                                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                                                    onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                                                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                                                >
                                                    {link}
                                                </Link>
                                            ) : (
                                                <a
                                                    href="#"
                                                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                                                    onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                                                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                                                >
                                                    {link}
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--glass-border)',
                    paddingTop: '40px',
                    flexWrap: 'wrap',
                    gap: '24px'
                }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>&copy; 2025 Smart Text Analyzer Inc. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)' }}>
                        <FaTwitter size={20} style={{ cursor: 'pointer' }} />
                        <FaLinkedin size={20} style={{ cursor: 'pointer' }} />
                        <FaGithub size={20} style={{ cursor: 'pointer' }} />
                        <FaInstagram size={20} style={{ cursor: 'pointer' }} />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
