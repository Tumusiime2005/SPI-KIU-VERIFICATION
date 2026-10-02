import React, { useState } from 'react';
import { X, Shield, Lock, User, MapPin, Clock, KeyRound, AlertCircle } from 'lucide-react';
import { CHECKPOINT_GATES, INITIAL_OFFICERS } from '../data/mockData';
import { SecurityOfficer } from '../types';

interface OfficerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOfficer: SecurityOfficer | null;
  onLoginSuccess: (officer: SecurityOfficer) => void;
}

export const OfficerAuthModal: React.FC<OfficerAuthModalProps> = ({
  isOpen,
  onClose,
  currentOfficer,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState(currentOfficer?.username || 'officer.marvin');
  const [password, setPassword] = useState('kiu2026');
  const [selectedGate, setSelectedGate] = useState(
    currentOfficer?.checkpoint || CHECKPOINT_GATES[0]
  );
  const [selectedShift, setSelectedShift] = useState(
    currentOfficer?.shift || 'Morning Shift (06:00 - 14:00)'
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your security officer username.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please provide your checkpoint access password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Check known officers or allow custom authenticated officer
      const existing = INITIAL_OFFICERS.find(
        (o) => o.username.toLowerCase() === username.trim().toLowerCase()
      );

      if (existing) {
        // Authenticated existing officer
        const updated: SecurityOfficer = {
          ...existing,
          checkpoint: selectedGate,
          shift: selectedShift,
          lastLoginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        onLoginSuccess(updated);
        onClose();
      } else {
        // Allow custom officer with badge generation
        const cleanName = username.replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        const customOfficer: SecurityOfficer = {
          id: 'off-custom-' + Date.now(),
          badgeNumber: 'KIU-SEC-' + Math.floor(100 + Math.random() * 900),
          fullName: `Officer ${cleanName}`,
          username: username.trim().toLowerCase(),
          rank: 'Gate Security Inspector',
          role: 'Security Officer',
          checkpoint: selectedGate,
          shift: selectedShift,
          lastLoginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        onLoginSuccess(customOfficer);
        onClose();
      }
    }, 350);
  };

  const handleSelectDemoOfficer = (demo: (typeof INITIAL_OFFICERS)[0]) => {
    setUsername(demo.username);
    setPassword('kiu2026');
    setSelectedGate(demo.checkpoint);
    setSelectedShift(demo.shift);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Checkpoint Guard Login
              </h2>
              <p className="text-[11px] text-slate-400">
                SPI-KIU Gate Access Terminal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-800/80 bg-rose-950/50 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Officer Username
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. officer.marvin or guard.akello"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Security PIN / Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Checkpoint Gate Assignment */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Stationary Gate / Checkpoint
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <MapPin className="h-4 w-4" />
              </div>
              <select
                value={selectedGate}
                onChange={(e) => setSelectedGate(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {CHECKPOINT_GATES.map((gate) => (
                  <option key={gate} value={gate}>
                    {gate}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Shift Duty */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Active Shift
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Clock className="h-4 w-4" />
              </div>
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="Morning Shift (06:00 - 14:00)">Morning Shift (06:00 - 14:00)</option>
                <option value="Afternoon Shift (14:00 - 22:00)">Afternoon Shift (14:00 - 22:00)</option>
                <option value="Night Shift (22:00 - 06:00)">Night Shift (22:00 - 06:00)</option>
              </select>
            </div>
          </div>

          {/* Quick Demo Accounts */}
          <div className="pt-2">
            <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
              Quick select duty officer:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {INITIAL_OFFICERS.map((off) => (
                <button
                  key={off.id}
                  type="button"
                  onClick={() => handleSelectDemoOfficer(off)}
                  className={`px-2 py-1.5 text-[11px] rounded border text-left truncate transition-colors ${
                    username === off.username
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-semibold'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                  title={`${off.fullName} (${off.badgeNumber})`}
                >
                  <span className="block truncate font-mono text-[10px] text-amber-400">
                    {off.badgeNumber}
                  </span>
                  <span className="block truncate">{off.fullName.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              <Shield className="h-4 w-4" />
              <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate & Start Shift'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
