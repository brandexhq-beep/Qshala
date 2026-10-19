import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ArrowUpRight } from 'lucide-react';
import QTMascot from './QTMascot';
import type { CaseStudyItem } from '../lib/data';

interface Props {
  caseStudies: CaseStudyItem[];
}

const CASE_STUDY_IMAGES: Record<string, string> = {
  'dps-bangalore-quriosity-league': '/assets/media/schools/qe1.webp',
  'flipkart-corporate-trivia-league': '/assets/media/corporate/qe3.webp',
  'wipro-onboarding-gamification': '/assets/media/corporate/corp_hertie.webp',
  'nps-socratic-science-storytelling': '/assets/media/schools/2.webp',
  'inventure-academy-critical-thinking': '/assets/media/schools/3.webp',
  'tcs-cross-hub-workplace-engagement': '/assets/media/corporate/photo-2026-10-09-16-30-40.webp',
  'iit-bombay-techfest-championship': '/assets/media/colleges/c1.webp',
  'iim-bangalore-business-simulations': '/assets/media/colleges/c2.webp',
  'sobha-city-family-game-nights': '/assets/media/crowd/dsc07829.webp',
  'wework-community-networking-nights': '/assets/media/corporate/qe5.webp',
};

const CATEGORY_STYLES: Record<string, { bg: string; text: string; buttonBg: string; buttonHover: string; solidText: string }> = {
  School: { bg: 'bg-[#75B543]/15', text: 'text-[#75B543]', buttonBg: 'bg-[#75B543]', buttonHover: 'hover:bg-emerald-600', solidText: 'text-white' },
  Corporate: { bg: 'bg-[#FDB913]/25', text: 'text-amber-800', buttonBg: 'bg-[#FDB913]', buttonHover: 'hover:bg-amber-400', solidText: 'text-slate-950' },
  College: { bg: 'bg-[#30B2E7]/15', text: 'text-[#30B2E7]', buttonBg: 'bg-[#30B2E7]', buttonHover: 'hover:bg-sky-500', solidText: 'text-white' },
  Community: { bg: 'bg-[#9333EA]/15', text: 'text-[#9333EA]', buttonBg: 'bg-[#9333EA]', buttonHover: 'hover:bg-purple-600', solidText: 'text-white' },
};

