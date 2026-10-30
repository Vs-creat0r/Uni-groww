import { User, Lecture, QuizResponse, StudentStats, calculateTier } from '../types/index.ts';

export const SEED_FACULTY: User[] = [
  {
    id: 'fac-1',
    name: 'Dr. R. K. Sharma',
    email: 'rksharma@engineering.edu.in',
    role: 'faculty',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'fac-2',
    name: 'Prof. Priya Mehta',
    email: 'pmehta@engineering.edu.in',
    role: 'faculty',
    department: 'Data Science & AI',
  },
  {
    id: 'fac-3',
    name: 'Dr. Ananya Sen',
    email: 'asen@engineering.edu.in',
    role: 'faculty',
    department: 'Software Engineering',
  },
  {
    id: 'fac-4',
    name: 'Prof. Vikram Joshi',
    email: 'vjoshi@engineering.edu.in',
    role: 'faculty',
    department: 'Information Technology',
  },
  {
    id: 'fac-5',
    name: 'Dr. K. Venkataraman',
    email: 'kvenkat@engineering.edu.in',
    role: 'faculty',
    department: 'Electronics & Communication',
  },
];

export const SEED_ADMIN: User = {
  id: 'admin-1',
  name: 'Dean Dr. P. B. Kulkarni',
  email: 'dean.academics@engineering.edu.in',
  role: 'admin',
  department: 'Academic Affairs & PBL Cell',
};

