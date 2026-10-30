import React, { useState } from 'react';
import { User, Role } from '../../types/index.ts';
import { SEED_FACULTY, SEED_STUDENTS, SEED_ADMIN } from '../../data/seedData.ts';
import { setCurrentUser, resetToSeedData } from '../../services/storage.ts';
import {
  GraduationCap,
  LogOut,
  UserCheck,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onToggleSidebar?: () => void;
  onSelectUser?: (user: User) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onToggleSidebar,
  onSelectUser,
}) => {
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const handleQuickSwitch = (user: User) => {
    setCurrentUser(user);
    if (onSelectUser) onSelectUser(user);
    setShowRoleSwitcher(false);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all lectures, quiz answers, and attendance to default demo state?')) {
      resetToSeedData();
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#1E2761] flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5 text-[#3498DB]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-[#1E2761]">
                  Uni-Grow
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  PBL Classroom
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Role Switcher + Current User + Actions */}
        {currentUser ? (
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                title="Switch demo persona for quick grading"
              >
                <span className="hidden sm:inline text-slate-500">Demo Persona:</span>
                <span className="font-semibold text-[#1E2761] truncate max-w-[120px] sm:max-w-[160px]">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showRoleSwitcher && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowRoleSwitcher(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                    <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                      Quick Persona Switcher (For PBL Demo)
                    </div>

                    <div className="space-y-1 my-1">
                      <div className="px-3 py-1 text-[11px] font-bold text-slate-700">Faculty:</div>
                      {SEED_FACULTY.slice(0, 2).map((fac) => (
                        <button
                          key={fac.id}
                          onClick={() => handleQuickSwitch(fac)}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                            currentUser.id === fac.id
                              ? 'bg-blue-50 text-[#1E2761] font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <div>{fac.name}</div>
                            <div className="text-[10px] text-slate-500">{fac.department}</div>
                          </div>
                          {currentUser.id === fac.id && (
                            <UserCheck className="w-4 h-4 text-[#3498DB]" />
                          )}
                        </button>
                      ))}

                      <div className="border-t border-slate-100 my-1 pt-1"></div>
                      <div className="px-3 py-1 text-[11px] font-bold text-slate-700">Student:</div>
                      {SEED_STUDENTS.slice(0, 2).map((stu) => (
                        <button
                          key={stu.id}
                          onClick={() => handleQuickSwitch(stu)}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                            currentUser.id === stu.id
                              ? 'bg-blue-50 text-[#1E2761] font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <div>{stu.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {stu.rollNumber}
                            </div>
                          </div>
                          {currentUser.id === stu.id && (
                            <UserCheck className="w-4 h-4 text-[#3498DB]" />
                          )}
                        </button>
                      ))}

                      <div className="border-t border-slate-100 my-1 pt-1"></div>
                      <div className="px-3 py-1 text-[11px] font-bold text-slate-700">Admin:</div>
                      <button
                        onClick={() => handleQuickSwitch(SEED_ADMIN)}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                          currentUser.id === SEED_ADMIN.id
                            ? 'bg-blue-50 text-[#1E2761] font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div>{SEED_ADMIN.name}</div>
                          <div className="text-[10px] text-slate-500">Academic Affairs Dean</div>
                        </div>
                        {currentUser.id === SEED_ADMIN.id && (
                          <UserCheck className="w-4 h-4 text-[#3498DB]" />
                        )}
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-2 px-2 flex justify-between items-center">
                      <button
                        onClick={handleResetData}
                        className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 py-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset Mock Data
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Role indicator pill */}
            <span
              className={`hidden md:inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md uppercase tracking-wider ${
                currentUser.role === 'faculty'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : currentUser.role === 'admin'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {currentUser.role}
            </span>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
              title="Sign out to Role Selection"
            >
              <LogOut className="w-4 h-4 text-slate-500 hover:text-red-600" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Engineering College PBL Edition</span>
          </div>
        )}
      </div>
    </header>
  );
};
