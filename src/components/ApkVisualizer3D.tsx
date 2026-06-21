'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Shield, Globe, Terminal, Cpu, Network } from 'lucide-react';

// Custom Connecting Vector Line between central capsule and 3D floating nodes
function ConnectionLine({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, opacity: 0.3, transparent: true });
  const line = new THREE.Line(lineGeom, material);

  return <primitive object={line} />;
}

function APKScene() {
  const groupRef = useRef<THREE.Group>(null);
  const capsuleRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Parallax tilt and constant rotation
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Constant slow base rotation combined with mouse tilt parallax
    const targetRotX = state.pointer.y * -0.35;
    const targetRotY = state.pointer.x * 0.35 + state.clock.getElapsedTime() * 0.12;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);

    // Subtle breathing scale of central capsule
    if (capsuleRef.current) {
      capsuleRef.current.scale.setScalar(1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.03);
    }

    // Counter rotate rings
    if (ring1Ref.current) ring1Ref.current.rotation.z -= 0.003;
    if (ring2Ref.current) ring2Ref.current.rotation.x += 0.005;
  });

  // Coordinates for floating HTML nodes
  const nodes = [
    {
      id: 'permissions',
      pos: [-2.2, 1.4, 0.5] as [number, number, number],
      color: '#EF4444',
      icon: <Shield className="w-3.5 h-3.5" />,
      title: 'PERMISSIONS',
      details: ['RECEIVE_SMS', 'SYSTEM_ALERT_WINDOW', 'READ_PHONE_STATE']
    },
    {
      id: 'urls',
      pos: [2.3, 1.6, -0.6] as [number, number, number],
      color: '#F59E0B',
      icon: <Globe className="w-3.5 h-3.5" />,
      title: 'C2 HOSTS & URLS',
      details: ['185.220.101.4', 'c2-domain.net', 'payload-exfil.org']
    },
    {
      id: 'services',
      pos: [2.1, -1.4, 0.8] as [number, number, number],
      color: '#14B8A6',
      icon: <Cpu className="w-3.5 h-3.5" />,
      title: 'SERVICES',
      details: ['SmsMonitorService', 'DexLoaderWorker', 'BootReceiver']
    },
    {
      id: 'activities',
      pos: [-2.0, -1.5, -0.8] as [number, number, number],
      color: '#C084FC',
      icon: <Terminal className="w-3.5 h-3.5" />,
      title: 'ACTIVITIES',
      details: ['MainActivity', 'OverlayAuthUI', 'VerifyAlert']
    },
    {
      id: 'networks',
      pos: [3.0, 0.0, 1.0] as [number, number, number],
      color: '#8B5CF6',
      icon: <Network className="w-3.5 h-3.5" />,
      title: 'CONNECTIONS',
      details: ['Tor Exit Nodes', 'Exfiltration Sockets', 'Dynamic Gateways']
    }
  ];

  return (
    <group ref={groupRef}>
      {/* Central 3D APK Capsule Object */}
      <mesh ref={capsuleRef}>
        <capsuleGeometry args={[0.5, 1.1, 8, 16]} />
        <meshPhysicalMaterial
          color="#8B5CF6"
          emissive="#7C3AED"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.8}
          clearcoat={1.0}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Outer wireframe capsule shell */}
      <mesh>
        <capsuleGeometry args={[0.52, 1.12, 6, 12]} />
        <meshBasicMaterial color="#C084FC" wireframe opacity={0.15} transparent />
      </mesh>

      {/* Orbital Ring 1 */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.3, 0.015, 8, 48]} />
        <meshBasicMaterial color="#8B5CF6" opacity={0.25} transparent />
      </mesh>

      {/* Orbital Ring 2 (Dashed/Dotted representation) */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[1.6, 0.01, 6, 32]} />
        <meshBasicMaterial color="#D8B4FE" wireframe opacity={0.2} transparent />
      </mesh>

      {/* Connection lines to data nodes */}
      {nodes.map((node) => (
        <ConnectionLine key={`line-${node.id}`} start={[0, 0, 0]} end={node.pos} color={node.color} />
      ))}

      {/* HTML Parallax Data Cards */}
      {nodes.map((node) => (
        <Html
          key={node.id}
          position={node.pos}
          center
          distanceFactor={6.2}
          zIndexRange={[10, 50]}
          transform
          sprite
        >
          <div
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#0F1020]/90 border text-left font-mono text-[9px] w-[130px] shadow-2xl backdrop-blur-md cursor-help transition-all duration-300 select-none"
            style={{
              borderColor: hoveredNode === node.id ? node.color : 'rgba(139, 92, 246, 0.2)',
              boxShadow: hoveredNode === node.id ? `0 0 15px ${node.color}33` : 'none',
              transform: hoveredNode === node.id ? 'scale(1.05)' : 'scale(1.0)',
            }}
          >
            <span
              className="font-bold tracking-wider flex items-center gap-1.5"
              style={{ color: node.color }}
            >
              {node.icon}
              {node.title}
            </span>
            <div className="flex flex-col gap-0.5 text-zinc-400 border-l pl-2" style={{ borderColor: `${node.color}44` }}>
              {node.details.map((d, index) => (
                <span key={index} className="truncate block">• {d}</span>
              ))}
            </div>
          </div>
        </Html>
      ))}
    </group>
  );
}

export default function ApkVisualizer3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-[430px] h-[430px] border border-[#8B5CF6]/15 rounded-3xl bg-white/[0.02] flex items-center justify-center font-mono text-zinc-500 text-xs">
        Initializing 3D Operator Console...
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[440px] h-[440px] border border-[#8B5CF6]/15 rounded-3xl bg-white/[0.01] hover:border-[#8B5CF6]/30 shadow-[0_0_50px_rgba(139,92,246,0.02)] transition-all duration-500 overflow-hidden flex items-center justify-center select-none">
      {/* 3D background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1F2235_1px,transparent_1px),linear-gradient(to_bottom,#1F2235_1px,transparent_1px)] bg-[size:30px_30px] opacity-10 pointer-events-none" />

      {/* Canvas container */}
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#8B5CF6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#C084FC" />
        
        <APKScene />
      </Canvas>
    </div>
  );
}
