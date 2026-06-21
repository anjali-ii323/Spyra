'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';

interface CinematicIntroProps {
  onComplete: () => void;
}

interface Particle {
  x: number; // Current 3D X
  y: number; // Current 3D Y
  z: number; // Current 3D Z
  ox: number; // Original explosion X
  oy: number; // Original explosion Y
  oz: number; // Original explosion Z
  tx: number; // Target S-curve X
  ty: number; // Target S-curve Y
  tz: number; // Target S-curve Z (assigned layer)
  layer: number; // Layer index (0 to 4)
  alpha: number;
  size: number;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timelineComplete, setTimelineComplete] = useState(false);

  // SVG Path definition for the S logo
  const sPath = "M65,25 C45,25 35,32 35,45 C35,60 65,55 65,70 C65,80 55,85 35,85";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Evaluate S-curve Bezier Points
    function getBezierPoint(p0: number[], p1: number[], p2: number[], p3: number[], t: number) {
      const mt = 1 - t;
      const mt2 = mt * mt;
      const mt3 = mt2 * mt;
      const t2 = t * t;
      const t3 = t2 * t;
      return [
        mt3 * p0[0] + 3 * mt2 * t * p1[0] + 3 * mt * t2 * p2[0] + t3 * p3[0],
        mt3 * p0[1] + 3 * mt2 * t * p1[1] + 3 * mt * t2 * p2[1] + t3 * p3[1]
      ];
    }

    function getSPoint(t: number) {
      // Map 100x100 coordinates to center relative box (-180 to 180)
      if (t < 0.33) {
        const localT = t / 0.33;
        const p = getBezierPoint([65, 25], [45, 25], [35, 32], [35, 45], localT);
        return [(p[0] - 50) * 5.6, (p[1] - 55) * 5.6];
      } else if (t < 0.66) {
        const localT = (t - 0.33) / 0.33;
        const p = getBezierPoint([35, 45], [35, 60], [65, 55], [65, 70], localT);
        return [(p[0] - 50) * 5.6, (p[1] - 55) * 5.6];
      } else {
        const localT = (t - 0.66) / 0.34;
        const p = getBezierPoint([65, 70], [65, 80], [55, 85], [35, 85], Math.min(localT, 1.0));
        return [(p[0] - 50) * 5.6, (p[1] - 55) * 5.6];
      }
    }

    // 2. Generate 1200 particles
    const particleCount = 1200;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      // Target points along S Bezier curve
      const tVal = i / (particleCount - 1);
      const [sx, sy] = getSPoint(tVal);
      
      const layer = i % 5;
      const baseZ = -90 + layer * 45; // Five parallel Z slices (-90, -45, 0, 45, 90)

      // Random explosion drifts
      const angle = Math.random() * Math.PI * 2;
      const distance = 150 + Math.random() * 450;
      const ox = Math.cos(angle) * distance;
      const oy = Math.sin(angle) * distance;
      const oz = (Math.random() - 0.5) * 300;

      // Small jitter for data fragment feel
      const jitterX = (Math.random() - 0.5) * 6;
      const jitterY = (Math.random() - 0.5) * 6;
      const jitterZ = (Math.random() - 0.5) * 4;

      particles.push({
        x: 0,
        y: 0,
        z: 0,
        ox,
        oy,
        oz,
        tx: sx + jitterX,
        ty: sy + jitterY,
        tz: baseZ + jitterZ,
        layer,
        alpha: 0,
        size: 0.8 + Math.random() * 1.4,
      });
    }

    // 3. Animation state variables driven by GSAP
    const animState = {
      progress: 0,      // Stage progress (0: birth, 1: explosion, 2: S-logo, 3: scan, 4: transition)
      explodeVal: 0,    // Interpolates from 0 to 1 during explosion
      formSVal: 0,      // Interpolates from 0 to 1 during S alignment
      layerStretch: 1,  // Multiplier for Z separation during Netflix unfold
      strokeThinned: 1, // Interpolates stroke thickness down to thin refined layers
      scanY: -180,      // Scanning beam vertical coordinate
      scanAlpha: 0,     // Scanning line brightness
      rayAlpha: 0,      // Volumetric light sweeps intensity
      cameraRotY: -0.4, // Camera angles for continuous depth rotation
      cameraRotX: 0.2,
      cameraScale: 1.0,
      bgAlpha: 1.0,
    };

    // 4. GSAP Timeline Sequence
    const tl = gsap.timeline({
      onComplete: () => {
        setTimelineComplete(true);
        // Wait 100ms to let Framer Motion register starting layoutId of logo in the DOM
        setTimeout(() => {
          onComplete();
        }, 100);
      }
    });

    // Step A: Spawn central particle birth
    tl.to(particles[0], {
      alpha: 1.0,
      duration: 0.8,
      ease: 'power1.in',
    });

    // Step B: Explode central node into cloud
    tl.to(animState, {
      explodeVal: 1,
      duration: 1.2,
      ease: 'expo.out',
      onUpdate: () => {
        // Fade in all particles during explosion
        particles.forEach((p, idx) => {
          if (idx > 0) p.alpha = 0.3 + Math.random() * 0.5;
        });
      }
    }, 0.8);

    // Step C: Pull particles into structured "S" shape
    tl.to(animState, {
      formSVal: 1,
      duration: 1.6,
      ease: 'power3.inOut',
    }, 2.0);

    // Step D: Start Security Scan Beam & Fade in Volumetric light sweeps
    tl.to(animState, {
      scanAlpha: 1.0,
      rayAlpha: 0.28,
      duration: 0.6,
      ease: 'power2.out',
    }, 3.4);

    // Sweep scan line vertically down and up
    tl.to(animState, {
      scanY: 180,
      duration: 1.4,
      ease: 'sine.inOut',
    }, 3.8);

    tl.to(animState, {
      scanY: -180,
      duration: 1.2,
      ease: 'sine.inOut',
    }, 5.2);

    // Step E: Separate layers in depth (Netflix unfold) & thin lines
    tl.to(animState, {
      layerStretch: 2.8,
      strokeThinned: 0.15,
      scanAlpha: 0,
      duration: 1.4,
      ease: 'power4.inOut',
    }, 6.4);

    // Step F: Pull back camera, fade background to transparent
    tl.to(animState, {
      cameraScale: 0.35,
      bgAlpha: 0.0,
      duration: 1.2,
      ease: 'power3.inOut',
    }, 6.8);

    // Camera slow rotation sweep (constant loop in requestAnimationFrame)
    gsap.to(animState, {
      cameraRotY: 0.3,
      cameraRotX: -0.15,
      duration: 8.0,
      ease: 'sine.inOut',
    });

    // 5. Investigative code signals/callouts details
    const logs = [
      { text: 'READ_SMS // CRITICAL_HIJACK', x: -280, y: -100, activeT: 4.2 },
      { text: 'DexClassLoader.loadClass()', x: -280, y: -20, activeT: 4.8 },
      { text: 'c2: http://185.220.101.4', x: 200, y: -60, activeT: 4.5 },
      { text: 'PRIVILEGE: SYSTEM_ALERT', x: 200, y: 40, activeT: 5.2 },
      { text: 'MALWARE_SIGNATURE: Spyra.A', x: -280, y: 80, activeT: 5.6 },
    ];

    // 6. Perspective Canvas Render Loop
    let animationFrameId: number;
    const fov = 400; // perspective focal length

    const render = () => {
      if (!ctx || !canvas) return;

      // Clear with dynamic backdrop alpha
      ctx.fillStyle = `rgba(3, 3, 7, ${animState.bgAlpha})`;
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Compute camera angles
      const cosY = Math.cos(animState.cameraRotY);
      const sinY = Math.sin(animState.cameraRotY);
      const cosX = Math.cos(animState.cameraRotX);
      const sinX = Math.sin(animState.cameraRotX);

      // Compute particle coordinates
      const projectedPoints: { x: number; y: number; z: number; size: number; alpha: number; layer: number }[] = [];

      particles.forEach((p) => {
        let px = 0;
        let py = 0;
        let pz = 0;

        if (animState.formSVal > 0) {
          // Morph between exploded coordinates and S logo targets
          const morphX = p.ox + (p.tx - p.ox) * animState.formSVal;
          const morphY = p.oy + (p.ty - p.oy) * animState.formSVal;
          // Apply Z-depth stretch separation
          const morphZ = p.oz + (p.tz * animState.layerStretch - p.oz) * animState.formSVal;

          px = morphX;
          py = morphY;
          pz = morphZ;
        } else {
          // Explosion drift
          px = p.ox * animState.explodeVal;
          py = p.oy * animState.explodeVal;
          pz = p.oz * animState.explodeVal;
        }

        // Apply 3D Camera Rotation around Y axis
        let x1 = px * cosY - pz * sinY;
        let z1 = px * sinY + pz * cosY;

        // Apply 3D Camera Rotation around X axis
        let y2 = py * cosX - z1 * sinX;
        let z2 = py * sinX + z1 * cosX;

        // Apply Camera Zoom Scale
        x1 *= animState.cameraScale;
        y2 *= animState.cameraScale;
        z2 *= animState.cameraScale;

        // Perspective projection formula
        const scale = fov / (fov + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;

        projectedPoints.push({
          x: projX,
          y: projY,
          z: z2,
          size: p.size * scale,
          alpha: p.alpha,
          layer: p.layer,
        });
      });

      // Draw volumetric light shafts fanning out behind the logo layers
      if (animState.rayAlpha > 0) {
        ctx.globalCompositeOperation = 'screen';
        const numRays = 4;
        for (let i = 0; i < numRays; i++) {
          const angle = (Date.now() * 0.0005) + (i * Math.PI / 2);
          const raySize = 400 * animState.cameraScale;
          const x1 = centerX + Math.cos(angle - 0.2) * raySize;
          const y1 = centerY + Math.sin(angle - 0.2) * raySize;
          const x2 = centerX + Math.cos(angle + 0.2) * raySize;
          const y2 = centerY + Math.sin(angle + 0.2) * raySize;

          const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, raySize);
          const rayColor = i % 2 === 0 ? '139, 92, 246' : '168, 85, 247'; // violet / purple
          grad.addColorStop(0, `rgba(${rayColor}, ${animState.rayAlpha})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      // Draw neural network lines (connecting adjacent points and layer slices)
      if (animState.formSVal > 0.4) {
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * animState.formSVal * animState.strokeThinned})`;
        ctx.lineWidth = 0.5;

        for (let i = 0; i < projectedPoints.length - 1; i++) {
          const pA = projectedPoints[i];
          const pB = projectedPoints[i + 1];

          // Connect points along the S-curve
          if (pA.layer === pB.layer && Math.abs(pA.z - pB.z) < 30) {
            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
            ctx.stroke();
          }

          // Connect corresponding points across adjacent layer slices
          if (i + 5 < projectedPoints.length) {
            const pC = projectedPoints[i + 5];
            if (Math.abs(pA.z - pC.z) < 140) {
              ctx.beginPath();
              ctx.moveTo(pA.x, pA.y);
              ctx.lineTo(pC.x, pC.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw data particles
      projectedPoints.forEach((pt) => {
        ctx.fillStyle = pt.layer === 4 ? `rgba(255, 255, 255, ${pt.alpha})` : `rgba(139, 92, 246, ${pt.alpha})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw horizontal security scan line
      if (animState.scanAlpha > 0) {
        const lineY = centerY + animState.scanY * animState.cameraScale;
        const grad = ctx.createLinearGradient(centerX - 150, lineY, centerX + 150, lineY);
        grad.addColorStop(0, 'rgba(139, 92, 246, 0)');
        grad.addColorStop(0.5, `rgba(255, 255, 255, ${animState.scanAlpha})`);
        grad.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(centerX - 220 * animState.cameraScale, lineY);
        ctx.lineTo(centerX + 220 * animState.cameraScale, lineY);
        ctx.stroke();

        // Draw scan glow reflection
        const reflectGrad = ctx.createRadialGradient(centerX, lineY, 0, centerX, lineY, 80);
        reflectGrad.addColorStop(0, 'rgba(139, 92, 246, 0.12)');
        reflectGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = reflectGrad;
        ctx.beginPath();
        ctx.arc(centerX, lineY, 80, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw investigative float logs/callouts
      if (animState.formSVal > 0.8 && animState.scanAlpha > 0) {
        const timePassed = tl.time();
        
        logs.forEach((log) => {
          if (timePassed >= log.activeT) {
            const lx = centerX + log.x * animState.cameraScale;
            const ly = centerY + log.y * animState.cameraScale;

            // Fade in matching scan progression
            const fade = Math.min((timePassed - log.activeT) * 1.5, 1.0);
            ctx.fillStyle = `rgba(168, 85, 247, ${fade * 0.8})`;
            ctx.font = '9px monospace';
            ctx.textAlign = log.x < 0 ? 'right' : 'left';
            ctx.fillText(log.text, lx, ly);

            // Connect text callout to S-logo nodes with leader lines
            ctx.strokeStyle = `rgba(139, 92, 246, ${fade * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(lx, ly + 2);
            ctx.lineTo(lx + (log.x < 0 ? 30 : -30), ly + 2);
            ctx.lineTo(centerX + (log.x < 0 ? -60 : 60) * animState.cameraScale, centerY + log.y * animState.cameraScale);
            ctx.stroke();
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[100] bg-[#030307] flex flex-col items-center justify-center p-6 select-none overflow-hidden transition-all duration-1000 ${
        timelineComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Floating morph container */}
      <div className="relative w-80 h-80 flex items-center justify-center pointer-events-none">
        {timelineComplete && (
          <motion.div
            layoutId="spyra-logo"
            style={{ width: '58.8px', height: '58.8px' }}
            className="absolute"
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d={sPath}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="7"
                strokeLinecap="round"
                className="drop-shadow-[0_0_4px_rgba(139,92,246,0.6)]"
              />
            </svg>
          </motion.div>
        )}
      </div>
    </div>
  );
}
