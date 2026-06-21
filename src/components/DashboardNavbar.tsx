'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Shield,
  Cpu,
  UploadCloud,
  History,
  LogOut,
  User,
  Activity,
  Menu,
  X
} from 'lucide-react';

export default function DashboardNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState('Analyst');
  const [userEmail, setUserEmail] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUserName(data.user.name);
          setUserEmail(data.user.email);
        } else {
          router.push('/login');
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/login', { method: 'DELETE' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { name: 'OVERVIEW', href: '/dashboard', icon: Cpu },
    { name: 'ANALYZE APK', href: '/dashboard/upload', icon: UploadCloud },
    { name: 'SCAN HISTORY', href: '/dashboard/history', icon: History }
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 w-full h-16 bg-[#04060c] border-b border-zinc-900 z-30 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-slate-300 hover:text-violet-400"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
 
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-6 h-6 relative flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M65,25 C45,25 35,32 35,45 C35,60 65,55 65,70 C65,80 55,85 35,85"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_4px_rgba(139,92,246,0.6)]"
                />
              </svg>
            </div>
            <span className="font-mono text-base font-bold tracking-widest text-slate-100">
              SPYRA<span className="text-violet-400 font-sans font-light">.AI</span>
            </span>
            <span className="hidden sm:inline-block font-mono text-[9px] bg-violet-500/10 border border-violet-500/30 text-violet-400 px-2 py-0.5 rounded ml-2">
              CONSOLE v1.0.0
            </span>
          </Link>
        </div>
 
        {/* User Card */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right font-mono">
            <span className="text-xs font-semibold text-slate-200">{userName}</span>
            <span className="text-[10px] text-slate-500">{userEmail}</span>
          </div>
          <div className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center text-violet-400">
            <User className="w-4 h-4" />
          </div>
        </div>
      </header>
 
      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-64px)] w-64 bg-[#04060c] border-r border-zinc-900 z-20 transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col justify-between p-4 font-mono text-sm">
          {/* Main Links */}
          <div className="flex flex-col gap-2">
            <div className="text-[10px] text-slate-500 px-3 mb-2 tracking-widest font-bold">
              NAVIGATION
            </div>
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link key={link.name} href={link.href} onClick={() => setMobileOpen(false)}>
                  <span
                    className={`flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200 border ${
                      isActive
                        ? 'bg-violet-500/10 text-violet-400 border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.05)]'
                        : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-zinc-900/40'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{link.name}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-4 border-t border-slate-800/80 pt-4">
            <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded text-[11px] text-slate-400 flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-green-400">
                <Activity className="w-3.5 h-3.5" /> AGENT ACTIVE
              </span>
              <span>Scanning networks...</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-red-400 hover:bg-red-500/10 transition-colors text-left border border-transparent"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
