'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, ShieldAlert, Cpu, CheckCircle2, Loader2, File } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ApkUploadPage() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError('');
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    // Accept APK files, allow ZIP files for sandbox tests
    if (extension !== 'apk' && extension !== 'zip') {
      setError('Invalid package format. Clear sandbox only accepts Android (.apk) packages.');
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      setError('Package size exceeds clearance parameters. Limit is 100MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleCancel = () => {
    setFile(null);
    setError('');
  };

  const runScanningSimulation = async (uploadFile: File) => {
    setScanning(true);
    setProgress(5);
    setScanStep('COMMENCING_SANDBOX_INITIALIZATION');

    const formData = new FormData();
    formData.append('file', uploadFile);

    // Start background file scan API request
    const apiPromise = fetch('/api/scan', {
      method: 'POST',
      body: formData,
    });

    // Run progressive steps UI animations
    const steps = [
      { p: 15, msg: 'DECOMPILING_ANDROID_MANIFEST_RESOURCES' },
      { p: 35, msg: 'EXTRACTING_CLASSES_DEX_STRING_BLOBS' },
      { p: 55, msg: 'COMPUTING_CRYPTOGRAPHIC_SHA_HASH' },
      { p: 75, msg: 'EVALUATING_WEIGHTED_PERMISSION_INTEGRITY' },
      { p: 90, msg: 'COMPILING_AI_EXPLAINABLE_MITIGATION_REPORT' }
    ];

    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 800));
      setProgress(step.p);
      setScanStep(step.msg);
    }

    try {
      const res = await apiPromise;
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Malware scanning analysis failed');
      }

      setProgress(100);
      setScanStep('ANALYSIS_MATRIX_COMPLETE');
      await new Promise((r) => setTimeout(r, 600));

      router.push(`/dashboard/reports/${data.scanId}`);
    } catch (err: any) {
      console.error('Scan Error:', err);
      setError(err.message || 'Scanning system malfunction.');
      setScanning(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="border-b border-slate-900 pb-6">
        <h1 className="font-mono text-xl font-bold tracking-wider text-slate-100">
          SECURE APK THREAT SANDBOX
        </h1>
        <p className="text-xs text-slate-400 font-sans mt-1">
          Perform live static decompilation and permission mapping of android binaries.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded text-xs font-mono mb-6">
            ✕ ERROR: {error}
          </div>
        )}

        {!scanning ? (
          <Card className="bg-slate-950/45 border-slate-800">
            <CardHeader>
              <CardTitle>UPLOAD MOBILE PACKAGE</CardTitle>
              <CardDescription>Drag and drop APK files to load threat models.</CardDescription>
            </CardHeader>
            <CardContent>
              {file ? (
                // File selected view
                <div className="flex flex-col items-center gap-6 p-8 border border-violet-500/20 bg-violet-950/5 rounded-lg text-center">
                  <div className="w-12 h-12 rounded bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                    <File className="w-6 h-6" />
                  </div>
                  <div className="font-mono text-xs">
                    <span className="font-bold text-slate-200 block text-sm mb-1">{file.name}</span>
                    <span className="text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      CANCEL
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => runScanningSimulation(file)}>
                      COMMENCE ANALYSIS <Cpu className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                // Dropzone area
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-12 text-center flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 ${
                    dragActive
                      ? 'border-violet-400 bg-violet-950/10 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                      : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/10'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".apk,.zip"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded bg-slate-900 flex items-center justify-center text-slate-500">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="font-mono text-xs">
                    <span className="text-violet-400 hover:underline block font-semibold mb-1">
                      SELECT LOCAL APK PACKAGE
                    </span>
                    <span className="text-slate-500">or drop package files here</span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-sans max-w-sm">
                    Only files ending with .apk or testing .zip formats are processed. Maximum bundle limit is 100MB.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          // Scanning progress view
          <Card className="bg-slate-950/45 border-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.05)]">
            <CardHeader className="text-center">
              <CardTitle className="tracking-widest">RUNNING DEEP INSPECTION ENGINE</CardTitle>
              <CardDescription>Securing sandbox bounds. Decompiling target files.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 p-8 font-mono text-xs">
              
              {/* Stepper bar */}
              <div className="relative w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Progress counter */}
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span className="text-violet-400 font-bold">{scanStep}</span>
                <span>{progress}% COMPLETE</span>
              </div>

              {/* Loading spinner */}
              <div className="flex justify-center py-6 text-violet-400">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>

              {/* Console log simulation */}
              <div className="bg-black/60 border border-slate-900 rounded p-4 h-32 overflow-y-auto text-[9px] text-slate-400 flex flex-col gap-1 select-none font-mono">
                <div>[INFO] Target: {file?.name}</div>
                <div>[INFO] File size: {((file?.size || 0) / 1024 / 1024).toFixed(2)} MB</div>
                {progress >= 15 && <div className="text-slate-300">&gt; Decompiling XML manifest resources... Done.</div>}
                {progress >= 35 && <div className="text-slate-300">&gt; Reading DEX file header definitions... Done.</div>}
                {progress >= 55 && <div className="text-slate-300">&gt; SHA256 checksum calculated. Matching signature hashes...</div>}
                {progress >= 75 && <div className="text-slate-300">&gt; Rule Engine matches completed. Dangerous permissions isolated.</div>}
                {progress >= 90 && <div className="text-slate-300">&gt; Explainer AI generating report paragraphs...</div>}
              </div>

            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
