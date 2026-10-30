import React, { useState } from 'react';
import { User, Lecture } from '../../types/index.ts';
import { saveLecture, getLectures } from '../../services/storage.ts';
import { PlusCircle, Calendar, BookOpen, Hash, CheckCircle2, ArrowRight } from 'lucide-react';

interface CreateLectureProps {
  currentUser: User;
  onLectureCreated: (lecture: Lecture) => void;
  onNavigateToAttendance: () => void;
}

const COMMON_SUBJECTS = [
  'CS301: Data Structures & Algorithms',
  'CS402: Operating Systems & Systems Programming',
  'AI501: Machine Learning & Predictive Modeling',
  'CS304: Database Management Systems',
  'CS405: Computer Networks & Cyber Security',
  'CS202: Discrete Mathematics & Graph Theory',
];

export const CreateLecture: React.FC<CreateLectureProps> = ({
  currentUser,
  onLectureCreated,
  onNavigateToAttendance,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [subject, setSubject] = useState(COMMON_SUBJECTS[0]);
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('10:00 AM');
  const [createdLecture, setCreatedLecture] = useState<Lecture | null>(null);

  const generateRoomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const newCode = generateRoomCode();
    const newLecture: Lecture = {
      id: `lec-${Date.now()}`,
      facultyId: currentUser.id,
      facultyName: currentUser.name,
      subject,
      topic: topic.trim(),
      date,
      time,
      roomCode: newCode,
      status: 'active',
      attendanceList: [],
    };

    saveLecture(newLecture);
    setCreatedLecture(newLecture);
    onLectureCreated(newLecture);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#1E2761] tracking-tight">Create New Lecture</h2>
        <p className="text-sm text-slate-500 mt-1">
          Initiate a live classroom session with an instant 6-digit room code for attendance and live quizzes.
        </p>
      </div>

      {createdLecture ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-xs">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-1">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Lecture Created & Live!</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            <span className="font-semibold text-slate-800">{createdLecture.subject}</span>: {createdLecture.topic}
          </p>

          <div className="bg-white border border-emerald-200 rounded-xl p-4 max-w-xs mx-auto shadow-xs">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Active Room Code
            </div>
            <div className="text-3xl font-mono font-extrabold tracking-widest text-[#1E2761]">
              {createdLecture.roomCode}
            </div>
            <div className="text-[11px] text-emerald-600 mt-1 font-medium">Students can join now</div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onNavigateToAttendance}
              className="px-5 py-2.5 bg-[#1E2761] hover:bg-[#2A3680] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Go to Live Attendance</span>
              <ArrowRight className="w-4 h-4 text-[#3498DB]" />
            </button>
            <button
              onClick={() => {
                setCreatedLecture(null);
                setTopic('');
              }}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-colors"
            >
              Create Another Session
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject selector with quick choices */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Course / Subject
              </label>
              <div className="space-y-2">
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB] outline-hidden"
                >
                  {COMMON_SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 self-center mr-1">Quick pick:</span>
                  {COMMON_SUBJECTS.slice(0, 3).map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSubject(sub)}
                      className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                        subject === sub
                          ? 'bg-blue-50 border-blue-300 text-[#1E2761] font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {sub.split(':')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Lecture Topic / Chapter
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Red-Black Tree Invariants and Double Black Deletion"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB] outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                Include the exact subtopic or lab focus for clear student records and PBL tracking.
              </p>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Session Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  Scheduled Slot
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 10:00 AM - 11:30 AM"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB] outline-hidden"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                A 6-digit room code will be generated upon creation.
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1E2761] hover:bg-[#2A3680] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-[#3498DB]" />
                <span>Save & Launch Session</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
