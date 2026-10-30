import React from 'react';
import { User, Role } from '../../types/index.ts';
import {
  PlusCircle,
  Users,
  HelpCircle,
  BookOpen,
  LogIn,
  CheckSquare,
  BarChart2,
  Trophy,
  LayoutDashboard,
  LineChart,
  FileDown,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { resetToSeedData } from '../../services/storage.ts';

interface SidebarProps {
  currentUser: User;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  const getNavItems = () => {
    switch (currentUser.role) {
      case 'faculty':
        return [
          {
            id: 'create-lecture',
            label: 'Create Lecture',
            icon: PlusCircle,
            desc: 'Subject, topic & schedule',
          },
          {
            id: 'attendance',
            label: 'Take Attendance',
            icon: Users,
            desc: '6-digit room code & roster',
          },
          {
            id: 'quiz',
            label: 'Quick Quiz & Poll',
            icon: HelpCircle,
            desc: 'Live MCQ & response chart',
          },
          {
            id: 'log',
            label: 'Lecture Log',
            icon: BookOpen,
            desc: 'Past history & quiz averages',
          },
        ];
      case 'student':
        return [
          {
            id: 'join',
            label: 'Join Lecture',
            icon: LogIn,
            desc: 'Enter 6-digit room code',
          },
          {
            id: 'quiz',
            label: 'Answer Quiz',
            icon: CheckSquare,
            desc: 'Participate in live MCQ',
          },
          {
            id: 'stats',
            label: 'My Stats',
            icon: BarChart2,
            desc: 'Scores & tier progress',
          },
          {
            id: 'leaderboard',
            label: 'Leaderboard',
            icon: Trophy,
            desc: 'Top 10 student ranks',
          },
        ];
      case 'admin':
        return [
          {
            id: 'overview',
            label: 'Overview',
            icon: LayoutDashboard,
            desc: 'Faculty & student stats',
          },
          {
            id: 'chart',
            label: 'Activity Chart',
            icon: LineChart,
            desc: '7-day lecture trends',
          },
          {
            id: 'export',
            label: 'Export Reports',
            icon: FileDown,
            desc: 'Download CSV lecture logs',
          },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 w-64 bg-[#1E2761] text-white flex flex-col justify-between z-40 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* User Profile Mini Card */}
          <div className="bg-[#141A42] p-3.5 rounded-xl border border-blue-900/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3498DB] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-xs">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-xs text-blue-200/80 truncate">
                  {currentUser.role === 'student'
                    ? currentUser.rollNumber
                    : currentUser.department || currentUser.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-blue-300/60 mb-2">
              {currentUser.role.toUpperCase()} WORKSPACE
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all text-sm font-medium ${
                    isActive
                      ? 'bg-[#3498DB] text-white shadow-md font-semibold'
                      : 'text-slate-300 hover:bg-[#2A3680] hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{item.label}</div>
                    <div
                      className={`text-[11px] truncate ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-blue-900/40 bg-[#171E4B]">
          <div className="flex items-center justify-between text-xs text-blue-200/70 mb-2">
            <span>Classroom Mode</span>
            <span className="inline-flex items-center text-emerald-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset all demo data to fresh initial state?')) {
                resetToSeedData();
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs text-slate-300 hover:text-white hover:bg-[#2A3680] rounded-lg transition-colors border border-blue-900/50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Initial Demo Data
          </button>
        </div>
      </aside>
    </>
  );
};
