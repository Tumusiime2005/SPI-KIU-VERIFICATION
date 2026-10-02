import React from 'react';
import { Shield, Volume2, VolumeX, LogIn, LogOut, ShieldCheck, MapPin } from 'lucide-react';
import { SecurityOfficer } from '../types';

interface NavbarProps {
  activeTab: 'scanner' | 'logs' | 'registry' | 'cards';
  setActiveTab: (tab: 'scanner' | 'logs' | 'registry' | 'cards') => void;
  officer: SecurityOfficer | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  deniedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  officer,
  onOpenLogin,
  onLogout,
  isMuted,
  onToggleMute,
  deniedCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-slate-950 shadow-md shadow-emerald-500/20">
            <Shield className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold tracking-wider text-emerald-400">
                SPITE
              </span>
              <span className="hidden text-xs font-semibold uppercase tracking-widest text-slate-400 sm:inline">
                Security Portal
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              Security Protocol for Identification, Tracking &amp; Enrollment
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-lg bg-slate-900/80 p-1 border border-slate-800/80">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'scanner'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Checkpoint
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'logs'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>Logs & Details</span>
            {deniedCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-rose-900/80 text-rose-200 border border-rose-700/60 rounded">
                {deniedCount} denied
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('registry')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'registry'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>Registrar &amp; ID Issuance</span>
          </button>

          <button
            onClick={() => setActiveTab('cards')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'cards'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Sample Badges
          </button>
        </nav>

        {/* Zone 3: Officer Action & Audio Control */}
        <div className="flex items-center gap-2.5">
          {/* Mute button */}
          <button
            type="button"
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Security Chimes' : 'Mute Security Chimes'}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
          </button>

          {/* Active Officer Status */}
          {officer ? (
            <div className="flex items-center gap-2 pl-1">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200 flex items-center justify-end gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  {officer.fullName}
                </span>
                <span className="text-[10px] font-mono text-slate-400 flex items-center justify-end gap-1">
                  <MapPin className="h-3 w-3 text-emerald-400" />
                  {officer.checkpoint.split('(')[0].trim()}
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-emerald-500/50 hover:bg-slate-800 transition-colors"
              >
                <span className="font-mono text-emerald-400 font-bold text-[11px]">
                  {officer.badgeNumber}
                </span>
                <span className="hidden sm:inline text-slate-400">| Switch</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                title="End Checkpoint Shift"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:border-rose-900 hover:text-rose-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm"
            >
              <LogIn className="h-4 w-4" />
              <span>Officer Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden border-t border-slate-800 bg-slate-950 px-2 py-1.5 justify-around text-xs">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`px-2.5 py-1 font-medium rounded ${
            activeTab === 'scanner' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-400'
          }`}
        >
          Checkpoint
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-2.5 py-1 font-medium rounded ${
            activeTab === 'logs' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-400'
          }`}
        >
          Logs ({deniedCount > 0 ? `${deniedCount} denied` : '0'})
        </button>
        <button
          onClick={() => setActiveTab('registry')}
          className={`px-2.5 py-1 font-medium rounded ${
            activeTab === 'registry' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-400'
          }`}
        >
          Students DB
        </button>
        <button
          onClick={() => setActiveTab('cards')}
          className={`px-2.5 py-1 font-medium rounded ${
            activeTab === 'cards' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-400'
          }`}
        >
          Badges
        </button>
      </div>
    </header>
  );
};