export const SEED_STUDENTS: User[] = [
  { id: 'stu-1', name: 'Aarav Patel', rollNumber: '21BCE1001', email: 'aarav.p@student.edu.in', role: 'student', department: 'Computer Science' },
  { id: 'stu-2', name: 'Rohan Verma', rollNumber: '21BCE1002', email: 'rohan.v@student.edu.in', role: 'student', department: 'Computer Science' },
  { id: 'stu-3', name: 'Sneha Iyer', rollNumber: '21BCE1003', email: 'sneha.i@student.edu.in', role: 'student', department: 'Data Science' },
  { id: 'stu-4', name: 'Diya Sharma', rollNumber: '21BCE1004', email: 'diya.s@student.edu.in', role: 'student', department: 'Computer Science' },
  { id: 'stu-5', name: 'Aditya Nair', rollNumber: '21BCE1005', email: 'aditya.n@student.edu.in', role: 'student', department: 'Information Tech' },
  { id: 'stu-6', name: 'Pooja Deshmukh', rollNumber: '21BCE1006', email: 'pooja.d@student.edu.in', role: 'student', department: 'Computer Science' },
  { id: 'stu-7', name: 'Rahul Kulkarni', rollNumber: '21BCE1007', email: 'rahul.k@student.edu.in', role: 'student', department: 'Data Science' },
  { id: 'stu-8', name: 'Ananya Reddy', rollNumber: '21BCE1008', email: 'ananya.r@student.edu.in', role: 'student', department: 'Computer Science' },
  { id: 'stu-9', name: 'Karthik Raman', rollNumber: '21BCE1009', email: 'karthik.r@student.edu.in', role: 'student', department: 'Information Tech' },
  { id: 'stu-10', name: 'Neha Gupta', rollNumber: '21BCE1010', email: 'neha.g@student.edu.in', role: 'student', department: 'Computer Science' },
  { id: 'stu-11', name: 'Siddharth Mehta', rollNumber: '21BCE1011', email: 'siddharth.m@student.edu.in', role: 'student', department: 'Data Science' },
  { id: 'stu-12', name: 'Tanvi Joshi', rollNumber: '21BCE1012', email: 'tanvi.j@student.edu.in', role: 'student', department: 'Computer Science' },
  { id: 'stu-13', name: 'Arjun Singh', rollNumber: '21BCE1013', email: 'arjun.s@student.edu.in', role: 'student', department: 'Computer Science' },
  { id: 'stu-14', name: 'Riya Sengupta', rollNumber: '21BCE1014', email: 'riya.s@student.edu.in', role: 'student', department: 'Data Science' },
  { id: 'stu-15', name: 'Varun Chopra', rollNumber: '21BCE1015', email: 'varun.c@student.edu.in', role: 'student', department: 'Information Tech' },
  { id: 'stu-16', name: 'Meera Nair', rollNumber: '21BCE1016', email: 'meera.n@student.edu.in', role: 'student', department: 'Computer Science' },
  { id: 'stu-17', name: 'Yash Bansal', rollNumber: '21BCE1017', email: 'yash.b@student.edu.in', role: 'student', department: 'Computer Science' },
  { id: 'stu-18', name: 'Ishaan Mukherjee', rollNumber: '21BCE1018', email: 'ishaan.m@student.edu.in', role: 'student', department: 'Data Science' },
  { id: 'stu-19', name: 'Kavya Pillai', rollNumber: '21BCE1019', email: 'kavya.p@student.edu.in', role: 'student', department: 'Computer Science' },
  { id: 'stu-20', name: 'Kunal Bhatia', rollNumber: '21BCE1020', email: 'kunal.b@student.edu.in', role: 'student', department: 'Information Tech' },
  { id: 'stu-21', name: 'Shreya Saxena', rollNumber: '21BCE1021', email: 'shreya.s@student.edu.in', role: 'student', department: 'Computer Science' },
  { id: 'stu-22', name: 'Devendra Patil', rollNumber: '21BCE1022', email: 'devendra.p@student.edu.in', role: 'student', department: 'Data Science' },
  { id: 'stu-23', name: 'Swati Mishra', rollNumber: '21BCE1023', email: 'swati.m@student.edu.in', role: 'student', department: 'Computer Science' },
  { id: 'stu-24', name: 'Pranav Rao', rollNumber: '21BCE1024', email: 'pranav.r@student.edu.in', role: 'student', department: 'Information Tech' },
  { id: 'stu-25', name: 'Ritu Agarwal', rollNumber: '21BCE1025', email: 'ritu.a@student.edu.in', role: 'student', department: 'Computer Science' },
  { id: 'stu-26', name: 'Abhinav Trivedi', rollNumber: '21BCE1026', email: 'abhinav.t@student.edu.in', role: 'student', department: 'Computer Science' },
  { id: 'stu-27', name: 'Simran Kaur', rollNumber: '21BCE1027', email: 'simran.k@student.edu.in', role: 'student', department: 'Data Science' },
  { id: 'stu-28', name: 'Gaurav Yadav', rollNumber: '21BCE1028', email: 'gaurav.y@student.edu.in', role: 'student', department: 'Information Tech' },
  { id: 'stu-29', name: 'Payal Jain', rollNumber: '21BCE1029', email: 'payal.j@student.edu.in', role: 'student', department: 'Computer Science' },
  { id: 'stu-30', name: 'Tejas Solanki', rollNumber: '21BCE1030', email: 'tejas.s@student.edu.in', role: 'student', department: 'Computer Science' },
];

export const INITIAL_ACTIVE_CODE = '842915';

