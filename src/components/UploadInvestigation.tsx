'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, File, Loader2, Cpu, Terminal, ArrowRight, X } from 'lucide-react';
import { Card } from './ui/card';

interface UploadInvestigationProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function UploadInvestigation({ isModal = false, onClose }: UploadInvestigationProps) {
  const router = useRouter();
  
  // Investigation States
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanStep, setScanStep] = useState('INITIATING_SANDBOX_CLEANROOM');
  const [uploadError, setUploadError] = useState('');
  const [scanId, setScanId] = useState<string | null>(null);
  const [showResultsButton, setShowResultsButton] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close helper
  const handleClose = () => {
    if (onClose) {
      // Reset state on close
      setFile(null);
      setScanning(false);
      setProgress(0);
      setScanId(null);
      setShowResultsButton(false);
      setUploadError('');
      onClose();
    }
  };

  // Drag and drop handlers
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
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setUploadError('');
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (extension !== 'apk') {
      setUploadError('Decompiler sandbox only accepts Android (.apk) packages.');
      return;
    }
    const maxUploadSize = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE_BYTES) || 1024 * 1024 * 1024;
    if (selectedFile.size > maxUploadSize) {
      const sizeText = maxUploadSize >= 1024 * 1024 * 1024 
        ? `${(maxUploadSize / (1024 * 1024 * 1024)).toFixed(0)} GB` 
        : `${(maxUploadSize / (1024 * 1024)).toFixed(0)} MB`;
      setUploadError(`Security envelope exceeded. ${sizeText} limit.`);
      return;
    }
    setFile(selectedFile);
    triggerUploadScan(selectedFile);
  };

  const triggerUploadScan = async (uploadFile: File) => {
    setScanning(true);
    setProgress(2);
    setScanStep('INITIATING_SECURE_ENVELOPE_SLICE');

    const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB Chunks
    const uploadId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const totalChunks = Math.ceil(uploadFile.size / CHUNK_SIZE);
    let analysisData: any = null;

    try {
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, uploadFile.size);
        const chunk = uploadFile.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk, uploadFile.name);
        formData.append('fileName', uploadFile.name);
        formData.append('chunkIndex', chunkIndex.toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('uploadId', uploadId);
        formData.append('fileSize', uploadFile.size.toString());

        const percent = Math.round((chunkIndex / totalChunks) * 100);
        setScanStep(`UPLOADING_ENVELOPE_CHUNK_${chunkIndex + 1}_OF_${totalChunks}_(${percent}%)`);

        const res = await fetch('/api/scan/upload-chunk', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to upload file chunk.');
        }

        const resData = await res.json();
        
        // Progress of upload occupies 0% to 60% of progress bar
        const uploadProgress = Math.round(((chunkIndex + 1) / totalChunks) * 60);
        setProgress(uploadProgress);

        if (chunkIndex === totalChunks - 1) {
          analysisData = resData;
        }
      }

      if (!analysisData) {
        throw new Error('Analysis response not received.');
      }

      // Remaining 40% represents decompilation/static-analysis phases
      const decompileSteps = [
        { p: 70, msg: 'DECOMPILING_MANIFEST_RESOURCES' },
        { p: 80, msg: 'EXTRACTING_DEX_BYTECODE' },
        { p: 88, msg: 'MAPPING_SYSTEM_PERMISSIONS' },
        { p: 93, msg: 'COMPUTING_SIGNATURE_SHA256' },
        { p: 97, msg: 'CORRELATING_C2_HOSTS' },
        { p: 99, msg: 'COMPILED_THREAT_GRAPH' }
      ];

      for (const step of decompileSteps) {
        await new Promise((r) => setTimeout(r, 600));
        setProgress(step.p);
        setScanStep(step.msg);
      }

      setScanId(analysisData.scanId);
      setProgress(100);
      setScanStep('DECOMPILATION_COMPLETE');
      setShowResultsButton(true);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Scanning system error.');
      setScanning(false);
      setFile(null);
      setProgress(0);
    }
  };

  const mainContent = (
    <div className="w-full max-w-[500px] font-mono text-xs relative">
      {uploadError && (
        <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-red-400 p-3.5 rounded text-xs font-mono mb-4 text-left">
          ✕ ERROR: {uploadError}
        </div>
      )}

      {/* Modal Close Button */}
      {isModal && onClose && (
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 w-8 h-8 rounded-full border border-zinc-800 bg-[#06070A] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#8B5CF6]/50 transition-colors z-50 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {!scanning ? (
        <Card className="bg-[#0F1020]/80 border border-[#8B5CF6]/20 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.06)]">
          {/* Header */}
          <div className="bg-[#06070A]/90 px-4 py-3 border-b border-[#8B5CF6]/15 flex items-center justify-between font-mono text-[10px] text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-850" />
              <span className="w-2 h-2 rounded-full bg-zinc-850" />
              <span className="w-2 h-2 rounded-full bg-zinc-850" />
            </div>
            <span>spyra_sandbox_terminal://target-apk</span>
            <Terminal className="w-3.5 h-3.5 text-zinc-550" />
          </div>

          {/* Sandbox dropzone */}
          <div className="p-8">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed rounded-lg p-12 text-center flex flex-col items-center gap-6 cursor-pointer transition-all duration-300 relative ${
                dragActive
                  ? 'border-[#8B5CF6] bg-[#8B5CF6]/5 shadow-[0_0_25px_rgba(139,92,246,0.1)]'
                  : 'border-zinc-800 hover:border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/3'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".apk"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Glowing animated scanner target */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-zinc-850 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-2.5 rounded-full border border-dashed border-[#8B5CF6]/30 animate-[spin_5s_linear_infinite_reverse]" />
                <div className="absolute inset-5 rounded-full border border-zinc-900 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6 text-zinc-500" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[#F5F7FA] hover:underline block font-semibold tracking-wider">
                  DRAG APPLICATION HERE
                </span>
                <span className="text-zinc-550 text-[10px] font-sans">or click to browse local security files</span>
              </div>
              <div className="text-[10px] text-zinc-500 font-sans max-w-xs leading-relaxed flex flex-col gap-1 items-center">
                <div>Supported Files: <strong className="text-[#D8B4FE]">.apk</strong></div>
                <div>Maximum File Size: <strong className="text-[#D8B4FE]">1 GB</strong></div>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        // Cinematic Investigation Sandbox Scanner Panel
        <Card className="bg-[#0F1020]/95 border border-[#8B5CF6]/30 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.08)] relative">
          <div className="bg-[#06070A]/95 px-4 py-3 border-b border-[#8B5CF6]/20 flex items-center justify-between font-mono text-[10px] text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/30" />
            </div>
            <span>spyra_decompiler_cleanroom://scanning</span>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8B5CF6]" />
          </div>

          <div className="p-6 flex flex-col gap-6">
            {/* Header info */}
            <div className="text-center flex flex-col gap-1">
              <span className="text-white font-bold tracking-widest uppercase text-xs block">
                EXTRACTING EVIDENCE MATRIX
              </span>
              <span className="text-[9px] text-zinc-550 font-sans">Bytecode verification sandbox environment</span>
            </div>

            {/* Glowing scanning target graphic */}
            <div className="relative w-full h-40 border border-[#8B5CF6]/15 rounded bg-[#06070A]/40 flex items-center justify-center overflow-hidden">
              {/* Purple horizontal scan laser beam */}
              <div className="absolute inset-x-0 w-full h-0.5 bg-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.8)] animate-[scan_2.8s_ease-in-out_infinite]" />

              {/* Dynamic SVG Branching Tree nodes appearing staggered */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                {/* Lines mapping permissions, APIs and C2 domains */}
                {progress >= 20 && (
                  <path d="M 250 80 Q 200 40 120 40" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="180" strokeDashoffset="180" className="animate-[draw_1s_ease-out_forwards]" />
                )}
                {progress >= 40 && (
                  <path d="M 250 80 Q 200 80 110 80" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="180" strokeDashoffset="180" className="animate-[draw_1s_ease-out_forwards]" />
                )}
                {progress >= 60 && (
                  <path d="M 250 80 Q 200 120 120 120" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="180" strokeDashoffset="180" className="animate-[draw_1s_ease-out_forwards]" />
                )}
                {progress >= 80 && (
                  <path d="M 250 80 Q 300 40 380 40" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="180" strokeDashoffset="180" className="animate-[draw_1s_ease-out_forwards]" />
                )}
                {progress >= 95 && (
                  <path d="M 250 80 Q 300 120 380 120" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="180" strokeDashoffset="180" className="animate-[draw_1s_ease-out_forwards]" />
                )}
              </svg>

              {/* Central File Node */}
              <div className="absolute w-12 h-12 rounded bg-zinc-950 border border-[#8B5CF6]/30 flex items-center justify-center text-white z-10 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                <File className="w-5 h-5 text-[#8B5CF6]" />
              </div>

              {/* Floating Extracted Nodes */}
              {progress >= 20 && (
                <div className="absolute left-[8%] top-[15%] px-2 py-1 rounded bg-[#0F1020]/80 border border-[#8B5CF6]/25 text-[8px] font-bold text-[#D8B4FE] shadow-[0_0_8px_rgba(139,92,246,0.1)]">
                  READ_SMS
                </div>
              )}
              {progress >= 40 && (
                <div className="absolute left-[4%] top-[45%] px-2 py-1 rounded bg-[#0F1020]/80 border border-[#8B5CF6]/25 text-[8px] font-bold text-[#D8B4FE] shadow-[0_0_8px_rgba(139,92,246,0.1)]">
                  DexClassLoader
                </div>
              )}
              {progress >= 60 && (
                <div className="absolute left-[8%] bottom-[15%] px-2 py-1 rounded bg-[#0F1020]/80 border border-[#8B5CF6]/25 text-[8px] font-bold text-[#D8B4FE] shadow-[0_0_8px_rgba(139,92,246,0.1)]">
                  SYSTEM_ALERT
                </div>
              )}
              {progress >= 80 && (
                <div className="absolute right-[8%] top-[15%] px-2 py-1 rounded bg-[#0F1020]/80 border border-[#EF4444]/25 text-[8px] font-bold text-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.1)]">
                  c2_bridge_node
                </div>
              )}
              {progress >= 95 && (
                <div className="absolute right-[8%] bottom-[15%] px-2 py-1 rounded bg-[#0F1020]/80 border border-[#EF4444]/25 text-[8px] font-bold text-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.1)]">
                  92% DANGER
                </div>
              )}
            </div>

            {/* Stepper details */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-[10px] text-zinc-400">
                <span className="text-[#D8B4FE] font-bold uppercase">{scanStep}</span>
                <span>{progress}% COMPLETE</span>
              </div>
              <div className="w-full h-1 bg-[#06070A] rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#C084FC] shadow-[0_0_10px_rgba(139,92,246,0.8)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Console log outputs */}
            <div className="bg-[#06070A]/90 border border-[#8B5CF6]/15 rounded p-4 h-28 overflow-y-auto text-[9px] text-zinc-400 flex flex-col gap-1.5 select-none font-mono">
              <div>[SANDBOX] Investigating Target APK: {file?.name}</div>
              <div>[SANDBOX] SHA256 signature calculated.</div>
              {progress >= 20 && <div className="text-zinc-300">&gt; Decompiling target DEX classes... Done.</div>}
              {progress >= 40 && <div className="text-zinc-300">&gt; Extracted 5 suspicious API namespaces.</div>}
              {progress >= 60 && <div className="text-zinc-300">&gt; Mapped system alert overlays privilege.</div>}
              {progress >= 80 && <div className="text-red-400 font-bold">&gt; Found connected control node (IP: 185.220.101.4).</div>}
              {progress >= 95 && <div className="text-[#D8B4FE] font-bold">&gt; Explainer AI agents verified. Threat report indexed.</div>}
            </div>

            {/* Results router link button */}
            {showResultsButton && (
              <button
                onClick={() => router.push(`/dashboard/reports/${scanId}`)}
                className="w-full py-3.5 rounded bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold tracking-widest text-[10px] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2 border-none animate-[pulse-glow_1.5s_infinite] cursor-pointer"
              >
                INTERACT WITH INTELLIGENCE REPORT <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Embedded Animation CSS rules */}
      <style jsx>{`
        @keyframes scan {
          0%, 100% {
            top: 4px;
          }
          50% {
            top: 156px;
          }
        }
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 15px rgba(139, 92, 246, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
          }
        }
      `}</style>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-6 animate-[fade-in_0.4s_ease-out_forwards]">
        {mainContent}
        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  return mainContent;
}
