import { INITIAL_OFFICERS, INITIAL_REGISTRAR_STAFF, INITIAL_STUDENTS } from '../data/mockData';
import { CheckpointStats, RegistrarStaff, ScanOutcome, ScanRecord, SecurityOfficer, Student } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'spi_kiu_students_v2',
  OFFICER_SESSION: 'spi_kiu_active_officer_v1',
  REGISTRAR_SESSION: 'spi_kiu_registrar_session_v1',
  SCAN_LOGS: 'spi_kiu_scan_logs_v1',
  STATS: 'spi_kiu_stats_v1'
};

export function getActiveRegistrarStaff(): RegistrarStaff | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTRAR_SESSION);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return null;
}

export function saveActiveRegistrarStaff(staff: RegistrarStaff | null): void {
  try {
    if (staff) {
      localStorage.setItem(STORAGE_KEYS.REGISTRAR_SESSION, JSON.stringify(staff));
    } else {
      localStorage.removeItem(STORAGE_KEYS.REGISTRAR_SESSION);
    }
  } catch {
    // ignore
  }
}

export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= INITIAL_STUDENTS.length) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  return INITIAL_STUDENTS;
}

export function searchStudentsByName(query: string, students: Student[]): Student[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  // Match if registration number matches
  const exactReg = students.filter(
    (s) => s.regNumber.toLowerCase() === clean || s.regNumber.replace(/[^a-z0-9]/gi, '').toLowerCase() === clean.replace(/[^a-z0-9]/gi, '')
  );
  if (exactReg.length > 0) return exactReg;

  // Split query words
  const terms = clean.split(/\s+/).filter(Boolean);

  return students.filter((student) => {
    const studentFullName = student.fullName.toLowerCase();
    const nameWords = studentFullName.split(/\s+/);

    // Matches if the full name includes the query
    if (studentFullName.includes(clean)) return true;

    // Matches if any term matches any word of the name (e.g. first or last name)
    return terms.some((term) =>
      nameWords.some((nw) => nw.startsWith(term) || nw.includes(term))
    );
  });
}

export function saveStoredStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch {
    // ignore
  }
}

export function getActiveOfficer(): SecurityOfficer | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFICER_SESSION);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  // Default to first officer for ease of use if not logged in
  const defaultOfficer = INITIAL_OFFICERS[0];
  localStorage.setItem(STORAGE_KEYS.OFFICER_SESSION, JSON.stringify(defaultOfficer));
  return defaultOfficer;
}

export function saveActiveOfficer(officer: SecurityOfficer | null): void {
  try {
    if (officer) {
      localStorage.setItem(STORAGE_KEYS.OFFICER_SESSION, JSON.stringify(officer));
    } else {
      localStorage.removeItem(STORAGE_KEYS.OFFICER_SESSION);
    }
  } catch {
    // ignore
  }
}

export function getScanLogs(): ScanRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCAN_LOGS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return [];
}

export function saveScanLogs(logs: ScanRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCAN_LOGS, JSON.stringify(logs));
  } catch {
    // ignore
  }
}

export function getStoredStats(): CheckpointStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  const initial: CheckpointStats = {
    totalScanned: 0,
    granted: 0,
    denied: 0,
    expiredCount: 0,
    unregisteredCount: 0,
    suspendedCount: 0
  };
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(initial));
  return initial;
}

export function saveStoredStats(stats: CheckpointStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

/**
 * Core verification engine for KIU Security Portal
 */
export function verifyStudentId(
  inputCode: string,
  officer: SecurityOfficer | null,
  currentStudents: Student[]
): { record: ScanRecord; outcome: ScanOutcome } {
  const cleanCode = inputCode.trim().toUpperCase();
  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const officerName = officer?.fullName || 'Gate Officer on Duty';
  const officerBadge = officer?.badgeNumber || 'KIU-SEC-GEN';
  const checkpoint = officer?.checkpoint || 'Main Gate - Ggaba Rd';

  // Check if code matches any student
  const student = currentStudents.find((s) => {
    const regMatch = s.regNumber.toUpperCase() === cleanCode;
    const cleanRegWithoutDashes = s.regNumber.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const cleanInputWithoutDashes = cleanCode.replace(/[^A-Za-z0-9]/g, '');
    const idMatch = s.id.toUpperCase() === cleanCode;
    return regMatch || idMatch || cleanRegWithoutDashes === cleanInputWithoutDashes;
  });

  let outcome: ScanOutcome = 'DENIED';
  let reason: ScanRecord['reason'] = 'UNREGISTERED_STUDENT';
  let message = '';

  if (!student) {
    outcome = 'DENIED';
    reason = 'UNREGISTERED_STUDENT';
    message = `UNAUTHORIZED ACCESS: ID "${cleanCode}" is not found in the KIU student database. Not an authorized student. Access to campus is strictly forbidden.`;
  } else {
    // Check expiry
    const expiry = new Date(student.expiryDate);
    // Compare date parts
    const isExpiredDate = expiry.getTime() < now.getTime();

    if (student.status === 'suspended') {
      outcome = 'DENIED';
      reason = 'SUSPENDED_STUDENT';
      message = `DISCIPLINARY HOLD: Student ${student.fullName} (${student.regNumber}) has a SUSPENDED status. Campus entry is prohibited per Office of the Dean of Students.`;
    } else if (isExpiredDate || student.status === 'expired') {
      outcome = 'DENIED';
      reason = 'EXPIRED_ID';
      message = `EXPIRED CREDENTIALS: Student ID for ${student.fullName} (${student.regNumber}) expired on ${student.expiryDate}. Card is no longer valid for gate access.`;
    } else if (student.status === 'withdrawn') {
      outcome = 'DENIED';
      reason = 'WITHDRAWN_STATUS';
      message = `INACTIVE REGISTRATION: Student ${student.fullName} has withdrawn from studies. Not authorized for gate entry.`;
    } else {
      outcome = 'GRANTED';
      reason = 'VERIFIED_ACTIVE';
      message = `ACCESS GRANTED: Verified active student of Kampala International University. Welcome to campus.`;
    }
  }

  const record: ScanRecord = {
    id: 'scan-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    timestamp: now.toISOString(),
    timeFormatted,
    scannedCode: cleanCode,
    outcome,
    reason,
    message,
    student: student ? { ...student } : undefined,
    checkpoint,
    officerName,
    officerBadge
  };

  return { record, outcome };
}

export function resetCheckpointDatabase(): void {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  localStorage.setItem(
    STORAGE_KEYS.STATS,
    JSON.stringify({
      totalScanned: 0,
      granted: 0,
      denied: 0,
      expiredCount: 0,
      unregisteredCount: 0,
      suspendedCount: 0
    })
  );
  localStorage.setItem(STORAGE_KEYS.SCAN_LOGS, JSON.stringify([]));
}
