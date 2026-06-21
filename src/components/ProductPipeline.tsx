'use client';

import React, { useState } from 'react';
import { ArrowRight, Bot, Cpu, Search, Activity, Network, Shield, Eye } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface PipelineStep {
  num: string;
  title: string;
  desc: string;
  icon: any;
  highlight?: boolean;
}

export default function ProductPipeline() {
  const [activeStep, setActiveStep] = useState<string>('agent');

  const steps: PipelineStep[] = [
    { num: '01', title: 'APK Upload', desc: 'Secure CLEANROOM isolated transmission sandbox.', icon: Shield },
    { num: '02', title: 'Evidence Extraction', desc: 'Compiles DEX classes and manifest properties.', icon: Search },
    { num: '03', title: 'Behavior Intelligence', desc: 'Profiles socket connections and alerts.', icon: Activity },
    {
      num: '04',
      title: 'Multi-Agent Investigation',
      desc: 'Collaborative AI agent swarms auditing bytecode namespace obfuscations.',
      icon: Bot,
      highlight: true,
    },
    { num: '05', title: 'Threat Correlation', desc: 'Matches checksum hashes against signatures database.', icon: Network },
    { num: '06', title: 'Risk Intelligence', desc: 'Executes weighted permissions risk metrics.', icon: Cpu },
    { num: '07', title: 'Explainable AI Report', desc: 'Generates detailed security mitigation steps.', icon: Eye },
  ];

  const agents = [
    {
      name: 'DECOMPILER_BOT',
      role: 'DEX Bytecode Auditor',
      status: 'ACTIVE // RUNNING',
      logs: [
        'Inspecting package sub-structures...',
        'Detected obfuscated namespace class: a.b.c.d',
        'Extracting raw byte arrays from DEX payload...',
        'Matched signature database: TROJAN_LOADER',
      ],
    },
    {
      name: 'NETWORK_BOT',
      role: 'C2 Telecom Watcher',
      status: 'ACTIVE // MONITORING',
      logs: [
        'Checking manifest broadcast receivers...',
        'Found host bridge: 185.220.101.4',
        'Flagged: Domain exists on C2 Tor threat node list',
        'Socket socket.connect() called on port 443',
      ],
    },
    {
      name: 'SECURITY_EXPLAINER_BOT',
      role: 'Risk Compiler',
      status: 'ACTIVE // COMPILING',
      logs: [
        'Scoring privilege request profiles...',
        'Warning: Accessibility binding triggers hijack alerts',
        'Generating readable mitigation documentation...',
        'Consensus reached: High alert index calculated',
      ],
    },
  ];

  return (
    <div className="w-full bg-[#030307] border border-zinc-900 rounded-2xl p-6 shadow-[0_0_50px_rgba(139,92,246,0.02)] font-mono text-xs">
      {/* Section Header */}
      <div className="border-b border-zinc-900 pb-4 mb-8 text-left">
        <h3 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
          <Activity className="w-4 h-4 text-violet-400" /> PRODUCT_INTELLIGENCE_PIPELINE // PIPELINE_FLOW
        </h3>
      </div>

      {/* Grid: Left Column (Steps list), Right Column (Multi-Agent Info Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: Interactive Timeline Steps */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isAgentStep = step.num === '04';
            
            return (
              <div
                key={step.num}
                onClick={() => isAgentStep && setActiveStep('agent')}
                className={`p-4 rounded-xl border transition-all duration-300 flex items-start gap-4 ${
                  isAgentStep
                    ? 'border-violet-500/40 bg-violet-950/10 shadow-[0_0_20px_rgba(139,92,246,0.08)] cursor-pointer hover:border-violet-400'
                    : 'border-zinc-900 bg-[#060609] hover:border-zinc-800'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-zinc-650 font-bold mb-1">{step.num}</span>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                    isAgentStep ? 'border-violet-400 text-violet-400' : 'border-zinc-800 text-zinc-500'
                  }`}>
                    <StepIcon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex-1 text-left">
                  <h4 className={`text-xs font-bold tracking-wider mb-1 flex items-center gap-2 ${
                    isAgentStep ? 'text-violet-400' : 'text-slate-200'
                  }`}>
                    {step.title}
                    {isAgentStep && (
                      <span className="text-[8px] bg-violet-500/10 border border-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded tracking-widest animate-pulse">
                        CORE_INNOVATION
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-zinc-550 leading-relaxed font-sans">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Multi-Agent swarms Inspector Drawer */}
        <div className="lg:col-span-5 flex flex-col">
          <Card className="bg-[#050508]/80 border-zinc-900 flex-1 p-6 flex flex-col gap-6">
            
            {/* Header info */}
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2 text-white">
                <Bot className="w-4 h-4 text-violet-450" />
                <span className="text-xs font-bold tracking-widest">AGENT_VERDICT_ENGINE</span>
              </div>
              <span className="text-[8px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded uppercase">
                3_Swarms_Active
              </span>
            </div>

            {/* Swarm bots details */}
            <div className="flex flex-col gap-4 flex-1">
              {agents.map((agent, aIdx) => (
                <div key={aIdx} className="p-3 bg-zinc-950/60 border border-zinc-900 rounded-lg flex flex-col gap-2">
                  
                  {/* Agent Header */}
                  <div className="flex justify-between items-center text-[10px]">
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-white tracking-wider">{agent.name}</span>
                      <span className="text-[8px] text-zinc-500">{agent.role}</span>
                    </div>
                    <span className="text-[7.5px] font-bold text-green-400 tracking-wide animate-pulse">
                      ● {agent.status}
                    </span>
                  </div>

                  {/* Terminal log snippet */}
                  <div className="bg-black/80 border border-zinc-900/60 p-2 rounded h-20 overflow-y-auto text-[8px] text-zinc-400 font-mono flex flex-col gap-1 select-none text-left">
                    {agent.logs.map((log, lIdx) => (
                      <div key={lIdx} className="leading-tight">
                        <span className="text-violet-500/50 mr-1">&gt;</span>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom active telemetry status */}
            <div className="border-t border-zinc-900 pt-4 flex justify-between items-center text-[8px] text-zinc-650 uppercase">
              <span>AGENTS_CONSENSUS: SECURE</span>
              <span>v1.2.0_swarms</span>
            </div>

          </Card>
        </div>

      </div>
    </div>
  );
}
