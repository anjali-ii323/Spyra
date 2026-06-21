'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleSystem() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 300;

  // Generate random coordinates and movement directions
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      // Coordinates
      pos[i] = (Math.random() - 0.5) * 40;
      pos[i + 1] = (Math.random() - 0.5) * 40;
      pos[i + 2] = (Math.random() - 0.5) * 40;

      // Velocities
      vel[i] = (Math.random() - 0.5) * 0.05;
      vel[i + 1] = (Math.random() - 0.5) * 0.05;
      vel[i + 2] = (Math.random() - 0.5) * 0.05;
    }
    return [pos, vel];
  }, []);

  // Update particles position on frame tick
  useFrame(() => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    const positionsAttr = geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      positionsAttr.array[idx] += velocities[idx];
      positionsAttr.array[idx + 1] += velocities[idx + 1];
      positionsAttr.array[idx + 2] += velocities[idx + 2];

      // Keep particles bounded
      if (Math.abs(positionsAttr.array[idx]) > 20) velocities[idx] *= -1;
      if (Math.abs(positionsAttr.array[idx + 1]) > 20) velocities[idx + 1] *= -1;
      if (Math.abs(positionsAttr.array[idx + 2]) > 20) velocities[idx + 2] *= -1;
    }

    positionsAttr.needsUpdate = true;
    pointsRef.current.rotation.y += 0.0005;
    pointsRef.current.rotation.x += 0.0002;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.12}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function CyberBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 bg-[#000000] -z-10" />;
  }

  return (
    <div className="absolute inset-0 bg-[#000000] -z-10 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-radial-gradient from-zinc-900/20 via-transparent to-transparent opacity-50" />
      <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-zinc-950/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-zinc-950/20 blur-[120px] pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <ParticleSystem />
      </Canvas>
    </div>
  );
}
