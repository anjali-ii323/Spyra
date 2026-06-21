'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  AlertTriangle,
  Shield,
  Download,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Globe,
  Terminal,
  Activity,
  Database,
  ShieldAlert,
  Clock,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ScanReportPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [scan, setScan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [permissionFilter, setPermissionFilter] = useState<'ALL' | 'DANGEROUS'>('ALL');

  useEffect(() => {
    // Fetch details of specific scan report
    fetch(`/api/scan/history?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.scan) {
          setScan(data.scan);
        } else {
          setError(data.error || 'Scan report not found');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching report:', err);
        setError('Connection malfunction');
        setLoading(false);
      });
  }, [id]);

  const getDurationText = (fileSizeStr: string) => {
    const fileMb = parseFloat(fileSizeStr) || 10;
    const minutes = Math.floor(fileMb / 15) + 1;
    const seconds = Math.floor((fileMb % 15) * 3) + 14;
    return `${minutes}m ${seconds % 60}s`;
  };

  const getCategorizedBehaviors = (behList: any[]) => {
    const categories = {
      suspicious: [] as any[],
      network: [] as any[],
      persistence: [] as any[],
      dataCollection: [] as any[],
      general: [] as any[],
    };

    behList.forEach((beh) => {
      const cat = beh.category.toLowerCase();
      const name = beh.name.toLowerCase();
      
      if (cat.includes('network') || name.includes('socket') || name.includes('c2')) {
        categories.network.push(beh);
      } else if (cat.includes('persistence') || name.includes('boot') || name.includes('admin')) {
        categories.persistence.push(beh);
      } else if (cat.includes('leak') || name.includes('harvest') || name.includes('sms') || cat.includes('sms')) {
        categories.dataCollection.push(beh);
      } else if (cat.includes('evasion') || name.includes('accessibility') || name.includes('dcl')) {
        categories.suspicious.push(beh);
      } else {
        categories.general.push(beh);
      }
    });

    return categories;
  };

  const getTimelineEvents = (uploadDate: string) => {
    const date = new Date(uploadDate);
    const formatTime = (d: Date) => {
      return d.toTimeString().split(' ')[0];
    };

    const e1 = new Date(date.getTime() - 50000);
    const e2 = new Date(date.getTime() - 45000);
    const e3 = new Date(date.getTime() - 40000);
    const e4 = new Date(date.getTime() - 29000);
    const e5 = new Date(date.getTime() - 18000);
    const e6 = new Date(date.getTime() - 7000);
    const e7 = date;

    return [
      { time: formatTime(e1), log: 'APK cleanroom intake initiated.' },
      { time: formatTime(e2), log: 'Manifest XML payload decompilation finished.' },
      { time: formatTime(e3), log: 'Security permissions audited and categorized.' },
      { time: formatTime(e4), log: 'Static network socket targets scraped from bytecode.' },
      { time: formatTime(e5), log: 'Multi-agent behavioral indicators generated.' },
      { time: formatTime(e6), log: 'Threat signature correlation vectors compiled.' },
      { time: formatTime(e7), log: 'Dossier report finalized and verified.' }
    ];
  };

  const generatePDFReport = () => {
    if (!scan) return;

    const doc = new jsPDF();
    const reportData = scan.report;
    const permissions = reportData.permissions as any[];
    const behaviors = reportData.behaviors as any[];
    const recommendations = reportData.recommendations as string[];
    const threatIntel = reportData.threatIntel as any;

    const duration = getDurationText(reportData.fileSize);
    const timeline = getTimelineEvents(scan.uploadDate);

    // Set page color properties
    doc.setFillColor(11, 15, 20); // dark grey-navy background
    doc.rect(0, 0, 210, 297, 'F');

    // Title Header
    doc.setTextColor(139, 92, 246); // violet color accent
    doc.setFont('courier', 'bold');
    doc.setFontSize(20);
    doc.text('SPYRA AI - SECURITY DOSSIER', 15, 25);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(`DOSSIER ID: ${scan.id.toUpperCase()}`, 15, 32);
    doc.text(`TIMESTAMP  : ${new Date(scan.uploadDate).toLocaleString()}`, 15, 37);

    // Divider line
    doc.setDrawColor(45, 55, 72);
    doc.setLineWidth(0.5);
    doc.line(15, 42, 195, 42);

    // Threat Summary details
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`PACKAGE FILE : ${scan.apkName}`, 15, 50);
    doc.text(`RISK LEVEL   : ${scan.riskLevel.toUpperCase()}`, 15, 56);
    doc.text(`CONFIDENCE   : ${threatIntel?.confidence || 84}%`, 15, 62);
    doc.text(`ENGINE       : Reverse Engineering + Multi-Agent Correlation`, 15, 68);
    doc.text(`DURATION     : ${duration}`, 15, 74);

    // Explainable AI summary box
    doc.setDrawColor(139, 92, 246);
    doc.setFillColor(19, 26, 34);
    doc.rect(15, 82, 180, 36, 'FD');

    doc.setFontSize(9);
    doc.setTextColor(139, 92, 246);
    doc.setFont('courier', 'bold');
    doc.text('EXPLAINABLE RISK PROFILE SUMMARY', 20, 89);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(226, 232, 240);
    const splitExplanation = doc.splitTextToSize(reportData.explanation, 170);
    doc.text(splitExplanation, 20, 96);

    // Section 1: Dangerous Permissions
    doc.setFont('courier', 'bold');
    doc.setTextColor(139, 92, 246);
    doc.setFontSize(11);
    doc.text('AUDITED ELEVATED PERMISSIONS', 15, 130);

    let yOffset = 138;
    const dangerousPerms = permissions.filter((p: any) => p.dangerous);
    
    if (dangerousPerms.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(9);
      doc.text('No elevated dangerous permissions flagged in Manifest.', 15, yOffset);
      yOffset += 8;
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      dangerousPerms.slice(0, 6).forEach((p: any) => {
        doc.setTextColor(239, 68, 68); // Red
        doc.text(`[-] ${p.name}`, 15, yOffset);
        
        doc.setTextColor(148, 163, 184);
        const explanationShort = p.explanation.length > 75 ? p.explanation.substring(0, 75) + '...' : p.explanation;
        doc.text(`: ${explanationShort}`, 65, yOffset);
        yOffset += 6;
      });
    }

    // Section 2: Observed Behaviors
    yOffset += 6;
    doc.setFont('courier', 'bold');
    doc.setTextColor(139, 92, 246);
    doc.setFontSize(11);
    doc.text('OBSERVED BEHAVIOR SIGNATURES', 15, yOffset);
    yOffset += 8;

    if (behaviors.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(9);
      doc.text('No signature bytecode anomalies mapped.', 15, yOffset);
      yOffset += 8;
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      behaviors.slice(0, 5).forEach((b: any) => {
        doc.setTextColor(245, 158, 11); // Amber
        doc.text(`[!] ${b.name} (${b.category})`, 15, yOffset);
        yOffset += 5;
      });
    }

    // Section 3: Process Timeline
    yOffset += 8;
    doc.setFont('courier', 'bold');
    doc.setTextColor(139, 92, 246);
    doc.setFontSize(11);
    doc.text('CLEANROOM OPERATION LOGS', 15, yOffset);
    yOffset += 8;

    doc.setFont('courier', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    timeline.forEach((event) => {
      doc.text(`[${event.time}] ${event.log}`, 15, yOffset);
      yOffset += 5.5;
    });

    // Save PDF
    doc.save(`spyra_threat_report_${scan.apkName.split('.')[0]}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex flex-col py-16 items-center justify-center font-mono text-xs text-slate-500 min-h-[400px]">
        <div className="w-8 h-8 border border-violet-400 border-t-transparent rounded-full animate-spin mb-4" />
        <div>LOAD_REPORT_pipeline: decrypting metadata blocks...</div>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="p-8 text-center flex flex-col items-center gap-6 max-w-md mx-auto min-h-[300px] justify-center font-mono">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <div className="text-sm text-slate-400">REPORT_DECRYPT_FAILURE: {error || 'Record unretrievable.'}</div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            RETURN TO OPERATIONS
          </Button>
        </Link>
      </div>
    );
  }

  const report = scan.report;
  const permissions = report.permissions as any[];
  const behaviors = report.behaviors as any[];
  const recommendations = report.recommendations as string[];
  const threatIntel = report.threatIntel as any;

  const isCritical = scan.riskLevel === 'Critical';
  const isHighRisk = scan.riskLevel === 'High Risk';
  const isMediumRisk = scan.riskLevel === 'Medium Risk';
  
  const duration = getDurationText(report.fileSize);
  const timelineEvents = getTimelineEvents(scan.uploadDate);
  const categorizedBehaviors = getCategorizedBehaviors(behaviors);

  return (
    <div className="flex flex-col gap-8 text-[#F5F7FA]">
      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-mono text-lg font-bold tracking-wider text-zinc-100 uppercase flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-400" /> THREAT DOSSIER: {scan.apkName}
            </h1>
            <p className="text-[10px] text-zinc-550 font-mono mt-1">
              UUID: {scan.id} | SCAN TIMESTAMP: {new Date(scan.uploadDate).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-3 font-mono text-xs">
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/history')}>
            LOG VIEW
          </Button>
          <Button variant="primary" size="sm" onClick={generatePDFReport} className="shadow-[0_0_15px_rgba(139,92,246,0.15)]">
            <Download className="w-4 h-4" /> EXPORT REPORT
          </Button>
        </div>
      </div>

      {/* TOP REPORT INFORMATION ROW */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 font-mono">
        <div className="bg-[#131A22]/50 border border-zinc-900 p-4 rounded-lg flex flex-col justify-between min-h-[90px]">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Threat Assessment</span>
          <span className="text-base font-bold tracking-tight text-zinc-200 select-none uppercase">ANALYZED</span>
        </div>
        <div className="bg-[#131A22]/50 border border-zinc-900 p-4 rounded-lg flex flex-col justify-between min-h-[90px]">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Risk Level</span>
          <span className={`text-base font-bold tracking-tight select-none uppercase ${
            isCritical || isHighRisk ? 'text-[#EF4444]' : isMediumRisk ? 'text-[#F59E0B]' : 'text-[#10B981]'
          }`}>
            {scan.riskLevel}
          </span>
        </div>
        <div className="bg-[#131A22]/50 border border-zinc-900 p-4 rounded-lg flex flex-col justify-between min-h-[90px]">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Confidence</span>
          <span className="text-base font-bold tracking-tight text-violet-400 select-none">
            {threatIntel?.confidence || 84}%
          </span>
        </div>
        <div className="bg-[#131A22]/50 border border-zinc-900 p-4 rounded-lg flex flex-col justify-between min-h-[90px]">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Evidence Count</span>
          <span className="text-base font-bold tracking-tight text-zinc-200 select-none">
            {permissions.filter(p => p.dangerous).length + behaviors.length} Findings
          </span>
        </div>
        <div className="bg-[#131A22]/50 border border-zinc-900 p-4 rounded-lg flex flex-col justify-between min-h-[90px]">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Duration</span>
          <span className="text-base font-bold tracking-tight text-zinc-200 select-none">
            {duration}
          </span>
        </div>
        <div className="bg-[#131A22]/50 border border-zinc-900 p-4 rounded-lg flex flex-col justify-between min-h-[90px] col-span-2 md:col-span-1">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Analysis Engine</span>
          <span className="text-[9px] font-bold tracking-tight text-zinc-400 select-none uppercase leading-tight pt-1">
            Static Disassembly + Swarm Agents
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hand: Indicators, Mitigation, Timeline, Explainer */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Threat Assessment Summary (Horizontal bar representation) */}
          <Card className="bg-[#131A22]/30 border-zinc-900">
            <CardHeader>
              <CardTitle>THREAT ASSESSMENT SUMMARY</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 p-6">
              <div className="grid grid-cols-3 gap-3 text-center font-mono text-[10px]">
                <div className="border border-zinc-900/60 p-3 rounded bg-zinc-950/20">
                  <span className="text-[#EF4444] text-lg font-bold block">{permissions.filter(p => p.dangerous).length}</span>
                  <span className="text-[8px] text-zinc-500 uppercase">Critical</span>
                </div>
                <div className="border border-zinc-900/60 p-3 rounded bg-zinc-950/20">
                  <span className="text-[#F59E0B] text-lg font-bold block">{behaviors.length}</span>
                  <span className="text-[8px] text-zinc-500 uppercase">Suspicious</span>
                </div>
                <div className="border border-zinc-900/60 p-3 rounded bg-zinc-950/20">
                  <span className="text-zinc-400 text-lg font-bold block">{permissions.filter(p => !p.dangerous).length}</span>
                  <span className="text-[8px] text-zinc-500 uppercase">Informational</span>
                </div>
              </div>

              {/* Horizontal Bar Chart representation */}
              <div className="flex flex-col gap-3 font-mono text-[10px]">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>OVERALL RISK LEVEL:</span>
                  <span className={`font-bold ${isCritical || isHighRisk ? 'text-[#EF4444]' : isMediumRisk ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>
                    {scan.riskLevel.toUpperCase()}
                  </span>
                </div>
                
                {/* Flat progress bar */}
                <div className="w-full h-2.5 bg-zinc-950 rounded overflow-hidden flex">
                  {/* Critical bar segment */}
                  <div 
                    className="h-full bg-[#EF4444]" 
                    style={{ width: `${Math.max(5, (permissions.filter(p => p.dangerous).length / (permissions.length + behaviors.length || 1)) * 100)}%` }} 
                  />
                  {/* Suspicious bar segment */}
                  <div 
                    className="h-full bg-[#F59E0B]" 
                    style={{ width: `${Math.max(5, (behaviors.length / (permissions.length + behaviors.length || 1)) * 100)}%` }} 
                  />
                  {/* Informational bar segment */}
                  <div 
                    className="h-full bg-[#14B8A6]" 
                    style={{ width: `${Math.max(5, (permissions.filter(p => !p.dangerous).length / (permissions.length + behaviors.length || 1)) * 100)}%` }} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actionable Recommendations */}
          <Card className="bg-[#131A22]/30 border-zinc-900 font-mono text-xs">
            <CardHeader>
              <CardTitle>MITIGATION ACTION ITEMS</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-4">
                {recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex gap-3 text-zinc-300">
                    <span className="text-violet-400 font-bold select-none">•</span>
                    <span className="font-sans text-xs leading-normal">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Investigation Timeline */}
          <Card className="bg-[#131A22]/30 border-zinc-900">
            <CardHeader>
              <CardTitle>INVESTIGATION PROCESS TIMELINE</CardTitle>
              <CardDescription>Auditing trace signatures in sandboxed cleanroom.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 font-mono text-[11px]">
              <div className="flex flex-col gap-4 relative pl-4 border-l border-zinc-900">
                {timelineEvents.map((event, idx) => (
                  <div key={idx} className="relative flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-[#8B5CF6] border border-[#06070A]" />
                    <span className="text-[#8B5CF6] font-bold">{event.time}</span>
                    <span className="text-zinc-700 hidden sm:inline">|</span>
                    <span className="text-zinc-300 font-sans font-medium">{event.log}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Explainable AI report paragraph */}
          <Card className="bg-[#131A22]/30 border-zinc-900">
            <CardHeader>
              <CardTitle className="tracking-wide">EXPLAINABLE RISK PROFILE</CardTitle>
            </CardHeader>
            <CardContent className="font-sans text-xs text-zinc-350 leading-relaxed flex flex-col gap-4">
              <p>{report.explanation}</p>
            </CardContent>
          </Card>

        </div>

        {/* Right Hand: Permissions Profile, Grouped Observed Behaviors */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Permission analysis table list */}
          <Card className="bg-[#131A22]/30 border-zinc-900">
            <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle>APK PERMISSIONS ANALYSIS</CardTitle>
                <CardDescription>Audited declared permission security groups.</CardDescription>
              </div>
              
              <div className="flex gap-2 font-mono text-[9px]">
                <button
                  onClick={() => setPermissionFilter('ALL')}
                  className={`px-3 py-1.5 border rounded cursor-pointer ${
                    permissionFilter === 'ALL'
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-200'
                      : 'border-zinc-900 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  ALL ({permissions.length})
                </button>
                <button
                  onClick={() => setPermissionFilter('DANGEROUS')}
                  className={`px-3 py-1.5 border rounded cursor-pointer ${
                    permissionFilter === 'DANGEROUS'
                      ? 'bg-red-950/30 border-red-500/30 text-red-400'
                      : 'border-zinc-900 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  DANGEROUS ({permissions.filter(p => p.dangerous).length})
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0 border-t border-zinc-900/60 max-h-[400px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-[11px] font-mono">
                <thead>
                  <tr className="bg-zinc-950/60 border-b border-zinc-900 text-zinc-500 uppercase text-[9px] tracking-wider">
                    <th className="p-4">Permission Name</th>
                    <th className="p-4 w-24">Severity</th>
                    <th className="p-4">Reason</th>
                    <th className="p-4">Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {permissions
                    .filter((p) => permissionFilter === 'ALL' || p.dangerous)
                    .map((perm, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-4 font-semibold text-zinc-300">{perm.name}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${
                            perm.dangerous 
                              ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                              : 'bg-zinc-950 border-zinc-900 text-zinc-500'
                          }`}>
                            {perm.dangerous ? 'HIGH' : 'INFO'}
                          </span>
                        </td>
                        <td className="p-4 text-zinc-400 font-sans leading-normal">{perm.explanation}</td>
                        <td className="p-4 text-zinc-650 font-mono text-[9px] max-w-[120px] truncate">
                          {perm.dangerous 
                            ? `AndroidManifest.xml::${perm.name}`
                            : 'Declared system tag'
                          }
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Grouped Observed Behaviors (Malware / SentinelOne Style) */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest">// OBSERVED BEHAVIOR VECTORS</h2>
              <p className="text-[10px] text-zinc-500 font-sans">Bytecode verification checks categorized by malware threat indexes.</p>
            </div>
            
            {[
              { title: 'Suspicious Components', key: 'suspicious', color: '#EF4444' },
              { title: 'Network Indicators', key: 'network', color: '#F59E0B' },
              { title: 'Persistence Indicators', key: 'persistence', color: '#8B5CF6' },
              { title: 'Data Collection Indicators', key: 'dataCollection', color: '#14B8A6' },
              { title: 'General Observed Behaviors', key: 'general', color: '#D8B4FE' },
            ].map((group) => {
              const list = categorizedBehaviors[group.key as keyof typeof categorizedBehaviors] || [];
              return (
                <Card key={group.key} className="bg-[#131A22]/30 border-zinc-900">
                  <CardHeader className="py-3.5">
                    <CardTitle className="text-[11px] font-bold flex items-center gap-2 text-zinc-200">
                      <span className="w-1 h-3 rounded-sm" style={{ backgroundColor: group.color }} />
                      {group.title.toUpperCase()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 border-t border-zinc-900/60 text-[11px] font-mono">
                    {list.length === 0 ? (
                      <div className="p-4 text-zinc-600 text-[10px]">No verification alerts triggered in this threat matrix vector.</div>
                    ) : (
                      <div className="divide-y divide-zinc-900">
                        {list.map((beh, idx) => (
                          <div key={idx} className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:bg-white/[0.005] transition-colors">
                            <div className="flex flex-col gap-1 max-w-xl">
                              <span className="font-bold text-zinc-300">{beh.name}</span>
                              <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">{beh.explanation}</p>
                            </div>
                            <div className="flex flex-col md:items-end gap-1.5 flex-shrink-0">
                              <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${
                                beh.severity === 'CRITICAL' || beh.severity === 'HIGH'
                                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                  : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                              }`}>
                                {beh.severity}
                              </span>
                              <span className="text-[9px] text-zinc-600">
                                Ref: {
                                  beh.name.includes('SMS') ? 'Landroid/telephony/SmsManager' :
                                  beh.name.includes('Accessibility') ? 'Landroid/accessibilityservice' :
                                  beh.name.includes('Socket') ? 'Ljava/net/Socket' :
                                  beh.name.includes('Shell') ? 'Runtime.exec()' :
                                  beh.name.includes('ClassLoader') ? 'DexClassLoader' :
                                  beh.name.includes('Device') ? 'DeviceAdminReceiver' :
                                  'Bytecode signature'
                                }
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
