import React, { useState } from 'react';
import { CreditCard, Scan, Sparkles, Filter, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Student } from '../types';
import { KiuBadge } from './KiuBadge';

interface CardsViewProps {
  students: Student[];
  onScanStudent: (code: string) => void;
}

export const CardsView: React.FC<CardsViewProps> = ({ students, onScanStudent }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student>(students[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-amber-400" />
          <span>KIU Official Student ID Cards & Physical Badges</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Inspect physical layout with Kampala International University crest, student credentials, RFID chip markers, holographic stamps, and barcodes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Card Selector */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1 pb-1">
            Select Student ID to Inspect:
          </span>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {students.map((student) => {
              const isSelected = selectedStudent.id === student.id;
              const isExpired =
                student.status === 'expired' ||
                new Date(student.expiryDate).getTime() < Date.now();

              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`cursor-pointer rounded-xl border p-3 transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={student.photoUrl}
                      alt={student.fullName}
                      referrerPolicy="no-referrer"
                      className="h-10 w-9 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-white block truncate">
                        {student.fullName}
                      </span>
                      <span className="font-mono text-[10px] text-amber-400 block">
                        {student.regNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate block">
                        {student.course}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                        student.status === 'active' && !isExpired
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {isExpired ? 'EXPIRED' : student.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Full Size Badge Viewport & Live Scan Trigger */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <KiuBadge student={selectedStudent} />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            <button
              type="button"
              onClick={() => onScanStudent(selectedStudent.regNumber)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 px-4 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 w-full"
            >
              <Scan className="h-4 w-4" />
              <span>Test Scan This ID at Checkpoint</span>
            </button>
          </div>

          {/* Verification Expectation Note */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 w-full max-w-md text-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Checkpoint Security Engine Expectation:
            </span>
            {selectedStudent.status === 'active' &&
            new Date(selectedStudent.expiryDate).getTime() >= Date.now() ? (
              <p className="text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Will prompt GREEN: Valid KIU student with active enrollment.</span>
              </p>
            ) : selectedStudent.status === 'suspended' ? (
              <p className="text-rose-400 font-medium flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Will prompt RED: Student has an active disciplinary suspension. Access denied.</span>
              </p>
            ) : (
              <p className="text-rose-400 font-medium flex items-center gap-1.5">
                <XCircle className="h-4 w-4 shrink-0" />
                <span>Will prompt RED: Card validity expired ({selectedStudent.expiryDate}). Access denied.</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
