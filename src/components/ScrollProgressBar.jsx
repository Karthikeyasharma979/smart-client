import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'var(--accent-color)',
        transformOrigin: '0%',
        zIndex: 10000,
        boxShadow: '0 0 15px var(--accent-glow)',
        scaleX
      }}
    />
  );
};

export default ScrollProgressBar;
