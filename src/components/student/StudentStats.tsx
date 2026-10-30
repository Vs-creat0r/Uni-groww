import React, { useState, useEffect } from 'react';
import { User, StudentStats as StudentStatsType } from '../../types/index.ts';
import { getStudentPerformanceStats, getQuizResponses, getLectures } from '../../services/storage.ts';
import { TierBadge } from '../common/TierBadge.tsx';
import {
  BookOpen,
  CheckSquare,
  Award,
  Trophy,
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
} from 'lucide-react';

interface StudentStatsProps {
  currentUser: User;
  onNavigateToLeaderboard: () => void;
}

export const StudentStats: React.FC<StudentStatsProps> = ({
  currentUser,
  onNavigateToLeaderboard,
}) => {
  const [stats, setStats] = useState<StudentStatsType | null>(null);

  const loadData = () => {
    const s = getStudentPerformanceStats(currentUser.id);
    setStats(s);
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
  }, [currentUser.id]);

  if (!stats) return null;

  // Next tier calculation
  const getNextTierInfo = () => {
    if (stats.avgScore < 40) {
      return {
        nextTier: 'Silver',
        targetScore: 40,
        pointsNeeded: 40 - stats.avgScore,
        progress: (stats.avgScore / 40) * 100,
      };
    } else if (stats.avgScore < 60) {
      return {
        nextTier: 'Gold',
        targetScore: 60,
        pointsNeeded: 60 - stats.avgScore,
        progress: ((stats.avgScore - 40) / 20) * 100,
      };
    } else if (stats.avgScore < 80) {
      return {
        nextTier: 'Platinum',
        targetScore: 80,
        pointsNeeded: 80 - stats.avgScore,
        progress: ((stats.avgScore - 60) / 20) * 100,
      };
    } else {
      return {
        nextTier: 'Max Rank (Platinum)',
        targetScore: 100,
        pointsNeeded: 0,
        progress: 100,
      };
    }
  };

  const nextTier = getNextTierInfo();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-[#1E2761] tracking-tight">My Academic & PBL Stats</h2>
        <p className="text-sm text-slate-500 mt-1">
          Track verified lecture attendance, active quiz proficiency, and PBL gamified tier status.
        </p>
      </div>

      {/* 4 Core Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Lectures Attended */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Lectures Attended</span>
            <div className="p-2 bg-blue-50 text-[#3498DB] rounded-xl">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-mono text-[#1E2761]">
              {stats.lecturesAttended}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Verified room check-ins</p>
          </div>
        </div>

        {/* Quizzes Taken */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Quizzes Attempted</span>
            <div className="p-2 bg-emerald-50 text-[#2ECC71] rounded-xl">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-mono text-[#1E2761]">
              {stats.quizzesTaken}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {stats.correctAnswers} correct responses
            </p>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Average Score</span>
            <div className="p-2 bg-amber-50 text-[#F39C12] rounded-xl">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-mono text-[#1E2761]">
              {stats.avgScore}%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Concept accuracy rating</p>
          </div>
        </div>

        {/* Current Rank Tier */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>PBL Tier Rank</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <TierBadge tier={stats.tier} score={stats.avgScore} size="lg" />
            <p className="text-[11px] text-slate-400 mt-1.5">
              {stats.tier === 'Platinum'
                ? 'Score ≥ 80% (Mastery)'
                : stats.tier === 'Gold'
                ? 'Score 60-79%'
                : stats.tier === 'Silver'
                ? 'Score 40-59%'
                : 'Score < 40%'}
            </p>
          </div>
        </div>
      </div>

      {/* Tier Progression Banner */}
      <div className="bg-gradient-to-r from-[#1E2761] to-[#2A3680] text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-[#3498DB] bg-white/10 px-2 py-0.5 rounded">
                Tier Progression Roadmap
              </span>
            </div>
            <h3 className="text-xl font-bold mt-1">
              Current Rank: {stats.tier} Tier ({stats.avgScore}%)
            </h3>
            {nextTier.pointsNeeded > 0 ? (
              <p className="text-xs text-blue-200/80 mt-0.5">
                Maintain high accuracy on your next quiz to earn +{nextTier.pointsNeeded}% and advance to{' '}
                <strong className="text-white">{nextTier.nextTier} Tier</strong>!
              </p>
            ) : (
              <p className="text-xs text-emerald-300 font-semibold mt-0.5">
                You have reached the elite Platinum Tier! Maintain participation to keep your rank.
              </p>
            )}
          </div>

          <button
            onClick={onNavigateToLeaderboard}
            className="px-4 py-2 bg-[#3498DB] hover:bg-[#2980B9] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs shrink-0 flex items-center gap-2"
          >
            <span>View University Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Tier Roadmap */}
        <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/10 text-center text-xs">
          <div
            className={`p-2.5 rounded-xl border ${
              stats.tier === 'Bronze'
                ? 'bg-orange-500/20 border-orange-400 text-white font-bold'
                : 'border-white/10 text-slate-300'
            }`}
          >
            <div className="text-[11px] text-orange-300 font-bold">Bronze</div>
            <div className="text-[10px] text-white/70">&lt; 40%</div>
          </div>

          <div
            className={`p-2.5 rounded-xl border ${
              stats.tier === 'Silver'
                ? 'bg-slate-400/20 border-slate-300 text-white font-bold'
                : 'border-white/10 text-slate-300'
            }`}
          >
            <div className="text-[11px] text-slate-300 font-bold">Silver</div>
            <div className="text-[10px] text-white/70">40 - 59%</div>
          </div>

          <div
            className={`p-2.5 rounded-xl border ${
              stats.tier === 'Gold'
                ? 'bg-amber-400/20 border-amber-300 text-white font-bold'
                : 'border-white/10 text-slate-300'
            }`}
          >
            <div className="text-[11px] text-amber-300 font-bold">Gold</div>
            <div className="text-[10px] text-white/70">60 - 79%</div>
          </div>

          <div
            className={`p-2.5 rounded-xl border ${
              stats.tier === 'Platinum'
                ? 'bg-indigo-400/30 border-indigo-300 text-white font-bold ring-1 ring-indigo-300'
                : 'border-white/10 text-slate-300'
            }`}
          >
            <div className="text-[11px] text-indigo-300 font-bold">Platinum</div>
            <div className="text-[10px] text-white/70">≥ 80%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
