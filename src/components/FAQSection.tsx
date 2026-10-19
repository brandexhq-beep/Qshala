import { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

const MASCOT_ROTATION = [
  '/assets/qt/QT Idea.svg',
  '/assets/qt/QT quizzing.svg',
  '/assets/qt/QT reading.svg',
  '/assets/qt/QT professional.svg',
  '/assets/qt/Qt curious.svg',
  '/assets/qt/QT sherlock.svg',
  '/assets/qt/QT with trophy.svg',
  '/assets/qt/QT holding money.svg',
  '/assets/qt/QT jumping.svg',
  '/assets/qt/QT happy.svg',
];

const FAQS = [
  {
    question: 'What makes QShala different from traditional quiz competitions?',
    answer: 'Traditional quizzes test rote memorization of static facts. QShala focuses on Socratic storytelling, critical thinking, and "Why?" questions to turn learning into an active discovery quest.',
    mascot: '/assets/qt/QT Idea.svg',
  },
  {
    question: 'Are QShala sessions conducted online or in-person?',
    answer: 'Both! We host live in-person workshops, auditoriums, and stage championships, as well as hybrid and fully remote sessions with digital buzzers and real-time leaderboards.',
    mascot: '/assets/qt/QT quizzing.svg',
  },
  {
    question: 'How do QShala Quriosity Clubs fit into a school timetable?',
    answer: 'QShala Quriosity Clubs are 40 to 60-minute weekly modules that easily complement standard General Knowledge, Library, or Life Skills periods for Grades 1 through 12.',
    mascot: '/assets/qt/QT reading.svg',
  },
  {
    question: 'How do corporate trivia sessions improve team bonding?',
    answer: 'Shared play creates psychological safety. Our low-pressure, high-fun trivia tournaments bond cross-functional teams and boost workplace connection across hybrid offices.',
    mascot: '/assets/qt/QT professional.svg',
  },
  {
    question: 'What age groups are QShala programs designed for?',
    answer: 'We have age-tailored programs for Primary (Grades 1-4: Quriosity Builders), Middle School (Grades 5-8: Quriosity Explorers), and High School (Grades 9-12: Quriosity Thinkers).',
    mascot: '/assets/qt/Qt curious.svg',
  },
  {
    question: 'Can QShala customize trivia around our company history and products?',
    answer: 'Yes! We frequently design custom brand trivia, company milestone quizzes, and onboarding challenges tailored specifically to your corporate culture.',
    mascot: '/assets/qt/QT sherlock.svg',
  },
  {
    question: 'What formats are offered for college campus fests and hackathons?',
    answer: 'We bring professional quizmasters, domain researchers, and multimedia buzzer setups for law moot court festivals, B-school strategy leagues, and STEM hackathons across India\'s top colleges.',
    mascot: '/assets/qt/QT with trophy.svg',
  },
  {
    question: 'Can families or community groups host a private quiz or game night?',
    answer: 'Absolutely! We conduct screen-free weekend family game nights and apartment society tournaments where kids, parents, and grandparents collaborate on mixed teams.',
    mascot: '/assets/qt/QT holding money.svg',
  },
];

interface Props {
  items?: Array<{ question: string; answer: string; mascot?: string }>;
}

export default function FAQSection({ items }: Props = {}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const data = items && items.length > 0 ? items : FAQS;

  return (
    <div className="space-y-10 w-full max-w-6xl mx-auto">
      {/* 2-Column Compact Grid (No harsh lines) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {data.map((faq, idx) => {
          const isOpen = openIdx === idx;
          const mascotPath = faq.mascot || MASCOT_ROTATION[idx % MASCOT_ROTATION.length];
          const mascotSrc = encodeURI(mascotPath);

          return (
            <div
              key={idx}
              className={`bg-white rounded-3xl transition-all duration-200 overflow-hidden ${
                isOpen 
                  ? 'bg-white shadow-md ring-1 ring-[#30B2E7]/30' 
                  : 'bg-white/90 shadow-xs hover:shadow-sm'
              }`}
            >
              {/* Question Trigger */}
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-3 sm:gap-4 font-black font-heading text-slate-900 transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30B2E7] focus-visible:ring-offset-2 min-h-[48px]"
              >
                <span className="text-base sm:text-lg leading-snug flex-1 min-w-0">{faq.question}</span>
                <div
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isOpen ? 'bg-[#30B2E7] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {/* Answer Panel */}
              {isOpen && (
                <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0 text-slate-700 text-sm sm:text-base font-semibold leading-relaxed flex items-start gap-3 sm:gap-4">
                  <p className="flex-1 min-w-0">{faq.answer}</p>
                  <img
                    src={mascotSrc}
                    alt="QT Mascot"
                    width={48}
                    height={48}
                    className="shrink-0 object-contain w-9 h-9 sm:w-12 sm:h-12 pointer-events-none self-end"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/qt/QT%20Idea.svg';
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Styled Link to Full FAQ Page */}
      <div className="flex justify-center pt-2">
        <a
          href="/faq"
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#30B2E7] hover:bg-sky-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider font-heading shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30B2E7] focus-visible:ring-offset-2"
        >
          <span>View All FAQs &amp; Help Center</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}
