'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  FileCheck,
  TrendingUp,
  Activity,
  ArrowRight,
  UploadCloud,
  FileSearch,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardOverview() {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    highRisk: 0,
    avgScore: 0,
    safeRate: 100,
  });

  useEffect(() => {
    // Fetch user scans history list
    fetch('/api/scan/history?limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (data.scans) {
          const list = data.scans;
          setScans(list);

          // Calculate statistics
          const total = list.length;
          const highRisk = list.filter(
            (s: any) => s.riskLevel === 'High Risk' || s.riskLevel === 'Critical'
          ).length;
          
          let sumScore = 0;
          list.forEach((s: any) => (sumScore += s.threatScore));
          const avgScore = total > 0 ? Math.round(sumScore / total) : 0;

          const safeCount = list.filter(
            (s: any) => s.riskLevel === 'Safe' || s.riskLevel === 'Low Risk'
          ).length;
          const safeRate = total > 0 ? Math.round((safeCount / total) * 100) : 100;

          setStats({ total, highRisk, avgScore, safeRate });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dashboard overview:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 font-mono text-xs text-slate-500 py-12 items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-violet-400 border-t-transparent animate-spin mb-4" />
        <div>LOAD_STATS_telemetry: sync in progress...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-6">
        <div>
          <h1 className="font-mono text-xl font-bold tracking-wider text-slate-100">
            THREAT OPERATIONS CENTER
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Real-time Android security metrics and package scanning portal.
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button variant="primary" size="sm" className="shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <UploadCloud className="w-4 h-4" /> ANALYZE NEW APK
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
        <Card glow className="bg-slate-950/40">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">TOTAL SCANS</span>
              <span className="text-2xl font-bold text-slate-100 mt-1">{stats.total}</span>
            </div>
            <div className="w-10 h-10 rounded bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <FileSearch className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card glow glowColor="red" className="bg-slate-950/40">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">HIGH-RISK DETECTED</span>
              <span className={`text-2xl font-bold mt-1 ${stats.highRisk > 0 ? 'text-red-500' : 'text-slate-100'}`}>
                {stats.highRisk}
              </span>
            </div>
            <div className="w-10 h-10 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card glow className="bg-slate-950/40">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">AVG THREAT SCORE</span>
              <span className="text-2xl font-bold text-slate-100 mt-1">{stats.avgScore}%</span>
            </div>
            <div className="w-10 h-10 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card glow glowColor="green" className="bg-slate-950/40">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">SAFETY INDEX</span>
              <span className="text-2xl font-bold text-green-400 mt-1">{stats.safeRate}%</span>
            </div>
            <div className="w-10 h-10 rounded bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <FileCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphics & Active Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* custom SVG line chart */}
        <Card className="lg:col-span-8 bg-slate-950/40 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>THREAT ACTIVITY TRAFFIC</CardTitle>
            <CardDescription>Visualizing analyzed threat levels across sample histories.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-end justify-between px-6 pb-6 relative">
            
            {/* SVG line path representation */}
            <div className="absolute inset-x-6 top-10 bottom-6 border-b border-slate-900 border-dashed flex flex-col justify-between">
              <div className="border-t border-slate-900/50 w-full" />
              <div className="border-t border-slate-900/50 w-full" />
              <div className="border-t border-slate-900/50 w-full" />
            </div>

            {scans.length > 1 ? (
              <svg className="w-full h-full absolute inset-0 px-6 py-6" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <path
                  d={`M 0 150 ${scans.slice(0, 8).reverse().map((s, idx) => `L ${(500 / 7) * idx} ${150 - (s.threatScore * 1.2)}`).join(' ')} L 500 150 Z`}
                  fill="url(#chart-glow)"
                />
                {/* Line path */}
                <path
                  d={scans.slice(0, 8).reverse().map((s, idx) => `${idx === 0 ? 'M' : 'L'} ${(500 / 7) * idx} ${150 - (s.threatScore * 1.2)}`).join(' ')}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-slate-500">
                Awaiting more data logs to plot threat trends.
              </div>
            )}
            
            {/* X Axis labels */}
            <div className="w-full flex justify-between font-mono text-[9px] text-slate-500 pt-2 z-10">
              <span>SCAN_T_MIN_7</span>
              <span>SCAN_T_MIN_5</span>
              <span>SCAN_T_MIN_3</span>
              <span>SCAN_T_MIN_1</span>
              <span>CURRENT</span>
            </div>

          </CardContent>
        </Card>

        {/* Real-time agent status */}
        <Card className="lg:col-span-4 bg-slate-950/40">
          <CardHeader>
            <CardTitle>THREAT FEED NODES</CardTitle>
            <CardDescription>Live telemetry nodes and active sandboxes.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 font-mono text-[11px]">
            <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
              <span className="text-slate-400">ML_CLASSIFIER:</span>
              <span className="text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ONLINE
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
              <span className="text-slate-400">RULES_WEIGHT_SET:</span>
              <span className="text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> SYNCED
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
              <span className="text-slate-400">C2_PROXY_BLACKLIST:</span>
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> 23 BLOCKED
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">SANDBOX_CPU_LOAD:</span>
              <span className="text-violet-400">12% UTILIZED</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans Table */}
      <Card className="bg-slate-950/40">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>RECENT SCAN HISTORY</CardTitle>
            <CardDescription>The last 5 APK threat analyses completed.</CardDescription>
          </div>
          {scans.length > 5 && (
            <Link href="/dashboard/history" className="text-xs font-mono text-violet-400 flex items-center gap-1 hover:underline">
              SEE ALL <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </CardHeader>
        <CardContent className="p-0 border-t border-slate-900/60">
          {scans.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center gap-4">
              <FileSearch className="w-12 h-12 text-slate-700" />
              <div className="font-mono text-xs text-slate-500">NO SCAN LOGS LOCATED IN DATABASE</div>
              <Link href="/dashboard/upload">
                <Button variant="primary" size="sm">
                  RUN INITIAL ANALYSIS
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-wider bg-slate-950/20">
                    <th className="p-4">APK PACKAGE</th>
                    <th className="p-4 hidden md:table-cell">UPLOAD DATE</th>
                    <th className="p-4 text-center">THREAT SCORE</th>
                    <th className="p-4 text-center">RISK LEVEL</th>
                    <th className="p-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {scans.slice(0, 5).map((scan) => {
                    const isDangerous = scan.riskLevel === 'High Risk' || scan.riskLevel === 'Critical';
                    const isSafe = scan.riskLevel === 'Safe' || scan.riskLevel === 'Low Risk';

                    return (
                      <tr key={scan.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="p-4 font-semibold text-slate-200">
                          {scan.apkName}
                        </td>
                        <td className="p-4 text-slate-400 hidden md:table-cell">
                          {new Date(scan.uploadDate).toLocaleString()}
                        </td>
                        <td className="p-4 text-center font-bold text-slate-200">
                          {scan.threatScore}%
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              isDangerous
                                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                : isSafe
                                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                            }`}
                          >
                            {scan.riskLevel}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Link href={`/dashboard/reports/${scan.id}`}>
                            <Button variant="outline" size="sm">
                              VIEW REPORT <ArrowRight className="w-3 h-3" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
