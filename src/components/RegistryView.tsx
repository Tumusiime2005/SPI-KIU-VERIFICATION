import React, { useState } from 'react';
import {
  Database,
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scan,
  CreditCard,
  Edit2,
  PlusCircle,
  X,
  Sparkles
} from 'lucide-react';
import { Student, StudentStatus } from '../types';
import femalePhoto1 from '@/src/assets/images/student_portrait_female_1_1790940633236.jpg';
import malePhoto1 from '@/src/assets/images/student_portrait_male_1_1790940644556.jpg';

interface RegistryViewProps {
  students: Student[];
  onAddStudent: (newStudent: Student) => void;
  onUpdateStudentStatus: (id: string, newStatus: StudentStatus, newExpiry?: string) => void;
  onScanStudent: (code: string) => void;
  onPreviewBadge: (student: Student) => void;
}

export const RegistryView: React.FC<RegistryViewProps> = ({
  students,
  onAddStudent,
  onUpdateStudentStatus,
  onScanStudent,
  onPreviewBadge
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | StudentStatus>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

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
      nationalIdOrPassport: 'CF' + Math.floor(100000000 + Math.random() * 900000000),
      emergencyContact: '+256 700 000 000',
      notes: 'Added via security checkpoint registry portal.'
    };

    onAddStudent(newStudent);
    setShowAddModal(false);

    // Reset inputs
    setNewFullName('');
    setNewRegNumber('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="h-5 w-5 text-amber-400" />
            <span>KIU Student Registry (SQL Database Engine)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative institutional database used by checkpoint scanners to verify student identity, validity, and enrollment status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-sm shadow-amber-500/10"
        >
          <UserPlus className="h-4 w-4" />
          <span>Register New Student</span>
        </button>
      </div>

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
            placeholder="Search by student name, Reg No, course or faculty..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
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
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Student Table */}
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
                <th className="py-3 px-4 text-right">Verification Actions</th>
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
                    <td className="py-3 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
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
                      {isExpiredDate && (
                        <span className="block text-[10px] text-rose-400 uppercase font-semibold">
                          Date Elapsed
                        </span>
                      )}
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

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onScanStudent(student.regNumber)}
                          className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                          title="Simulate scanning this student at gate"
                        >
                          <Scan className="h-3.5 w-3.5" />
                          <span>Scan</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onPreviewBadge(student)}
                          className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
                          title="View Official KIU Student ID Card"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          <span>Card</span>
                        </button>
                      </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Register New KIU Student Record
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
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
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
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
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
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
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
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
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
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="School of Computing & Information Technology">
                    School of Computing & Information Technology
                  </option>
                  <option value="Faculty of Medicine & Surgery">
                    Faculty of Medicine & Surgery
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
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
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
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
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
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
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
                  className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
                >
                  Save Record to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
