import React, { useState, useEffect } from 'react';
import { User, Lecture, AttendanceStudent } from '../../types/index.ts';
import {
  getLectures,
  updateLecture,
  getStudentsList,
  addAttendanceToLecture,
} from '../../services/storage.ts';
import {
  QrCode,
  Copy,
  Check,
  UserPlus,
  Users,
  Search,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface TakeAttendanceProps {
  currentUser: User;
  onNavigateToQuiz: () => void;
}

export const TakeAttendance: React.FC<TakeAttendanceProps> = ({
  currentUser,
  onNavigateToQuiz,
}) => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedLectureId, setSelectedLectureId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastJoinedNotification, setLastJoinedNotification] = useState<string | null>(null);

  // Load lectures
  const loadData = () => {
    const all = getLectures();
    // prioritize lectures for this faculty, or all active
    const active = all.filter((l) => l.status === 'active');
    setLectures(all);

    if (active.length > 0 && !selectedLectureId) {
      setSelectedLectureId(active[0].id);
    } else if (all.length > 0 && !selectedLectureId) {
      setSelectedLectureId(all[0].id);
    }
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('unigrow_storage_change', handleStorageChange);
    return () => {
      window.removeEventListener('unigrow_storage_change', handleStorageChange);
    };
  }, []);

  const currentLecture = lectures.find((l) => l.id === selectedLectureId) || lectures[0];
  const allStudents = getStudentsList();

  const handleCopyCode = () => {
    if (!currentLecture) return;
    navigator.clipboard.writeText(currentLecture.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate a student joining the room live
  const handleSimulateStudentJoin = () => {
    if (!currentLecture) return;

    // find students not yet joined
    const joinedIds = new Set(currentLecture.attendanceList.map((a) => a.studentId));
    const unjoined = allStudents.filter((s) => !joinedIds.has(s.id));

    if (unjoined.length === 0) {
      alert('All 30 enrolled students have already joined this session!');
      return;
    }

    const randomStudent = unjoined[Math.floor(Math.random() * unjoined.length)];
    addAttendanceToLecture(currentLecture.id, {
      studentId: randomStudent.id,
      name: randomStudent.name,
      rollNumber: randomStudent.rollNumber || '21BCE0000',
    });

    setLastJoinedNotification(`${randomStudent.name} (${randomStudent.rollNumber}) just joined!`);
    setTimeout(() => setLastJoinedNotification(null), 3000);
  };

  // Mark all enrolled present
  const handleMarkAllPresent = () => {
    if (!currentLecture) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedList: AttendanceStudent[] = allStudents.map((s) => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber || '21BCE0000',
      joinedAt: timeStr,
    }));

    const updatedLec = {
      ...currentLecture,
      attendanceList: updatedList,
    };
    updateLecture(updatedLec);
    setLastJoinedNotification('All 30 enrolled students marked present!');
    setTimeout(() => setLastJoinedNotification(null), 3000);
  };

  if (!currentLecture) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-slate-800">No Active Lectures</h3>
        <p className="text-sm text-slate-500 mt-1">Please create a lecture to start taking attendance.</p>
      </div>
    );
  }

  const attendanceCount = currentLecture.attendanceList.length;
  const totalEnrolled = allStudents.length;
  const attendanceRate = Math.round((attendanceCount / totalEnrolled) * 100);

  const filteredAttendance = currentLecture.attendanceList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast alert for live join */}
      {lastJoinedNotification && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-200" />
            <span>{lastJoinedNotification}</span>
          </div>
          <span className="text-[10px] text-emerald-200">Real-time attendance updated</span>
        </div>
      )}

      {/* Top Banner / Session Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Active Session
            </span>
            <span className="text-xs text-slate-500">{currentLecture.date}</span>
          </div>
          <h2 className="text-xl font-bold text-[#1E2761] mt-1">{currentLecture.subject}</h2>
          <p className="text-sm text-slate-600">{currentLecture.topic}</p>
        </div>

        {/* Lecture dropdown if multiple */}
        <div className="flex items-center gap-2">
          <select
            value={selectedLectureId}
            onChange={(e) => setSelectedLectureId(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-hidden"
          >
            {lectures.map((l) => (
              <option key={l.id} value={l.id}>
                {l.subject.split(':')[0]} - {l.topic.slice(0, 24)} ({l.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero 6-Digit Room Code Card & Live Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Code Display */}
        <div className="lg:col-span-1 bg-gradient-to-br from-[#1E2761] to-[#141A42] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Room Access Code</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Broadcasting
              </span>
            </div>

            <p className="text-xs text-blue-100/80 mb-4">
              Share this 6-digit code with students in the hall or on the projector:
            </p>

            <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-center backdrop-blur-xs relative group">
              <div className="text-4xl sm:text-5xl font-mono font-extrabold tracking-widest text-white drop-shadow-sm select-all">
                {currentLecture.roomCode}
              </div>

              <button
                onClick={handleCopyCode}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-[#3498DB] hover:bg-[#2980B9] text-white rounded-md transition-colors shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Code Copied!' : 'Copy Room Code'}</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-blue-200/90">
            <div className="flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-[#3498DB]" />
              <span>Smart QR Ready</span>
            </div>
            <button
              onClick={onNavigateToQuiz}
              className="text-white hover:text-[#3498DB] font-semibold underline underline-offset-2 transition-colors"
            >
              Broadcast Quiz →
            </button>
          </div>
        </div>

        {/* Live Attendance Counter & Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1E2761]">Live Classroom Roster</h3>
                <p className="text-xs text-slate-500">Students actively registered in this session</p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold font-mono tabular-nums text-[#1E2761]">
                  {attendanceCount} <span className="text-sm font-normal text-slate-400">/ {totalEnrolled}</span>
                </div>
                <div className="text-xs font-semibold text-emerald-600">
                  {attendanceRate}% Present
                </div>
              </div>
            </div>

            {/* Attendance Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6 overflow-hidden">
              <div
                className="bg-[#2ECC71] h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${attendanceRate}%` }}
              />
            </div>

            {/* Interactive Demo simulation tools */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#3498DB]" />
                Demo Controls:
              </span>
              <button
                type="button"
                onClick={handleSimulateStudentJoin}
                className="px-3 py-1.5 text-xs font-semibold bg-[#1E2761] hover:bg-[#2A3680] text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#3498DB]" />
                Simulate 1 Student Join
              </button>
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg transition-colors"
              >
                Mark All 30 Present
              </button>
            </div>
          </div>

          {/* Quick search input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search joined students by name or roll number..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#3498DB] focus:border-[#3498DB] outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Joined Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#1E2761]" />
            <h4 className="text-sm font-bold text-slate-800">
              Joined Attendance Sheet ({filteredAttendance.length})
            </h4>
          </div>
          <span className="text-xs text-slate-400">Auto-saved to college ledger</span>
        </div>

        {filteredAttendance.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium">No students have joined yet.</p>
            <p className="text-xs text-slate-400 mt-1">
              Ask students to enter code <span className="font-mono font-bold text-[#1E2761]">{currentLecture.roomCode}</span> or click &quot;Simulate 1 Student Join&quot; above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Roll Number</th>
                  <th className="px-6 py-3">Joined Timestamp</th>
                  <th className="px-6 py-3 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAttendance.map((student, idx) => (
                  <tr key={student.studentId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="px-6 py-3 font-semibold text-slate-800 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                        {student.name[0]}
                      </div>
                      <span>{student.name}</span>
                    </td>
                    <td className="px-6 py-3 font-mono text-slate-600">{student.rollNumber}</td>
                    <td className="px-6 py-3 text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{student.joinedAt}</span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Check className="w-3 h-3" />
                        Present
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
