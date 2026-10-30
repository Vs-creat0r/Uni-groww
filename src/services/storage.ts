import { User, Lecture, QuizResponse, Quiz, AttendanceStudent, StudentStats, calculateTier } from '../types/index.ts';
import {
  SEED_FACULTY,
  SEED_STUDENTS,
  SEED_ADMIN,
  SEED_LECTURES,
  SEED_QUIZ_RESPONSES,
  calculateAllStudentStats,
} from '../data/seedData.ts';

const KEYS = {
  FACULTY: 'unigrow_faculty_v1',
  STUDENTS: 'unigrow_students_v1',
  ADMIN: 'unigrow_admin_v1',
  LECTURES: 'unigrow_lectures_v1',
  RESPONSES: 'unigrow_responses_v1',
  CURRENT_USER: 'unigrow_current_user_v1',
};

export const initStorage = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(KEYS.FACULTY)) {
    localStorage.setItem(KEYS.FACULTY, JSON.stringify(SEED_FACULTY));
  }
  if (!localStorage.getItem(KEYS.STUDENTS)) {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(SEED_STUDENTS));
  }
  if (!localStorage.getItem(KEYS.ADMIN)) {
    localStorage.setItem(KEYS.ADMIN, JSON.stringify(SEED_ADMIN));
  }
  if (!localStorage.getItem(KEYS.LECTURES)) {
    localStorage.setItem(KEYS.LECTURES, JSON.stringify(SEED_LECTURES));
  }
  if (!localStorage.getItem(KEYS.RESPONSES)) {
    localStorage.setItem(KEYS.RESPONSES, JSON.stringify(SEED_QUIZ_RESPONSES));
  }
};

export const resetToSeedData = () => {
  localStorage.setItem(KEYS.FACULTY, JSON.stringify(SEED_FACULTY));
  localStorage.setItem(KEYS.STUDENTS, JSON.stringify(SEED_STUDENTS));
  localStorage.setItem(KEYS.ADMIN, JSON.stringify(SEED_ADMIN));
  localStorage.setItem(KEYS.LECTURES, JSON.stringify(SEED_LECTURES));
  localStorage.setItem(KEYS.RESPONSES, JSON.stringify(SEED_QUIZ_RESPONSES));
  notifyChange();
};

const notifyChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('unigrow_storage_change'));
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: User | null) => {
  if (!user) {
    localStorage.removeItem(KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  }
  notifyChange();
};

export const getFacultyList = (): User[] => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.FACULTY) || '[]') || SEED_FACULTY;
  } catch {
    return SEED_FACULTY;
  }
};

export const getStudentsList = (): User[] => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]') || SEED_STUDENTS;
  } catch {
    return SEED_STUDENTS;
  }
};

export const getAdminUser = (): User => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.ADMIN) || 'null') || SEED_ADMIN;
  } catch {
    return SEED_ADMIN;
  }
};

export const getLectures = (): Lecture[] => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.LECTURES) || '[]') || SEED_LECTURES;
  } catch {
    return SEED_LECTURES;
  }
};

export const saveLecture = (newLecture: Lecture) => {
  const lectures = getLectures();
  lectures.unshift(newLecture);
  localStorage.setItem(KEYS.LECTURES, JSON.stringify(lectures));
  notifyChange();
};

export const updateLecture = (updated: Lecture) => {
  const lectures = getLectures().map((l) => (l.id === updated.id ? updated : l));
  localStorage.setItem(KEYS.LECTURES, JSON.stringify(lectures));
  notifyChange();
};

export const getLectureByRoomCode = (roomCode: string): Lecture | undefined => {
  const lectures = getLectures();
  return lectures.find((l) => l.roomCode.trim() === roomCode.trim() && l.status === 'active');
};

export const addAttendanceToLecture = (
  lectureId: string,
  student: { studentId: string; name: string; rollNumber: string }
): boolean => {
  const lectures = getLectures();
  const lecture = lectures.find((l) => l.id === lectureId);
  if (!lecture) return false;

  const alreadyJoined = lecture.attendanceList.some((s) => s.studentId === student.studentId);
  if (!alreadyJoined) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const record: AttendanceStudent = {
      studentId: student.studentId,
      name: student.name,
      rollNumber: student.rollNumber,
      joinedAt: timeStr,
    };
    lecture.attendanceList.push(record);
    localStorage.setItem(KEYS.LECTURES, JSON.stringify(lectures));
    notifyChange();
    return true;
  }
  return false;
};

export const getQuizResponses = (): QuizResponse[] => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.RESPONSES) || '[]') || SEED_QUIZ_RESPONSES;
  } catch {
    return SEED_QUIZ_RESPONSES;
  }
};

export const saveQuizResponse = (response: QuizResponse) => {
  const responses = getQuizResponses();
  // check if student already answered this quiz
  const exists = responses.findIndex(
    (r) => r.quizId === response.quizId && r.studentId === response.studentId
  );
  if (exists >= 0) {
    responses[exists] = response;
  } else {
    responses.push(response);
  }
  localStorage.setItem(KEYS.RESPONSES, JSON.stringify(responses));

  // Also update lecture's activeQuiz responsesCount and avg score
  const lectures = getLectures();
  const lec = lectures.find((l) => l.id === response.lectureId);
  if (lec && lec.activeQuiz && lec.activeQuiz.id === response.quizId) {
    if (!lec.activeQuiz.responsesCount) {
      lec.activeQuiz.responsesCount = { A: 0, B: 0, C: 0, D: 0 };
    }
    lec.activeQuiz.responsesCount[response.selectedOption] =
      (lec.activeQuiz.responsesCount[response.selectedOption] || 0) + 1;

    // recalculate avg score
    const quizResps = responses.filter((r) => r.quizId === response.quizId);
    const correctCount = quizResps.filter((r) => r.isCorrect).length;
    lec.avgQuizScore = Math.round((correctCount / quizResps.length) * 100);

    localStorage.setItem(KEYS.LECTURES, JSON.stringify(lectures));
  }

  notifyChange();
};

export const setLectureActiveQuiz = (lectureId: string, quiz: Quiz) => {
  const lectures = getLectures();
  const lecture = lectures.find((l) => l.id === lectureId);
  if (lecture) {
    lecture.activeQuiz = quiz;
    localStorage.setItem(KEYS.LECTURES, JSON.stringify(lectures));
    notifyChange();
  }
};

export const getStudentPerformanceStats = (studentId: string): StudentStats => {
  const students = getStudentsList();
  const lectures = getLectures();
  const responses = getQuizResponses();
  const allStats = calculateAllStudentStats(students, lectures, responses);
  const found = allStats.find((s) => s.studentId === studentId);
  if (found) return found;

  const stu = students.find((s) => s.id === studentId);
  return {
    studentId,
    studentName: stu?.name || 'Student',
    rollNumber: stu?.rollNumber || '21BCE0000',
    department: stu?.department || 'Computer Science',
    lecturesAttended: 0,
    quizzesTaken: 0,
    correctAnswers: 0,
    avgScore: 0,
    tier: calculateTier(0),
  };
};

export const getAllLeaderboard = (): StudentStats[] => {
  const students = getStudentsList();
  const lectures = getLectures();
  const responses = getQuizResponses();
  return calculateAllStudentStats(students, lectures, responses);
};
