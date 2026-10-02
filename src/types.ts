export type StudentStatus = 'active' | 'expired' | 'suspended' | 'withdrawn';

export interface Student {
  id: string;
  regNumber: string;
  fullName: string;
  gender: 'Male' | 'Female';
  faculty: string;
  course: string;
  level: string;
  campus: string;
  issueDate: string;
  expiryDate: string;
  status: StudentStatus;
  photoUrl: string;
  nationalIdOrPassport: string;
  emergencyContact: string;
  hallOfResidence?: string;
  notes?: string;
}

export interface SecurityOfficer {
  id: string;
  badgeNumber: string;
  fullName: string;
  username: string;
  rank: string;
  role: 'Security Officer' | 'Senior Inspector' | 'Chief of Campus Security';
  checkpoint: string;
  shift: string;
  lastLoginTime?: string;
}

export interface RegistrarStaff {
  id: string;
  staffId: string;
  fullName: string;
  username: string;
  role: 'Academic Registrar' | 'ID Production Officer' | 'Directorate of Student Affairs';
  department: string;
  authenticatedAt?: string;
}

export type ScanOutcome = 'GRANTED' | 'DENIED';

export type RejectionReason =
  | 'EXPIRED_ID'
  | 'UNREGISTERED_STUDENT'
  | 'SUSPENDED_STUDENT'
  | 'WITHDRAWN_STATUS'
  | 'INVALID_FORMAT'
  | 'VERIFIED_ACTIVE';

export interface ScanRecord {
  id: string;
  timestamp: string;
  timeFormatted: string;
  scannedCode: string;
  outcome: ScanOutcome;
  reason: RejectionReason;
  message: string;
  student?: Student;
  checkpoint: string;
  officerName: string;
  officerBadge: string;
}

export interface CheckpointStats {
  totalScanned: number;
  granted: number;
  denied: number;
  expiredCount: number;
  unregisteredCount: number;
  suspendedCount: number;
}
