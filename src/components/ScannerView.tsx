import React, { useState, useRef, useEffect } from 'react';
import {
  Scan,
  Camera,
  CameraOff,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ArrowRight,
  MapPin,
  Clock,
  UserCheck
} from 'lucide-react';
import { ScanRecord, SecurityOfficer, Student } from '../types';
import { searchStudentsByName } from '../utils/storage';
import { StudentSelectModal } from './StudentSelectModal';
import { ContinuousScanner } from './ContinuousScanner';

interface ScannerViewProps {
  officer: SecurityOfficer | null;
  students: Student[];
  latestScan: ScanRecord | null;
  onScanCode: (code: string) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  officer,
  students,
  latestScan,
  onScanCode
}) => {
  const [inputCode, setInputCode] = useState('');
  const [isContinuousScannerActive, setIsContinuousScannerActive] = useState(false);
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

  // Auto-focus input for rapid barcode gun scanning or typing
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
      // Multiple students found with same first or last name
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
      // Direct barcode scan or unregistered ID
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Station context */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-1.5 font-medium">
          <MapPin className="h-3.5 w-3.5 text-emerald-400" />
          <span>{officer?.checkpoint || 'Main Gate - Ggaba Rd (Kansanga)'}</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-slate-400">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>{officer?.shift || 'Active Shift'}</span>
        </div>
      </div>

      {/* 1. Continuous Optical Camera Scanner (when activated, stays open to take multiple records) */}
      <ContinuousScanner
        isActive={isContinuousScannerActive}
        onClose={() => setIsContinuousScannerActive(false)}
        onCodeScanned={onScanCode}
      />

      {/* 2. Scan / Reg / Name Input Bar */}
      <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="barcodeInput"
              className="block text-xs font-bold uppercase tracking-wider text-emerald-400"
            >
              Scan Barcode / Enter Registration Number / Type Student Name
            </label>

            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Single or continuous verification
            </span>
          </div>

          <div className="relative">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Scan className="h-5 w-5 text-emerald-400" />
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
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 font-mono text-sm sm:text-base text-white placeholder-slate-500 shadow-inner focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
              >
                <span>Verify ID</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsContinuousScannerActive(!isContinuousScannerActive)}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3.5 text-xs sm:text-sm font-semibold transition-colors ${
                  isContinuousScannerActive
                    ? 'border-emerald-500 bg-emerald-950 text-emerald-300 font-bold'
                    : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:border-slate-600'
                }`}
                title={isContinuousScannerActive ? 'Turn Off Continuous Camera' : 'Start Continuous Camera Scanner'}
              >
                {isContinuousScannerActive ? (
                  <>
                    <CameraOff className="h-4 w-4 text-rose-400" />
                    <span>Stop Cam</span>
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 text-emerald-400" />
                    <span>Continuous Cam</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Autocomplete / Duplicate Name Candidates Dropdown */}
            {showLiveDropdown && liveMatches.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 z-30 rounded-xl border border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur-md overflow-hidden max-h-64 overflow-y-auto">
                <div className="border-b border-slate-800 bg-slate-950/80 px-4 py-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>
                      {liveMatches.length} student{liveMatches.length > 1 ? 's' : ''} matching &quot;{inputCode}&quot;
                    </span>
                  </span>
                  {liveMatches.length > 1 && (
                    <span className="text-[11px] text-slate-400">
                      Click candidate to verify
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
                          className="h-9 w-8 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white truncate">
                              {cand.fullName}
                            </span>
                            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                              {cand.regNumber}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 truncate block">
                            {cand.course} · {cand.campus.split('-')[0].trim()}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                          cand.status === 'active'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {cand.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* 3. THE VERIFICATION MESSAGE (Clear Green Granted / Red Denied) */}
      <div className="min-h-[200px]">
        {latestScan ? (
          latestScan.outcome === 'DENIED' ? (
            /* RED VERIFICATION PROMPT: ACCESS DENIED */
            <div className="rounded-2xl border-2 border-rose-600 bg-gradient-to-b from-rose-950/90 via-rose-950/70 to-slate-950 p-6 sm:p-8 text-white shadow-2xl shadow-rose-950/60 animate-in zoom-in-95 duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse">
                  <AlertOctagon className="h-10 w-10 stroke-[2.5]" />
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest bg-rose-900/90 text-rose-200 px-2.5 py-0.5 rounded border border-rose-700">
                      ACCESS DENIED
                    </span>
                    <span className="text-xs text-rose-300 font-mono">
                      {latestScan.timeFormatted}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">
                    DO NOT ACCESS CAMPUS
                  </h3>

                  <p className="text-sm sm:text-base text-rose-100 font-medium leading-relaxed pt-1">
                    {latestScan.message}
                  </p>

                  <div className="pt-2 text-xs font-mono text-rose-300/90">
                    <span>ID / Credential: </span>
                    <span className="font-bold text-white">
                      {latestScan.scannedCode}
                    </span>
                    {latestScan.student && (
                      <span className="ml-2 text-rose-200 font-sans">
                        ({latestScan.student.fullName})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* GREEN VERIFICATION PROMPT: ACCESS GRANTED */
            <div className="rounded-2xl border-2 border-emerald-500 bg-gradient-to-b from-emerald-950/90 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-2xl shadow-emerald-950/50 animate-in zoom-in-95 duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest bg-emerald-900/90 text-emerald-200 px-2.5 py-0.5 rounded border border-emerald-700">
                      ACCESS GRANTED
                    </span>
                    <span className="text-xs text-emerald-300 font-mono">
                      {latestScan.timeFormatted}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                    Verified KIU Student
                  </h3>

                  <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed">
                    Student of Kampala International University. Entry permitted.
                  </p>

                  {latestScan.student && (
                    <div className="pt-2 text-xs flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-300 font-mono">
                      <span className="text-white font-bold font-sans text-sm">
                        {latestScan.student.fullName}
                      </span>
                      <span>·</span>
                      <span className="text-emerald-400 font-bold">
                        {latestScan.student.regNumber}
                      </span>
                      <span>·</span>
                      <span className="font-sans text-slate-400 truncate">
                        {latestScan.student.course}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        ) : (
          /* IDLE WAITING STATE */
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80 text-emerald-400">
              <Scan className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-200">
                Ready for Student Verification
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Scan student ID barcode, enter registration number, or click &quot;Continuous Cam&quot; to scan IDs automatically without repeated permissions.
              </p>
            </div>
          </div>
        )}
      </div>

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