export default function InteractiveCaseStudiesShowcase({ caseStudies }: Props) {
  // Curated items for homepage rotation
  const displayStudies = caseStudies.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedModalCase, setSelectedModalCase] = useState<CaseStudyItem | null>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayStudies.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayStudies.length) % displayStudies.length);
  };

  const handleModalNext = () => {
    const idx = displayStudies.findIndex((s) => s.id === selectedModalCase?.id);
    if (idx !== -1) {
      const nextIdx = (idx + 1) % displayStudies.length;
      setSelectedModalCase(displayStudies[nextIdx]);
      setCurrentIndex(nextIdx);
    }
  };

  const handleModalPrev = () => {
    const idx = displayStudies.findIndex((s) => s.id === selectedModalCase?.id);
    if (idx !== -1) {
      const prevIdx = (idx - 1 + displayStudies.length) % displayStudies.length;
      setSelectedModalCase(displayStudies[prevIdx]);
      setCurrentIndex(prevIdx);
    }
  };

  const cs = displayStudies[currentIndex % displayStudies.length];
  const mascotVariants = ['sherlock', 'quizzing', 'idea', 'reading', 'professional'] as const;
  const mascot = mascotVariants[currentIndex % mascotVariants.length];
  const currentImage = CASE_STUDY_IMAGES[cs.slug] || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop';
  const catStyle = CATEGORY_STYLES[cs.clientType] || CATEGORY_STYLES.School;

  return (
    <div className="space-y-6">
      {/* Simplified Case Study Card: Photo, School Name & One Clean Text Box */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={cs.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_e, { offset }) => {
              if (offset.x < -60) handleNext();
              else if (offset.x > 60) handlePrev();
            }}
            className="bg-white rounded-3xl p-5 sm:p-8 md:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between h-full w-full cursor-grab active:cursor-grabbing"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Photo Column */}
              <div className="lg:col-span-5 relative">
                <div className="overflow-hidden rounded-2xl aspect-[4/3] bg-slate-100 shadow-sm">
                  <img
                    src={currentImage}
                    alt={cs.clientName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -top-3 -right-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                  <QTMascot variant={mascot} size="sm" />
                </div>
              </div>

              {/* School Name & Single Text Box */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3.5 py-1 rounded-full ${catStyle.bg} ${catStyle.text} font-black text-xs uppercase font-heading`}>
                    {cs.clientType}
                  </span>
                  <span className="text-slate-900 font-black text-sm uppercase tracking-wider font-heading">
                    {cs.clientName}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading leading-tight">
                  {cs.title}
                </h3>

                {/* Single Consolidated Text Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100/90 text-slate-700 text-sm sm:text-base font-semibold leading-relaxed">
                  {cs.summary}
                </div>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={`/blog/${cs.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#30B2E7] hover:bg-sky-500 text-white font-black text-xs uppercase tracking-wider font-heading shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <span>Read Event Story &amp; View Photos</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setSelectedModalCase(cs)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase tracking-wider font-heading transition-all cursor-pointer"
                  >
                    <span>Quick Preview</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-100">
              {/* Dots */}
              <div className="flex items-center gap-2">
                {displayStudies.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to case study ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx ? 'w-8 bg-[#30B2E7]' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-400 font-heading">
                  {currentIndex + 1} / {displayStudies.length}
                </span>
                <button
                  onClick={handlePrev}
                  className="p-2.5 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-all hover:scale-105 cursor-pointer shadow-sm flex items-center justify-center"
                  title="Previous Story"
                  aria-label="Previous Story"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 min-w-[44px] min-h-[44px] rounded-full bg-[#FDB913] hover:bg-amber-400 text-slate-950 font-bold transition-all hover:scale-105 cursor-pointer shadow-sm flex items-center justify-center"
                  title="Next Story"
                  aria-label="Next Story"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* DETAILED CASE STUDY MODAL */}
      <AnimatePresence>
        {selectedModalCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-3xl p-5 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-6 max-h-[calc(100dvh-2rem)] overflow-y-auto scroll-touch border border-slate-100"
            >
              <button
                onClick={() => setSelectedModalCase(null)}
                aria-label="Close case study dialog"
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <span className={`px-3.5 py-1 rounded-full ${(CATEGORY_STYLES[selectedModalCase.clientType] || CATEGORY_STYLES.School).buttonBg} ${(CATEGORY_STYLES[selectedModalCase.clientType] || CATEGORY_STYLES.School).solidText} font-black text-xs uppercase font-heading shadow-sm`}>
                  {selectedModalCase.clientType} • {selectedModalCase.clientName}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading leading-tight pt-2">
                  {selectedModalCase.title}
                </h3>
              </div>

              <div className="space-y-4 text-slate-700 text-sm font-semibold leading-relaxed">
                <div>
                  <h4 className="text-base font-black text-slate-900 font-heading mb-1">Background &amp; Challenge</h4>
                  <p>{selectedModalCase.summary}</p>
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 font-heading mb-1">QShala Execution Strategy</h4>
                  <p>Deployed live socratic quiz masters, custom trivia mechanics, and real-time interactive leaderboards designed to foster critical thinking and genuine engagement.</p>
                </div>
              </div>

              <blockquote className="border-l-4 border-[#FDB913] pl-4 py-3 bg-[#FFFDF5] rounded-r-2xl border border-amber-100">
                <p className="text-slate-800 text-sm font-semibold italic">&ldquo;{selectedModalCase.quote.text}&rdquo;</p>
                <footer className="text-slate-900 font-black text-xs not-italic mt-1 font-heading">
                  — {selectedModalCase.quote.author}, {selectedModalCase.quote.role}
                </footer>
              </blockquote>

              <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleModalPrev}
                    aria-label="View previous case study"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs font-heading transition-colors cursor-pointer min-h-[40px] active:scale-95"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev Story</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleModalNext}
                    aria-label="View next case study"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs font-heading transition-colors cursor-pointer min-h-[40px] active:scale-95"
                  >
                    <span>Next Story</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`/blog/${selectedModalCase.slug}`}
                    className="px-5 py-2.5 rounded-full bg-[#30B2E7] hover:bg-sky-500 text-white font-black text-xs uppercase tracking-wider font-heading shadow-sm hover:shadow-md transition-all text-center min-h-[40px] flex items-center justify-center"
                  >
                    View Photos &amp; Event Story &rarr;
                  </a>
                  <a
                    href="/contact"
                    className="px-5 py-2.5 rounded-full bg-[#75B543] hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider font-heading shadow-sm hover:shadow-md transition-all text-center min-h-[40px] flex items-center justify-center"
                  >
                    Schedule &rarr;
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
