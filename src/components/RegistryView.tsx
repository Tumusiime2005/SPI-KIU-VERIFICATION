import React, { useState } from 'react';
import {
  Database,
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CreditCard,
  PlusCircle,
  X,
  Lock,
  Building2,
  LogOut,
  Sparkles,
  QrCode,
  ShieldAlert
} from 'lucide-react';
import { RegistrarStaff, Student, StudentStatus } from '../types';
import { StudentIdCardGenerator } from './StudentIdCardGenerator';
import femalePhoto1 from '@/src/assets/images/student_portrait_female_1_1790940633236.jpg';
import malePhoto1 from '@/src/assets/images/student_portrait_male_1_1790940644556.jpg';

interface RegistryViewProps {
  students: Student[];
  registrarStaff: RegistrarStaff | null;
  onOpenRegistrarAuth: () => void;
  onRegistrarLogout: () => void;
  onAddStudent: (newStudent: Student) => void;
  onUpdateStudentStatus: (id: string, newStatus: StudentStatus, newExpiry?: string) => void;
}

export const RegistryView: React.FC<RegistryViewProps> = ({
  students,
  registrarStaff,
  onOpenRegistrarAuth,
  onRegistrarLogout,
  onAddStudent,
  onUpdateStudentStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | StudentStatus>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [generatedStudentBadge, setGeneratedStudentBadge] = useState<Student | null>(null);

  // New Student Form State
  const [newFullName, setNewFullName] = useState('');
  const [newRegNumber, setNewRegNumber] = useState('');
  const [newGender, setNewGender] = useState<'Male' | 'Female'>('Male');
  const [newFaculty, setNewFaculty] = useState('School of Computing & Information Technology');
  const [newCourse, setNewCourse] = useState('Bachelor of Science in Information Technology');
  const [newLevel, setNewLevel] = useState('Year 1, Semester 1');
  const [newCampus, setNewCampus] = useState('Main Campus - Kansanga');
  const [newExpiryDate, setNewExpiryDate] = useState('2028-12-31');
  const [newStatus, setNewStatus] = useState<StudentStatus>('active');
  const [newNationalId, setNewNationalId] = useState('CF' + Math.floor(100000000 + Math.random() * 900000000));
  const [newEmergencyContact, setNewEmergencyContact] = useState('+256 772 000 000');

  // Gated Access: If registrar staff is not logged in, show restricted portal lock
  if (!registrarStaff) {
    return (
      <div className="max-w-2xl mx-auto rounded-2xl border-2 border-slate-800 bg-slate-900/80 p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Lock className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-mono font-semibold text-emerald-400 border border-slate-700">
            <Building2 className="h-3.5 w-3.5" />
            <span>Academic Registrar &amp; ID Card Issuance Directorate</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Restricted Access: Student Enrollment &amp; ID Generation
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Security guards are strictly unauthorized to register new students or print ID badges. Access is reserved exclusively for the <strong>Office of the Academic Registrar</strong> and <strong>ID Card Production Team</strong>.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onOpenRegistrarAuth}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Lock className="h-4 w-4" />
            <span>Authenticate as Academic Registrar</span>
          </button>
        </div>
      </div>
    );
  }

  const filteredStudents = students.filter((s) => {
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      s.fullName.toLowerCase().includes(query) ||
      s.regNumber.toLowerCase().includes(query) ||
      s.course.toLowerCase().includes(query) ||
      s.faculty.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newRegNumber.trim()) return;

    const newStudent: Student = {
      id: 'stu-' + Date.now(),
      regNumber: newRegNumber.trim(),
      fullName: newFullName.trim(),
      gender: newGender,
      faculty: newFaculty,
      course: newCourse,
      level: newLevel,
      campus: newCampus,
      issueDate: new Date().toISOString().slice(0, 10),
      expiryDate: newExpiryDate,
      status: newStatus,
      photoUrl: newGender === 'Female' ? femalePhoto1 : malePhoto1,
      nationalIdOrPassport: newNationalId || 'CF' + Math.floor(100000000 + Math.random() * 900000000),
      emergencyContact: newEmergencyContact || '+256 700 000 000',
      notes: `Enrolled by ${registrarStaff.fullName} (${registrarStaff.staffId})`
    };

    onAddStudent(newStudent);
    setShowAddModal(false);

    // Immediately open the ID card generator for the newly created student!
    setGeneratedStudentBadge(newStudent);

    // Reset inputs
    setNewFullName('');
    setNewRegNumber('');
  };

  return (
    <div className="space-y-6">
      {/* Active Registrar Staff Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
              Registrar Portal Active
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              {registrarStaff.fullName} ({registrarStaff.role})
            </span>
          </div>
          <h2 className="text-base font-bold text-white mt-1 flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-400" />
            <span>KIU Student Enrollment &amp; ID Card Production Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Add new students, update enrollment status, and generate Front and Back official ID cards with unique QR codes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20"
          >
            <UserPlus className="h-4 w-4" />
            <span>Enroll New Student</span>
          </button>

          <button
            type="button"
            onClick={onRegistrarLogout}
            title="Lock Registrar Portal"
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Generated ID Card Preview Modal */}
      {generatedStudentBadge && (
        <div className="rounded-2xl border-2 border-emerald-500/80 bg-slate-900 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span>Official KIU ID Card Generator (Front &amp; Back Unique QR)</span>
            </span>
            <button
              type="button"
              onClick={() => setGeneratedStudentBadge(null)}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <StudentIdCardGenerator
            student={generatedStudentBadge}
            onClose={() => setGeneratedStudentBadge(null)}
          />
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search registry by student name, Reg No, course or faculty..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
          />
        </div>

        {/* Status segmented filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          {(['ALL', 'active', 'expired', 'suspended'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md uppercase transition-colors ${
                statusFilter === st
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Student Registry Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Reg Number</th>
                <th className="py-3 px-4">Course & Faculty</th>
                <th className="py-3 px-4">Card Expiry</th>
                <th className="py-3 px-4">Status Flag</th>
                <th className="py-3 px-4 text-right">Card Production</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredStudents.map((student) => {
                const isExpiredDate = new Date(student.expiryDate).getTime() < Date.now();
                return (
                  <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.photoUrl}
                          alt={student.fullName}
                          referrerPolicy="no-referrer"
                          className="h-10 w-9 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-100 block">
                            {student.fullName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {student.level} · {student.campus.split('-')[0].trim()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Reg No */}
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {student.regNumber}
                    </td>

                    {/* Course */}
                    <td className="py-3 px-4 max-w-xs">
                      <span className="font-medium text-slate-200 block truncate">
                        {student.course}
                      </span>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {student.faculty}
                      </span>
                    </td>

                    {/* Expiry Date */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono">
                      <span
                        className={`text-xs ${
                          isExpiredDate ? 'text-rose-400 font-bold' : 'text-slate-300'
                        }`}
                      >
                        {student.expiryDate}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={student.status}
                        onChange={(e) =>
                          onUpdateStudentStatus(student.id, e.target.value as StudentStatus)
                        }
                        className={`rounded-lg px-2 py-1 text-xs font-mono font-semibold border ${
                          student.status === 'active'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                            : student.status === 'expired'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                            : 'bg-amber-950/80 text-amber-300 border-amber-800'
                        } focus:outline-none`}
                      >
                        <option value="active">ACTIVE</option>
                        <option value="expired">EXPIRED</option>
                        <option value="suspended">SUSPENDED</option>
                        <option value="withdrawn">WITHDRAWN</option>
                      </select>
                    </td>

                    {/* Action: Generate Front & Back ID Card */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setGeneratedStudentBadge(student)}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition-colors ml-auto shadow-sm"
                        title="Generate Front and Back ID Card with Unique QR Code"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                        <span>Generate Front &amp; Back ID</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Enroll New KIU Student (Academic Registrar)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Full Student Name
                  </label>
                  <input
                    type="text"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="e.g. Dennis Mugisha"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    value={newRegNumber}
                    onChange={(e) => setNewRegNumber(e.target.value)}
                    placeholder="e.g. 2025-01-09941"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 font-mono text-xs text-white focus:border-emerald-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as 'Male' | 'Female')}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">Campus</label>
                  <select
                    value={newCampus}
                    onChange={(e) => setNewCampus(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="Main Campus - Kansanga">Main Campus - Kansanga</option>
                    <option value="Western Campus - Ishaka">Western Campus - Ishaka</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Faculty</label>
                <select
                  value={newFaculty}
                  onChange={(e) => setNewFaculty(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                >
                  <option value="School of Computing & Information Technology">
                    School of Computing &amp; Information Technology
                  </option>
                  <option value="Faculty of Medicine & Surgery">
                    Faculty of Medicine &amp; Surgery
                  </option>
                  <option value="School of Law">School of Law</option>
                  <option value="Faculty of Business and Management">
                    Faculty of Business and Management
                  </option>
                  <option value="Faculty of Engineering">Faculty of Engineering</option>
                  <option value="School of Pharmacy">School of Pharmacy</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Degree Course</label>
                <input
                  type="text"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Card Expiry Date
                  </label>
                  <input
                    type="date"
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 font-mono text-xs text-white focus:border-emerald-400 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Initial Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as StudentStatus)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="active">Active (Permitted)</option>
                    <option value="expired">Expired (Denied)</option>
                    <option value="suspended">Suspended (Denied)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20"
                >
                  Save Record &amp; Generate Front/Back ID Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
