'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

// Helper component to manage converging particles in R3F
function IntroParticles({ phase }: { phase: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 600;

  // Initial random positions far away, and destination target positions
  const [positions, targets, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const tar = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Start in a large spherical shell far away
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 25 + Math.random() * 15; // scattered sphere

      pos[i] = r * Math.sin(phi) * Math.cos(theta);
      pos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i + 2] = r * Math.cos(phi);

      // Target positions (converge to a core cloud)
      tar[i] = (Math.random() - 0.5) * 4;
      tar[i + 1] = (Math.random() - 0.5) * 4;
      tar[i + 2] = (Math.random() - 0.5) * 4;

      // Velocities
      vel[i] = (Math.random() - 0.5) * 0.1;
      vel[i + 1] = (Math.random() - 0.5) * 0.1;
      vel[i + 2] = (Math.random() - 0.5) * 0.1;
    }

    return [pos, tar, vel];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    const positionsAttr = geometry.attributes.position;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      if (phase === 1) {
        // Converging to center targets
        positionsAttr.array[idx] += (targets[idx] - positionsAttr.array[idx]) * 0.04;
        positionsAttr.array[idx + 1] += (targets[idx + 1] - positionsAttr.array[idx + 1]) * 0.04;
        positionsAttr.array[idx + 2] += (targets[idx + 2] - positionsAttr.array[idx + 2]) * 0.04;
      } else {
        // Orbiting gently around the center S-logo
        const angle = 0.002 * (i % 2 === 0 ? 1 : -1);
        const x = positionsAttr.array[idx];
        const z = positionsAttr.array[idx + 2];
        positionsAttr.array[idx] = x * Math.cos(angle) - z * Math.sin(angle);
        positionsAttr.array[idx + 2] = x * Math.sin(angle) + z * Math.cos(angle);
        positionsAttr.array[idx + 1] += Math.sin(time + i) * 0.003;
      }
    }
    positionsAttr.needsUpdate = true;
    pointsRef.current.rotation.y += 0.0005;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#C084FC"
        size={0.08}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Controller to handle R3F camera movements
function CameraController({ phase }: { phase: number }) {
  const { camera } = useThree();

  useEffect(() => {
    if (phase === 2) {
      // Zoom in camera slowly as S assembles
      gsap.to(camera.position, {
        z: 8,
        duration: 2.2,
        ease: 'power2.out',
      });
    } else if (phase === 3) {
      // Extreme close-up for fracture/reveal
      gsap.to(camera.position, {
        z: 6.8,
        duration: 1.8,
        ease: 'power1.inOut',
      });
    }
  }, [phase, camera]);

  return null;
}

// The 3D Layered S-Logo assembly and fracture component
function LogoSModel({ phase }: { phase: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const layer1Ref = useRef<THREE.Group>(null);
  const layer2Ref = useRef<THREE.Group>(null);
  const layer3Ref = useRef<THREE.Group>(null);

  // Smooth Bezier Curve paths forming the S logo layers
  const curves = useMemo(() => {
    const c1 = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0.65, 1.25, -0.2),
      new THREE.Vector3(-0.35, 1.25, 0.1),
      new THREE.Vector3(-0.65, 0.9, 0),
      new THREE.Vector3(-0.65, 0.4, 0)
    );
    const c2 = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-0.65, 0.4, 0),
      new THREE.Vector3(-0.65, -0.2, 0.3),
      new THREE.Vector3(0.65, 0.15, -0.3),
      new THREE.Vector3(0.65, -0.5, 0)
    );
    const c3 = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0.65, -0.5, 0),
      new THREE.Vector3(0.65, -1.05, 0.15),
      new THREE.Vector3(0.15, -1.25, -0.1),
      new THREE.Vector3(-0.65, -1.25, 0.2)
    );
    return [c1, c2, c3];
  }, []);

  // Setup GSAP animation sequences on mounting
  useEffect(() => {
    // Initial offset positions
    gsap.set(layer1Ref.current!.position, { x: -3.5, y: 2.2, z: -3.0 });
    gsap.set(layer2Ref.current!.position, { x: 4.0, y: -0.5, z: 2.5 });
    gsap.set(layer3Ref.current!.position, { x: -2.5, y: -2.8, z: 3.5 });

    gsap.set(layer1Ref.current!.rotation, { x: 0.8, y: -0.5, z: 0.4 });
    gsap.set(layer2Ref.current!.rotation, { x: -0.6, y: 0.9, z: -0.3 });
    gsap.set(layer3Ref.current!.rotation, { x: 0.4, y: -0.7, z: 0.6 });

    // Assembly timeline (Phase 2 triggers)
  }, []);

  useEffect(() => {
    if (phase === 2) {
      // Assemble S layers
      gsap.to(layer1Ref.current!.position, { x: 0, y: 0, z: 0, duration: 2.0, ease: 'power3.out' });
      gsap.to(layer2Ref.current!.position, { x: 0, y: 0, z: 0, duration: 2.0, ease: 'power3.out' });
      gsap.to(layer3Ref.current!.position, { x: 0, y: 0, z: 0, duration: 2.0, ease: 'power3.out' });

      gsap.to(layer1Ref.current!.rotation, { x: 0, y: 0, z: 0, duration: 2.2, ease: 'power2.out' });
      gsap.to(layer2Ref.current!.rotation, { x: 0, y: 0, z: 0, duration: 2.2, ease: 'power2.out' });
      gsap.to(layer3Ref.current!.rotation, { x: 0, y: 0, z: 0, duration: 2.2, ease: 'power2.out' });
    } else if (phase === 3) {
      // Fracture S layers elegantly (controlled separation to reveal text)
      gsap.to(layer1Ref.current!.position, {
        x: -1.3,
        y: 0.9,
        z: 0.6,
        duration: 1.8,
        ease: 'power2.inOut',
      });
      gsap.to(layer2Ref.current!.position, {
        x: 1.8,
        y: 0,
        z: -0.8,
        duration: 1.8,
        ease: 'power2.inOut',
      });
      gsap.to(layer3Ref.current!.position, {
        x: -1.3,
        y: -0.9,
        z: 0.8,
        duration: 1.8,
        ease: 'power2.inOut',
      });
    }
  }, [phase]);

  useFrame(() => {
    if (!groupRef.current) return;
    if (phase === 2) {
      // Slow rotation as S aligns
      groupRef.current.rotation.y = Math.sin(Date.now() * 0.0003) * 0.15;
    } else if (phase === 3) {
      // Parallax yaw
      groupRef.current.rotation.y = Math.sin(Date.now() * 0.0005) * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Top Layer S Path */}
      <group ref={layer1Ref}>
        <mesh>
          <tubeGeometry args={[curves[0], 64, 0.09, 12, false]} />
          <meshPhysicalMaterial
            color="#7C3AED"
            emissive="#7C3AED"
            emissiveIntensity={1.4}
            roughness={0.15}
            metalness={0.9}
            clearcoat={1}
          />
        </mesh>
      </group>

      {/* Middle Layer S Path */}
      <group ref={layer2Ref}>
        <mesh>
          <tubeGeometry args={[curves[1], 64, 0.09, 12, false]} />
          <meshPhysicalMaterial
            color="#8B5CF6"
            emissive="#8B5CF6"
            emissiveIntensity={1.6}
            roughness={0.15}
            metalness={0.9}
            clearcoat={1}
          />
        </mesh>
      </group>

      {/* Bottom Layer S Path */}
      <group ref={layer3Ref}>
        <mesh>
          <tubeGeometry args={[curves[2], 64, 0.09, 12, false]} />
          <meshPhysicalMaterial
            color="#C084FC"
            emissive="#C084FC"
            emissiveIntensity={1.4}
            roughness={0.15}
            metalness={0.9}
            clearcoat={1}
          />
        </mesh>
      </group>
    </group>
  );
}

