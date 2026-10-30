import React, { useState, useEffect } from 'react';
import { User, Lecture } from '../../types/index.ts';
import {
  getFacultyList,
  getStudentsList,
  getLectures,
  getQuizResponses,
  resetToSeedData,
} from '../../services/storage.ts';
import {
  Users,
  GraduationCap,
  BookOpen,
  HelpCircle,
  FileDown,
  BarChart2,
  Calendar,
  CheckCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  currentTab: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, currentTab }) => {
  const [faculty, setFaculty] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);

  const loadData = () => {
    setFaculty(getFacultyList());
    setStudents(getStudentsList());
    setLectures(getLectures());
    setResponses(getQuizResponses());
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

  // Compute 7-day activity data
  const getLast7DaysData = () => {
    const days: { date: string; displayDate: string; count: number; avgAttendance: number }[] = [];
    const today = new Date('2026-10-30'); // Anchor to current context date

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const displayStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      const dayLectures = lectures.filter((l) => l.date === dateStr);
      const totalAtt = dayLectures.reduce((acc, l) => acc + l.attendanceList.length, 0);
      const avgAtt = dayLectures.length > 0 ? Math.round(totalAtt / dayLectures.length) : 0;

      days.push({
        date: dateStr,
        displayDate: displayStr,
        count: dayLectures.length,
        avgAttendance: avgAtt,
      });
    }

    return days;
  };

  const activityData = getLast7DaysData();
  const maxLectureCount = Math.max(...activityData.map((d) => d.count), 4);

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = [
      'Lecture ID',
      'Date',
      'Subject',
      'Topic',
      'Faculty Name',
      'Room Code',
      'Status',
      'Attendance Count',
      'Average Quiz Score (%)',
    ];

    const rows = lectures.map((l) => [
      `"${l.id}"`,
      `"${l.date}"`,
      `"${l.subject.replace(/"/g, '""')}"`,
      `"${l.topic.replace(/"/g, '""')}"`,
      `"${l.facultyName.replace(/"/g, '""')}"`,
      `"${l.roomCode}"`,
      `"${l.status}"`,
      l.attendanceList.length,
      l.avgQuizScore ?? 'N/A',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UniGrow_Lecture_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2761] tracking-tight">University Administration Portal</h2>
          <p className="text-sm text-slate-500 mt-1">
            Aggregated institutional analytics across departments, faculty engagement, and PBL lecture sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-[#1E2761] hover:bg-[#2A3680] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <FileDown className="w-4 h-4 text-[#3498DB]" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* 4 Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Faculty */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Faculty</span>
            <div className="p-2 bg-blue-50 text-[#3498DB] rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-mono text-[#1E2761]">
              {faculty.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">5 Professors active</p>
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Students</span>
            <div className="p-2 bg-emerald-50 text-[#2ECC71] rounded-xl">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-mono text-[#1E2761]">
              {students.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">30 Enrolled in PBL</p>
          </div>
        </div>

        {/* Total Lectures */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Lectures</span>
            <div className="p-2 bg-amber-50 text-[#F39C12] rounded-xl">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-mono text-[#1E2761]">
              {lectures.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">20 Sessions recorded</p>
          </div>
        </div>

        {/* Total Quizzes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Quiz Responses</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-mono text-[#1E2761]">
              {responses.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">50+ Votes collected</p>
          </div>
        </div>
      </div>

      {/* Lecture Activity Chart (Last 7 Days) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#3498DB]" />
              <h3 className="text-base font-bold text-slate-900">Lecture Activity Chart (Last 7 Days)</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily frequency of conducted lectures and average student attendance
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-3 h-3 bg-[#1E2761] rounded-sm"></span>
              Lectures Held
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-3 h-3 bg-[#3498DB] rounded-sm"></span>
              Avg Attendance Rate
            </span>
          </div>
        </div>

        {/* SVG/HTML Bar Chart with Tooltips */}
        <div className="pt-4">
          <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end h-64 border-b border-slate-200 pb-2">
            {activityData.map((d, index) => {
              const heightPct = Math.max((d.count / maxLectureCount) * 100, 15);
              const isHovered = activeDayIndex === index;

              return (
                <div
                  key={d.date}
                  onMouseEnter={() => setActiveDayIndex(index)}
                  onMouseLeave={() => setActiveDayIndex(null)}
                  className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap text-center animate-fade-in pointer-events-none">
                      <div className="font-bold">{d.displayDate}</div>
                      <div className="text-slate-300">
                        {d.count} {d.count === 1 ? 'lecture' : 'lectures'} • {d.avgAttendance}/30 students
                      </div>
                    </div>
                  )}

                  {/* Value label on top of bar */}
                  <span className="text-[11px] font-mono font-bold text-slate-600 mb-1.5">
                    {d.count}
                  </span>

                  {/* The Bar */}
                  <div
                    className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                      isHovered
                        ? 'bg-[#3498DB] shadow-md scale-y-105'
                        : 'bg-[#1E2761] hover:bg-[#2A3680]'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />

                  {/* Date label under bar */}
                  <span className="text-[11px] font-medium text-slate-500 mt-2 truncate w-full text-center">
                    {d.displayDate.split(',')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2">
          <span>Consistent daily activity recorded across engineering departments.</span>
          <span className="font-semibold text-slate-700">Peak Volume: Oct 26-29 (Mid-term PBL sprints)</span>
        </div>
      </div>

      {/* Recent Lectures Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#1E2761]" />
            <h3 className="text-sm font-bold text-slate-800">Recent Institutional Lectures ({lectures.length})</h3>
          </div>

          <button
            onClick={handleExportCSV}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
          >
            <FileDown className="w-3.5 h-3.5" />
            Download Full CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Topic</th>
                <th className="px-6 py-3">Faculty</th>
                <th className="px-6 py-3 text-center">Attendance</th>
                <th className="px-6 py-3 text-center">Avg Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lectures.slice(0, 8).map((lec) => (
                <tr key={lec.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-3 font-mono text-slate-600 whitespace-nowrap">{lec.date}</td>
                  <td className="px-6 py-3 font-semibold text-slate-800 whitespace-nowrap">{lec.subject.split(':')[0]}</td>
                  <td className="px-6 py-3 text-slate-700">{lec.topic}</td>
                  <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{lec.facultyName}</td>
                  <td className="px-6 py-3 text-center font-mono font-medium whitespace-nowrap">
                    {lec.attendanceList.length} / 30
                  </td>
                  <td className="px-6 py-3 text-center font-mono font-bold text-[#1E2761] whitespace-nowrap">
                    {lec.avgQuizScore ?? 75}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
