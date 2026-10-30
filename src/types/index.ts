export type Role = 'faculty' | 'student' | 'admin';

export type Tier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  rollNumber?: string;
  avatar?: string;
}

export interface QuizOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Quiz {
  id: string;
  lectureId: string;
  question: string;
  options: QuizOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  status: 'draft' | 'active' | 'closed';
  createdAt: string;
  responsesCount?: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
}

export interface QuizResponse {
  id: string;
  quizId: string;
  lectureId: string;
  studentId: string;
  studentName: string;
  selectedOption: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  timestamp: string;
}

export interface AttendanceStudent {
  studentId: string;
  name: string;
  rollNumber: string;
  joinedAt: string;
}

export interface Lecture {
  id: string;
  facultyId: string;
  facultyName: string;
  subject: string;
  topic: string;
  date: string; // YYYY-MM-DD
  time?: string;
  roomCode: string; // 6-digit code
  status: 'active' | 'completed';
  attendanceList: AttendanceStudent[];
  activeQuiz?: Quiz;
  avgQuizScore?: number;
}

export interface StudentStats {
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  lecturesAttended: number;
  quizzesTaken: number;
  correctAnswers: number;
  avgScore: number; // 0 - 100
  tier: Tier;
}

export const calculateTier = (score: number): Tier => {
  if (score >= 80) return 'Platinum';
  if (score >= 60) return 'Gold';
  if (score >= 40) return 'Silver';
  return 'Bronze';
};
