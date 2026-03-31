import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const ShortcutContext = createContext();

const DEFAULT_SHORTCUTS = {
    'run-analysis': { key: 'r', ctrl: true, alt: false, shift: false, label: 'Run Analysis' },
    'toggle-zen': { key: 'z', ctrl: true, alt: true, shift: false, label: 'Toggle Zen Mode' },
    'download-pdf': { key: 'd', ctrl: true, alt: false, shift: true, label: 'Download PDF' },
};

export const ShortcutProvider = ({ children }) => {
    const [shortcuts, setShortcuts] = useState(() => {
        const saved = localStorage.getItem('user-shortcuts');
        return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS;
    });

    const actionsRef = useRef({});

    const registerAction = useCallback((id, action) => {
        actionsRef.current[id] = action;
        return () => {
            delete actionsRef.current[id];
        };
    }, []);

    const updateShortcut = (id, newShortcut) => {
        setShortcuts(prev => {
            const updated = { ...prev, [id]: { ...prev[id], ...newShortcut } };
            localStorage.setItem('user-shortcuts', JSON.stringify(updated));
            return updated;
        });
    };

    const handleKeyDown = useCallback((e) => {
        // Don't trigger if user is typing in an input/textarea unless explicitly allowed (but here we want global shortcuts)
        // However, if we're in an editor, some might conflict. We'll allow global shortcuts for now.
        
        Object.entries(shortcuts).forEach(([id, config]) => {
            const matchesKey = e.key.toLowerCase() === config.key.toLowerCase();
            const matchesCtrl = config.ctrl === (e.ctrlKey || e.metaKey);
            const matchesAlt = config.alt === e.altKey;
            const matchesShift = config.shift === e.shiftKey;

            if (matchesKey && matchesCtrl && matchesAlt && matchesShift) {
                if (actionsRef.current[id]) {
                    e.preventDefault();
                    actionsRef.current[id]();
                }
            }
        });
    }, [shortcuts]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <ShortcutContext.Provider value={{ shortcuts, updateShortcut, registerAction }}>
            {children}
        </ShortcutContext.Provider>
    );
};

export const useShortcuts = () => {
    const context = useContext(ShortcutContext);
    if (!context) {
        throw new Error('useShortcuts must be used within a ShortcutProvider');
    }
    return context;
};
