import React, { useState, useRef, useEffect } from 'react';
import {
  Scan,
  Camera,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  AlertTriangle,
  RotateCcw,
  Users,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  MapPin,
  Fingerprint,
  UserCheck
} from 'lucide-react';
import { CheckpointStats, ScanRecord, SecurityOfficer, Student } from '../types';
import { INITIAL_PRESET_TESTS } from '../data/mockData';
import { KiuBadge } from './KiuBadge';
import { searchStudentsByName } from '../utils/storage';
import { StudentSelectModal } from './StudentSelectModal';

interface ScannerViewProps {
  officer: SecurityOfficer | null;
  stats: CheckpointStats;
  students: Student[];
  latestScan: ScanRecord | null;
  recentScans: ScanRecord[];
  onScanCode: (code: string) => void;
  onOpenScannerModal: () => void;
  onResetStats: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  officer,
  stats,
  students,
  latestScan,
  recentScans,
  onScanCode,
  onOpenScannerModal,
  onResetStats
}) => {
  const [inputCode, setInputCode] = useState('');
  const [showLiveDropdown, setShowLiveDropdown] = useState(false);
  const [candidateModal, setCandidateModal] = useState<{
    isOpen: boolean;
    query: string;
    candidates: Student[];
  }>({
    isOpen: false,
    query: '',
    candidates: []
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-focus input for rapid physical barcode scanner gun use
  useEffect(() => {
    inputRef.current?.focus();
  }, [latestScan]);

  // Live autocomplete matches based on first/last name or reg number
  const liveMatches =
    inputCode.trim().length >= 2 ? searchStudentsByName(inputCode, students) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputCode.trim();
    if (!query) return;

    // Check if query matches students by name or reg number
    const matches = searchStudentsByName(query, students);

    if (matches.length > 1) {
      // Multiple students found with same first or last name!
      // Prompt modal so guard can select the exact student
      setCandidateModal({
        isOpen: true,
        query,
        candidates: matches
      });
      setShowLiveDropdown(false);
    } else if (matches.length === 1) {
      // Exactly one matching student
      onScanCode(matches[0].regNumber);
      setInputCode('');
      setShowLiveDropdown(false);
    } else {
      // No match in registry or raw barcode / alien ID
      onScanCode(query);
      setInputCode('');
      setShowLiveDropdown(false);
    }
  };

  const handleSelectCandidate = (student: Student) => {
    setCandidateModal({ isOpen: false, query: '', candidates: [] });
    setInputCode('');
    setShowLiveDropdown(false);
    onScanCode(student.regNumber);
  };

  const handlePresetClick = (code: string) => {
    if (code === 'Mukasa' || code === 'Brenda') {
      const matches = searchStudentsByName(code, students);
      setCandidateModal({
        isOpen: true,
        query: code,
        candidates: matches
      });
    } else {
      onScanCode(code);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Checkpoint Duty Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Fingerprint className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Checkpoint Access Terminal
              </h2>
              <span className="inline-flex items-center gap-1 rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-800/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Terminal
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="h-3 w-3 text-amber-400" />
              <span>{officer?.checkpoint || 'Main Gate - Ggaba Rd (Kansanga)'}</span>
              <span className="text-slate-600">·</span>
              <Clock className="h-3 w-3 text-slate-400" />
              <span>{officer?.shift || 'Active Shift'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetStats}
            title="Reset Shift Counters"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Shift Counters</span>
          </button>
        </div>
      </div>

      {/* 2. Stat Counter Cards (Explicitly requested by user) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Scanned */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition-all hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Recorded
            </span>
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
              {stats.totalScanned}
            </span>
            <span className="text-[11px] text-slate-400">IDs scanned</span>
          </div>
        </div>

        {/* Admitted / Granted */}
        <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4 transition-all hover:border-emerald-800/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Access Granted
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
              {stats.granted}
            </span>
            <span className="text-[11px] text-emerald-400/80">
              {stats.totalScanned > 0
                ? `${Math.round((stats.granted / stats.totalScanned) * 100)}% verified`
                : '100%'}
            </span>
          </div>
        </div>

        {/* Total Rejections (Highlighted) */}
        <div className="rounded-xl border border-rose-900/60 bg-rose-950/30 p-4 transition-all hover:border-rose-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">
              Rejected IDs
            </span>
            <ShieldAlert className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-rose-400 tabular-nums">
              {stats.denied}
            </span>
            <span className="text-[11px] text-rose-400/80">Turned away</span>
          </div>
        </div>

        {/* Rejection Causes Breakdown */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
            Rejection Breakdown
          </span>
          <div className="space-y-1 font-mono text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-[11px] text-slate-400">Expired IDs:</span>
              <span className="font-bold text-rose-400 tabular-nums">{stats.expiredCount}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-[11px] text-slate-400">Not KIU Students:</span>
              <span className="font-bold text-rose-400 tabular-nums">
                {stats.unregisteredCount}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-[11px] text-slate-400">Suspended:</span>
              <span className="font-bold text-amber-400 tabular-nums">{stats.suspendedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Barcode Scanner & Quick Input Console */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl relative">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="barcodeInput"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200"
            >
              <Scan className="h-4 w-4 text-amber-400" />
              <span>Scan Barcode / Enter Student Name or Reg No</span>
            </label>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Name Search with Candidate Selection
            </span>
          </div>

          <div className="relative">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Scan className="h-5 w-5 text-amber-400" />
                </div>
                <input
                  id="barcodeInput"
                  ref={inputRef}
                  type="text"
                  value={inputCode}
                  onFocus={() => setShowLiveDropdown(true)}
                  onChange={(e) => {
                    setInputCode(e.target.value);
                    setShowLiveDropdown(true);
                  }}
                  placeholder="Scan barcode, enter Reg No (e.g. 2024-01-08942) or student name (e.g. Mukasa, Brenda)..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 font-mono text-sm sm:text-base text-white placeholder-slate-500 shadow-inner focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
              >
                <span>Verify ID</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onOpenScannerModal}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3.5 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:border-slate-600 transition-colors"
              >
                <Camera className="h-4 w-4 text-amber-400" />
                <span className="hidden sm:inline">Auto-Cam</span>
              </button>
            </div>

            {/* Live Autocomplete / Duplicate Name Candidates Dropdown */}
            {showLiveDropdown && liveMatches.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 z-30 rounded-xl border border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur-md overflow-hidden max-h-72 overflow-y-auto">
                <div className="border-b border-slate-800 bg-slate-950/80 px-4 py-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>
                      {liveMatches.length} student{liveMatches.length > 1 ? 's' : ''} matching &quot;{inputCode}&quot;
                    </span>
                  </span>
                  {liveMatches.length > 1 && (
                    <span className="text-[11px] text-slate-400">
                      Click candidate or hit Enter to view list
                    </span>
                  )}
                </div>

                <div className="divide-y divide-slate-800/80">
                  {liveMatches.map((cand) => (
                    <div
                      key={cand.id}
                      onClick={() => handleSelectCandidate(cand)}
                      className="p-3 hover:bg-slate-800/80 cursor-pointer transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={cand.photoUrl}
                          alt={cand.fullName}
                          referrerPolicy="no-referrer"
                          className="h-10 w-9 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white truncate">
                              {cand.fullName}
                            </span>
                            <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded">
                              {cand.regNumber}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 truncate block">
                            {cand.course} · {cand.campus.split('-')[0].trim()}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                            cand.status === 'active'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {cand.status}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>

        {/* 4. Quick Testing ID Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Simulate Checkpoint Scans & Duplicate Name Lookups:</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {INITIAL_PRESET_TESTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetClick(preset.code)}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-800/50 text-left transition-all group"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 truncate">
                      {preset.label.split('(')[0]}
                    </span>
                  </div>
                  <span className="block font-mono text-[10px] text-slate-400 truncate">
                    {preset.desc}
                  </span>
                </div>

                <span
                  className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded shrink-0 ${
                    preset.expectedOutcome === 'GRANTED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                      : preset.expectedOutcome === 'LIST'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800/80'
                      : 'bg-rose-950 text-rose-300 border border-rose-800/80'
                  }`}
                >
                  {preset.expectedOutcome}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. LIVE VERIFICATION VERDICT - Prominent Green / Red Screen */}
      <div>
        {latestScan ? (
          latestScan.outcome === 'DENIED' ? (
            /* RED DENIAL ALERT (LOUD & VISIBLE ACCESS REJECTION) */
            <div className="rounded-2xl border-2 border-rose-600 bg-gradient-to-b from-rose-950/90 via-rose-950/70 to-slate-950 p-6 sm:p-8 text-white shadow-2xl shadow-rose-950/50 animate-in zoom-in-95 duration-200">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse">
                    <AlertOctagon className="h-10 w-10 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold uppercase tracking-widest bg-rose-900/90 text-rose-200 px-2.5 py-0.5 rounded border border-rose-700">
                        ACCESS DENIED
                      </span>
                      <span className="text-xs text-rose-300 font-mono">
                        Logged at {latestScan.timeFormatted}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">
                      DO NOT GRANT ENTRY TO CAMPUS
                    </h3>

                    <p className="text-sm sm:text-base text-rose-100 font-medium max-w-2xl leading-relaxed pt-1">
                      {latestScan.message}
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-auto shrink-0 bg-rose-950/80 border border-rose-800/80 rounded-xl p-4 text-xs space-y-2 font-mono">
                  <div className="text-slate-300">
                    <span className="text-rose-400 block text-[10px] uppercase font-bold">
                      Scanned Credential:
                    </span>
                    <span className="text-white text-sm font-bold">
                      {latestScan.scannedCode}
                    </span>
                  </div>
                  <div className="text-slate-300">
                    <span className="text-rose-400 block text-[10px] uppercase font-bold">
                      Checkpoint Station:
                    </span>
                    <span className="text-slate-200 truncate block">
                      {latestScan.checkpoint}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-rose-900/80 text-[11px] text-rose-300">
                    Instruction: Deny turnstile passage. Direct individual to Academic Registrar / Dean of Students office.
                  </div>
                </div>
              </div>

              {/* If student profile existed but was expired or suspended, show their badge with expired tag */}
              {latestScan.student && (
                <div className="mt-6 pt-6 border-t border-rose-900/60 flex flex-col items-center">
                  <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider mb-3">
                    Flagged Student Profile Record:
                  </span>
                  <KiuBadge student={latestScan.student} compact />
                </div>
              )}
            </div>
          ) : (
            /* GREEN ACCESS GRANTED (OFFICIAL KIU STUDENT APPROVED) */
            <div className="rounded-2xl border-2 border-emerald-500 bg-gradient-to-b from-emerald-950/90 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-2xl shadow-emerald-950/40 animate-in zoom-in-95 duration-200">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="space-y-4 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/80 border border-emerald-600 px-3 py-1 text-xs font-bold text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>ACCESS GRANTED · ENTRY PERMITTED</span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Verified KIU Student
                    </h3>
                    <p className="text-sm text-emerald-200/90 mt-1">
                      Credentials validated against university registry. Welcome to campus.
                    </p>
                  </div>

                  {latestScan.student && (
                    <div className="grid grid-cols-2 gap-3 text-left pt-2 font-mono text-xs max-w-md">
                      <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800">
                        <span className="text-[10px] uppercase text-slate-400 block font-sans">
                          Reg Number
                        </span>
                        <span className="text-amber-400 font-bold text-sm">
                          {latestScan.student.regNumber}
                        </span>
                      </div>
                      <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800">
                        <span className="text-[10px] uppercase text-slate-400 block font-sans">
                          Academic Level
                        </span>
                        <span className="text-slate-200 font-medium">
                          {latestScan.student.level}
                        </span>
                      </div>
                      <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800 col-span-2">
                        <span className="text-[10px] uppercase text-slate-400 block font-sans">
                          Course & Department
                        </span>
                        <span className="text-slate-200 font-medium">
                          {latestScan.student.course}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Badge Visualizer */}
                {latestScan.student && (
                  <div className="shrink-0 w-full lg:w-auto flex justify-center">
                    <KiuBadge student={latestScan.student} compact />
                  </div>
                )}
              </div>
            </div>
          )
        ) : (
          /* IDLE STANDBY STATE */
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80 text-amber-400">
              <Scan className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-200">
                Awaiting Next Student Credential
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Scan barcode, QR code, or type student name (e.g. &quot;Mukasa&quot; or &quot;Brenda&quot;).
                The system will automatically find matching candidates, verify campus enrollment, and confirm card validity.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 6. Recent Scans Log Stream */}
      {recentScans.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Recent Checkpoint Scans
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              Showing last {recentScans.length} events
            </span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {recentScans.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between py-2.5 text-xs hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">
                    {scan.outcome === 'GRANTED' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-200">
                        {scan.student?.regNumber || scan.scannedCode}
                      </span>
                      {scan.student && (
                        <span className="text-slate-300 truncate font-medium">
                          {scan.student.fullName}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {scan.message}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                      scan.outcome === 'GRANTED'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {scan.outcome}
                  </span>
                  <span className="block font-mono text-[10px] text-slate-400 mt-0.5">
                    {scan.timeFormatted}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disambiguation Modal for Multiple Students with Same First or Last Name */}
      <StudentSelectModal
        isOpen={candidateModal.isOpen}
        query={candidateModal.query}
        candidates={candidateModal.candidates}
        onSelectCandidate={handleSelectCandidate}
        onClose={() => setCandidateModal({ isOpen: false, query: '', candidates: [] })}
      />
    </div>
  );
};
