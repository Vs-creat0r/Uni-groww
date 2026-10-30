import React, { useState, useEffect } from 'react';
import { User, Lecture, Quiz, QuizOption } from '../../types/index.ts';
import {
  getLectures,
  updateLecture,
  setLectureActiveQuiz,
  getQuizResponses,
} from '../../services/storage.ts';
import {
  HelpCircle,
  BarChart3,
  Sparkles,
  Send,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Users,
  Check,
  Zap,
} from 'lucide-react';

interface QuickQuizProps {
  currentUser: User;
}

// Preset Indian college engineering questions for instant AI suggestion demo
const AI_QUESTION_PRESETS = [
  {
    question: 'In an AVL tree, what is the maximum permissible height difference between the left and right subtrees of any node?',
    options: [
      { id: 'A' as const, text: 'Strictly 0 (Must be fully symmetric)' },
      { id: 'B' as const, text: 'At most 1 (-1, 0, or +1 balance factor)' },
      { id: 'C' as const, text: 'At most 2' },
      { id: 'D' as const, text: 'Any logarithmic constant log(n)' },
    ],
    correctAnswer: 'B' as const,
    explanation: 'An AVL tree strictly requires that the heights of two child subtrees of any node differ by at most one.',
  },
  {
    question: 'Which of the following conditions is NOT one of the Coffman conditions required for a deadlock to occur in an OS?',
    options: [
      { id: 'A' as const, text: 'Mutual Exclusion' },
      { id: 'B' as const, text: 'Hold and Wait' },
      { id: 'C' as const, text: 'Preemptive Resource Allocation' },
      { id: 'D' as const, text: 'Circular Wait' },
    ],
    correctAnswer: 'C' as const,
    explanation: 'The Coffman condition is No Preemption. Preemptive allocation prevents deadlocks.',
  },
  {
    question: 'In TCP 3-Way Handshake, which flag combination is sent back by the server in response to the initial client SYN?',
    options: [
      { id: 'A' as const, text: 'ACK only' },
      { id: 'B' as const, text: 'SYN + ACK' },
      { id: 'C' as const, text: 'FIN + ACK' },
      { id: 'D' as const, text: 'RST + SYN' },
    ],
    correctAnswer: 'B' as const,
    explanation: 'The server acknowledges the client SYN and sends its own SYN packet (SYN-ACK).',
  },
  {
    question: 'What is the time complexity of finding the shortest path between all pairs of vertices using the Floyd-Warshall algorithm?',
    options: [
      { id: 'A' as const, text: 'O(V log V + E)' },
      { id: 'B' as const, text: 'O(V^2)' },
      { id: 'C' as const, text: 'O(V^3)' },
      { id: 'D' as const, text: 'O(V * E)' },
    ],
    correctAnswer: 'C' as const,
    explanation: 'Floyd-Warshall uses three nested loops over the V vertices, yielding O(V^3) complexity.',
  },
];

