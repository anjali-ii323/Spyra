'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, History, ArrowRight, ShieldAlert, FileCheck, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ScanHistoryPage() {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskLevel, setRiskLevel] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 10 });

  useEffect(() => {
    fetchScans();
  }, [search, riskLevel, page]);

  const fetchScans = () => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      search,
      riskLevel,
      page: page.toString(),
      limit: '10',
    });

    fetch(`/api/scan/history?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.scans) {
          setScans(data.scans);
          setPagination(data.pagination);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching scans:', err);
        setLoading(false);
      });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset page on new search
  };

  const handleRiskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRiskLevel(e.target.value);
    setPage(1); // Reset page on filter change
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="border-b border-slate-900 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-mono text-xl font-bold tracking-wider text-slate-100">
            SCAN DATABASE LOGS
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Search, filter, and review historical mobile package security analyses.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 font-mono text-xs items-center">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search APK package name..."
            value={search}
            onChange={handleSearchChange}
            className="w-full bg-slate-950 border border-slate-800 rounded pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        </div>

        {/* Risk Dropdown */}
        <div className="relative w-full sm:w-48">
          <select
            value={riskLevel}
            onChange={handleRiskChange}
            className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="ALL">ALL RISK LEVELS</option>
            <option value="Safe">Safe</option>
            <option value="Low Risk">Low Risk</option>
            <option value="Medium Risk">Medium Risk</option>
            <option value="High Risk">High Risk</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Scans List Container */}
      <Card className="bg-slate-950/40">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col py-16 items-center justify-center font-mono text-xs text-slate-500">
              <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin mb-4" />
              <div>Fetching logs database records...</div>
            </div>
          ) : scans.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center gap-4">
              <History className="w-12 h-12 text-slate-800" />
              <div className="font-mono text-xs text-slate-500">NO SCAN RECORDS MATCHED YOUR QUERY</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-wider bg-slate-950/20">
                    <th className="p-4">APK PACKAGE</th>
                    <th className="p-4">MALWARE FAMILY MATCH</th>
                    <th className="p-4 hidden sm:table-cell">UPLOAD DATE</th>
                    <th className="p-4 text-center">THREAT SCORE</th>
                    <th className="p-4 text-center">RISK LEVEL</th>
                    <th className="p-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {scans.map((scan) => {
                    const isDangerous = scan.riskLevel === 'High Risk' || scan.riskLevel === 'Critical';
                    const isSafe = scan.riskLevel === 'Safe' || scan.riskLevel === 'Low Risk';
                    const intel = scan.report?.threatIntel as any;

                    return (
                      <tr key={scan.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="p-4 font-semibold text-slate-200">
                          {scan.apkName}
                        </td>
                        <td className="p-4 text-slate-300">
                          {intel ? intel.family : 'Generic.Android.Adware'}
                        </td>
                        <td className="p-4 text-slate-400 hidden sm:table-cell">
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

      {/* Pagination Toolbar */}
      {!loading && pagination.pages > 1 && (
        <div className="flex justify-between items-center font-mono text-xs text-slate-500">
          <span>
            PAGE {page} OF {pagination.pages} ({pagination.total} TOTAL RECORDS)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              PREVIOUS
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === pagination.pages}
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            >
              NEXT
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
