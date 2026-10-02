import React, { useState } from 'react';
import { ShieldAlert, Lock, User, KeyRound, X, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { RegistrarStaff } from '../types';
import { INITIAL_REGISTRAR_STAFF } from '../data/mockData';

interface RegistrarAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (staff: RegistrarStaff) => void;
}

export const RegistrarAuthModal: React.FC<RegistrarAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('registrar.marvin');
  const [password, setPassword] = useState('kiuAdmin2026');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Check if user is trying to log in with security guard credentials
      if (username.startsWith('officer.') || username.startsWith('guard.') || username.startsWith('sgt.')) {
        setErrorMessage(
          'ACCESS FORBIDDEN: Security guards do not have authorization to register students or issue ID credentials. Only authorized Academic Registrar staff may enter.'
        );
        return;
      }

      // Find staff in authorized list
      const staff = INITIAL_REGISTRAR_STAFF.find(
        (s) => s.username.toLowerCase() === username.trim().toLowerCase()
      );

      if (staff && password === 'kiuAdmin2026') {
        const authenticated: RegistrarStaff = {
          ...staff,
          authenticatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        onLoginSuccess(authenticated);
        onClose();
      } else if (password === 'kiuAdmin2026' && username.trim().length > 2) {
        // Custom registrar admin
        const cleanName = username.replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        const customStaff: RegistrarStaff = {
          id: 'reg-custom-' + Date.now(),
          staffId: 'KIU-REG-' + Math.floor(100 + Math.random() * 900),
          fullName: cleanName,
          username: username.trim().toLowerCase(),
          role: 'Academic Registrar',
          department: 'Office of the Academic Registrar',
          authenticatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        onLoginSuccess(customStaff);
        onClose();
      } else {
        setErrorMessage('Invalid Registrar staff credentials. Password required: kiuAdmin2026');
      }
    }, 400);
  };

  const handleSelectDemoStaff = (demo: (typeof INITIAL_REGISTRAR_STAFF)[0]) => {
    setUsername(demo.username);
    setPassword('kiuAdmin2026');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Academic Registrar Authentication
              </h2>
              <p className="text-[11px] text-slate-400">
                Restricted: Student Enrollment &amp; ID Card Issuance
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notice banner */}
        <div className="bg-amber-950/40 border-b border-amber-800/40 px-6 py-2.5 flex items-center gap-2 text-[11px] text-amber-200">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
          <span>Security guard accounts cannot access this section. Registrar credentials required.</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-800/80 bg-rose-950/60 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Registrar / ID Officer Username
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. registrar.marvin or cards.nansubuga"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Administrator Security Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: kiuAdmin2026)"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* Quick Demo Accounts */}
          <div className="pt-1">
            <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
              Authorized Registrar Accounts:
            </span>
            <div className="space-y-1.5">
              {INITIAL_REGISTRAR_STAFF.map((staff) => (
                <button
                  key={staff.id}
                  type="button"
                  onClick={() => handleSelectDemoStaff(staff)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg border text-left text-xs transition-colors ${
                    username === staff.username
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-semibold block">{staff.fullName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {staff.role} · {staff.staffId}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-slate-900 px-2 py-0.5 rounded text-emerald-400 border border-slate-800">
                    Select
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              <span>
                {isLoading ? 'Verifying Authorization...' : 'Authenticate & Open ID Issuance Desk'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
