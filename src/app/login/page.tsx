'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import CyberBackground from '@/components/CyberBackground';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user has a valid active session, redirect straight to dashboard
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.push('/dashboard');
        }
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Connection failure');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      {/* 3D background */}
      <CyberBackground />

      <Card glow className="w-full max-w-[420px] bg-zinc-950/70 border-violet-500/20 shadow-[0_0_40px_rgba(139,92,246,0.04)]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 relative flex items-center justify-center">
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
              <span className="font-mono text-xl font-bold tracking-widest text-slate-100">
                SPYRA<span className="text-violet-400 font-sans font-light">.AI</span>
              </span>
            </Link>
          </div>
          <CardTitle>THREAT ANALYST LOG IN</CardTitle>
          <CardDescription>
            Enter your credentials to connect to the threat sandbox.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-mono text-xs">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded text-[11px]">
                ✕ {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-slate-400 uppercase">Analyst Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@spyra.ai"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-400 uppercase">Security Token/Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded pl-10 pr-10 py-3 text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={loading} className="mt-2">
              {loading ? (
                'CONNECTING...'
              ) : (
                <>
                  LAUNCH CONSOLE <Cpu className="w-4 h-4" />
                </>
              )}
            </Button>

            <div className="text-center text-[10px] text-slate-500 mt-2 font-sans">
              Need console clearance?{' '}
              <Link href="/register" className="text-violet-400 hover:underline">
                Create an Account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
