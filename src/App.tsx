import React, { useState, useEffect } from 'react';
import { User } from './types/index.ts';
import { initStorage, getCurrentUser, setCurrentUser } from './services/storage.ts';
import { Login } from './components/auth/Login.tsx';
import { Header } from './components/common/Header.tsx';
import { Sidebar } from './components/common/Sidebar.tsx';

// Faculty components
import { CreateLecture } from './components/faculty/CreateLecture.tsx';
import { TakeAttendance } from './components/faculty/TakeAttendance.tsx';
import { QuickQuiz } from './components/faculty/QuickQuiz.tsx';
import { LectureLog } from './components/faculty/LectureLog.tsx';

// Student components
import { JoinLecture } from './components/student/JoinLecture.tsx';
import { AnswerQuiz } from './components/student/AnswerQuiz.tsx';
import { StudentStats } from './components/student/StudentStats.tsx';
import { Leaderboard } from './components/student/Leaderboard.tsx';

// Admin component
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';

export default function App() {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize storage and load user on mount
  useEffect(() => {
    initStorage();
    const user = getCurrentUser();
    if (user) {
      setCurrentUserState(user);
      setDefaultTabForRole(user.role);
    }
    setIsInitialized(true);

    const handleStorageChange = () => {
      const updatedUser = getCurrentUser();
      setCurrentUserState(updatedUser);
    };

    window.addEventListener('unigrow_storage_change', handleStorageChange);
    return () => {
      window.removeEventListener('unigrow_storage_change', handleStorageChange);
    };
  }, []);

  const setDefaultTabForRole = (role: 'faculty' | 'student' | 'admin') => {
    switch (role) {
      case 'faculty':
        setCurrentTab('attendance');
        break;
      case 'student':
        setCurrentTab('join');
        break;
      case 'admin':
        setCurrentTab('overview');
        break;
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUserState(user);
    setDefaultTabForRole(user.role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
    setCurrentTab('');
  };

  const handleSelectUser = (user: User) => {
    setCurrentUserState(user);
    setDefaultTabForRole(user.role);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#1E2761] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Loading Uni-Grow Platform...
          </p>
        </div>
      </div>
    );
  }

  // If no user is logged in, show the Login Page
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Render main screen content based on role and tab
  const renderTabContent = () => {
    if (currentUser.role === 'faculty') {
      switch (currentTab) {
        case 'create-lecture':
          return (
            <CreateLecture
              currentUser={currentUser}
              onLectureCreated={() => setCurrentTab('attendance')}
              onNavigateToAttendance={() => setCurrentTab('attendance')}
            />
          );
        case 'attendance':
          return (
            <TakeAttendance
              currentUser={currentUser}
              onNavigateToQuiz={() => setCurrentTab('quiz')}
            />
          );
        case 'quiz':
          return <QuickQuiz currentUser={currentUser} />;
        case 'log':
        default:
          return <LectureLog currentUser={currentUser} />;
      }
    }

    if (currentUser.role === 'student') {
      switch (currentTab) {
        case 'join':
          return (
            <JoinLecture
              currentUser={currentUser}
              onJoinedSuccess={() => setCurrentTab('quiz')}
              onNavigateToQuiz={() => setCurrentTab('quiz')}
            />
          );
        case 'quiz':
          return (
            <AnswerQuiz
              currentUser={currentUser}
              onNavigateToStats={() => setCurrentTab('stats')}
            />
          );
        case 'stats':
          return (
            <StudentStats
              currentUser={currentUser}
              onNavigateToLeaderboard={() => setCurrentTab('leaderboard')}
            />
          );
        case 'leaderboard':
        default:
          return <Leaderboard currentUser={currentUser} />;
      }
    }

    if (currentUser.role === 'admin') {
      return <AdminDashboard currentUser={currentUser} currentTab={currentTab} />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onSelectUser={handleSelectUser}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Role-Specific Sidebar */}
        <Sidebar
          currentUser={currentUser}
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
