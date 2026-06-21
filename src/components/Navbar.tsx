'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export default function Navbar({ introActive = false }: { introActive?: boolean }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check session dynamically
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthenticated(true);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#06070A]/80 backdrop-blur-md border-b border-[#8B5CF6]/15">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-6 h-6 relative flex items-center justify-center">
            {!introActive && (
              <motion.div
                layoutId="spyra-logo"
                className="w-full h-full"
                transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1] }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    d="M65,25 C45,25 35,32 35,45 C35,60 65,55 65,70 C65,80 55,85 35,85"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_6px_rgba(139,92,246,0.5)] transition-all group-hover:stroke-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                  />
                </svg>
              </motion.div>
            )}
          </div>
          <span className="font-mono text-base font-bold tracking-widest text-[#F5F7FA] transition-colors group-hover:text-neutral-200">
            SPYRA<span className="text-[#8B5CF6] font-sans font-light">.AI</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest text-zinc-400">
          <a href="#pipeline" className="hover:text-white transition-colors">
            WORKFLOW
          </a>
          <a href="#agents" className="hover:text-white transition-colors">
            MULTI_AGENTS
          </a>
          <a href="#correlation" className="hover:text-white transition-colors">
            CORRELATION
          </a>
          <a href="#dashboard-preview" className="hover:text-white transition-colors">
            OPERATIONS
          </a>
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          {authenticated ? (
            <a href="/dashboard">
              <Button variant="primary" size="sm" className="bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]/85 font-mono text-xs tracking-wider border-none rounded font-bold">
                <Cpu className="w-3.5 h-3.5" /> CONSOLE
              </Button>
            </a>
          ) : (
            <>
              <a href="/login">
                <Button variant="outline" size="sm" className="border-zinc-800 hover:border-[#8B5CF6]/30 text-zinc-300 hover:text-white hover:bg-zinc-900/60 font-mono text-xs tracking-wider rounded">
                  SIGN IN
                </Button>
              </a>
              <a href="/register">
                <Button variant="primary" size="sm" className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] text-white font-mono text-xs tracking-wider border-none rounded font-bold">
                  START SCANNING
                </Button>
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-zinc-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#06070A]/95 border-b border-[#8B5CF6]/15 p-6 flex flex-col gap-6 font-mono text-xs tracking-widest text-zinc-400">
          <a
            href="#pipeline"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-white transition-colors"
          >
            WORKFLOW
          </a>
          <a
            href="#agents"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-white transition-colors"
          >
            MULTI_AGENTS
          </a>
          <a
            href="#correlation"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-white transition-colors"
          >
            CORRELATION
          </a>
          <a
            href="#dashboard-preview"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-white transition-colors"
          >
            OPERATIONS
          </a>
          <hr className="border-zinc-850" />
          <div className="flex flex-col gap-3">
            {authenticated ? (
              <a href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" fullWidth className="bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]/85 font-bold">
                  <Cpu className="w-3.5 h-3.5" /> CONSOLE
                </Button>
              </a>
            ) : (
              <>
                <a href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth className="border-zinc-850 text-zinc-300">
                    SIGN IN
                  </Button>
                </a>
                <a href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" fullWidth className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                    START SCANNING
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
