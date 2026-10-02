import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  CreditCard,
  Printer,
  RotateCw,
  Download,
  ShieldCheck,
  Building,
  Calendar,
  Phone,
  Hash,
  CheckCircle2,
  X
} from 'lucide-react';
import { Student } from '../types';

interface StudentIdCardGeneratorProps {
  student: Student;
  onClose?: () => void;
}

export const StudentIdCardGenerator: React.FC<StudentIdCardGeneratorProps> = ({
  student,
  onClose
}) => {
  const [activeSide, setActiveSide] = useState<'both' | 'front' | 'back'>('both');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Generate unique dynamic QR code with respect to student information and data
  useEffect(() => {
    const studentPayload = JSON.stringify({
      institution: 'Kampala International University',
      regNumber: student.regNumber,
      fullName: student.fullName,
      course: student.course,
      faculty: student.faculty,
      campus: student.campus,
      validUntil: student.expiryDate,
      issueDate: student.issueDate,
      status: student.status,
      nationalId: student.nationalIdOrPassport,
      securityToken: `KIU-SEC-VERIFIED-${student.regNumber}`
    });

    QRCode.toDataURL(
      student.regNumber, // Primary scan code is regNumber so gate scanners authenticate immediately
      {
        width: 256,
        margin: 1,
        color: {
          dark: '#022c22', // deep forest emerald
          light: '#ffffff'
        }
      },
      (err, url) => {
        if (!err && url) {
          setQrCodeDataUrl(url);
        }
      }
    );
  }, [student]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3.5 print:hidden">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-emerald-400" />
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              KIU Official Student Identification Badge
            </h4>
            <p className="text-[11px] text-slate-400">
              Generated with unique dynamic QR code for <span className="text-emerald-400 font-mono font-bold">{student.regNumber}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveSide('both')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activeSide === 'both' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setActiveSide('front')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activeSide === 'front' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Front Only
            </button>
            <button
              type="button"
              onClick={() => setActiveSide('back')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activeSide === 'back' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Back Only
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm"
          >
            <Printer className="h-4 w-4" />
            <span>Print Badge (CR-80)</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Cards Display Grid */}
      <div className="flex flex-wrap items-center justify-center gap-8 py-4">
        {/* ========================================================= */}
        {/* FRONT PART OF THE ID                                     */}
        {/* ========================================================= */}
        {(activeSide === 'both' || activeSide === 'front') && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 print:hidden flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Card Front (Face)</span>
            </span>

            <div className="w-[340px] sm:w-[380px] h-[225px] sm:h-[245px] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 border-2 border-emerald-600/80 p-4 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between select-none">
              {/* Background watermark seal */}
              <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-emerald-500/5 pointer-events-none border border-emerald-500/10 flex items-center justify-center">
                <span className="font-serif text-6xl font-black text-emerald-500/10">KIU</span>
              </div>

              {/* Holographic Security Stripe */}
              <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-emerald-400/10 to-transparent pointer-events-none" />

              {/* Top Banner */}
              <div className="border-b border-emerald-500/30 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {/* University Crest Symbol */}
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-slate-950 font-serif font-black text-sm border-2 border-emerald-300 shadow-md">
                    KIU
                  </div>
                  <div>
                    <h3 className="font-serif text-[11px] sm:text-xs font-black tracking-wider text-white uppercase leading-none">
                      Kampala International University
                    </h3>
                    <p className="text-[8px] font-mono tracking-widest text-emerald-300 uppercase mt-0.5">
                      Exploring the Heights · Est. 1993
                    </p>
                  </div>
                </div>

                <span className="font-mono text-[8px] font-bold text-emerald-950 bg-emerald-400 px-1.5 py-0.5 rounded uppercase">
                  STUDENT
                </span>
              </div>

              {/* Middle Section: Photo & Student Credentials */}
              <div className="flex items-center gap-3.5 py-1">
                {/* Photo with official border */}
                <div className="relative shrink-0">
                  <img
                    src={student.photoUrl}
                    alt={student.fullName}
                    className="w-18 h-22 sm:w-20 sm:h-24 rounded-lg object-cover border-2 border-emerald-400 shadow-md bg-slate-800"
                  />
                  <div className="absolute -bottom-1.5 -right-1.5 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="text-[9px] uppercase font-bold text-emerald-400 font-mono tracking-wider">
                    Registration No:
                  </div>
                  <div className="font-mono font-black text-sm sm:text-base text-white tracking-wide text-emerald-300">
                    {student.regNumber}
                  </div>

                  <div className="font-bold text-xs sm:text-sm text-white truncate pt-0.5 leading-tight">
                    {student.fullName}
                  </div>

                  <div className="text-[10px] text-slate-300 font-medium truncate leading-tight">
                    {student.course}
                  </div>

                  <div className="text-[9px] text-slate-400 truncate">
                    {student.faculty}
                  </div>

                  <div className="text-[8px] font-mono text-emerald-400/90 pt-0.5">
                    {student.campus.split('-')[0].trim()} · {student.level}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="border-t border-emerald-500/20 pt-1.5 flex items-center justify-between text-[8px] font-mono text-slate-400">
                <div className="flex items-center gap-3">
                  <span>Issued: {student.issueDate}</span>
                  <span className="text-emerald-400 font-bold">
                    Expires: {student.expiryDate}
                  </span>
                </div>

                {/* Microchip marker */}
                <div className="flex items-center gap-1 text-[8px] text-amber-300 font-bold">
                  <div className="w-3 h-2 rounded bg-amber-400/80 border border-amber-300" />
                  <span>RFID CHIP</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* BACK PART OF THE ID (WITH UNIQUE QR CODE)                 */}
        {/* ========================================================= */}
        {(activeSide === 'both' || activeSide === 'back') && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 print:hidden flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Card Back (Unique Dynamic QR Code)</span>
            </span>

            <div className="w-[340px] sm:w-[380px] h-[225px] sm:h-[245px] rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 border-2 border-emerald-600/80 p-4 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between select-none">
              {/* Magnetic Stripe on top */}
              <div className="w-full h-7 bg-slate-950 border-b border-slate-800 -mx-4 -mt-4 px-4 flex items-center justify-between">
                <div className="h-3.5 w-full bg-slate-900 rounded-sm opacity-90" />
              </div>

              {/* Middle Section: Unique QR Code + Student Security Records */}
              <div className="flex items-center justify-between gap-3 pt-2">
                {/* Left: Detailed student security credentials */}
                <div className="space-y-1 text-[9px] font-mono text-slate-300 flex-1 min-w-0">
                  <div>
                    <span className="text-slate-500 uppercase block text-[8px]">
                      National ID / Passport:
                    </span>
                    <span className="text-slate-200 font-bold">
                      {student.nationalIdOrPassport}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase block text-[8px]">
                      Emergency Security Contact:
                    </span>
                    <span className="text-slate-200 font-bold">
                      {student.emergencyContact}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase block text-[8px]">
                      Hall of Residence / Hostel:
                    </span>
                    <span className="text-slate-200 truncate block">
                      {student.hallOfResidence || 'Off-Campus Residency'}
                    </span>
                  </div>

                  <div className="pt-0.5">
                    <span className="text-emerald-400 font-bold text-[8px]">
                      Official Academic Registrar Verification
                    </span>
                  </div>
                </div>

                {/* Right: Unique QR Code generated specifically for this student */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="p-1.5 bg-white rounded-xl shadow-lg border-2 border-emerald-400">
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt={`QR Code for ${student.regNumber}`}
                        className="w-20 h-20 sm:w-22 sm:h-22 object-contain"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                        Generating QR...
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-[8px] text-emerald-400 font-bold mt-1 uppercase">
                    SCAN TO VERIFY
                  </span>
                </div>
              </div>

              {/* Terms & Return Address */}
              <div className="border-t border-slate-800 pt-1.5 text-[7px] leading-tight text-slate-400 space-y-0.5">
                <p>
                  This identification card remains the property of Kampala International University. Cardholder must produce it on demand to security personnel or university officials.
                </p>
                <div className="flex items-center justify-between text-slate-500 font-mono text-[7px] pt-0.5">
                  <span>If found, return to: Academic Registrar, Ggaba Rd, Kansanga</span>
                  <span className="text-emerald-400 font-bold">Ref: KIU/SEC/{student.regNumber}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
