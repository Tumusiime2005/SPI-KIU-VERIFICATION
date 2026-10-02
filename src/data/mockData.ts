import femalePhoto1 from '@/src/assets/images/student_portrait_female_1_1790940633236.jpg';
import malePhoto1 from '@/src/assets/images/student_portrait_male_1_1790940644556.jpg';
import { SecurityOfficer, Student } from '../types';

export const INITIAL_OFFICERS: SecurityOfficer[] = [
  {
    id: 'off-01',
    badgeNumber: 'KIU-SEC-104',
    fullName: 'Officer Marvin Tumusiime',
    username: 'officer.marvin',
    rank: 'Senior Checkpoint Inspector',
    role: 'Senior Inspector',
    checkpoint: 'Main Gate - Ggaba Rd (Kansanga)',
    shift: 'Morning Shift (06:00 - 14:00)',
    lastLoginTime: 'Today at 06:15 AM'
  },
  {
    id: 'off-02',
    badgeNumber: 'KIU-SEC-089',
    fullName: 'Officer Joanita Akello',
    username: 'guard.akello',
    rank: 'Campus Access Officer',
    role: 'Security Officer',
    checkpoint: 'Western Campus Gate 1 (Ishaka)',
    shift: 'Afternoon Shift (14:00 - 22:00)',
    lastLoginTime: 'Yesterday at 14:02 PM'
  },
  {
    id: 'off-03',
    badgeNumber: 'KIU-SEC-012',
    fullName: 'Sergeant Patrick Kato',
    username: 'sgt.kato',
    rank: 'Chief Gate Supervisor',
    role: 'Chief of Campus Security',
    checkpoint: 'Postgraduate & Admin Gate',
    shift: 'Morning Shift (06:00 - 14:00)',
    lastLoginTime: 'Today at 05:45 AM'
  }
];

