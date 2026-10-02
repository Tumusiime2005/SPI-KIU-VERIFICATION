import React, { useState } from 'react';
import {
  Download,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Filter,
  FileSpreadsheet,
  AlertTriangle,
  Clock,
  Shield
} from 'lucide-react';
import { ScanOutcome, ScanRecord } from '../types';

interface LogViewProps {
  logs: ScanRecord[];
  onClearLogs: () => void;
}

export const LogView: React.FC<LogViewProps> = ({ logs, onClearLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<'ALL' | ScanOutcome>('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesOutcome = outcomeFilter === 'ALL' || log.outcome === outcomeFilter;
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      log.scannedCode.toLowerCase().includes(query) ||
      (log.student?.fullName.toLowerCase().includes(query) ?? false) ||
      log.checkpoint.toLowerCase().includes(query) ||
      log.officerName.toLowerCase().includes(query) ||
      log.message.toLowerCase().includes(query);
    return matchesOutcome && matchesSearch;
  });

  const exportToCSV = () => {
    if (logs.length === 0) return;

    const headers = [
      'Log ID',
      'Timestamp',
      'Registration Number',
      'Student Name',
      'Faculty',
      'Campus',
      'Outcome',
      'Reason',
      'Message',
      'Checkpoint Gate',
      'Officer Name',
      'Officer Badge'
    ];

    const rows = logs.map((log) => [
      log.id,
      log.timestamp,
      log.scannedCode,
      log.student?.fullName || 'N/A (Unregistered)',
      log.student?.faculty || 'N/A',
      log.student?.campus || 'N/A',
      log.outcome,
      log.reason,
      `"${log.message.replace(/"/g, '""')}"`,
      `"${log.checkpoint}"`,
      `"${log.officerName}"`,
      log.officerBadge
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `SPI_KIU_Security_Log_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalScans = logs.length;
  const grantedCount = logs.filter((l) => l.outcome === 'GRANTED').length;
  const deniedCount = logs.filter((l) => l.outcome === 'DENIED').length;

  return (
    <div className="space-y-6">
      {/* Header with summary and action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-amber-400" />
            <span>Campus Security Checkpoint Access Log</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit trail of all student ID scans, authorizations, and denied entry attempts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={exportToCSV}
            disabled={logs.length === 0}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-amber-500/10"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onClearLogs}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:border-rose-900 hover:bg-rose-950/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
        {/* Search */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, reg number, gate, or message..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>

        {/* Outcome Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setOutcomeFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              outcomeFilter === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({totalScans})
          </button>
          <button
            type="button"
            onClick={() => setOutcomeFilter('GRANTED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              outcomeFilter === 'GRANTED'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Granted ({grantedCount})
          </button>
          <button
            type="button"
            onClick={() => setOutcomeFilter('DENIED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              outcomeFilter === 'DENIED'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Denied ({deniedCount})
          </button>
        </div>
      </div>

      {/* Log Data Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        {filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Student / ID</th>
                  <th className="py-3 px-4">Status & Reason</th>
                  <th className="py-3 px-4">Security Verdict Details</th>
                  <th className="py-3 px-4">Checkpoint Gate</th>
                  <th className="py-3 px-4 text-right">Duty Officer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      log.outcome === 'DENIED' ? 'bg-rose-950/10' : ''
                    }`}
                  >
                    {/* Timestamp */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-400 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        <span>{log.timeFormatted}</span>
                      </div>
                    </td>

                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-slate-200">
                          {log.student?.regNumber || log.scannedCode}
                        </span>
                        {log.student ? (
                          <span className="text-slate-400 text-[11px] truncate max-w-xs">
                            {log.student.fullName}
                          </span>
                        ) : (
                          <span className="text-rose-400 text-[11px] italic">
                            Non-Student / Unknown
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status & Reason */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {log.outcome === 'GRANTED' ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            GRANTED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-rose-300 bg-rose-950/80 border border-rose-800 px-2 py-0.5 rounded animate-pulse">
                            <XCircle className="h-3 w-3 text-rose-400" />
                            DENIED
                          </span>
                        )}

                        <span className="font-mono text-[10px] text-slate-400">
                          {log.reason.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>

                    {/* Verdict Message */}
                    <td className="py-3 px-4 max-w-md">
                      <p
                        className={`text-[11px] line-clamp-2 ${
                          log.outcome === 'DENIED' ? 'text-rose-200 font-medium' : 'text-slate-300'
                        }`}
                      >
                        {log.message}
                      </p>
                    </td>

                    {/* Checkpoint */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-300 font-mono text-[11px]">
                      {log.checkpoint.split('(')[0].trim()}
                    </td>

                    {/* Officer */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="text-slate-300 font-medium block">
                        {log.officerName}
                      </span>
                      <span className="font-mono text-[10px] text-amber-400">
                        {log.officerBadge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-2">
            <FileSpreadsheet className="mx-auto h-8 w-8 text-slate-600" />
            <h4 className="text-sm font-semibold text-slate-300">
              No Checkpoint Scan Logs Found
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {searchTerm
                ? 'No records match your search filter.'
                : 'Scanned student IDs will automatically generate real-time security log entries here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
