import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import QTMascot, { type QTMascotVariant } from './QTMascot';

const TRIVIA_FACTS = [
  "An octopus has three hearts. Two pump blood to the gills, one to the body!",
  "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old!",
  "A day on Venus is longer than a year on Venus.",
  "Bananas are curved because they grow towards the sun in a process called negative geotropism.",
  "Wombat poop is cube-shaped, which stops it from rolling away!",
  "Sloths can hold their breath longer than dolphins can (up to 40 minutes)!",
  "There are more trees on Earth than stars in the Milky Way galaxy.",
  "The dot over the lowercase letters 'i' and 'j' is called a tittle!",
  "Sea otters hold hands while sleeping so they don't drift away in ocean currents.",
  "Hot water freezes faster than cold water in certain conditions, a phenomenon known as the Mpemba effect.",
  "Cows have best friends and experience lower stress levels when they are together.",
  "The Eiffel Tower can grow more than 15 cm taller during summer due to thermal expansion of the iron.",
  "Butterflies taste their food with their feet to test if leaves are suitable for laying eggs.",
  "Sharks existed before trees and dinosaurs roamed the Earth!",
  "Venus is the only planet in the solar system that spins clockwise."
];

const MASCOT_VARIANTS: QTMascotVariant[] = ['quizzing', 'sherlock', 'idea', 'reading', 'curious'];
const STORAGE_KEY = 'qshala_last_banner_trivia';

function getNextRandomIndex(currentIdx: number, total: number): number {
  if (total <= 1) return 0;
  let next = Math.floor(Math.random() * total);
  while (next === currentIdx) {
    next = Math.floor(Math.random() * total);
  }
  return next;
}

export default function AnimatedHeroMascotStage() {
  const [factIdx, setFactIdx] = useState(0);
  const [variantIdx, setVariantIdx] = useState(0);
  const intervalRef = useRef<any>(null);

  // Initialize with a non-repeating random fact on mount/refresh
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastStoredIdx = -1;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        lastStoredIdx = parseInt(stored, 10);
      }
    } catch {
      // sessionStorage unavailable
    }

    const initialFactIdx = getNextRandomIndex(lastStoredIdx, TRIVIA_FACTS.length);
    const initialVariantIdx = Math.floor(Math.random() * MASCOT_VARIANTS.length);

    setFactIdx(initialFactIdx);
    setVariantIdx(initialVariantIdx);
  }, []);

  // Sync current fact to sessionStorage whenever it updates
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(STORAGE_KEY, String(factIdx));
    } catch {
      // ignore
    }
  }, [factIdx]);

  const shuffleTrivia = useCallback(() => {
    setFactIdx((prev) => getNextRandomIndex(prev, TRIVIA_FACTS.length));
    setVariantIdx((prev) => (prev + 1) % MASCOT_VARIANTS.length);
  }, []);

  // Auto-shuffle on timer so visitors discover new trivia even without manual click
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      shuffleTrivia();
    }, 9000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [shuffleTrivia]);

  const handleGenerate = () => {
    // Reset timer on manual click
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        shuffleTrivia();
      }, 9000);
    }
    shuffleTrivia();
  };

  const currentFact = TRIVIA_FACTS[factIdx] || TRIVIA_FACTS[0];
  const currentVariant = MASCOT_VARIANTS[variantIdx] || MASCOT_VARIANTS[0];

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center">
      
      {/* Background Glowing Ambient Rings */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#30B2E7]/20 via-[#FDB913]/25 to-[#75B543]/20 rounded-full blur-3xl pointer-events-none scale-110 animate-pulse" />

      {/* Live Interactive Mascot Stage Container */}
      <div className="relative w-full flex flex-col items-center text-center space-y-3">

        {/* Live Dynamic Speech Bubble Container */}
        <div className="min-h-[90px] w-full flex items-end justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={factIdx}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative px-3.5 py-3 sm:px-5 sm:py-3.5 rounded-2xl bg-[#FFFDF5] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] max-w-sm sm:max-w-md w-full flex items-center gap-2.5 sm:gap-3"
            >
              <div className="p-1.5 rounded-xl bg-[#FDB913] text-black shrink-0 border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                <HelpCircle className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm font-black text-slate-900 leading-snug font-heading text-left flex-1 min-w-0">
                &ldquo;{currentFact}&rdquo;
              </p>
              {/* Speech Bubble Arrow */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FFFDF5] border-r-2 border-b-2 border-black rotate-45" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Center Mascot Render */}
        <div className="min-h-[220px] sm:min-h-[250px] w-full flex items-center justify-center">
          <motion.div
            key={variantIdx}
            initial={{ scale: 0.85, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={handleGenerate}
          >
            <QTMascot variant={currentVariant} size="2xl" />
          </motion.div>
        </div>

        {/* Button */}
        <div className="w-full pt-1 flex justify-center">
          <button
            type="button"
            onClick={handleGenerate}
            className="px-6 py-2.5 rounded-full font-black text-xs sm:text-sm font-heading transition-all border-2 border-black bg-[#30B2E7] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 cursor-pointer"
          >
            Generate Trivia
          </button>
        </div>

      </div>

    </div>
  );
}