// 20 pre-seeded lectures
export const SEED_LECTURES: Lecture[] = [
  {
    id: 'lec-1',
    facultyId: 'fac-1',
    facultyName: 'Dr. R. K. Sharma',
    subject: 'CS301: Data Structures & Algorithms',
    topic: 'AVL Trees & Self-Balancing Rotations',
    date: '2026-10-30',
    time: '10:00 AM',
    roomCode: INITIAL_ACTIVE_CODE,
    status: 'active',
    attendanceList: [
      { studentId: 'stu-1', name: 'Aarav Patel', rollNumber: '21BCE1001', joinedAt: '10:01 AM' },
      { studentId: 'stu-2', name: 'Rohan Verma', rollNumber: '21BCE1002', joinedAt: '10:02 AM' },
      { studentId: 'stu-3', name: 'Sneha Iyer', rollNumber: '21BCE1003', joinedAt: '10:03 AM' },
      { studentId: 'stu-4', name: 'Diya Sharma', rollNumber: '21BCE1004', joinedAt: '10:04 AM' },
      { studentId: 'stu-5', name: 'Aditya Nair', rollNumber: '21BCE1005', joinedAt: '10:05 AM' },
      { studentId: 'stu-6', name: 'Pooja Deshmukh', rollNumber: '21BCE1006', joinedAt: '10:05 AM' },
      { studentId: 'stu-8', name: 'Ananya Reddy', rollNumber: '21BCE1008', joinedAt: '10:06 AM' },
      { studentId: 'stu-10', name: 'Neha Gupta', rollNumber: '21BCE1010', joinedAt: '10:07 AM' },
      { studentId: 'stu-12', name: 'Tanvi Joshi', rollNumber: '21BCE1012', joinedAt: '10:08 AM' },
      { studentId: 'stu-13', name: 'Arjun Singh', rollNumber: '21BCE1013', joinedAt: '10:09 AM' },
      { studentId: 'stu-16', name: 'Meera Nair', rollNumber: '21BCE1016', joinedAt: '10:10 AM' },
      { studentId: 'stu-17', name: 'Yash Bansal', rollNumber: '21BCE1017', joinedAt: '10:11 AM' },
    ],
    activeQuiz: {
      id: 'quiz-active-1',
      lectureId: 'lec-1',
      question: 'What is the maximum allowed balance factor difference in an AVL Tree node before triggering a rotation?',
      options: [
        { id: 'A', text: '0 (Perfect symmetry only)' },
        { id: 'B', text: '1 (Height difference at most 1)' },
        { id: 'C', text: '2 (Height difference at most 2)' },
        { id: 'D', text: 'Any positive integer' },
      ],
      correctAnswer: 'B',
      explanation: 'In an AVL tree, the balance factor (height of left subtree - height of right subtree) must be -1, 0, or 1.',
      status: 'active',
      createdAt: '10:15 AM',
      responsesCount: { A: 2, B: 18, C: 4, D: 1 },
    },
    avgQuizScore: 72,
  },
  {
    id: 'lec-2',
    facultyId: 'fac-2',
    facultyName: 'Prof. Priya Mehta',
    subject: 'AI501: Machine Learning Foundations',
    topic: 'Gradient Descent Optimization & Learning Rates',
    date: '2026-10-29',
    time: '11:30 AM',
    roomCode: '619240',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 24).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '11:32 AM',
    })),
    avgQuizScore: 84,
  },
  {
    id: 'lec-3',
    facultyId: 'fac-3',
    facultyName: 'Dr. Ananya Sen',
    subject: 'CS402: Operating Systems',
    topic: 'Deadlock Detection & Bankers Algorithm',
    date: '2026-10-29',
    time: '02:00 PM',
    roomCode: '739102',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 22).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '02:05 PM',
    })),
    avgQuizScore: 68,
  },
  {
    id: 'lec-4',
    facultyId: 'fac-1',
    facultyName: 'Dr. R. K. Sharma',
    subject: 'CS301: Data Structures & Algorithms',
    topic: 'Dijkstra and Bellman-Ford Shortest Paths',
    date: '2026-10-28',
    time: '09:00 AM',
    roomCode: '482173',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 27).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '09:03 AM',
    })),
    avgQuizScore: 79,
  },
  {
    id: 'lec-5',
    facultyId: 'fac-4',
    facultyName: 'Prof. Vikram Joshi',
    subject: 'CS405: Computer Networks',
    topic: 'TCP Congestion Control & 3-Way Handshake',
    date: '2026-10-28',
    time: '01:30 PM',
    roomCode: '592810',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 25).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '01:35 PM',
    })),
    avgQuizScore: 74,
  },
  {
    id: 'lec-6',
    facultyId: 'fac-5',
    facultyName: 'Dr. K. Venkataraman',
    subject: 'CS304: Database Systems',
    topic: 'B+ Tree Indexing and Query Execution Plans',
    date: '2026-10-27',
    time: '11:00 AM',
    roomCode: '319842',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 21).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '11:04 AM',
    })),
    avgQuizScore: 65,
  },
  {
    id: 'lec-7',
    facultyId: 'fac-2',
    facultyName: 'Prof. Priya Mehta',
    subject: 'AI501: Machine Learning Foundations',
    topic: 'Overfitting Regularization (L1 Lasso vs L2 Ridge)',
    date: '2026-10-27',
    time: '03:00 PM',
    roomCode: '904128',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 26).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '03:02 PM',
    })),
    avgQuizScore: 88,
  },
  {
    id: 'lec-8',
    facultyId: 'fac-3',
    facultyName: 'Dr. Ananya Sen',
    subject: 'CS402: Operating Systems',
    topic: 'Virtual Memory & Page Replacement (LRU, FIFO)',
    date: '2026-10-26',
    time: '10:00 AM',
    roomCode: '725194',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 20).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '10:06 AM',
    })),
    avgQuizScore: 71,
  },
  {
    id: 'lec-9',
    facultyId: 'fac-1',
    facultyName: 'Dr. R. K. Sharma',
    subject: 'CS301: Data Structures & Algorithms',
    topic: 'Dynamic Programming: Knapsack & Longest Subsequence',
    date: '2026-10-26',
    time: '02:00 PM',
    roomCode: '614920',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 28).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '02:03 PM',
    })),
    avgQuizScore: 82,
  },
  {
    id: 'lec-10',
    facultyId: 'fac-4',
    facultyName: 'Prof. Vikram Joshi',
    subject: 'CS405: Computer Networks',
    topic: 'Subnet Masking and CIDR IP Addressing',
    date: '2026-10-25',
    time: '09:30 AM',
    roomCode: '839215',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 23).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '09:32 AM',
    })),
    avgQuizScore: 63,
  },
  {
    id: 'lec-11',
    facultyId: 'fac-5',
    facultyName: 'Dr. K. Venkataraman',
    subject: 'CS304: Database Systems',
    topic: 'ACID Properties and 2-Phase Locking Protocol',
    date: '2026-10-25',
    time: '01:00 PM',
    roomCode: '429184',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 19).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '01:05 PM',
    })),
    avgQuizScore: 76,
  },
  {
    id: 'lec-12',
    facultyId: 'fac-2',
    facultyName: 'Prof. Priya Mehta',
    subject: 'AI501: Machine Learning Foundations',
    topic: 'Convolutional Neural Networks (CNN) Feature Maps',
    date: '2026-10-24',
    time: '11:00 AM',
    roomCode: '184920',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 25).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '11:02 AM',
    })),
    avgQuizScore: 85,
  },
  {
    id: 'lec-13',
    facultyId: 'fac-1',
    facultyName: 'Dr. R. K. Sharma',
    subject: 'CS301: Data Structures & Algorithms',
    topic: 'Disjoint Set Union & Kruskal Algorithm',
    date: '2026-10-24',
    time: '03:30 PM',
    roomCode: '582910',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 22).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '03:34 AM',
    })),
    avgQuizScore: 78,
  },
  {
    id: 'lec-14',
    facultyId: 'fac-3',
    facultyName: 'Dr. Ananya Sen',
    subject: 'CS402: Operating Systems',
    topic: 'Semaphores & Dining Philosophers Problem',
    date: '2026-10-23',
    time: '10:30 AM',
    roomCode: '912048',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 26).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '10:33 AM',
    })),
    avgQuizScore: 81,
  },
  {
    id: 'lec-15',
    facultyId: 'fac-4',
    facultyName: 'Prof. Vikram Joshi',
    subject: 'CS405: Computer Networks',
    topic: 'DNS Architecture & TLS Encryption Handshake',
    date: '2026-10-23',
    time: '02:00 PM',
    roomCode: '394812',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 24).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '02:04 PM',
    })),
    avgQuizScore: 69,
  },
  {
    id: 'lec-16',
    facultyId: 'fac-5',
    facultyName: 'Dr. K. Venkataraman',
    subject: 'CS304: Database Systems',
    topic: 'Relational Algebra & Normalization up to BCNF',
    date: '2026-10-22',
    time: '11:00 AM',
    roomCode: '682914',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 22).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '11:05 AM',
    })),
    avgQuizScore: 75,
  },
  {
    id: 'lec-17',
    facultyId: 'fac-2',
    facultyName: 'Prof. Priya Mehta',
    subject: 'AI501: Machine Learning Foundations',
    topic: 'Decision Trees, Gini Impurity & Information Gain',
    date: '2026-10-22',
    time: '02:30 PM',
    roomCode: '294819',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 27).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '02:32 PM',
    })),
    avgQuizScore: 89,
  },
  {
    id: 'lec-18',
    facultyId: 'fac-1',
    facultyName: 'Dr. R. K. Sharma',
    subject: 'CS301: Data Structures & Algorithms',
    topic: 'Binary Search Tree Operations & Traversals',
    date: '2026-10-21',
    time: '09:00 AM',
    roomCode: '859102',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 25).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '09:04 AM',
    })),
    avgQuizScore: 77,
  },
  {
    id: 'lec-19',
    facultyId: 'fac-3',
    facultyName: 'Dr. Ananya Sen',
    subject: 'CS402: Operating Systems',
    topic: 'CPU Scheduling Algorithms (Round Robin, SRTF)',
    date: '2026-10-21',
    time: '01:00 PM',
    roomCode: '491023',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 21).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '01:02 PM',
    })),
    avgQuizScore: 83,
  },
  {
    id: 'lec-20',
    facultyId: 'fac-4',
    facultyName: 'Prof. Vikram Joshi',
    subject: 'CS405: Computer Networks',
    topic: 'OSI 7-Layer Reference Model vs TCP/IP Stack',
    date: '2026-10-20',
    time: '11:00 AM',
    roomCode: '102948',
    status: 'completed',
    attendanceList: SEED_STUDENTS.slice(0, 28).map(s => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '',
      joinedAt: '11:03 AM',
    })),
    avgQuizScore: 73,
  },
];

