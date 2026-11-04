import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizCardData } from '../lib/data';
import { triggerConfetti } from '../lib/utils';
import { RefreshCw } from 'lucide-react';

interface InteractiveQuizCardProps {
  quiz: QuizCardData;
  onShuffle?: () => void;
}

const MASCOT_MAP: Record<string, string> = {
  'science': '/assets/qt/QT sherlock.svg',
  'physics': '/assets/qt/Qt curious.svg',
  'money': '/assets/qt/QT holding money.svg',
};

function getMascot(category: string): string {
  const cat = category.toLowerCase();
  for (const key of Object.keys(MASCOT_MAP)) {
    if (cat.includes(key)) return MASCOT_MAP[key];
  }
  return '/assets/qt/QT Idea.svg';
}

export default function InteractiveQuizCard({ quiz, onShuffle }: InteractiveQuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const mascotSrc = getMascot(quiz.category);

  // Cleanly reset selection on question rotation without layout shift
  useEffect(() => {
    setSelected(null);
  }, [quiz.id]);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === quiz.correctAnswer) {
      triggerConfetti();
    }
  };

  return (
    <div className="group bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-sm flex flex-col justify-between h-full min-h-[480px] sm:min-h-[510px] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex-1 flex flex-col justify-start">
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-3.5 gap-2">
          <span className="px-3.5 py-1 rounded-full bg-[#30B2E7] text-white font-black text-[11px] uppercase tracking-wider shrink-0 shadow-sm">
            {quiz.category}
          </span>
          <span className="px-3.5 py-1 rounded-full bg-[#FDB913] text-slate-950 text-[11px] font-black shrink-0 shadow-sm">
            {quiz.difficulty}
          </span>
        </div>

        {/* Dynamic Question & Answers Content Frame */}
        <div key={quiz.id} className="flex-1 flex flex-col justify-start animate-in fade-in duration-150">
          {/* Question title with locked minimum height to prevent CLS across varied text lengths */}
          <h3 
            className="text-base sm:text-lg font-black text-slate-900 leading-snug mb-3.5 flex-none min-h-[3.6rem] sm:min-h-[3.8rem] line-clamp-3 group-hover:text-[#30B2E7] transition-colors" 
            style={{ fontFamily: 'Causten Round Black, sans-serif' }}
          >
            {quiz.question}
          </h3>

          {/* Options (Clean borderless answer bubbles) */}
          <div className="flex flex-col gap-2.5 flex-1">
            {quiz.options.map((option, idx) => {
              const isCorrect = idx === quiz.correctAnswer;
              const isSelected = selected === idx;

              let bg = 'bg-slate-50 hover:bg-[#FDB913]/25 hover:text-slate-950 text-slate-800 border border-slate-100 hover:border-amber-200';
              if (selected !== null) {
                if (isCorrect) bg = 'bg-[#75B543] text-white font-black shadow-sm border-transparent';
                else if (isSelected) bg = 'bg-rose-500 text-white font-black shadow-sm border-transparent';
                else bg = 'bg-slate-50 text-slate-400 opacity-40 border-transparent';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-between min-h-[46px] leading-snug transition-all cursor-pointer ${bg}`}
                >
                  <span>{option}</span>
                  {selected !== null && isCorrect && <span className="ml-2 shrink-0 font-black text-sm">✓</span>}
                  {selected !== null && isSelected && !isCorrect && <span className="ml-2 shrink-0 font-black text-sm">✕</span>}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3.5 rounded-2xl bg-[#FFF8E1] border border-amber-200/80 p-3 text-slate-900 text-xs font-semibold leading-relaxed shadow-sm"
              >
                <div className="font-black uppercase tracking-wider text-[10px] text-amber-700 mb-1 font-heading">
                  QT's Quriosity Flash:
                </div>
                {quiz.explanation}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer: Shuffle Action & Mascot */}
      <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
        {onShuffle ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShuffle();
            }}
            aria-label={`Shuffle ${quiz.difficulty} question`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-[#30B2E7] hover:text-white text-slate-700 font-black text-xs border border-slate-200/80 shadow-xs active:scale-95 transition-all font-heading cursor-pointer min-h-[36px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Shuffle Question</span>
          </button>
        ) : <div />}

        <img
          src={mascotSrc}
          alt="QT Mascot"
          width="44"
          height="44"
          className="object-contain drop-shadow-sm group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300"
          loading="eager"
        />
      </div>
    </div>
  );
}