export const CHECKPOINT_GATES = [
  'Main Gate - Ggaba Rd (Kansanga)',
  'Western Campus Gate 1 (Ishaka)',
  'Postgraduate & Admin Complex Gate',
  'School of Health Sciences Gate (Ishaka)',
  'Engineering & IT Wing Gate (Kansanga)',
  'University Library North Gate',
  'Hostel & Residential Perimeter Checkpoint'
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-001',
    regNumber: '2024-01-08942',
    fullName: 'Brenda Namagembe',
    gender: 'Female',
    faculty: 'School of Computing & Information Technology',
    course: 'Bachelor of Science in Software Engineering',
    level: 'Year 2, Semester 1',
    campus: 'Main Campus - Kansanga',
    issueDate: '2024-01-15',
    expiryDate: '2027-12-31', // Valid
    status: 'active',
    photoUrl: femalePhoto1,
    nationalIdOrPassport: 'CF98024102948K',
    emergencyContact: '+256 701 445 289',
    hallOfResidence: 'Victoria Hostel Wing B',
    notes: 'Clear access. Registered for Semester 1 Exams.'
  },
  {
    id: 'stu-001b',
    regNumber: '2023-09-04189',
    fullName: 'Brenda Atuhaire',
    gender: 'Female',
    faculty: 'Faculty of Medicine & Surgery',
    course: 'Bachelor of Medicine & Surgery (MBChB)',
    level: 'Year 3, Semester 1',
    campus: 'Western Campus - Ishaka',
    issueDate: '2023-09-10',
    expiryDate: '2028-06-30', // Valid
    status: 'active',
    photoUrl: femalePhoto1,
    nationalIdOrPassport: 'CF01092841022H',
    emergencyContact: '+256 772 881 294',
    hallOfResidence: 'Ishaka Clinical Hostels',
    notes: 'Valid clinical badge clearance.'
  },
  {
    id: 'stu-001c',
    regNumber: '2021-08-01994',
    fullName: 'Brenda Nabirye',
    gender: 'Female',
    faculty: 'School of Law',
    course: 'Bachelor of Laws (LLB)',
    level: 'Graduated / Expired Card',
    campus: 'Main Campus - Kansanga',
    issueDate: '2021-08-01',
    expiryDate: '2024-07-31', // Expired
    status: 'expired',
    photoUrl: femalePhoto1,
    nationalIdOrPassport: 'CF98028192019L',
    emergencyContact: '+256 752 119 281',
    notes: 'Card expired July 2024. Student must renew with Registrar.'
  },
  {
    id: 'stu-002',
    regNumber: '2023-08-01254',
    fullName: 'Joshua Emmanuel Mukasa',
    gender: 'Male',
    faculty: 'Faculty of Medicine & Surgery',
    course: 'Bachelor of Medicine & Bachelor of Surgery (MBChB)',
    level: 'Year 3, Semester 2',
    campus: 'Western Campus - Ishaka',
    issueDate: '2023-08-20',
    expiryDate: '2028-06-30', // Valid
    status: 'active',
    photoUrl: malePhoto1,
    nationalIdOrPassport: 'CM01035109122M',
    emergencyContact: '+256 772 198 304',
    hallOfResidence: 'Teaching Hospital Quarters Block 4',
    notes: 'Clinical student with 24/7 hospital badge clearance.'
  },
  {
    id: 'stu-002b',
    regNumber: '2024-01-09412',
    fullName: 'Derrick Ssemwogerere Mukasa',
    gender: 'Male',
    faculty: 'School of Computing & Information Technology',
    course: 'Bachelor of Science in Computer Science',
    level: 'Year 2, Semester 1',
    campus: 'Main Campus - Kansanga',
    issueDate: '2024-01-18',
    expiryDate: '2027-12-31', // Valid
    status: 'active',
    photoUrl: malePhoto1,
    nationalIdOrPassport: 'CM02014918239Y',
    emergencyContact: '+256 701 992 481',
    notes: 'Active enrollment verified.'
  },
  {
    id: 'stu-002c',
    regNumber: '2022-03-08819',
    fullName: 'Sarah Christine Mukasa',
    gender: 'Female',
    faculty: 'School of Pharmacy',
    course: 'Bachelor of Pharmacy (BPharm)',
    level: 'Year 4, Semester 1',
    campus: 'Western Campus - Ishaka',
    issueDate: '2022-03-15',
    expiryDate: '2026-03-31',
    status: 'suspended', // Suspended
    photoUrl: femalePhoto1,
    nationalIdOrPassport: 'CF00192841029P',
    emergencyContact: '+256 788 410 928',
    notes: 'Disciplinary suspension on file.'
  },
  {
    id: 'stu-003',
    regNumber: '2021-03-03310',
    fullName: 'Derrick Ochieng Omondi',
    gender: 'Male',
    faculty: 'School of Law',
    course: 'Bachelor of Laws (LLB)',
    level: 'Graduated / Expired Card',
    campus: 'Main Campus - Kansanga',
    issueDate: '2021-03-10',
    expiryDate: '2024-08-31', // EXPIRED!
    status: 'expired',
    photoUrl: malePhoto1,
    nationalIdOrPassport: 'CM97089104112X',
    emergencyContact: '+256 788 654 321',
    hallOfResidence: 'Off-Campus (Kabalagala)',
    notes: 'Card expired August 2024. Student completed final year exams, alumni clearance required.'
  },
  {
    id: 'stu-004',
    regNumber: '2024-02-05411',
    fullName: 'Patience Sarah Kyomugisha',
    gender: 'Female',
    faculty: 'Faculty of Business and Management',
    course: 'Bachelor of Business Administration (Accounting)',
    level: 'Year 2, Semester 2',
    campus: 'Main Campus - Kansanga',
    issueDate: '2024-02-18',
    expiryDate: '2027-02-28', // Valid date, but status suspended
    status: 'suspended', // SUSPENDED!
    photoUrl: femalePhoto1,
    nationalIdOrPassport: 'CF02011928410A',
    emergencyContact: '+256 704 883 129',
    hallOfResidence: 'Albert Hall Room 12',
    notes: 'SUSPENDED: Dean of Students disciplinary hold pending investigation (Ref: KIU/DOS/DISC/24/09).'
  },
  {
    id: 'stu-004b',
    regNumber: '2025-01-09822',
    fullName: 'Elton Marvin Tumusiime',
    gender: 'Male',
    faculty: 'Faculty of Engineering',
    course: 'Bachelor of Science in Electrical Engineering',
    level: 'Year 2, Semester 1',
    campus: 'Main Campus - Kansanga',
    issueDate: '2025-01-10',
    expiryDate: '2028-12-31', // Valid
    status: 'active',
    photoUrl: malePhoto1,
    nationalIdOrPassport: 'CM03091823901R',
    emergencyContact: '+256 700 812 345',
    notes: 'Engineering lab clearance verified.'
  },
  {
    id: 'stu-004c',
    regNumber: '2023-04-06129',
    fullName: 'Patience Tumusiime',
    gender: 'Female',
    faculty: 'School of Business and Management',
    course: 'Bachelor of Procurement & Logistics',
    level: 'Year 3, Semester 1',
    campus: 'Main Campus - Kansanga',
    issueDate: '2023-04-12',
    expiryDate: '2026-04-30', // Valid
    status: 'active',
    photoUrl: femalePhoto1,
    nationalIdOrPassport: 'CF01092849102T',
    emergencyContact: '+256 782 109 481',
    notes: 'Active student status.'
  },
  {
    id: 'stu-005',
    regNumber: '2023-01-09871',
    fullName: 'Brian Samuel Kigozi',
    gender: 'Male',
    faculty: 'Faculty of Engineering',
    course: 'Bachelor of Science in Civil Engineering',
    level: 'Year 3, Semester 1',
    campus: 'Main Campus - Kansanga',
    issueDate: '2023-01-25',
    expiryDate: '2027-01-31', // Valid
    status: 'active',
    photoUrl: malePhoto1,
    nationalIdOrPassport: 'CM00142890123K',
    emergencyContact: '+256 752 901 345',
    hallOfResidence: 'Nile Hall Wing C',
    notes: 'Active enrollment verified.'
  },
  {
    id: 'stu-006',
    regNumber: '2022-09-04218',
    fullName: 'Diana Akech Nansubuga',
    gender: 'Female',
    faculty: 'School of Pharmacy',
    course: 'Bachelor of Pharmacy (BPharm)',
    level: 'Year 4, Semester 1',
    campus: 'Western Campus - Ishaka',
    issueDate: '2022-09-01',
    expiryDate: '2025-06-30', // EXPIRED!
    status: 'expired',
    photoUrl: femalePhoto1,
    nationalIdOrPassport: 'CF99014298102B',
    emergencyContact: '+256 781 223 908',
    hallOfResidence: 'Bushenyi Hostels',
    notes: 'Card expired June 2025. Must renew student card at Academic Registrar desk.'
  },
  {
    id: 'stu-007',
    regNumber: '2025-01-01102',
    fullName: 'Farouk Allan Tumwesigye',
    gender: 'Male',
    faculty: 'School of Computing & Information Technology',
    course: 'Bachelor of Science in Computer Science',
    level: 'Year 1, Semester 2',
    campus: 'Main Campus - Kansanga',
    issueDate: '2025-01-10',
    expiryDate: '2028-12-31', // Valid
    status: 'active',
    photoUrl: malePhoto1,
    nationalIdOrPassport: 'CM04081298412Z',
    emergencyContact: '+256 706 771 234',
    hallOfResidence: 'Victoria Hall Room 45',
    notes: 'Freshman orientation completed. Valid access.'
  }
];

export const INITIAL_PRESET_TESTS = [
  {
    label: 'Type "Mukasa" (Multiple students match)',
    code: 'Mukasa',
    expectedOutcome: 'LIST',
    desc: 'Shows list of 3 students with name Mukasa'
  },
  {
    label: 'Type "Brenda" (Multiple students match)',
    code: 'Brenda',
    expectedOutcome: 'LIST',
    desc: 'Shows list of 3 students with name Brenda'
  },
  {
    label: 'Valid SWE (Brenda Namagembe)',
    code: '2024-01-08942',
    expectedOutcome: 'GRANTED',
    desc: 'Active student, valid card expires 2027'
  },
  {
    label: 'Valid Medical (Joshua Mukasa)',
    code: '2023-08-01254',
    expectedOutcome: 'GRANTED',
    desc: 'Active student, Western Campus Ishaka'
  },
  {
    label: 'Expired ID (Derrick Ochieng)',
    code: '2021-03-03310',
    expectedOutcome: 'DENIED',
    desc: 'Card expired August 2024'
  },
  {
    label: 'Suspended (Patience Kyomugisha)',
    code: '2024-02-05411',
    expectedOutcome: 'DENIED',
    desc: 'Disciplinary hold placed by Dean of Students'
  }
];
