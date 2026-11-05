import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, BookOpen, Lightbulb, Puzzle, Compass, Rocket } from 'lucide-react';

const CURIOSITY_PROMPTS = [
  "Why is the sky blue?",
  "What causes a rainbow?",
  "How do octopuses breathe?",
  "Why do we dream?",
  "What makes stars shine?",
  "Growth through Curiosity..."
];

const ORBIT_ICONS = [
  { icon: HelpCircle, color: 'text-[#30B2E7]' },
  { icon: BookOpen, color: 'text-[#30B2E7]' },
  { icon: Lightbulb, color: 'text-[#FDB913]' },
  { icon: Puzzle, color: 'text-[#75B543]' },
  { icon: Compass, color: 'text-[#30B2E7]' },
  { icon: Rocket, color: 'text-[#75B543]' },
];

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [promptIdx, setPromptIdx] = useState(0);
  const [scene, setScene] = useState<1 | 2 | 3 | 4 | 5>(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (document.documentElement.classList.contains('skip-loader')) {
        setLoading(false);
        document.documentElement.classList.remove('loading-active');
        return;
      }
    }

    setLoading(true);

    const t1 = setTimeout(() => setScene(2), 200);  // Question stroke & particle burst
    const t2 = setTimeout(() => setScene(3), 600);  // QT Sleeping -> Awakens
    const t3 = setTimeout(() => setScene(4), 1000); // QT Curious & Orbiting Icons
    const t4 = setTimeout(() => setScene(5), 1400); // Icon expansion burst
    const tEnd = setTimeout(() => {
      setLoading(false);
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('loading-active');
      }
    }, 1800);

    const promptInterval = setInterval(() => {
      setPromptIdx((prev) => (prev + 1) % CURIOSITY_PROMPTS.length);
    }, 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tEnd);
      clearInterval(promptInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="curiosity-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FFFDF5] text-black select-none pointer-events-auto overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#30B2E7]/15 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FDB913]/20 rounded-full blur-3xl animate-pulse" />
          </div>

          {/* Center Stage */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-[260px]">
            {/* Scene 1: Bouncing Dot */}
            {scene === 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1], y: [0, -10, 0] }}
                transition={{ duration: 0.3 }}
                className="w-12 h-12 rounded-full bg-[#30B2E7] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-white text-xl"
              >
                ?
              </motion.div>
            )}

            {/* Scene 2: Question Stroke & Particle Burst */}
            {scene === 2 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative flex items-center justify-center"
              >
                <svg viewBox="0 0 100 100" className="w-24 h-24">
                  <motion.path
                    d="M 30 35 C 30 15, 70 15, 70 35 C 70 50, 50 45, 50 65 L 50 72"
                    fill="none"
                    stroke="#FDB913"
                    strokeWidth="10"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  />
                  <motion.circle
                    cx="50"
                    cy="88"
                    r="6"
                    fill="#30B2E7"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.2 }}
                  />
                </svg>

                {[0, 60, 120, 180, 240, 300].map((deg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.cos((deg * Math.PI) / 180) * 48,
                      y: Math.sin((deg * Math.PI) / 180) * 48
                    }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="absolute w-3 h-3 rounded-full bg-[#75B543] border border-black"
                  />
                ))}
              </motion.div>
            )}

            {/* Scenes 3, 4 & 5: QT Mascot & Orbiting Vector Icons */}
            {(scene === 3 || scene === 4 || scene === 5) && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative flex flex-col items-center justify-center"
              >
                {/* Orbiting Vector Icons */}
                {scene >= 4 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {ORBIT_ICONS.map((item, idx) => {
                      const IconComp = item.icon;
                      const angle = (idx / ORBIT_ICONS.length) * 2 * Math.PI;
                      const radius = 95;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: scene === 5 ? 0 : 1,
                            scale: scene === 5 ? 1.6 : 1,
                            x: Math.cos(angle) * (scene === 5 ? radius * 2.0 : radius),
                            y: Math.sin(angle) * (scene === 5 ? radius * 2.0 : radius),
                          }}
                          transition={{ duration: 0.4, delay: idx * 0.04 }}
                          className={`absolute p-2.5 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${item.color}`}
                        >
                          <IconComp className="w-5 h-5 stroke-[2.5]" />
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* QT Mascot */}
                <motion.div
                  animate={
                    scene === 5
                      ? { y: -80, scale: 0.7, opacity: 0 }
                      : { y: [0, -6, 0], rotate: [0, -2, 2, 0] }
                  }
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <img
                    src={scene === 3 ? '/assets/qt/QT Sleeping.svg' : '/assets/qt/Qt curious.svg'}
                    alt={scene === 3 ? 'QT Waking Up' : 'QT Curious'}
                    width="130"
                    height="130"
                    className="object-contain drop-shadow-md"
                  />
                  {scene === 3 && (
                    <motion.span
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="mt-2 px-4 py-1 text-xs font-black rounded-full border-2 border-black bg-[#FDB913] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-heading"
                    >
                      Curiosity Awakens...
                    </motion.span>
                  )}
                  {(scene === 4 || scene === 5) && (
                    <motion.span
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="mt-2 px-4 py-1 text-xs font-black rounded-full border-2 border-black bg-[#30B2E7] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-heading"
                    >
                      Ready to Explore!
                    </motion.span>
                  )}
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Rotating Prompts */}
          <div className="mt-6 h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={promptIdx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="text-sm sm:text-base font-black text-slate-900 tracking-tight font-heading"
              >
                {CURIOSITY_PROMPTS[promptIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <div className="w-52 h-3 bg-white rounded-full border-2 border-black overflow-hidden mt-4 relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
              className="h-full bg-[#30B2E7] rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
