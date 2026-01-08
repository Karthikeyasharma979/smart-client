import React from 'react';

const WelcomeScreen = ({ isExiting }) => {
    return (
        <div className="premium-loader" style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            opacity: isExiting ? 0 : 1,
            transition: 'opacity 0.8s ease-in-out',
            pointerEvents: 'none'
        }}>
            <div className="loader-container">
                {/* Layer 1: The Chaos (Blurry, Glitchy) */}
                <div className="text-layer chaos-layer">SMART TEXT ANALYZER</div>

                {/* Layer 2: The Clarity (Clean, Sharp) - Revealed by Mask */}
                <div className="text-layer clear-layer">SMART TEXT ANALYZER</div>

                {/* The Scan Line */}
                <div className="scan-line"></div>

                {/* Tagline */}
                <div className="tagline">AI-POWERED WRITING ASSISTANT</div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
