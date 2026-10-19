import React, { useState } from 'react';
import { QUESTION_BANK, type QuizCardData } from '../lib/data';
import InteractiveQuizCard from './InteractiveQuizCard';
import { RefreshCw } from 'lucide-react';

const DIFFICULTIES = ['Difficult', 'Medium', 'Easy'] as const;

function getRandomQuiz(difficulty: typeof DIFFICULTIES[number], excludeId?: string): QuizCardData {
  const pool = QUESTION_BANK.filter((q) => q.difficulty === difficulty && q.id !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)] || QUESTION_BANK[0];
}

function getRandomQuizzes(): QuizCardData[] {
  return DIFFICULTIES.map((diff) => getRandomQuiz(diff));
}

const DEFAULT_INITIAL_QUIZZES: QuizCardData[] = [
  QUESTION_BANK.find((q) => q.difficulty === 'Difficult') || QUESTION_BANK[0],
  QUESTION_BANK.find((q) => q.difficulty === 'Medium') || QUESTION_BANK[1],
  QUESTION_BANK.find((q) => q.difficulty === 'Easy') || QUESTION_BANK[2],
];

export default function DailyQuizSection({ initialQuizzes }: { initialQuizzes?: QuizCardData[] }) {
  const [quizzes, setQuizzes] = useState<QuizCardData[]>(() => {
    return initialQuizzes && initialQuizzes.length === 3 ? initialQuizzes : DEFAULT_INITIAL_QUIZZES;
  });

  const pickRandomQuizzes = () => setQuizzes(getRandomQuizzes());

  const shuffleCard = (index: number) => {
    const diff = DIFFICULTIES[index] || 'Medium';
    const nextQuiz = getRandomQuiz(diff, quizzes[index]?.id);
    setQuizzes((prev) => prev.map((q, i) => (i === index ? nextQuiz : q)));
  };

  return (
    <div className="space-y-6">
      {/* 3 Interactive Quiz Cards (Difficult, Medium, Easy) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {quizzes.map((quiz, idx) => (
          <InteractiveQuizCard 
            key={quiz.id} 
            quiz={quiz} 
            onShuffle={() => shuffleCard(idx)}
          />
        ))}
      </div>

      {/* Bottom Rotation Control Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={pickRandomQuizzes}
          type="button"
          aria-label="Shuffle all 3 questions"
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-900 font-black text-xs sm:text-sm border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all font-heading cursor-pointer min-h-[44px]"
        >
          <RefreshCw className="w-4 h-4 text-[#30B2E7]" />
          <span>Shuffle All Questions</span>
        </button>
      </div>
    </div>
  );
}
