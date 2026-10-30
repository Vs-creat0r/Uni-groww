import React, { useState, useEffect } from 'react';
import { User, Lecture, Quiz, QuizResponse } from '../../types/index.ts';
import { getLectures, getQuizResponses, saveQuizResponse } from '../../services/storage.ts';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Send,
  Sparkles,
  RefreshCw,
  Award,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface AnswerQuizProps {
  currentUser: User;
  onNavigateToStats: () => void;
}

export const AnswerQuiz: React.FC<AnswerQuizProps> = ({ currentUser, onNavigateToStats }) => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [existingResponse, setExistingResponse] = useState<QuizResponse | null>(null);

  const loadData = () => {
    const all = getLectures();
    setLectures(all);

    // Find if active quiz has already been answered by this student
    const activeLec = all.find((l) => l.activeQuiz && l.activeQuiz.status === 'active');
    if (activeLec?.activeQuiz) {
      const responses = getQuizResponses();
      const existing = responses.find(
        (r) => r.quizId === activeLec.activeQuiz?.id && r.studentId === currentUser.id
      );
      if (existing) {
        setExistingResponse(existing);
        setSelectedOption(existing.selectedOption);
        setHasSubmitted(true);
      }
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
  }, [currentUser.id]);

  // Find active lecture with active quiz
  const activeLecture = lectures.find((l) => l.activeQuiz && l.activeQuiz.status === 'active');
  const quiz = activeLecture?.activeQuiz;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz || !selectedOption || !activeLecture) return;

    const isCorrect = selectedOption === quiz.correctAnswer;

    if (isCorrect) {
      // Fire confetti celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2ECC71', '#3498DB', '#1E2761', '#F39C12'],
      });
    }

    const response: QuizResponse = {
      id: `qr-${Date.now()}`,
      quizId: quiz.id,
      lectureId: activeLecture.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      selectedOption,
      isCorrect,
      timestamp: new Date().toISOString(),
    };

    saveQuizResponse(response);
    setExistingResponse(response);
    setHasSubmitted(true);
  };

  const isCorrect = existingResponse ? existingResponse.isCorrect : selectedOption === quiz?.correctAnswer;

  if (!quiz) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2761] tracking-tight">Active Quiz</h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time concept checks broadcast by your professor.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 animate-pulse text-[#3498DB]" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Waiting for Professor to Broadcast Quiz...</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No MCQ is currently being broadcast in your active classroom session. Your professor will launch a 1-minute quiz shortly.
          </p>

          <div className="pt-2">
            <button
              onClick={loadData}
              className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Check for New Question</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Session Context Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            Live Concept Check
          </span>
          <h3 className="text-sm font-bold text-slate-800 mt-1">
            {activeLecture?.subject} • {activeLecture?.topic}
          </h3>
          <p className="text-xs text-slate-500">Instructor: {activeLecture?.facultyName}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded text-[#1E2761]">
            Room: {activeLecture?.roomCode}
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Question 1 of 1
          </div>
          <h2 className="text-xl font-bold text-slate-900 leading-snug">{quiz.question}</h2>
        </div>

        {/* Options */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {quiz.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isCorrectOption = opt.id === quiz.correctAnswer;

            let optionStyle = 'border-slate-200 hover:border-blue-400 bg-white text-slate-800';

            if (hasSubmitted) {
              if (isCorrectOption) {
                optionStyle = 'border-emerald-400 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-400';
              } else if (isSelected && !isCorrectOption) {
                optionStyle = 'border-rose-400 bg-rose-50 text-rose-950 ring-1 ring-rose-400';
              } else {
                optionStyle = 'border-slate-200 bg-slate-50/60 opacity-60 text-slate-600';
              }
            } else if (isSelected) {
              optionStyle = 'border-[#3498DB] bg-blue-50/80 text-[#1E2761] ring-2 ring-[#3498DB]/40 font-semibold';
            }

            return (
              <label
                key={opt.id}
                className={`flex items-center gap-3.5 p-4 rounded-xl border-2 transition-all cursor-pointer ${optionStyle}`}
              >
                <input
                  type="radio"
                  name="quizOption"
                  disabled={hasSubmitted}
                  checked={isSelected}
                  onChange={() => setSelectedOption(opt.id)}
                  className="hidden"
                />
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    hasSubmitted && isCorrectOption
                      ? 'bg-[#2ECC71] text-white'
                      : hasSubmitted && isSelected && !isCorrectOption
                      ? 'bg-rose-500 text-white'
                      : isSelected
                      ? 'bg-[#3498DB] text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {opt.id}
                </span>
                <span className="text-sm flex-1">{opt.text}</span>

                {hasSubmitted && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {hasSubmitted && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </label>
            );
          })}

          {/* Post-submission Feedback Banner */}
          {hasSubmitted && (
            <div
              className={`p-5 rounded-xl border mt-6 space-y-2 animate-fade-in ${
                isCorrect
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/80 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-extrabold text-sm text-emerald-800">
                      Brilliant! Correct Answer (+25 PBL XP)
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span className="font-extrabold text-sm text-rose-800">
                      Incorrect! The correct answer is Option {quiz.correctAnswer}
                    </span>
                  </>
                )}
              </div>

              {quiz.explanation && (
                <p className="text-xs text-slate-700 pt-1 border-t border-slate-200/60">
                  <strong className="text-slate-900">Key Takeaway:</strong> {quiz.explanation}
                </p>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onNavigateToStats}
                  className="text-xs font-bold underline underline-offset-4 hover:opacity-80 flex items-center gap-1"
                >
                  View My Tier & Stats Progress <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Submit Action */}
          {!hasSubmitted && (
            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-400">Select one option and lock your vote</span>
              <button
                type="submit"
                disabled={!selectedOption}
                className="px-6 py-2.5 bg-[#1E2761] hover:bg-[#2A3680] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-40"
              >
                <Send className="w-4 h-4 text-[#3498DB]" />
                <span>Submit My Answer</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
