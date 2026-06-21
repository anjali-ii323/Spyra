'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function PhoneModel() {
  const groupRef = useRef<THREE.Group>(null);

  // Animate hovering and slow rotation
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.25;
    groupRef.current.rotation.y = t * 0.3;
    groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.05;
  });

  return (
    <group ref={groupRef} scale={[1.2, 1.2, 1.2]}>
      {/* Outer Phone Case Body */}
      <mesh>
        <boxGeometry args={[4.2, 8.2, 0.4]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Metallic Bezel */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.3, 8.3, 0.35]} />
        <meshStandardMaterial
          color="#a1a1aa"
          emissive="#71717a"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={1.0}
        />
      </mesh>

      {/* Screen Mesh */}
      <mesh position={[0, 0, 0.21]}>
        <planeGeometry args={[4.0, 7.8]} />
        <meshStandardMaterial
          color="#09090b"
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Holographic Glowing grid lines on screen */}
      <gridHelper
        args={[8, 16, '#27272a', '#18181b']}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0.22]}
      />

      {/* Scanning Laser Beam (glides up and down) */}
      <ScanningLaser />

      {/* Glowing Android circuit details */}
      <group position={[0, 0, 0.23]}>
        {/* Core Node */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        {/* Connected nodes */}
        <mesh position={[-0.8, -0.4, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.01]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.8, -0.4, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.01]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, -1.2, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial color="#27272a" />
        </mesh>
      </group>
    </group>
  );
}

function ScanningLaser() {
  const laserRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!laserRef.current) return;
    const t = state.clock.getElapsedTime();
    // Bounce laser beam up and down screen coordinates
    laserRef.current.position.y = Math.sin(t * 2.0) * 3.6;
  });

  return (
    <mesh ref={laserRef} position={[0, 0, 0.24]}>
      <boxGeometry args={[3.9, 0.1, 0.02]} />
      <meshBasicMaterial
        color="#ef4444"
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  );
}

export default function AndroidDevice() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-slate-950/20 border border-slate-800 rounded-2xl">
        <div className="text-slate-400 font-mono text-sm animate-pulse">BOOTING HOLO_DEVICE...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ef4444" />
        <directionalLight position={[0, 5, 5]} intensity={1.2} />
        <PhoneModel />
      </Canvas>
    </div>
  );
}
