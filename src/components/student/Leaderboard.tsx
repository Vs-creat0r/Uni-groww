import React, { useState, useEffect } from 'react';
import { User, StudentStats } from '../../types/index.ts';
import { getAllLeaderboard } from '../../services/storage.ts';
import { TierBadge } from '../common/TierBadge.tsx';
import { Trophy, Medal, Crown, Star, Sparkles, Search, Award } from 'lucide-react';

interface LeaderboardProps {
  currentUser: User;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser }) => {
  const [leaderboard, setLeaderboard] = useState<StudentStats[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = () => {
    setLeaderboard(getAllLeaderboard());
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

  const top10 = leaderboard.slice(0, 10);
  const currentUserRankIndex = leaderboard.findIndex((s) => s.studentId === currentUser.id);
  const currentUserStats = leaderboard[currentUserRankIndex];

  const filteredList = top10.filter(
    (s) =>
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2761] tracking-tight">University PBL Leaderboard</h2>
          <p className="text-sm text-slate-500 mt-1">
            Top 10 ranked engineering students ranked by attendance and concept quiz accuracy.
          </p>
        </div>

        {/* Current user mini banner */}
        {currentUserStats && (
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1E2761] text-white flex items-center justify-center font-bold text-xs font-mono">
              #{currentUserRankIndex + 1}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Your Rank</div>
              <div className="text-[11px] text-slate-500">{currentUserStats.avgScore}% • {currentUserStats.tier}</div>
            </div>
          </div>
        )}
      </div>

      {/* Top 3 Podium Cards */}
      {top10.length >= 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* #2 Rank */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center order-2 sm:order-1 relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center mx-auto mb-2 text-sm border border-slate-300">
                #2
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{top10[1].studentName}</h4>
              <p className="text-[11px] font-mono text-slate-500">{top10[1].rollNumber}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="text-2xl font-mono font-extrabold text-[#1E2761]">{top10[1].avgScore}%</div>
              <div className="mt-1">
                <TierBadge tier={top10[1].tier} size="sm" />
              </div>
            </div>
          </div>

          {/* #1 Champion */}
          <div className="bg-gradient-to-b from-amber-50 to-white p-6 rounded-2xl border-2 border-amber-300 shadow-md text-center order-1 sm:order-2 relative flex flex-col justify-between">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-200" />
              Rank 1 Champion
            </div>
            <div className="pt-2">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-white font-extrabold flex items-center justify-center mx-auto mb-2 text-lg shadow-xs">
                #1
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">{top10[0].studentName}</h4>
              <p className="text-[11px] font-mono text-slate-500">{top10[0].rollNumber}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-100">
              <div className="text-3xl font-mono font-extrabold text-[#1E2761]">{top10[0].avgScore}%</div>
              <div className="mt-1">
                <TierBadge tier={top10[0].tier} size="sm" />
              </div>
            </div>
          </div>

          {/* #3 Rank */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center order-3 relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center mx-auto mb-2 text-sm border border-orange-200">
                #3
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{top10[2].studentName}</h4>
              <p className="text-[11px] font-mono text-slate-500">{top10[2].rollNumber}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="text-2xl font-mono font-extrabold text-[#1E2761]">{top10[2].avgScore}%</div>
              <div className="mt-1">
                <TierBadge tier={top10[2].tier} size="sm" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#F39C12]" />
            <h3 className="text-sm font-bold text-slate-800">Top 10 Roll of Honor</h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search top 10..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Rank</th>
                <th className="px-6 py-3.5">Student</th>
                <th className="px-6 py-3.5">Roll Number</th>
                <th className="px-6 py-3.5 text-center">Lectures</th>
                <th className="px-6 py-3.5 text-center">Score %</th>
                <th className="px-6 py-3.5 text-right">PBL Tier Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((student, idx) => {
                const isMe = student.studentId === currentUser.id;
                const rankNumber = idx + 1;

                return (
                  <tr
                    key={student.studentId}
                    className={`transition-colors ${
                      isMe ? 'bg-blue-50/80 font-semibold' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      {rankNumber === 1 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-white font-bold flex items-center justify-center text-xs">
                          1
                        </span>
                      ) : rankNumber === 2 ? (
                        <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold flex items-center justify-center text-xs">
                          2
                        </span>
                      ) : rankNumber === 3 ? (
                        <span className="w-6 h-6 rounded-full bg-orange-200 text-orange-900 font-bold flex items-center justify-center text-xs">
                          3
                        </span>
                      ) : (
                        <span className="font-mono text-slate-400 font-semibold pl-2">
                          #{rankNumber}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span>{student.studentName}</span>
                        {isMe && (
                          <span className="text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded uppercase">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal">{student.department}</div>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-600">{student.rollNumber}</td>
                    <td className="px-6 py-3.5 text-center font-mono text-slate-700">
                      {student.lecturesAttended}
                    </td>
                    <td className="px-6 py-3.5 text-center font-mono font-extrabold text-[#1E2761]">
                      {student.avgScore}%
                    </td>
                    <td className="px-6 py-3.5 text-right whitespace-nowrap">
                      <TierBadge tier={student.tier} score={student.avgScore} size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
