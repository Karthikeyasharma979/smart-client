import React, { useState, useEffect } from 'react';
import { useShortcuts } from '../contexts/ShortcutContext';
import { LuKeyboard, LuX, LuRotateCcw, LuCommand } from 'react-icons/lu';

const ShortcutCustomizer = ({ onClose }) => {
    const { shortcuts, updateShortcut } = useShortcuts();
    const [editingId, setEditingId] = useState(null);

    const handleKeyDownCapture = (e, id) => {
        // Stop default browser behavior
        e.preventDefault();
        e.stopPropagation();

        const config = {
            key: e.key.toLowerCase(),
            ctrl: e.ctrlKey || e.metaKey,
            alt: e.altKey,
            shift: e.shiftKey
        };

        // Don't allow key combinations that include just modifier keys
        if (['control', 'shift', 'alt', 'meta'].includes(config.key)) {
            return;
        }

        updateShortcut(id, config);
        setEditingId(null);
    };

    const resetToDefaults = () => {
        const DEFAULT_SHORTCUTS = {
            'run-analysis': { key: 'r', ctrl: true, alt: false, shift: false, label: 'Run Analysis' },
            'toggle-zen': { key: 'z', ctrl: true, alt: true, shift: false, label: 'Toggle Zen Mode' },
            'download-pdf': { key: 'd', ctrl: true, alt: false, shift: true, label: 'Download PDF' },
        };
        Object.entries(DEFAULT_SHORTCUTS).forEach(([id, config]) => updateShortcut(id, config));
    };

    return (
        <div className="glass-panel" style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '450px',
            maxHeight: '80vh',
            zIndex: 10000,
            overflowY: 'auto',
            padding: '40px',
            background: 'var(--editor-bg)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--glass-border)',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 100px rgba(0, 255, 157, 0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        background: 'rgba(0, 255, 157, 0.1)',
                        padding: '10px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <LuKeyboard color="var(--accent-color)" size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Shortcuts</h2>
                </div>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <LuX size={24} />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
                {Object.entries(shortcuts).map(([id, config]) => (
                    <div key={id} style={{
                        padding: '16px',
                        borderRadius: '16px',
                        background: 'var(--toolbar-bg)',
                        border: '1px solid var(--glass-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                        transform: editingId === id ? 'scale(1.02)' : 'scale(1)',
                        borderColor: editingId === id ? 'var(--accent-color)' : 'var(--glass-border)'
                    }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{config.label}</span>
                        
                        <button 
                            onKeyDown={(e) => editingId === id ? handleKeyDownCapture(e, id) : null}
                            onClick={() => setEditingId(editingId === id ? null : id)}
                            style={{
                                display: 'flex',
                                gap: '4px',
                                background: editingId === id ? 'rgba(0, 255, 157, 0.1)' : 'var(--secondary-bg)',
                                border: '1px solid var(--glass-border)',
                                borderColor: editingId === id ? 'var(--accent-color)' : 'var(--glass-border)',
                                padding: '6px 12px',
                                borderRadius: '10px',
                                color: editingId === id ? 'var(--accent-color)' : 'var(--text-secondary)',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                minWidth: '100px',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            {editingId === id ? "Recording..." : (
                                <>
                                    {config.ctrl && <kbd style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 4px', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>Ctrl</kbd>}
                                    {config.shift && <kbd style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 4px', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>Shift</kbd>}
                                    {config.alt && <kbd style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 4px', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>Alt</kbd>}
                                    <kbd style={{ 
                                        textTransform: 'uppercase', 
                                        background: 'rgba(0, 194, 255, 0.1)', 
                                        padding: '2px 6px', 
                                        borderRadius: '4px', 
                                        border: '1px solid rgba(0, 194, 255, 0.2)',
                                        color: '#00C2FF'
                                    }}>{config.key}</kbd>
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                    onClick={resetToDefaults}
                    style={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '8px', 
                        padding: '12px', 
                        borderRadius: '12px', 
                        background: 'transparent', 
                        border: '1px solid var(--glass-border)', 
                        color: 'var(--text-secondary)', 
                        cursor: 'pointer',
                        fontWeight: 600
                    }}>
                    <LuRotateCcw size={16} />
                    Reset to Defaults
                </button>
                <button 
                    onClick={onClose}
                    style={{ 
                        flex: 1, 
                        padding: '12px', 
                        borderRadius: '12px', 
                        background: 'var(--accent-color)', 
                        border: 'none', 
                        color: '#000', 
                        fontWeight: 700,
                        cursor: 'pointer'
                    }}>
                    I'm Done
                </button>
            </div>
        </div>
    );
};

export default ShortcutCustomizer;
