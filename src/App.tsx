/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Navbar
} from './components/Navbar';
import { ScannerView } from './components/ScannerView';
import { LogView } from './components/LogView';
import { RegistryView } from './components/RegistryView';
import { CardsView } from './components/CardsView';
import { OfficerAuthModal } from './components/OfficerAuthModal';
import { CameraScannerModal } from './components/CameraScannerModal';
import { BadgeModal } from './components/BadgeModal';
import {
  getActiveOfficer,
  getScanLogs,
  getStoredStats,
  getStoredStudents,
  saveActiveOfficer,
  saveScanLogs,
  saveStoredStats,
  saveStoredStudents,
  verifyStudentId
} from './utils/storage';
import { sounds } from './utils/audio';
import { CheckpointStats, ScanRecord, SecurityOfficer, Student, StudentStatus } from './types';
import { Shield, PhoneCall, MapPin, University } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'logs' | 'registry' | 'cards'>('scanner');
  const [officer, setOfficer] = useState<SecurityOfficer | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<ScanRecord[]>([]);
  const [stats, setStats] = useState<CheckpointStats>({
    totalScanned: 0,
    granted: 0,
    denied: 0,
    expiredCount: 0,
    unregisteredCount: 0,
    suspendedCount: 0
  });
  const [latestScan, setLatestScan] = useState<ScanRecord | null>(null);

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [badgeModalStudent, setBadgeModalStudent] = useState<Student | null>(null);

  // Sound state
  const [isMuted, setIsMuted] = useState(sounds.getMuted());

  // Initialize data on mount
  useEffect(() => {
    const loadedOfficer = getActiveOfficer();
    const loadedStudents = getStoredStudents();
    const loadedLogs = getScanLogs();
    const loadedStats = getStoredStats();

    setOfficer(loadedOfficer);
    setStudents(loadedStudents);
    setLogs(loadedLogs);
    setStats(loadedStats);

    if (loadedLogs.length > 0) {
      setLatestScan(loadedLogs[0]);
    }
  }, []);

  const handleToggleMute = () => {
    const next = !isMuted;
    sounds.setMuted(next);
    setIsMuted(next);
  };

  const handleScanCode = (code: string) => {
    if (!code.trim()) return;

    sounds.playScanChirp();

    const { record, outcome } = verifyStudentId(code, officer, students);

    // Audio cue based on security verdict
    if (outcome === 'GRANTED') {
      sounds.playAccessGranted();
    } else {
      sounds.playAccessDenied();
    }

    // Update Logs
    const updatedLogs = [record, ...logs];
    setLogs(updatedLogs);
    saveScanLogs(updatedLogs);
    setLatestScan(record);

    // Update Stats
    const updatedStats: CheckpointStats = {
      totalScanned: stats.totalScanned + 1,
      granted: outcome === 'GRANTED' ? stats.granted + 1 : stats.granted,
      denied: outcome === 'DENIED' ? stats.denied + 1 : stats.denied,
      expiredCount:
        record.reason === 'EXPIRED_ID' ? stats.expiredCount + 1 : stats.expiredCount,
      unregisteredCount:
        record.reason === 'UNREGISTERED_STUDENT'
          ? stats.unregisteredCount + 1
          : stats.unregisteredCount,
      suspendedCount:
        record.reason === 'SUSPENDED_STUDENT'
          ? stats.suspendedCount + 1
          : stats.suspendedCount
    };

    setStats(updatedStats);
    saveStoredStats(updatedStats);

    // Switch to scanner view to show the prominent red or green alert
    if (activeTab !== 'scanner') {
      setActiveTab('scanner');
    }
  };

  const handleLoginSuccess = (authenticatedOfficer: SecurityOfficer) => {
    setOfficer(authenticatedOfficer);
    saveActiveOfficer(authenticatedOfficer);
  };

  const handleLogout = () => {
    setOfficer(null);
    saveActiveOfficer(null);
    setIsLoginModalOpen(true);
  };

  const handleResetStats = () => {
    const resetValues: CheckpointStats = {
      totalScanned: 0,
      granted: 0,
      denied: 0,
      expiredCount: 0,
      unregisteredCount: 0,
      suspendedCount: 0
    };
    setStats(resetValues);
    saveStoredStats(resetValues);
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all recorded scan history for this shift?')) {
      setLogs([]);
      saveScanLogs([]);
      setLatestScan(null);
    }
  };

  const handleAddStudent = (newStudent: Student) => {
    const updated = [newStudent, ...students];
    setStudents(updated);
    saveStoredStudents(updated);
  };

  const handleUpdateStudentStatus = (
    id: string,
    newStatus: StudentStatus,
    newExpiry?: string
  ) => {
    const updated = students.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          status: newStatus,
          expiryDate: newExpiry || s.expiryDate
        };
      }
      return s;
    });
    setStudents(updated);
    saveStoredStudents(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        officer={officer}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        deniedCount={stats.denied}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'scanner' && (
          <ScannerView
            officer={officer}
            stats={stats}
            students={students}
            latestScan={latestScan}
            recentScans={logs.slice(0, 5)}
            onScanCode={handleScanCode}
            onOpenScannerModal={() => setIsCameraModalOpen(true)}
            onResetStats={handleResetStats}
          />
        )}

        {activeTab === 'logs' && (
          <LogView logs={logs} onClearLogs={handleClearLogs} />
        )}

        {activeTab === 'registry' && (
          <RegistryView
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudentStatus={handleUpdateStudentStatus}
            onScanStudent={handleScanCode}
            onPreviewBadge={(stu) => setBadgeModalStudent(stu)}
          />
        )}

        {activeTab === 'cards' && (
          <CardsView students={students} onScanStudent={handleScanCode} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 text-xs text-slate-500 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-500" />
            <span className="font-semibold text-slate-400">SPI-KIU</span>
            <span>· Campus Security & Access Control System</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-slate-400" />
              Main Campus (Ggaba Rd, Kansanga) & Western Campus (Ishaka)
            </span>
            <span className="text-slate-700 hidden md:inline">|</span>
            <span className="flex items-center gap-1 text-amber-500/80">
              <PhoneCall className="h-3 w-3" />
              Campus Security Hotline: +256 701 000 911
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <OfficerAuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentOfficer={officer}
        onLoginSuccess={handleLoginSuccess}
      />

      <CameraScannerModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCodeScanned={handleScanCode}
      />

      <BadgeModal
        student={badgeModalStudent}
        onClose={() => setBadgeModalStudent(null)}
        onScanStudent={handleScanCode}
      />
    </div>
  );
}
