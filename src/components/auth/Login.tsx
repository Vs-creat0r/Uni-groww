import React, { useState } from 'react';
import { Role, User } from '../../types/index.ts';
import { SEED_FACULTY, SEED_STUDENTS, SEED_ADMIN } from '../../data/seedData.ts';
import { setCurrentUser } from '../../services/storage.ts';
import {
  GraduationCap,
  BookOpen,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  KeyRound,
  Mail,
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<Role>('faculty');
  const [email, setEmail] = useState('rksharma@engineering.edu.in');
  const [password, setPassword] = useState('professor123');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('fac-1');

  // When role changes, update default prefill
  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    if (role === 'faculty') {
      setEmail(SEED_FACULTY[0].email);
      setPassword('faculty123');
      setSelectedPresetId(SEED_FACULTY[0].id);
    } else if (role === 'student') {
      setEmail(SEED_STUDENTS[0].email);
      setPassword('student123');
      setSelectedPresetId(SEED_STUDENTS[0].id);
    } else {
      setEmail(SEED_ADMIN.email);
      setPassword('admin123');
      setSelectedPresetId(SEED_ADMIN.id);
    }
  };

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    if (selectedRole === 'faculty') {
      const f = SEED_FACULTY.find((x) => x.id === id);
      if (f) setEmail(f.email);
    } else if (selectedRole === 'student') {
      const s = SEED_STUDENTS.find((x) => x.id === id);
      if (s) setEmail(s.email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let userToLogin: User;

    if (selectedRole === 'faculty') {
      const existing = SEED_FACULTY.find((f) => f.email.toLowerCase() === email.toLowerCase());
      userToLogin = existing || {
        id: `fac-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email,
        role: 'faculty',
        department: 'Computer Science & Engineering',
      };
    } else if (selectedRole === 'student') {
      const existing = SEED_STUDENTS.find((s) => s.email.toLowerCase() === email.toLowerCase());
      userToLogin = existing || {
        id: `stu-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email,
        rollNumber: `21BCE${Math.floor(1000 + Math.random() * 9000)}`,
        role: 'student',
        department: 'Computer Science',
      };
    } else {
      userToLogin = SEED_ADMIN;
    }

    setCurrentUser(userToLogin);
    onLoginSuccess(userToLogin);
  };

  const handleDirectDemoLogin = (user: User) => {
    setCurrentUser(user);
    onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1E2761] text-white shadow-lg mb-4">
          <GraduationCap className="w-9 h-9 text-[#3498DB]" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#1E2761] tracking-tight">
          Uni-Grow
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          AI-Powered Classroom Engagement Platform for Indian Colleges
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-200 rounded-2xl">
          {/* Step 1: Role Selector Tab Buttons */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Select Your University Role
            </label>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleRoleChange('faculty')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  selectedRole === 'faculty'
                    ? 'bg-[#1E2761] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Faculty</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  selectedRole === 'student'
                    ? 'bg-[#1E2761] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-[#1E2761] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Selector for Demo Presentation */}
          <div className="mb-6 bg-blue-50/60 border border-blue-100 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#1E2761] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#3498DB]" />
                Demo University Profiles:
              </span>
              <span className="text-[11px] text-blue-600 font-medium">Click to prefill</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {selectedRole === 'faculty' &&
                SEED_FACULTY.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleSelectPreset(f.id)}
                    className={`text-xs px-2.5 py-1 rounded-md transition-colors border ${
                      selectedPresetId === f.id
                        ? 'bg-[#1E2761] text-white border-[#1E2761] font-medium'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}

              {selectedRole === 'student' &&
                SEED_STUDENTS.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectPreset(s.id)}
                    className={`text-xs px-2.5 py-1 rounded-md transition-colors border ${
                      selectedPresetId === s.id
                        ? 'bg-[#1E2761] text-white border-[#1E2761] font-medium'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    {s.name} ({s.rollNumber})
                  </button>
                ))}

              {selectedRole === 'admin' && (
                <button
                  type="button"
                  className="text-xs px-2.5 py-1 rounded-md bg-[#1E2761] text-white border border-[#1E2761] font-medium"
                >
                  {SEED_ADMIN.name} (Academic Dean)
                </button>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Institutional Email Address
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@engineering.edu.in"
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB] outline-hidden bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Any password works for demo</span>
              </div>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB] outline-hidden bg-white font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-semibold text-sm bg-[#1E2761] hover:bg-[#2A3680] shadow-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#1E2761]"
              >
                <span>Enter as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</span>
                <ArrowRight className="w-4 h-4 text-[#3498DB]" />
              </button>
            </div>
          </form>

          {/* Quick Direct 1-Click Launchers */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
              Instant 1-Click Demo Evaluation
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDirectDemoLogin(SEED_FACULTY[0])}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-colors"
              >
                <div className="text-[10px] font-bold text-blue-600 uppercase">Faculty Demo</div>
                <div className="text-xs font-semibold text-slate-800 truncate">Dr. R.K. Sharma</div>
                <div className="text-[10px] text-slate-500 truncate">Active Lecture Room</div>
              </button>
              <button
                type="button"
                onClick={() => handleDirectDemoLogin(SEED_STUDENTS[0])}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-colors"
              >
                <div className="text-[10px] font-bold text-emerald-600 uppercase">Student Demo</div>
                <div className="text-xs font-semibold text-slate-800 truncate">Aarav Patel</div>
                <div className="text-[10px] text-slate-500 truncate">21BCE1001 (Platinum)</div>
              </button>
              <button
                type="button"
                onClick={() => handleDirectDemoLogin(SEED_ADMIN)}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition-colors"
              >
                <div className="text-[10px] font-bold text-purple-600 uppercase">Admin Demo</div>
                <div className="text-xs font-semibold text-slate-800 truncate">Dean Kulkarni</div>
                <div className="text-[10px] text-slate-500 truncate">Reports & CSV Export</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
