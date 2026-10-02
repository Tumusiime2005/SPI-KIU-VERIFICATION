import React from 'react';
import { Shield, QrCode, Cpu, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Student } from '../types';

interface KiuBadgeProps {
  student: Student;
  compact?: boolean;
}

export const KiuBadge: React.FC<KiuBadgeProps> = ({ student, compact = false }) => {
  const isExpired =
    student.status === 'expired' || new Date(student.expiryDate).getTime() < Date.now();
  const isSuspended = student.status === 'suspended';
  const isValid = !isExpired && !isSuspended && student.status === 'active';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${
        isValid
          ? 'border-amber-500/40 bg-gradient-to-b from-[#0B2545] via-[#091E36] to-[#051120]'
          : isExpired
          ? 'border-rose-700/60 bg-gradient-to-b from-[#300C12] via-[#21080C] to-[#120406]'
          : 'border-amber-700/60 bg-gradient-to-b from-[#2B1B04] via-[#1D1203] to-[#100901]'
      } text-white shadow-2xl transition-all duration-300 ${
        compact ? 'max-w-md p-4' : 'max-w-lg p-6'
      }`}
    >
      {/* Decorative Guilloche / ID watermarks */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-500/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-blue-500/10 blur-2xl" />

      {/* Top Banner: University Title */}
      <div className="relative border-b border-amber-500/30 pb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/30">
            <Shield className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-extrabold tracking-wider text-xs sm:text-sm uppercase text-amber-300">
              Kampala International University
            </h3>
            <p className="text-[10px] tracking-widest uppercase text-slate-300 font-semibold">
              Exploring the Heights · Student ID Card
            </p>
          </div>
        </div>

        {/* Smart Chip Graphic */}
        <div className="hidden sm:flex items-center gap-1 rounded bg-amber-500/20 px-2 py-1 border border-amber-500/40 text-amber-300">
          <Cpu className="h-3.5 w-3.5" />
          <span className="font-mono text-[9px] font-bold">RFID CHIP</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-5 items-center sm:items-start">
        {/* Student Photograph */}
        <div className="relative shrink-0">
          <div className="h-32 w-28 sm:h-36 sm:w-32 rounded-xl overflow-hidden border-2 border-amber-400/80 shadow-md bg-slate-800">
            <img
              src={student.photoUrl}
              alt={student.fullName}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Hologram Emblem */}
          <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-rose-300 to-emerald-400 text-slate-950 shadow-md border border-white/60">
            <Shield className="h-4 w-4 fill-slate-950 stroke-[1.5]" />
          </div>
        </div>

        {/* Student Dossier Information */}
        <div className="flex-1 space-y-2 text-center sm:text-left min-w-0 w-full">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Student Full Name
            </span>
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
              {student.fullName}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                Registration No.
              </span>
              <span className="font-mono font-bold text-amber-400 text-sm tracking-wide">
                {student.regNumber}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                Campus Location
              </span>
              <span className="font-medium text-slate-200 truncate block">
                {student.campus.split('-')[0].trim()}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase text-slate-400 font-semibold block">
              Program & Faculty
            </span>
            <p className="text-xs font-semibold text-slate-200 truncate">
              {student.course}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {student.faculty}
            </p>
          </div>

          {/* Dates & Validity */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/60 text-xs">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">Issued</span>
              <span className="font-mono text-[11px] text-slate-300">{student.issueDate}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">Expires</span>
              <span
                className={`font-mono text-[11px] font-bold ${
                  isExpired ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {student.expiryDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Barcode, QR & Status */}
      <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
        {/* Simulated Barcode */}
        <div className="flex flex-col">
          <div className="flex h-7 items-end gap-[2px] bg-white/95 px-2 py-1 rounded">
            {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 3, 1, 4, 2].map((w, idx) => (
              <div
                key={idx}
                className="bg-black"
                style={{ width: `${w}px`, height: '100%' }}
              />
            ))}
          </div>
          <span className="font-mono text-[9px] text-slate-400 text-center tracking-widest mt-0.5">
            {student.regNumber}
          </span>
        </div>

        {/* Status Callout */}
        <div className="flex items-center gap-2">
          {isValid && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-700/60 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="h-4 w-4" />
              <span>ACTIVE ENROLLMENT</span>
            </div>
          )}

          {isExpired && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-950/70 border border-rose-700/60 px-2.5 py-1 rounded-lg animate-pulse">
              <XCircle className="h-4 w-4" />
              <span>EXPIRED CARD</span>
            </div>
          )}

          {isSuspended && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/70 border border-amber-700/60 px-2.5 py-1 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
              <span>SUSPENDED</span>
            </div>
          )}

          <div className="flex h-8 w-8 items-center justify-center rounded bg-white/10 text-white">
            <QrCode className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
