import React, { useState, useEffect } from 'react';
import { User, Lecture } from '../../types/index.ts';
import { getLectures } from '../../services/storage.ts';
import {
  BookOpen,
  Search,
  Calendar,
  Users,
  Award,
  ChevronRight,
  Filter,
  CheckCircle,
} from 'lucide-react';

interface LectureLogProps {
  currentUser: User;
}

export const LectureLog: React.FC<LectureLogProps> = ({ currentUser }) => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

  const loadData = () => {
    setLectures(getLectures());
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

  const subjects = ['all', ...Array.from(new Set(lectures.map((l) => l.subject)))];

  const filteredLectures = lectures.filter((l) => {
    const matchesSearch =
      l.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.roomCode.includes(searchQuery);
    const matchesSubject = selectedSubject === 'all' || l.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const totalSessions = lectures.length;
  const avgAttendance =
    totalSessions > 0
      ? Math.round(
          lectures.reduce((acc, l) => acc + l.attendanceList.length, 0) / totalSessions
        )
      : 0;
  const validScores = lectures.filter((l) => l.avgQuizScore !== undefined);
  const overallAvgScore =
    validScores.length > 0
      ? Math.round(
          validScores.reduce((acc, l) => acc + (l.avgQuizScore || 0), 0) / validScores.length
        )
      : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#1E2761] tracking-tight">Lecture Log Archive</h2>
        <p className="text-sm text-slate-500 mt-1">
          Historical log of classroom sessions, verified student attendance counts, and concept quiz averages.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Sessions</span>
            <BookOpen className="w-4 h-4 text-[#3498DB]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#1E2761] mt-2">
            {totalSessions}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Logged across semesters</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Avg Attendance</span>
            <Users className="w-4 h-4 text-[#2ECC71]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#1E2761] mt-2">
            {avgAttendance} <span className="text-sm font-normal text-slate-400">/ 30</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            {Math.round((avgAttendance / 30) * 100)}% Average Participation
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Avg Quiz Score</span>
            <Award className="w-4 h-4 text-[#F39C12]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#1E2761] mt-2">
            {overallAvgScore}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Classroom concept retention</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic, subject or room code..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#3498DB] focus:border-[#3498DB] outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full sm:w-auto text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-hidden font-medium"
          >
            <option value="all">All Courses / Subjects</option>
            {subjects.filter((s) => s !== 'all').map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Subject & Topic</th>
                <th className="px-6 py-3.5">Room Code</th>
                <th className="px-6 py-3.5 text-center">Attendance</th>
                <th className="px-6 py-3.5 text-center">Avg Quiz Score</th>
                <th className="px-6 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLectures.map((lec) => {
                const score = lec.avgQuizScore ?? 75;
                const scoreColor =
                  score >= 80
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : score >= 60
                    ? 'text-amber-700 bg-amber-50 border-amber-200'
                    : 'text-rose-700 bg-rose-50 border-rose-200';

                return (
                  <tr
                    key={lec.id}
                    onClick={() => setSelectedLecture(lec)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-mono">
                      {lec.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 text-sm">{lec.topic}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{lec.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-[#1E2761]">
                        {lec.roomCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap font-mono">
                      <span className="font-semibold text-slate-800">{lec.attendanceList.length}</span>
                      <span className="text-slate-400 text-[10px]"> / 30</span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block font-mono font-bold text-xs px-2.5 py-0.5 rounded border ${scoreColor}`}
                      >
                        {score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedLecture && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                  Session Log #{selectedLecture.roomCode}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedLecture.topic}</h3>
                <p className="text-xs text-slate-500">{selectedLecture.subject} • {selectedLecture.date}</p>
              </div>
              <button
                onClick={() => setSelectedLecture(null)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 uppercase font-semibold">Attendance Logged</div>
                <div className="text-xl font-bold font-mono text-[#1E2761]">
                  {selectedLecture.attendanceList.length} Students
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 uppercase font-semibold">Avg Quiz Score</div>
                <div className="text-xl font-bold font-mono text-[#2ECC71]">
                  {selectedLecture.avgQuizScore ?? 75}%
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Attendees Roster ({selectedLecture.attendanceList.length})
              </h4>
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                {selectedLecture.attendanceList.map((stu, i) => (
                  <div key={stu.studentId} className="px-3 py-2 flex items-center justify-between">
                    <span className="font-medium text-slate-800">{i + 1}. {stu.name}</span>
                    <span className="font-mono text-slate-500 text-[11px]">{stu.rollNumber} ({stu.joinedAt})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedLecture(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