export const QuickQuiz: React.FC<QuickQuizProps> = ({ currentUser }) => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedLectureId, setSelectedLectureId] = useState<string>('');

  // Form states
  const [questionText, setQuestionText] = useState(AI_QUESTION_PRESETS[0].question);
  const [optionA, setOptionA] = useState(AI_QUESTION_PRESETS[0].options[0].text);
  const [optionB, setOptionB] = useState(AI_QUESTION_PRESETS[0].options[1].text);
  const [optionC, setOptionC] = useState(AI_QUESTION_PRESETS[0].options[2].text);
  const [optionD, setOptionD] = useState(AI_QUESTION_PRESETS[0].options[3].text);
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const [explanation, setExplanation] = useState(AI_QUESTION_PRESETS[0].explanation);
  const [isSimulating, setIsSimulating] = useState(false);

  const loadData = () => {
    const all = getLectures();
    setLectures(all);
    if (all.length > 0 && !selectedLectureId) {
      setSelectedLectureId(all[0].id);
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
  }, []);

  const currentLecture = lectures.find((l) => l.id === selectedLectureId) || lectures[0];
  const activeQuiz = currentLecture?.activeQuiz;

  // Handle AI Question suggestion
  const handleAISuggest = () => {
    const randomPreset = AI_QUESTION_PRESETS[Math.floor(Math.random() * AI_QUESTION_PRESETS.length)];
    setQuestionText(randomPreset.question);
    setOptionA(randomPreset.options[0].text);
    setOptionB(randomPreset.options[1].text);
    setOptionC(randomPreset.options[2].text);
    setOptionD(randomPreset.options[3].text);
    setCorrectAnswer(randomPreset.correctAnswer);
    setExplanation(randomPreset.explanation);
  };

  // Launch Quiz to classroom
  const handleLaunchQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLecture) return;

    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      lectureId: currentLecture.id,
      question: questionText.trim(),
      options: [
        { id: 'A', text: optionA.trim() },
        { id: 'B', text: optionB.trim() },
        { id: 'C', text: optionC.trim() },
        { id: 'D', text: optionD.trim() },
      ],
      correctAnswer,
      explanation: explanation.trim(),
      status: 'active',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      responsesCount: { A: 0, B: 0, C: 0, D: 0 },
    };

    setLectureActiveQuiz(currentLecture.id, newQuiz);
  };

  // Simulate mock responses from classroom students
  const handleSimulateClassResponses = () => {
    if (!currentLecture || !activeQuiz) return;
    setIsSimulating(true);

    const counts: { A: number; B: number; C: number; D: number } = {
      A: activeQuiz.responsesCount?.A ?? 0,
      B: activeQuiz.responsesCount?.B ?? 0,
      C: activeQuiz.responsesCount?.C ?? 0,
      D: activeQuiz.responsesCount?.D ?? 0,
    };
    // Bias responses towards the correct answer (~65% correct, 35% across others)
    const totalSimulatedVotes = 15;
    for (let i = 0; i < totalSimulatedVotes; i++) {
      const rand = Math.random();
      if (rand < 0.65) {
        counts[activeQuiz.correctAnswer] = (counts[activeQuiz.correctAnswer] || 0) + 1;
      } else {
        const wrongOpts = (['A', 'B', 'C', 'D'] as const).filter(
          (o) => o !== activeQuiz.correctAnswer
        );
        const picked = wrongOpts[Math.floor(Math.random() * wrongOpts.length)];
        counts[picked] = (counts[picked] || 0) + 1;
      }
    }

    const updatedQuiz: Quiz = {
      ...activeQuiz,
      responsesCount: counts,
    };

    const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0);
    const correctVotes = counts[activeQuiz.correctAnswer] || 0;
    const avgScore = totalVotes > 0 ? Math.round((correctVotes / totalVotes) * 100) : 0;

    const updatedLec: Lecture = {
      ...currentLecture,
      activeQuiz: updatedQuiz,
      avgQuizScore: avgScore,
    };

    updateLecture(updatedLec);
    setTimeout(() => setIsSimulating(false), 300);
  };

  // Reset or create another quiz
  const handleResetQuiz = () => {
    if (!currentLecture) return;
    const updatedLec: Lecture = {
      ...currentLecture,
      activeQuiz: undefined,
    };
    updateLecture(updatedLec);
  };

  if (!currentLecture) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
        <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-slate-800">No Lecture Available</h3>
        <p className="text-sm text-slate-500 mt-1">Please create a lecture first.</p>
      </div>
    );
  }

  // Poll chart calculations
  const counts = activeQuiz?.responsesCount || { A: 0, B: 0, C: 0, D: 0 };
  const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0);
  const correctVotes = activeQuiz ? counts[activeQuiz.correctAnswer] || 0 : 0;
  const accuracy = totalVotes > 0 ? Math.round((correctVotes / totalVotes) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Active Session
            </span>
            <span className="text-xs text-slate-500">Room: {currentLecture.roomCode}</span>
          </div>
          <h2 className="text-xl font-bold text-[#1E2761] mt-1">{currentLecture.subject}</h2>
          <p className="text-sm text-slate-600">{currentLecture.topic}</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedLectureId}
            onChange={(e) => setSelectedLectureId(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-hidden"
          >
            {lectures.map((l) => (
              <option key={l.id} value={l.id}>
                {l.subject.split(':')[0]} ({l.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeQuiz ? (
        /* Live Poll Results View */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Live Poll In Progress
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {activeQuiz.question}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-[#1E2761] tabular-nums">
                    {totalVotes}
                  </div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Votes</div>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-[#2ECC71] tabular-nums">
                    {accuracy}%
                  </div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Accuracy</div>
                </div>
              </div>
            </div>

            {/* Poll Bar Chart */}
            <div className="mt-6 space-y-4">
              {activeQuiz.options.map((opt) => {
                const count = counts[opt.id] || 0;
                const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                const isCorrect = opt.id === activeQuiz.correctAnswer;

                return (
                  <div
                    key={opt.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCorrect
                        ? 'border-emerald-300 bg-emerald-50/40'
                        : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-sm mb-2">
                      <div className="flex items-center gap-2 font-medium">
                        <span
                          className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                            isCorrect
                              ? 'bg-[#2ECC71] text-white shadow-xs'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span className="text-slate-800">{opt.text}</span>
                        {isCorrect && (
                          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> (Correct Key)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-xs text-slate-500 tabular-nums">
                          {count} {count === 1 ? 'vote' : 'votes'}
                        </span>
                        <span className="font-mono text-sm font-bold text-slate-800 tabular-nums min-w-[3rem] text-right">
                          {pct}%
                        </span>
                      </div>
                    </div>

                    {/* Animated Poll Bar */}
                    <div className="w-full bg-slate-200/80 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-700 ease-out ${
                          isCorrect ? 'bg-[#2ECC71]' : 'bg-[#3498DB]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation box */}
            {activeQuiz.explanation && (
              <div className="mt-6 p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700">
                <span className="font-bold text-[#1E2761] mr-1.5">Conceptual Explanation:</span>
                {activeQuiz.explanation}
              </div>
            )}

            {/* Poll Actions & Simulator button */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                disabled={isSimulating}
                onClick={handleSimulateClassResponses}
                className="px-4 py-2 bg-[#3498DB] hover:bg-[#2980B9] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>{isSimulating ? 'Receiving Votes...' : 'Simulate +15 Student Responses'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl transition-colors"
                >
                  Create New Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Creation Form */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#1E2761]">Draft 1-Minute Concept MCQ</h3>
              <p className="text-xs text-slate-500">
                Broadcast an instant multiple choice quiz question to all joined students in room {currentLecture.roomCode}.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAISuggest}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1E2761] bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3498DB]" />
              <span>✨ AI Suggest Question</span>
            </button>
          </div>

          <form onSubmit={handleLaunchQuiz} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Quiz Question
              </label>
              <textarea
                required
                rows={3}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter single concept check question for the lecture..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB] outline-hidden"
              />
            </div>

            {/* 4 Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Option A</span>
                  <input
                    type="radio"
                    name="correctAnswerKey"
                    checked={correctAnswer === 'A'}
                    onChange={() => setCorrectAnswer('A')}
                    className="text-[#2ECC71] focus:ring-[#2ECC71]"
                  />
                </label>
                <input
                  type="text"
                  required
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl outline-hidden ${
                    correctAnswer === 'A'
                      ? 'border-[#2ECC71] ring-1 ring-[#2ECC71]'
                      : 'border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Option B</span>
                  <input
                    type="radio"
                    name="correctAnswerKey"
                    checked={correctAnswer === 'B'}
                    onChange={() => setCorrectAnswer('B')}
                    className="text-[#2ECC71] focus:ring-[#2ECC71]"
                  />
                </label>
                <input
                  type="text"
                  required
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl outline-hidden ${
                    correctAnswer === 'B'
                      ? 'border-[#2ECC71] ring-1 ring-[#2ECC71]'
                      : 'border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Option C</span>
                  <input
                    type="radio"
                    name="correctAnswerKey"
                    checked={correctAnswer === 'C'}
                    onChange={() => setCorrectAnswer('C')}
                    className="text-[#2ECC71] focus:ring-[#2ECC71]"
                  />
                </label>
                <input
                  type="text"
                  required
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl outline-hidden ${
                    correctAnswer === 'C'
                      ? 'border-[#2ECC71] ring-1 ring-[#2ECC71]'
                      : 'border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Option D</span>
                  <input
                    type="radio"
                    name="correctAnswerKey"
                    checked={correctAnswer === 'D'}
                    onChange={() => setCorrectAnswer('D')}
                    className="text-[#2ECC71] focus:ring-[#2ECC71]"
                  />
                </label>
                <input
                  type="text"
                  required
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl outline-hidden ${
                    correctAnswer === 'D'
                      ? 'border-[#2ECC71] ring-1 ring-[#2ECC71]'
                      : 'border-slate-300'
                  }`}
                />
              </div>
            </div>

            {/* Correct answer indicator */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-800">
              <span className="font-medium">
                Correct Answer Key Selected: <strong className="font-bold uppercase text-emerald-900">Option {correctAnswer}</strong>
              </span>
              <span className="text-[11px] text-emerald-700">Click radio above to adjust</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Explanation (Shown to students post-submission)
              </label>
              <input
                type="text"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Brief justification for why this answer is correct..."
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB] outline-hidden"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1E2761] hover:bg-[#2A3680] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-[#3498DB]" />
                <span>Broadcast Quiz to Classroom</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