interface IntroSequenceProps {
  onComplete: () => void;
}

export default function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [phase, setPhase] = useState<number>(0); // 0: Dark, 1: Particle Intake, 2: Assembly, 3: Fracture, 4: Scanline, 5: Fading/Complete
  const textRef = useRef<HTMLHeadingElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intro sequence scheduling via timelines
    const tl = gsap.timeline({
      onComplete: () => {
        // Trigger page reveal
        onComplete();
      },
    });

    // 0.0s - Phase 1: Sparse particles intake starts immediately
    tl.to({}, { duration: 0.1, onStart: () => setPhase(1) });

    // 0.6s - Phase 2: S-logo assembly and camera zoom
    tl.to({}, { duration: 1.1, onStart: () => setPhase(2) });

    // 1.7s - Phase 3: Fracture S logo layers & reveal SPYRA AI text
    tl.to({}, {
      duration: 1.8,
      onStart: () => {
        setPhase(3);
        // Fade & zoom text
        gsap.to(textRef.current, {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.1,
          ease: 'power3.out',
        });
      },
    });

    // 3.5s - Phase 4: Vertical glowing scanline sweep and page reveal
    tl.to({}, {
      duration: 1.0,
      onStart: () => {
        setPhase(4);
        if (scanlineRef.current) {
          // Fade in scanline and sweep it down
          gsap.set(scanlineRef.current, { opacity: 1 });
          gsap.to(scanlineRef.current, {
            top: '100%',
            duration: 0.9,
            ease: 'power2.inOut',
          });
        }
        // Fade out overlay container
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.9,
            ease: 'power2.out',
          });
        }
      },
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-[#06070A] z-[100] flex items-center justify-center overflow-hidden"
    >
      {/* 3D WebGL Canvas */}
      <div className="absolute inset-0 z-10 w-full h-full">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }} gl={{ alpha: true, powerPreference: "high-performance" }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <pointLight position={[0, 0, 2]} intensity={2.5} color="#A855F7" />

          {/* Converging/orbiting particles */}
          <IntroParticles phase={phase} />

          {/* Assembling 3D S logo */}
          {phase >= 2 && <LogoSModel phase={phase} />}

          <CameraController phase={phase} />
        </Canvas>
      </div>

      {/* HTML Reveal Text in center background of S-Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <h1
          ref={textRef}
          className="font-mono text-4xl sm:text-7xl font-extrabold tracking-[0.25em] text-[#F5F7FA] opacity-0 scale-90 blur-md select-none transition-all"
          style={{
            textShadow: '0 0 30px rgba(139,92,246,0.5), 0 0 60px rgba(139,92,246,0.2)',
          }}
        >
          SPYRA AI
        </h1>
      </div>

      {/* Full-Screen Scanline Sweep Divider */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <div
          ref={scanlineRef}
          className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent shadow-[0_0_20px_rgba(139,92,246,0.8),0_0_40px_rgba(139,92,246,0.4)] opacity-0"
        />
      </div>
    </div>
  );
}
