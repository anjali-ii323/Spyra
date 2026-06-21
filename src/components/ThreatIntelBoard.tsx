'use client';

import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Wifi, Terminal, Cpu, Database, Eye, Activity } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface NodeData {
  id: string;
  title: string;
  icon: any;
  status: string;
  details: string[];
}

export default function ThreatIntelBoard() {
  const [activeNode, setActiveNode] = useState<string>('risk');
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const nodes: NodeData[] = [
    {
      id: 'risk',
      title: 'Risk Profile Index',
      icon: ShieldAlert,
      status: 'CRITICAL THREAT',
      details: [
        'Danger Quotient: 92/100',
        'Payload Integrity: FAILED',
        'Host System Clearance: REVOKED',
        'Trojan Signature Match: TRUE',
      ],
    },
    {
      id: 'permissions',
      title: 'Permission Profiler',
      icon: Shield,
      status: '5 INTRUSIVE PRIVILEGES',
      details: [
        'BIND_ACCESSIBILITY_SERVICE: Bypass overlay controls',
        'SYSTEM_ALERT_WINDOW: Inject alert hijack screens',
        'RECEIVE_BOOT_COMPLETED: Silent persistence hook',
        'READ_SMS: Intercept MFA auth security tokens',
      ],
    },
    {
      id: 'network',
      title: 'Network Telemetry',
      icon: Wifi,
      status: 'SUSPICIOUS TELEMETRY',
      details: [
        'C2 control node: 185.220.101.4 (TOR exit bridge)',
        'Endpoint socket: port 443 TCP encrypted telemetry',
        'Data extraction packet: encrypted headers found',
        'SSL verification: BYPASSED (Accepts all certs)',
      ],
    },
    {
      id: 'malware',
      title: 'Malware Signatures',
      icon: Database,
      status: 'TROJAN DETECTED',
      details: [
        'Bytecode pattern matches malware family: Spyra.A',
        'Known hash identifier: sha256_82f1bc8f042e9...',
        'Signature matching: Threat database cache v12.44',
      ],
    },
    {
      id: 'ai',
      title: 'AI Agent Verdict',
      icon: Cpu,
      status: 'MULTI-AGENT CONSENSUS',
      details: [
        'Decompiler Agent: Detected packers / namespace obfuscation',
        'Behavioral Agent: Class loader loads hidden bytes dynamically',
        'Security Explainer: Intent matches Android Ransomware profile',
      ],
    },
  ];

  const activeData = nodes.find((n) => n.id === activeNode) || nodes[0];

  return (
    <div className="w-full bg-[#030307] border border-zinc-900 rounded-2xl p-6 shadow-[0_0_50px_rgba(139,92,246,0.02)] overflow-hidden font-mono">
      {/* Station Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-900 pb-4 mb-6 gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-bold text-white tracking-widest uppercase">
            ANALYST_WORKSTATION // THREAT_CORRELATION_BOARD
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full bg-red-500 ${pulse ? 'animate-ping' : ''}`} />
            LIVE TELEMETRY
          </span>
          <span>CORRELATION: ACTIVE</span>
        </div>
      </div>

      {/* Main Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[420px]">
        {/* Left Side: Circular node diagram with animated visual connectors */}
        <div className="lg:col-span-6 flex items-center justify-center p-4 relative min-h-[300px]">
          {/* SVG Connector Lines connecting outer nodes to the center core */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {/* Define glowing drop shadows */}
            <defs>
              <filter id="glow-line" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Animated data flow lines */}
            <g filter="url(#glow-line)">
              {/* Line 1: Center to Permissions (Top Left) */}
              <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="8,12" className="animate-[dash_2.5s_linear_infinite]" />

              {/* Line 2: Center to Network (Top Right) */}
              <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="8,12" className="animate-[dash_3s_linear_infinite_reverse]" />

              {/* Line 3: Center to Malware (Bottom Left) */}
              <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="8,12" className="animate-[dash_2.2s_linear_infinite]" />

              {/* Line 4: Center to AI Verdict (Bottom Right) */}
              <line x1="50%" y1="50%" x2="80%" y2="75%" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="50%" y1="50%" x2="80%" y2="75%" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="8,12" className="animate-[dash_2.8s_linear_infinite_reverse]" />
            </g>
          </svg>

          {/* Core Center Node: Risk Profile */}
          <button
            onClick={() => setActiveNode('risk')}
            className={`absolute w-28 h-28 rounded-full border flex flex-col items-center justify-center gap-1.5 z-10 transition-all duration-300 ${
              activeNode === 'risk'
                ? 'border-red-500/60 bg-red-950/20 shadow-[0_0_25px_rgba(239,68,68,0.25)] text-red-400'
                : 'border-zinc-800 bg-[#09090c] text-zinc-450 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase">RISK SCORE</span>
            <span className="text-lg font-bold">92%</span>
          </button>

          {/* Node 2: Permissions (Top Left) */}
          <button
            onClick={() => setActiveNode('permissions')}
            className={`absolute left-[10%] top-[12%] w-18 h-18 rounded-lg border flex flex-col items-center justify-center gap-1 z-10 transition-all duration-300 ${
              activeNode === 'permissions'
                ? 'border-violet-500/60 bg-violet-950/20 shadow-[0_0_20px_rgba(139,92,246,0.25)] text-violet-400'
                : 'border-zinc-900 bg-[#060609] text-zinc-500 hover:border-zinc-800 hover:text-zinc-200'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[8px] font-bold tracking-wider">PRIVILEGES</span>
          </button>

          {/* Node 3: Network Telemetry (Top Right) */}
          <button
            onClick={() => setActiveNode('network')}
            className={`absolute right-[10%] top-[12%] w-18 h-18 rounded-lg border flex flex-col items-center justify-center gap-1 z-10 transition-all duration-300 ${
              activeNode === 'network'
                ? 'border-violet-500/60 bg-violet-950/20 shadow-[0_0_20px_rgba(139,92,246,0.25)] text-violet-400'
                : 'border-zinc-900 bg-[#060609] text-zinc-500 hover:border-zinc-800 hover:text-zinc-200'
            }`}
          >
            <Wifi className="w-5 h-5" />
            <span className="text-[8px] font-bold tracking-wider">NETWORK</span>
          </button>

          {/* Node 4: Malware (Bottom Left) */}
          <button
            onClick={() => setActiveNode('malware')}
            className={`absolute left-[10%] bottom-[12%] w-18 h-18 rounded-lg border flex flex-col items-center justify-center gap-1 z-10 transition-all duration-300 ${
              activeNode === 'malware'
                ? 'border-violet-500/60 bg-violet-950/20 shadow-[0_0_20px_rgba(139,92,246,0.25)] text-violet-400'
                : 'border-zinc-900 bg-[#060609] text-zinc-500 hover:border-zinc-800 hover:text-zinc-200'
            }`}
          >
            <Database className="w-5 h-5" />
            <span className="text-[8px] font-bold tracking-wider">SIGNATURES</span>
          </button>

          {/* Node 5: AI Findings (Bottom Right) */}
          <button
            onClick={() => setActiveNode('ai')}
            className={`absolute right-[10%] bottom-[12%] w-18 h-18 rounded-lg border flex flex-col items-center justify-center gap-1 z-10 transition-all duration-300 ${
              activeNode === 'ai'
                ? 'border-violet-500/60 bg-violet-950/20 shadow-[0_0_20px_rgba(139,92,246,0.25)] text-violet-400'
                : 'border-zinc-900 bg-[#060609] text-zinc-500 hover:border-zinc-800 hover:text-zinc-200'
            }`}
          >
            <Cpu className="w-5 h-5" />
            <span className="text-[8px] font-bold tracking-wider">AI_AGENTS</span>
          </button>
        </div>

        {/* Right Side: Detailed metrics console */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <Card className="bg-[#050508]/80 border-zinc-900 flex-1 flex flex-col justify-between p-6">
            <div className="flex flex-col gap-4">
              {/* Selected Node Header */}
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <activeData.icon className="w-4 h-4 text-violet-450" />
                  <span className="text-xs font-bold text-white tracking-widest uppercase">{activeData.title}</span>
                </div>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded tracking-wide ${
                  activeData.id === 'risk' || activeData.id === 'malware'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                }`}>
                  {activeData.status}
                </span>
              </div>

              {/* Console logs */}
              <div className="flex flex-col gap-3 font-mono text-[10px] text-zinc-400 mt-2">
                {activeData.details.map((detail, idx) => (
                  <div key={idx} className="flex gap-2 items-start py-1 px-2.5 rounded bg-zinc-950/40 border border-zinc-900/30">
                    <span className="text-zinc-650 flex-shrink-0">&gt;&gt;</span>
                    <span className="leading-relaxed">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom active telemetry stats */}
            <div className="border-t border-zinc-900 pt-4 mt-6 flex justify-between items-center text-[9px] text-zinc-550">
              <span className="flex items-center gap-1.5 uppercase font-mono">
                <Activity className="w-3.5 h-3.5 text-zinc-600" /> SYS_PROBE_CORRELATION: ONLINE
              </span>
              <span className="font-mono text-zinc-500 uppercase">THREAT LEVEL CRITICAL</span>
            </div>
          </Card>
        </div>
      </div>
      
      {/* SVG Dash animation CSS rules */}
      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
      `}</style>
    </div>
  );
}
