import React from 'react';
import { X, Users, CheckCircle2, XCircle, AlertTriangle, ArrowRight, MapPin, GraduationCap } from 'lucide-react';
import { Student } from '../types';

interface StudentSelectModalProps {
  isOpen: boolean;
  query: string;
  candidates: Student[];
  onSelectCandidate: (student: Student) => void;
  onClose: () => void;
}

export const StudentSelectModal: React.FC<StudentSelectModalProps> = ({
  isOpen,
  query,
  candidates,
  onSelectCandidate,
  onClose
}) => {
  if (!isOpen || candidates.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Multiple Students Found ({candidates.length} Matches)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Students sharing the name &quot;<span className="text-emerald-400 font-semibold">{query}</span>&quot;. Select the individual present at the checkpoint:
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Candidate List */}
        <div className="p-6 space-y-3 overflow-y-auto">
          {candidates.map((student) => {
            const isExpired =
              student.status === 'expired' ||
              new Date(student.expiryDate).getTime() < Date.now();
            const isSuspended = student.status === 'suspended';
            const isValid = !isExpired && !isSuspended && student.status === 'active';

            return (
              <div
                key={student.id}
                onClick={() => onSelectCandidate(student)}
                className="group relative cursor-pointer rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-emerald-500/60 hover:bg-slate-850 hover:shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left: Photo and details */}
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={student.photoUrl}
                    alt={student.fullName}
                    referrerPolicy="no-referrer"
                    className="h-14 w-12 rounded-lg object-cover border-2 border-slate-700 group-hover:border-emerald-400 shrink-0 transition-colors"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                        {student.fullName}
                      </h4>
                      <span className="font-mono text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {student.regNumber}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium truncate mt-0.5 flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{student.course}</span>
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 text-emerald-500/80 shrink-0" />
                        <span>{student.campus.split('-')[0].trim()}</span>
                      </span>
                      <span>·</span>
                      <span className="truncate">{student.level}</span>
                      <span>·</span>
                      <span className="font-mono">Expires: {student.expiryDate}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Status indicator and Select button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  {isValid && (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      ACTIVE
                    </span>
                  )}
                  {isExpired && (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-rose-300 bg-rose-950/80 border border-rose-800 px-2.5 py-0.5 rounded">
                      <XCircle className="h-3 w-3 text-rose-400" />
                      EXPIRED
                    </span>
                  )}
                  {isSuspended && (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded">
                      <AlertTriangle className="h-3 w-3 text-amber-400" />
                      SUSPENDED
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCandidate(student);
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 group-hover:bg-emerald-400 transition-colors shadow-sm"
                  >
                    <span>Verify ID</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-slate-950/80 px-6 py-3 flex items-center justify-between text-xs text-slate-400">
          <span>Click any candidate to verify their student status and grant or deny access.</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
