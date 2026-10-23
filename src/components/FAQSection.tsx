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
    question: 'How much does a quiz cost, and are there any fees?',
    answer:
      "The Zerodha Varsity quizzes are free for participants. So are the other quizzes we host on behalf of organisations, including Safety Quest with the Arundhati Foundation. Check our Events section to see what's coming up. And if you'd like to host a quiz of your own, let's talk and see if we can build something unique for you.",
    mascot: '/assets/qt/QT Idea.svg',
  },
  {
    question: 'How many people can take part, and how long does a session run?',
    answer:
      "There's no minimum or maximum group size, so we plan around the people you have. Sessions typically run 30 minutes or more, and that's the format we'd suggest. We can be flexible, but 30 minutes is the least we need to connect with your group and get everyone enjoying the questions. Tell us how many people you expect and how much time you have, and we'll suggest a format that fits.",
    mascot: '/assets/qt/QT quizzing.svg',
  },
  {
    question: 'How far ahead should we book?',
    answer:
      "The earlier you tell us, the more we can tailor the quiz to your group, and custom events need a little more time than standard ones. Write to us with your date and we'll tell you honestly whether it works.",
    mascot: '/assets/qt/QT reading.svg',
  },
  {
    question: 'Can you build the quiz around our company, school, campus or community?',
    answer:
      "Yes, and we'd love to. We can shape the questions around your people, your products or your theme, so the quiz feels like yours. We also offer quizzes in Hindi and Kannada, as well as English. Tell us who's playing and what you'd like to bring in, and we'll suggest rounds.",
    mascot: '/assets/qt/QT professional.svg',
  },
  {
    question: 'Is the quiz online or in person, and what do you bring?',
    answer:
      "Both. We run quizzes in person and online, and we'll recommend whichever suits your group and space. For in-person quizzes, we bring the buzzers and sound. You'd arrange the screen and the venue. Tell us where you're hosting and we'll work out the rest together.",
    mascot: '/assets/qt/Qt curious.svg',
  },
  {
    question: "Will our team enjoy it if they aren't quiz people?",
    answer:
      "Absolutely. That's the group we plan for. All our activities are made so that people have fun naturally. It's never forced, nobody has to work at it, and the learning slips in without anyone noticing. The games are light, and they're a lovely way for colleagues to bond. Teams play together, so quieter colleagues can join in at their own pace. Tell us about your group and we'll set the right mix.",
    mascot: '/assets/qt/QT sherlock.svg',
  },
  {
    question: 'How do you work with schools, and what is asked of teachers?',
    answer:
      "We plan quizzes and Quriosity programs around your timetable, so tell us what works for you. We'll agree in advance what we take care of and what we'd need from your staff. We're happy to offer a demo so you can see how it feels first.",
    mascot: '/assets/qt/QT reading.svg',
  },
  {
    question: 'What can you run for college fests and student clubs?',
    answer:
      "We can run a standalone quiz or add themed rounds to your fest, in person or online. Do have a look at our Colleges services page, where you'll find custom quizzes we've built for specific departments, including finance and law. Tell us the size and format of your event and we'll suggest what fits.",
    mascot: '/assets/qt/QT with trophy.svg',
  },
  {
    question: 'Can we book a quiz for a family gathering, housing society or friends?',
    answer:
      "Yes. We run quizzes for communities and can build one around your occasion, with questions that work for different ages playing together. Tell us who's coming and when, and we'll send you a quote.",
    mascot: '/assets/qt/QT holding money.svg',
  },
  {
    question: 'What is QQL Club?',
    answer:
      'QQL Club is a quiz membership for ₹499 for six months from the day you join, open to all ages. Each month you get a Monthly Mega Quiz by email to take at your own pace.',
    mascot: '/assets/qt/QT jumping.svg',
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
