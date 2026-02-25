import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Wave = () => {
    const meshRef = useRef();

    // Geometry parameters: width, height, widthSegments, heightSegments
    // High segment count for smooth wave
    const geometry = useMemo(() => new THREE.PlaneGeometry(30, 15, 60, 30), []);

    const count = geometry.attributes.position.count;

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const { array, originalPosition } = geometry.attributes.position;

        // If originalPosition is not stored, store it
        if (!geometry.attributes.position.originalPosition) {
            geometry.attributes.position.originalPosition = geometry.attributes.position.array.slice();
        }

        const originalPositions = geometry.attributes.position.originalPosition;

        for (let i = 0; i < count; i++) {
            const x = originalPositions[i * 3];
            // const y = originalPositions[i * 3 + 1]; // We'll modify Z instead for "height" if rotated
            const y = originalPositions[i * 3 + 1];

            // Create a wave effect
            // varying Z height based on X and Time
            geometry.attributes.position.array[i * 3 + 2] =
                (Math.sin(x * 0.5 + time * 0.5) * 1.5) +
                (Math.sin(x * 1.5 + time * 0.3) * 0.5) +
                (Math.sin(y * 1.5 + time * 0.3) * 0.5);
        }
        geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={meshRef} position={[0, -2, 0]} rotation={[-Math.PI / 2.5, 0, 0]}>
            <primitive object={geometry} attach="geometry" />
            <pointsMaterial
                attach="material"
                color="#76ff03"
                size={0.07}
                sizeAttenuation={true}
                transparent={true}
                opacity={0.8}
            />
        </points>
    );
};

const DigitalWave = () => {
    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.8 }}>
            <Canvas camera={{ position: [0, 2, 10], fov: 75 }}>
                <fog attach="fog" args={['#000', 5, 20]} />
                <Wave />
            </Canvas>
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, transparent 0%, #000 90%)', // Vignette
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default DigitalWave;
