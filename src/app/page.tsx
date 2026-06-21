'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Cpu,
  ArrowRight,
  Terminal,
  Activity,
  Network,
  Fingerprint,
  Radio,
  FileCode,
  ShieldCheck,
  Info,
  CheckCircle2,
  AlertTriangle,
  Server,
  Lock,
  Globe,
  Database,
  FileText,
  FileSearch,
  Eye,
  Sliders,
  Share2,
  ChevronDown
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import UploadInvestigation from '@/components/UploadInvestigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CyberBackground from '@/components/CyberBackground';
import dynamic from 'next/dynamic';

const IntroSequence = dynamic(() => import('@/components/IntroSequence'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#06070A] z-[100]" />
});

const ApkVisualizer3D = dynamic(() => import('@/components/ApkVisualizer3D'), {
  ssr: false,
  loading: () => (
    <div className="w-[430px] h-[430px] border border-[#8B5CF6]/15 rounded-3xl bg-white/[0.01] flex items-center justify-center font-mono text-zinc-500 text-xs">
      Initializing 3D Operator Console...
    </div>
  )
});

export default function StartupLandingPage() {
  const [introActive, setIntroActive] = useState(true);
  const [activeTab, setActiveTab] = useState<'dex' | 'network' | 'explainer' | 'graph'>('dex');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const smaliCode = `.class public Lcom/spyra/security/Agent;
.super Ljava/lang/Object;
.field private static final C2:Ljava/lang/String; = "http://185.220.101.4/payload"

.method public static interceptSMS(Landroid/content/Context;)V
    .registers 5
    const-string v0, "android.permission.RECEIVE_SMS"
    invoke-static {p0, v0}, Lcom/spyra/security/Agent;->checkPermission(Landroid/content/Context;Ljava/lang/String;)Z
    move-result v0
    if-eqz v0, :Lunsafe
    const-string v1, "SMS_HIJACK_ENGAGED"
    invoke-static {v1}, Lcom/spyra/security/Logger;->logCritical(Ljava/lang/String;)V
    
    # Critical API Call isolated in sandbox cleanroom
    invoke-virtual {v0}, Landroid/telephony/SmsManager;->sendTextMessage(...)V
    :Lunsafe
    return-void
.end method`;

  const networkTargets = [
    { ip: '185.220.101.4', port: '80/HTTP', type: 'Tor Exit Node', location: 'Germany', status: 'Critical', statusColor: 'text-[#EF4444]' },
    { ip: '194.26.135.201', port: '443/HTTPS', type: 'Known C2 Host', location: 'Russia', status: 'Suspicious', statusColor: 'text-[#F59E0B]' },
    { ip: '8.8.8.8', port: '53/UDP', type: 'Google DNS', location: 'United States', status: 'Safe', statusColor: 'text-[#10B981]' }
  ];

  return (
    <div className="min-h-screen bg-[#06070A] text-[#F5F7FA] overflow-x-hidden font-sans relative">
      
      {/* Intro Opening Animation Overlay */}
      <AnimatePresence>
        {introActive && (
          <IntroSequence onComplete={() => setIntroActive(false)} />
        )}
      </AnimatePresence>

      {/* Subtle particle matrix background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <CyberBackground />
      </div>

      {/* Fixed Header Navbar */}
      <Navbar introActive={introActive} />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto z-10 min-h-[90vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* Hero Left Column (Copy and Call to Action) */}
          <div className="lg:col-span-6 flex flex-col items-start text-left gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-[#8B5CF6]/20 text-xs font-mono text-[#D8B4FE]">
              <Shield className="w-3.5 h-3.5" /> SECURE SANDBOX CLEANROOM
            </div>
            
            <div className="flex flex-col gap-2">
              <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-none text-[#F5F7FA] uppercase select-none">
                SPYRA AI
              </h2>
              <div className="font-mono text-xl sm:text-2xl font-bold text-zinc-550 uppercase tracking-widest flex flex-col gap-1 mt-2">
                <span className="text-[#8B5CF6]">➔ Reverse Engineer.</span>
                <span className="text-[#8B5CF6]/80">➔ Investigate.</span>
                <span className="text-[#8B5CF6]/60">➔ Understand.</span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-xl leading-relaxed">
              Upload Android applications and uncover hidden behavior, suspicious permissions, network activity, and potential threats before installation.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Button 
                onClick={() => setUploadModalOpen(true)}
                className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] text-white font-mono font-bold tracking-widest text-xs px-6 py-4 rounded border-none cursor-pointer"
              >
                START INVESTIGATION
              </Button>
              <a href="#diagnostics">
                <Button variant="outline" className="border-zinc-850 hover:border-[#8B5CF6]/30 text-zinc-300 hover:text-white hover:bg-white/[0.02] font-mono font-bold tracking-widest text-xs px-6 py-4 rounded">
                  VIEW DEMO REPORT
                </Button>
              </a>
            </div>
          </div>

          {/* Hero Right Column (Interactive 3D APK HUD Object) */}
          <div className="lg:col-span-6 w-full flex justify-center items-center">
            <ApkVisualizer3D />
          </div>

        </div>
      </header>

      {/* SECTION 1: HOW IT WORKS */}
      <section id="pipeline" className="relative py-24 bg-[#0F1020]/30 border-y border-[#8B5CF6]/10 z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="font-mono text-[10px] text-[#D8B4FE] font-bold tracking-widest uppercase block mb-3">// PIPELINE OPERATION</span>
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white">
            HOW IT WORKS
          </h2>
          <p className="text-xs text-zinc-400 font-sans max-w-md mx-auto mt-2 leading-relaxed">
            The automated diagnostics pipeline triggered upon binary cleanroom submission.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 text-left font-mono text-xs">
            {/* Step 1 */}
            <div className="bg-[#0F1020]/60 border border-[#8B5CF6]/15 p-6 rounded-xl flex flex-col gap-3 relative overflow-hidden group hover:border-[#8B5CF6]/30 transition-all duration-300">
              <span className="text-[10px] text-[#D8B4FE] font-bold">01 // INTAKE</span>
              <h4 className="text-sm font-bold text-white uppercase">Upload APK</h4>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                Ingest target APK packages or structural ZIP files directly into our isolated cleanroom sandbox.
              </p>
            </div>
            {/* Step 2 */}
            <div className="bg-[#0F1020]/60 border border-[#8B5CF6]/15 p-6 rounded-xl flex flex-col gap-3 relative overflow-hidden group hover:border-[#8B5CF6]/30 transition-all duration-300">
              <span className="text-[10px] text-[#D8B4FE] font-bold">02 // DISSECT</span>
              <h4 className="text-sm font-bold text-white uppercase">Reverse Engineer</h4>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                Decompile compiled classes.dex modules and read raw AndroidManifest configuration tags.
              </p>
            </div>
            {/* Step 3 */}
            <div className="bg-[#0F1020]/60 border border-[#8B5CF6]/15 p-6 rounded-xl flex flex-col gap-3 relative overflow-hidden group hover:border-[#8B5CF6]/30 transition-all duration-300">
              <span className="text-[10px] text-[#D8B4FE] font-bold">03 // ANALYSIS</span>
              <h4 className="text-sm font-bold text-white uppercase">Investigate</h4>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                Evaluate danger levels, run static agent algorithms, and verify blacklisted socket gateways.
              </p>
            </div>
            {/* Step 4 */}
            <div className="bg-[#0F1020]/60 border border-[#8B5CF6]/15 p-6 rounded-xl flex flex-col gap-3 relative overflow-hidden group hover:border-[#8B5CF6]/30 transition-all duration-300">
              <span className="text-[10px] text-[#D8B4FE] font-bold">04 // REPORT</span>
              <h4 className="text-sm font-bold text-white uppercase">Generate Report</h4>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                Publish a structured security dossier containing mitigation instructions and threat nodes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: MULTI-AGENT INVESTIGATION */}
      <section id="agents" className="relative py-24 px-6 max-w-7xl mx-auto z-10">
        <div className="flex flex-col items-center text-center gap-3 mb-16">
          <span className="font-mono text-[10px] text-[#D8B4FE] font-bold tracking-widest uppercase block">// SECURITY INTELLIGENCE</span>
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white">
            MULTI-AGENT SWARM ANALYSIS
          </h2>
          <p className="text-xs text-zinc-450 font-sans max-w-md mx-auto leading-relaxed">
            Four specialized agents run parallel checks to capture permission overlaps and binary risks.
          </p>
        </div>

        {/* Graphical Representation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Agent cards left side */}
          <div className="lg:col-span-4 flex flex-col gap-4 font-mono text-[11px] text-zinc-400">
            <div className="p-4 bg-[#0F1020]/50 border border-[#8B5CF6]/15 rounded-xl hover:border-[#8B5CF6]/30 transition-all">
              <span className="text-[#8B5CF6] font-bold block mb-1">PRIVACY AGENT</span>
              <p className="text-[10px] text-zinc-400 font-sans leading-normal">Evaluates permission levels (e.g. SMS intercepts) for overlay harvesting dangers.</p>
            </div>
            <div className="p-4 bg-[#0F1020]/50 border border-[#8B5CF6]/15 rounded-xl hover:border-[#8B5CF6]/30 transition-all">
              <span className="text-[#14B8A6] font-bold block mb-1">NETWORK AGENT</span>
              <p className="text-[10px] text-zinc-400 font-sans leading-normal">Scrapes connection strings and correlates active IPs with C2 blacklist proxies.</p>
            </div>
          </div>

          {/* Central Pulsing Engine */}
          <div className="lg:col-span-4 flex justify-center py-6">
            <div className="relative w-44 h-44 rounded-full border border-[#8B5CF6]/15 flex items-center justify-center bg-[#0F1020]/40 shadow-[0_0_40px_rgba(139,92,246,0.06)]">
              {/* Converging dashed rings */}
              <div className="absolute inset-4 rounded-full border border-dashed border-[#8B5CF6]/10 animate-[spin_12s_linear_infinite]" />
              <div className="absolute inset-8 rounded-full border border-dashed border-[#8B5CF6]/20 animate-[spin_6s_linear_infinite_reverse]" />
              
              <div className="w-16 h-16 rounded-full bg-[#06070A] border border-[#8B5CF6]/35 flex items-center justify-center text-[#D8B4FE] z-10 shadow-[0_0_15px_rgba(139,92,246,0.2)] animate-pulse">
                <Cpu className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Agent cards right side */}
          <div className="lg:col-span-4 flex flex-col gap-4 font-mono text-[11px] text-zinc-400">
            <div className="p-4 bg-[#0F1020]/50 border border-[#8B5CF6]/15 rounded-xl hover:border-[#8B5CF6]/30 transition-all">
              <span className="text-[#F59E0B] font-bold block mb-1">MALWARE AGENT</span>
              <p className="text-[10px] text-zinc-400 font-sans leading-normal">Performs structural signature checks against active Trojans and adware databases.</p>
            </div>
            <div className="p-4 bg-[#0F1020]/50 border border-[#8B5CF6]/15 rounded-xl hover:border-[#8B5CF6]/30 transition-all">
              <span className="text-[#D8B4FE] font-bold block mb-1">INTEL AGENT</span>
              <p className="text-[10px] text-zinc-400 font-sans leading-normal">References global intelligence registries to classify verified malware strains.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THREAT CORRELATION */}
      <section id="correlation" className="relative py-24 bg-[#0F1020]/30 border-y border-[#8B5CF6]/10 z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center text-center gap-3 mb-12">
            <span className="font-mono text-[10px] text-[#D8B4FE] font-bold tracking-widest uppercase block">// NODE LINKAGE MAP</span>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white">
              THREAT VECTOR CORRELATION
            </h2>
            <p className="text-xs text-zinc-450 font-sans max-w-md mx-auto leading-relaxed">
              Visual mapping illustrating how system permissions link to suspicious C2 network targets.
            </p>
          </div>

          {/* SVG Relationship Graph */}
          <div className="bg-[#06070A]/85 border border-[#8B5CF6]/15 rounded-2xl max-w-3xl mx-auto p-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.02),transparent)] pointer-events-none" />
            <svg className="w-full h-[280px] overflow-visible z-10 relative" viewBox="0 0 600 280">
              
              {/* Glowing animated path connectors */}
              <motion.path
                d="M 120 70 L 300 140 M 120 210 L 300 140 M 300 140 L 480 140"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="1.5"
                strokeOpacity="0.4"
                strokeDasharray="400"
                animate={{ strokeDashoffset: [400, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />

              {/* Node 1: Permissions */}
              <g transform="translate(120, 70)">
                <circle r="26" fill="#0F1020" stroke="#8b5cf6" strokeWidth="1.5" />
                <text fill="#D8B4FE" fontSize="7" fontFamily="monospace" textAnchor="middle" y="3">SMS_PERMISSION</text>
              </g>

              {/* Node 2: Sockets */}
              <g transform="translate(120, 210)">
                <circle r="26" fill="#0F1020" stroke="#8b5cf6" strokeWidth="1.5" />
                <text fill="#D8B4FE" fontSize="7" fontFamily="monospace" textAnchor="middle" y="3">C2_IP_MATCH</text>
              </g>

              {/* Node 3: Core Correlator */}
              <g transform="translate(300, 140)">
                <circle r="32" fill="#0F1020" stroke="#8b5cf6" strokeWidth="2.5" />
                <circle r="32" fill="none" stroke="#D8B4FE" strokeWidth="1.5" className="animate-ping opacity-25" />
                <text fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle" y="3" fontWeight="bold">CORRELATOR</text>
              </g>

              {/* Node 4: Threat Score */}
              <g transform="translate(480, 140)">
                <circle r="28" fill="#0F1020" stroke="#EF4444" strokeWidth="2" />
                <text fill="#fca5a5" fontSize="8" fontFamily="monospace" textAnchor="middle" y="3" fontWeight="bold">92% DANGER</text>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE REPORT PREVIEW */}
      <section id="diagnostics" className="relative py-24 px-6 max-w-7xl mx-auto z-10">
        <div className="flex flex-col items-center text-center gap-3 mb-16">
          <span className="font-mono text-[10px] text-[#D8B4FE] font-bold tracking-widest uppercase block">// DIAGNOSTICS CONSOLE</span>
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white">
            INTERACTIVE INTEL REPORT
          </h2>
          <p className="text-xs text-zinc-450 font-sans max-w-md mx-auto leading-relaxed">
            Audit-ready operational summaries, classes disassembly, and geolocated sockets maps.
          </p>
        </div>

        {/* Console mockup */}
        <div className="bg-[#0F1020] border border-[#8B5CF6]/15 rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto flex flex-col font-mono text-xs">
          
          {/* Header */}
          <div className="bg-[#06070A] border-b border-[#8B5CF6]/10 px-5 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-zinc-450 text-[10px]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[#EF4444] font-bold uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping" /> CRITICAL_ALERT
              </span>
              <span className="text-zinc-700">|</span>
              <span>Dossier://com.spyra.hijack</span>
            </div>
            <span className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] px-2.5 py-0.5 rounded font-bold">THREAT SCORE: 92%</span>
          </div>

          {/* Interactive Tab bar */}
          <div className="bg-[#06070A]/40 border-b border-[#8B5CF6]/10 flex overflow-x-auto text-[10px] font-bold">
            <button
              onClick={() => setActiveTab('dex')}
              className={`px-5 py-3.5 border-r border-[#8B5CF6]/10 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dex' ? 'bg-[#0F1020] text-[#D8B4FE] border-b-2 border-b-[#8B5CF6]' : 'text-zinc-450 hover:bg-[#0F1020]/40 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" /> CLASSES_DISASSEMBLER
            </button>
            <button
              onClick={() => setActiveTab('network')}
              className={`px-5 py-3.5 border-r border-[#8B5CF6]/10 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'network' ? 'bg-[#0F1020] text-[#D8B4FE] border-b-2 border-b-[#8B5CF6]' : 'text-zinc-450 hover:bg-[#0F1020]/40 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" /> SOCKET_GATEWAYS
            </button>
            <button
              onClick={() => setActiveTab('explainer')}
              className={`px-5 py-3.5 border-r border-[#8B5CF6]/10 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'explainer' ? 'bg-[#0F1020] text-[#D8B4FE] border-b-2 border-b-[#8B5CF6]' : 'text-zinc-450 hover:bg-[#0F1020]/40 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> AGENTS_EXPLAINER
            </button>
            <button
              onClick={() => setActiveTab('graph')}
              className={`px-5 py-3.5 border-r border-[#8B5CF6]/10 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'graph' ? 'bg-[#0F1020] text-[#D8B4FE] border-b-2 border-b-[#8B5CF6]' : 'text-zinc-450 hover:bg-[#0F1020]/40 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> NODE_LINKAGES
            </button>
          </div>

          {/* Console screen */}
          <div className="p-6 bg-[#0E0F1D] min-h-[280px] text-left">
            {/* Tab: DEX */}
            {activeTab === 'dex' && (
              <div className="flex flex-col gap-3">
                <span className="text-[10px] text-zinc-550 uppercase font-bold tracking-wider">// Extracted Smali Dex Classes: com.spyra.security.Agent</span>
                <pre className="bg-[#06070A] border border-[#8B5CF6]/15 p-4 rounded-lg overflow-x-auto text-[11px] text-zinc-350 leading-relaxed max-h-[220px]">
                  <code>{smaliCode}</code>
                </pre>
              </div>
            )}

            {/* Tab: Network */}
            {activeTab === 'network' && (
              <div className="flex flex-col gap-3">
                <span className="text-[10px] text-zinc-550 uppercase font-bold tracking-wider">// Isolated Network Sockets and C2 Target Registries</span>
                <div className="overflow-x-auto border border-[#8B5CF6]/15 rounded-lg bg-[#06070A]/40">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="bg-[#06070A] border-b border-[#8B5CF6]/15 text-zinc-500 uppercase">
                        <th className="p-3">IP ADDRESS</th>
                        <th className="p-3">PORT</th>
                        <th className="p-3">GATEWAY DESCRIPTION</th>
                        <th className="p-3">GEO_LOCATION</th>
                        <th className="p-3">THREAT_STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850/60 text-zinc-350">
                      {networkTargets.map((row) => (
                        <tr key={row.ip} className="hover:bg-[#15172C] transition-colors">
                          <td className="p-3 font-semibold text-white">{row.ip}</td>
                          <td className="p-3">{row.port}</td>
                          <td className="p-3 text-zinc-500">{row.type}</td>
                          <td className="p-3">{row.location}</td>
                          <td className={`p-3 font-bold ${row.statusColor}`}>{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Swarm Explainer */}
            {activeTab === 'explainer' && (
              <div className="flex flex-col gap-3">
                <span className="text-[10px] text-zinc-550 uppercase font-bold tracking-wider">// Multi-Agent Natural Language Threat Verification</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
                  <div className="bg-[#06070A]/50 border border-[#8B5CF6]/15 p-4 rounded-lg flex flex-col gap-2">
                    <span className="font-mono text-[9px] text-[#8B5CF6] font-bold">// PRIVACY_AGENT</span>
                    <h5 className="font-semibold text-white uppercase text-[11px]">SMS Hijack Hook</h5>
                    <p className="text-zinc-400 leading-relaxed text-[11px]">
                      The application requests <strong>READ_SMS</strong> and <strong>RECEIVE_SMS</strong> overlay permissions without operational logic justification.
                    </p>
                  </div>
                  <div className="bg-[#06070A]/50 border border-[#8B5CF6]/15 p-4 rounded-lg flex flex-col gap-2">
                    <span className="font-mono text-[9px] text-[#EF4444] font-bold">// NETWORK_AGENT</span>
                    <h5 className="font-semibold text-white uppercase text-[11px]">C2 Socket Target</h5>
                    <p className="text-zinc-400 leading-relaxed text-[11px]">
                      Socket targets trace directly to blacklisted gateway proxy <strong>185.220.101.4</strong> (verified Tor exit node) inside Germany.
                    </p>
                  </div>
                  <div className="bg-[#06070A]/50 border border-[#8B5CF6]/15 p-4 rounded-lg flex flex-col gap-2">
                    <span className="font-mono text-[9px] text-[#14B8A6] font-bold">// MALWARE_AGENT</span>
                    <h5 className="font-semibold text-white uppercase text-[11px]">DEX Fingerprint Match</h5>
                    <p className="text-zinc-400 leading-relaxed text-[11px]">
                      Classes.dex signature matches database footprints of Android overlay Trojan families with 85% confidence score.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Node Linkages */}
            {activeTab === 'graph' && (
              <div className="flex flex-col gap-3">
                <span className="text-[10px] text-zinc-550 uppercase font-bold tracking-wider">// Node Linkage Vector Map</span>
                <div className="bg-[#06070A] border border-[#8B5CF6]/15 p-5 rounded-lg text-zinc-450 text-[10px] leading-relaxed whitespace-pre overflow-x-auto">
                  {`[TARGET BINARY] ──────(Requests Overlay)──────➔ [SYSTEM_ALERT_WINDOW]
        │
     (Spawns dex payload)
        │
        ▼
  [BACKGROUND EXECUTABLE] ──(Access API call)──➔ [sendTextMessage()]
        │
     (Establishes Socket)
        ▼
  [GATEWAY: 185.220.101.4 (TOR C2)] ──────(Action)──────➔ [CRITICAL DATA EXFILTRATED]`}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 5: INVESTIGATION DASHBOARD PREVIEW */}
      <section id="dashboard-preview" className="relative py-24 bg-[#0F1020]/30 border-t border-[#8B5CF6]/10 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Dashboard Copy */}
          <div className="lg:col-span-5 flex flex-col items-start text-left gap-5">
            <span className="font-mono text-[10px] text-[#D8B4FE] font-bold tracking-widest uppercase">// CONTROL CENTER</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white leading-none">
              INVESTIGATION <br />
              <span className="text-[#8B5CF6]">OPERATIONS CENTER</span>
            </h2>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Our dashboard console provides security operators with comprehensive tools to review active sandbox uploads, monitor risk metrics, and filter scans dynamically.
            </p>

            <div className="flex flex-col gap-4 font-mono text-[11px] text-zinc-300 w-full mt-2">
              <div className="p-4 bg-[#0F1020] border border-[#8B5CF6]/15 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#D8B4FE]">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">REAL-TIME TELEMETRY</span>
                  <span>Interactive charts plotting malware strain loads</span>
                </div>
              </div>
              <div className="p-4 bg-[#0F1020] border border-[#8B5CF6]/15 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#D8B4FE]">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">PERSISTENT SANDBOX HISTORY</span>
                  <span>Filter previous package diagnostics logs instantly</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Dashboard Mockup */}
          <div className="lg:col-span-7 w-full flex justify-center">
            <div 
              className="bg-[#0F1020]/40 border border-[#8B5CF6]/20 rounded-2xl w-full max-w-[560px] h-[330px] p-5 shadow-2xl flex flex-col gap-5 relative backdrop-blur-xl"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                transform: 'rotateX(15deg) rotateY(-10deg) translate3d(0, 0, 0)'
              }}
            >
              {/* Header */}
              <div className="border-b border-[#8B5CF6]/15 pb-3 flex items-center justify-between font-mono text-[9px] text-zinc-550">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-zinc-800" />
                  <span className="w-2 h-2 rounded-full bg-zinc-850" />
                  <span className="w-2 h-2 rounded-full bg-zinc-850" />
                </div>
                <span>spyra_operations_centre_v1.0.0</span>
              </div>
              {/* Internal Grids */}
              <div className="grid grid-cols-12 gap-4 h-full font-mono text-[10px] text-zinc-400">
                <div className="col-span-8 border border-[#8B5CF6]/10 rounded-lg p-4 flex flex-col justify-between bg-black/40">
                  <span className="text-white font-bold">ACTIVE_SANDBOX_LOAD</span>
                  <div className="h-20 border-b border-dashed border-[#8B5CF6]/15 flex items-end justify-between text-[8px] text-zinc-650">
                    <span>MON_T1</span>
                    <span>MON_T3</span>
                    <span>MON_T5</span>
                    <span className="text-[#8B5CF6] font-bold">CURRENT</span>
                  </div>
                </div>
                <div className="col-span-4 border border-[#8B5CF6]/10 rounded-lg p-4 flex flex-col justify-between bg-black/40">
                  <span className="text-white font-bold">RISK_LEVEL</span>
                  <span className="text-3xl font-bold text-[#EF4444] animate-pulse">92%</span>
                  <span className="text-[8px] text-zinc-650">CRITICAL_ALERT</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6: CALL TO ACTION */}
      <section className="relative py-24 px-6 border-t border-[#8B5CF6]/10 z-10 bg-[#06070A]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#D8B4FE] mb-2 shadow-[0_0_15px_rgba(139,92,246,0.15)] animate-pulse">
            <ShieldCheck className="w-6 h-6" />
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#F5F7FA]">
            DEPLOY SECURITY DECOMPILATION
          </h2>
          
          <p className="text-xs sm:text-sm text-zinc-450 font-sans max-w-md leading-relaxed">
            Acquire console clearance to immediately sandbox Android packages, analyze Smali namespaces, and generate explainable threat reports.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 mt-4 font-mono text-xs">
            <Button 
              onClick={() => setUploadModalOpen(true)}
              className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] text-white font-mono font-bold tracking-widest text-xs px-6 py-4 rounded border-none cursor-pointer"
            >
              START INVESTIGATION NOW
            </Button>
            <Link href="/login">
              <Button variant="outline" className="border-zinc-850 text-zinc-300 hover:text-white hover:bg-white/[0.02] font-bold tracking-widest px-8 py-4 rounded">
                OPERATOR LOGIN
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="border-t border-zinc-900/60 bg-[#06070A] py-12 px-6 z-10 relative font-mono text-[10px] text-zinc-650">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <span>&copy; {new Date().getFullYear()} SPYRA AI INC. ALL THREATS CONTROLLED.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">SECURITY_CHARTER</a>
            <a href="#" className="hover:text-white transition-colors">PRIVACY_POLICY</a>
            <a href="#" className="hover:text-white transition-colors">COMPLIANCE</a>
          </div>
        </div>
      </footer>

      {/* Full-screen Glassmorphic Sandbox Upload cleanroom Overlay Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <UploadInvestigation isModal onClose={() => setUploadModalOpen(false)} />
        )}
      </AnimatePresence>
      
    </div>
  );
}