// Pre-seed 50 Quiz Responses across students
export const SEED_QUIZ_RESPONSES: QuizResponse[] = [
  // Student 1 (Aarav Patel - Top Platinum performer)
  { id: 'qr-1', quizId: 'quiz-2', lectureId: 'lec-2', studentId: 'stu-1', studentName: 'Aarav Patel', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-29 11:45' },
  { id: 'qr-2', quizId: 'quiz-3', lectureId: 'lec-3', studentId: 'stu-1', studentName: 'Aarav Patel', selectedOption: 'B', isCorrect: true, timestamp: '2026-10-29 14:20' },
  { id: 'qr-3', quizId: 'quiz-4', lectureId: 'lec-4', studentId: 'stu-1', studentName: 'Aarav Patel', selectedOption: 'C', isCorrect: true, timestamp: '2026-10-28 09:25' },
  { id: 'qr-4', quizId: 'quiz-7', lectureId: 'lec-7', studentId: 'stu-1', studentName: 'Aarav Patel', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-27 15:30' },
  { id: 'qr-5', quizId: 'quiz-9', lectureId: 'lec-9', studentId: 'stu-1', studentName: 'Aarav Patel', selectedOption: 'D', isCorrect: true, timestamp: '2026-10-26 14:35' },
  { id: 'qr-6', quizId: 'quiz-12', lectureId: 'lec-12', studentId: 'stu-1', studentName: 'Aarav Patel', selectedOption: 'B', isCorrect: true, timestamp: '2026-10-24 11:25' },

  // Student 2 (Rohan Verma - Platinum)
  { id: 'qr-7', quizId: 'quiz-2', lectureId: 'lec-2', studentId: 'stu-2', studentName: 'Rohan Verma', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-29 11:45' },
  { id: 'qr-8', quizId: 'quiz-3', lectureId: 'lec-3', studentId: 'stu-2', studentName: 'Rohan Verma', selectedOption: 'B', isCorrect: true, timestamp: '2026-10-29 14:20' },
  { id: 'qr-9', quizId: 'quiz-4', lectureId: 'lec-4', studentId: 'stu-2', studentName: 'Rohan Verma', selectedOption: 'A', isCorrect: false, timestamp: '2026-10-28 09:25' },
  { id: 'qr-10', quizId: 'quiz-7', lectureId: 'lec-7', studentId: 'stu-2', studentName: 'Rohan Verma', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-27 15:30' },
  { id: 'qr-11', quizId: 'quiz-9', lectureId: 'lec-9', studentId: 'stu-2', studentName: 'Rohan Verma', selectedOption: 'D', isCorrect: true, timestamp: '2026-10-26 14:35' },

  // Student 3 (Sneha Iyer - Platinum)
  { id: 'qr-12', quizId: 'quiz-2', lectureId: 'lec-2', studentId: 'stu-3', studentName: 'Sneha Iyer', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-29 11:45' },
  { id: 'qr-13', quizId: 'quiz-3', lectureId: 'lec-3', studentId: 'stu-3', studentName: 'Sneha Iyer', selectedOption: 'B', isCorrect: true, timestamp: '2026-10-29 14:20' },
  { id: 'qr-14', quizId: 'quiz-4', lectureId: 'lec-4', studentId: 'stu-3', studentName: 'Sneha Iyer', selectedOption: 'C', isCorrect: true, timestamp: '2026-10-28 09:25' },
  { id: 'qr-15', quizId: 'quiz-7', lectureId: 'lec-7', studentId: 'stu-3', studentName: 'Sneha Iyer', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-27 15:30' },
  { id: 'qr-16', quizId: 'quiz-14', lectureId: 'lec-14', studentId: 'stu-3', studentName: 'Sneha Iyer', selectedOption: 'C', isCorrect: true, timestamp: '2026-10-23 10:50' },

  // Student 4 (Diya Sharma - Gold)
  { id: 'qr-17', quizId: 'quiz-2', lectureId: 'lec-2', studentId: 'stu-4', studentName: 'Diya Sharma', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-29 11:45' },
  { id: 'qr-18', quizId: 'quiz-3', lectureId: 'lec-3', studentId: 'stu-4', studentName: 'Diya Sharma', selectedOption: 'C', isCorrect: false, timestamp: '2026-10-29 14:20' },
  { id: 'qr-19', quizId: 'quiz-5', lectureId: 'lec-5', studentId: 'stu-4', studentName: 'Diya Sharma', selectedOption: 'B', isCorrect: true, timestamp: '2026-10-28 13:50' },
  { id: 'qr-20', quizId: 'quiz-7', lectureId: 'lec-7', studentId: 'stu-4', studentName: 'Diya Sharma', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-27 15:30' },

  // Student 5 (Aditya Nair - Gold)
  { id: 'qr-21', quizId: 'quiz-2', lectureId: 'lec-2', studentId: 'stu-5', studentName: 'Aditya Nair', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-29 11:45' },
  { id: 'qr-22', quizId: 'quiz-4', lectureId: 'lec-4', studentId: 'stu-5', studentName: 'Aditya Nair', selectedOption: 'B', isCorrect: false, timestamp: '2026-10-28 09:25' },
  { id: 'qr-23', quizId: 'quiz-6', lectureId: 'lec-6', studentId: 'stu-5', studentName: 'Aditya Nair', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-27 11:20' },
  { id: 'qr-24', quizId: 'quiz-8', lectureId: 'lec-8', studentId: 'stu-5', studentName: 'Aditya Nair', selectedOption: 'C', isCorrect: true, timestamp: '2026-10-26 10:25' },

  // Student 6 (Pooja Deshmukh - Gold)
  { id: 'qr-25', quizId: 'quiz-2', lectureId: 'lec-2', studentId: 'stu-6', studentName: 'Pooja Deshmukh', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-29 11:45' },
  { id: 'qr-26', quizId: 'quiz-7', lectureId: 'lec-7', studentId: 'stu-6', studentName: 'Pooja Deshmukh', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-27 15:30' },
  { id: 'qr-27', quizId: 'quiz-9', lectureId: 'lec-9', studentId: 'stu-6', studentName: 'Pooja Deshmukh', selectedOption: 'B', isCorrect: false, timestamp: '2026-10-26 14:35' },
  { id: 'qr-28', quizId: 'quiz-11', lectureId: 'lec-11', studentId: 'stu-6', studentName: 'Pooja Deshmukh', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-25 13:20' },

  // Student 7 (Rahul Kulkarni - Silver)
  { id: 'qr-29', quizId: 'quiz-2', lectureId: 'lec-2', studentId: 'stu-7', studentName: 'Rahul Kulkarni', selectedOption: 'C', isCorrect: false, timestamp: '2026-10-29 11:45' },
  { id: 'qr-30', quizId: 'quiz-3', lectureId: 'lec-3', studentId: 'stu-7', studentName: 'Rahul Kulkarni', selectedOption: 'B', isCorrect: true, timestamp: '2026-10-29 14:20' },
  { id: 'qr-31', quizId: 'quiz-5', lectureId: 'lec-5', studentId: 'stu-7', studentName: 'Rahul Kulkarni', selectedOption: 'D', isCorrect: false, timestamp: '2026-10-28 13:50' },
  { id: 'qr-32', quizId: 'quiz-10', lectureId: 'lec-10', studentId: 'stu-7', studentName: 'Rahul Kulkarni', selectedOption: 'B', isCorrect: true, timestamp: '2026-10-25 09:50' },

  // Student 8 (Ananya Reddy - Gold)
  { id: 'qr-33', quizId: 'quiz-2', lectureId: 'lec-2', studentId: 'stu-8', studentName: 'Ananya Reddy', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-29 11:45' },
  { id: 'qr-34', quizId: 'quiz-4', lectureId: 'lec-4', studentId: 'stu-8', studentName: 'Ananya Reddy', selectedOption: 'C', isCorrect: true, timestamp: '2026-10-28 09:25' },
  { id: 'qr-35', quizId: 'quiz-7', lectureId: 'lec-7', studentId: 'stu-8', studentName: 'Ananya Reddy', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-27 15:30' },

  // Student 9 (Karthik Raman - Silver)
  { id: 'qr-36', quizId: 'quiz-3', lectureId: 'lec-3', studentId: 'stu-9', studentName: 'Karthik Raman', selectedOption: 'A', isCorrect: false, timestamp: '2026-10-29 14:20' },
  { id: 'qr-37', quizId: 'quiz-5', lectureId: 'lec-5', studentId: 'stu-9', studentName: 'Karthik Raman', selectedOption: 'B', isCorrect: true, timestamp: '2026-10-28 13:50' },
  { id: 'qr-38', quizId: 'quiz-10', lectureId: 'lec-10', studentId: 'stu-9', studentName: 'Karthik Raman', selectedOption: 'A', isCorrect: false, timestamp: '2026-10-25 09:50' },

  // Student 10 (Neha Gupta - Platinum)
  { id: 'qr-39', quizId: 'quiz-2', lectureId: 'lec-2', studentId: 'stu-10', studentName: 'Neha Gupta', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-29 11:45' },
  { id: 'qr-40', quizId: 'quiz-4', lectureId: 'lec-4', studentId: 'stu-10', studentName: 'Neha Gupta', selectedOption: 'C', isCorrect: true, timestamp: '2026-10-28 09:25' },
  { id: 'qr-41', quizId: 'quiz-8', lectureId: 'lec-8', studentId: 'stu-10', studentName: 'Neha Gupta', selectedOption: 'C', isCorrect: true, timestamp: '2026-10-26 10:25' },
  { id: 'qr-42', quizId: 'quiz-12', lectureId: 'lec-12', studentId: 'stu-10', studentName: 'Neha Gupta', selectedOption: 'B', isCorrect: true, timestamp: '2026-10-24 11:25' },

  // More responses for remaining students (Bronze / Silver / Gold representation)
  { id: 'qr-43', quizId: 'quiz-2', lectureId: 'lec-2', studentId: 'stu-11', studentName: 'Siddharth Mehta', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-29 11:45' },
  { id: 'qr-44', quizId: 'quiz-6', lectureId: 'lec-6', studentId: 'stu-12', studentName: 'Tanvi Joshi', selectedOption: 'C', isCorrect: false, timestamp: '2026-10-27 11:20' },
  { id: 'qr-45', quizId: 'quiz-7', lectureId: 'lec-7', studentId: 'stu-13', studentName: 'Arjun Singh', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-27 15:30' },
  { id: 'qr-46', quizId: 'quiz-8', lectureId: 'lec-8', studentId: 'stu-14', studentName: 'Riya Sengupta', selectedOption: 'B', isCorrect: false, timestamp: '2026-10-26 10:25' },
  { id: 'qr-47', quizId: 'quiz-10', lectureId: 'lec-10', studentId: 'stu-15', studentName: 'Varun Chopra', selectedOption: 'D', isCorrect: false, timestamp: '2026-10-25 09:50' },
  { id: 'qr-48', quizId: 'quiz-13', lectureId: 'lec-13', studentId: 'stu-16', studentName: 'Meera Nair', selectedOption: 'A', isCorrect: true, timestamp: '2026-10-24 15:40' },
  { id: 'qr-49', quizId: 'quiz-15', lectureId: 'lec-15', studentId: 'stu-17', studentName: 'Yash Bansal', selectedOption: 'C', isCorrect: false, timestamp: '2026-10-23 14:15' },
  { id: 'qr-50', quizId: 'quiz-16', lectureId: 'lec-16', studentId: 'stu-18', studentName: 'Ishaan Mukherjee', selectedOption: 'B', isCorrect: true, timestamp: '2026-10-22 11:20' },
];

// Calculation of student aggregated stats based on attendance & responses
export const calculateAllStudentStats = (
  students: User[],
  lectures: Lecture[],
  responses: QuizResponse[]
): StudentStats[] => {
  return students.map((stu) => {
    // Attendance count
    const lecturesAttended = lectures.filter((lec) =>
      lec.attendanceList.some((a) => a.studentId === stu.id)
    ).length;

    // Quizzes taken
    const studentResponses = responses.filter((r) => r.studentId === stu.id);
    const quizzesTaken = studentResponses.length;
    const correctAnswers = studentResponses.filter((r) => r.isCorrect).length;

    // Calculate baseline score with high variability across 30 students for realistic PBL ranks
    // Aarav, Rohan, Sneha, Neha, Riya, Ananya have higher base rates
    let avgScore = 0;
    if (quizzesTaken > 0) {
      avgScore = Math.round((correctAnswers / quizzesTaken) * 100);
    } else {
      // Deterministic synthetic baseline for demonstration if student hasn't taken active quiz
      const hash = stu.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      avgScore = 35 + (hash % 58); // yields scores from 35 to 93
    }

    const tier = calculateTier(avgScore);

    return {
      studentId: stu.id,
      studentName: stu.name,
      rollNumber: stu.rollNumber || 'N/A',
      department: stu.department || 'Computer Science',
      lecturesAttended: Math.max(lecturesAttended, 5 + (stu.name.length % 12)),
      quizzesTaken: Math.max(quizzesTaken, 3 + (stu.name.length % 8)),
      correctAnswers: Math.round((avgScore / 100) * Math.max(quizzesTaken, 5)),
      avgScore,
      tier,
    };
  }).sort((a, b) => b.avgScore - a.avgScore);
};
