import React from 'react';
import { X, Scan } from 'lucide-react';
import { Student } from '../types';
import { KiuBadge } from './KiuBadge';

interface BadgeModalProps {
  student: Student | null;
  onClose: () => void;
  onScanStudent: (code: string) => void;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ student, onClose, onScanStudent }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Student Identification Card
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-center py-2">
          <KiuBadge student={student} />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              onScanStudent(student.regNumber);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
          >
            <Scan className="h-4 w-4" />
            <span>Scan This ID Now</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
