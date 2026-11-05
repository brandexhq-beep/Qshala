import { useState } from 'react';
import QTMascot from './QTMascot';

interface ArchiveEvent {
  id: string;
  title: string;
  year: number;
  month: string; // "Jan", "Feb", etc.
  dateString: string;
  category: 'Schools' | 'Corporates' | 'Colleges' | 'Community';
  description: string;
  highlights: string[];
  winners: string[];
  imageSrc: string;
  badge: string;
  cardColor: string;
}

const ARCHIVE_EVENTS: ArchiveEvent[] = [
  {
    id: 'arch-1',
    title: 'NPS Indiranagar Culmination Quiz | Finals 2025',
    year: 2025,
    month: 'Feb',
    dateString: 'February 15, 2025',
    category: 'Schools',
    description: 'Winner names, school names, Highlights, and Socratic round scores. 400+ students competed across middle & high school divisions in live stage rounds.',
    highlights: [
      'Top score: 480 points in Buzzer Round',
      'Over 40 participating school branches',
      'Socratic civics & science spotlight question round'
    ],
    winners: ['NPS Indiranagar (Gold)', 'DPS Bangalore East (Silver)', 'Greenwood High (Bronze)'],
    imageSrc: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
    badge: 'School Finals',
    cardColor: '#FFF8E1'
  },
  {
    id: 'arch-2',
    title: 'Inter-School Science & Civics League | Regional Finals 2025',
    year: 2025,
    month: 'Jan',
    dateString: 'January 28, 2025',
    category: 'Schools',
    description: '120+ participating schools across South India competing in Socratic reasoning, environmental science, and current affairs storytelling.',
    highlights: [
      'Interactive live buzzer technology',
      'Quriosity project exhibition round',
      'Guest Quizmaster Sachin Ravi on stage'
    ],
    winners: ['The National Hill View Public School', 'Inventure Academy', 'St. Joseph Boys High School'],
    imageSrc: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
    badge: 'Regional Finals',
    cardColor: '#E8F6FD'
  },
  {
    id: 'arch-3',
    title: 'QShala Corporate Championship | Tech & Innovation 2024',
    year: 2024,
    month: 'Nov',
    dateString: 'November 20, 2024',
    category: 'Corporates',
    description: 'High-octane corporate engagement tournament hosted for Flipkart, Wipro, TCS, Infosys, and Google teams featuring gamified company history and tech trivia.',
    highlights: [
      '80+ corporate teams competing live',
      'Hybrid audience voting & poll rounds',
      'Custom company heritage & values rounds'
    ],
    winners: ['Team Flipkart Alpha', 'Wipro Innovations', 'TCS Cyber Stars'],
    imageSrc: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    badge: 'Corporate League',
    cardColor: '#EDF7E5'
  },
  {
    id: 'arch-4',
    title: 'State-Wide Family Quriosity Fest 2024',
    year: 2024,
    month: 'Sep',
    dateString: 'September 14, 2024',
    category: 'Community',
    description: 'Live arena event with 500+ parent-child teams competing in dinner table trivia, socratic puzzles, and real-time quriosity leaderboards.',
    highlights: [
      'Parent-child team format',
      '500+ live family participants',
      'Quriosity Store book & game rewards'
    ],
    winners: ['Team Curious Explorers', 'Team Socratic Brains', 'Team Mind Sparks'],
    imageSrc: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop',
    badge: 'Community Fest',
    cardColor: '#FFF8E1'
  },
  {
    id: 'arch-5',
    title: 'National Junior Qualifier Finals 2024',
    year: 2024,
    month: 'Jun',
    dateString: 'June 10, 2024',
    category: 'Schools',
    description: 'Our annual Forbes-30-under-30 style mega Qualifier of news, science, authentic knowledge, and critical thinking with the QShala stamp.',
    highlights: [
      'Nationwide online & offline qualifiers',
      'Socratic debate final round',
      'Certificate & trophy ceremony'
    ],
    winners: ['Bengaluru Chapter Winners', 'Mumbai Chapter Winners', 'Hyderabad Chapter Winners'],
    imageSrc: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    badge: 'National Qualifier',
    cardColor: '#E8F6FD'
  }
];

const YEARS = ['All Years', '2026', '2025', '2024', '2023', '2022'] as const;
const MONTHS = ['All Months', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export default function ArchiveEventsList() {
  const [selectedYear, setSelectedYear] = useState<string>('All Years');
  const [selectedMonth, setSelectedMonth] = useState<string>('All Months');
  const [activeModalEvent, setActiveModalEvent] = useState<ArchiveEvent | null>(null);

  const filteredEvents = ARCHIVE_EVENTS.filter((event) => {
    const matchYear = selectedYear === 'All Years' || event.year.toString() === selectedYear;
    const matchMonth = selectedMonth === 'All Months' || event.month === selectedMonth;
    return matchYear && matchMonth;
  });

  const handleModalNext = () => {
    const idx = filteredEvents.findIndex((e) => e.id === activeModalEvent?.id);
    if (idx !== -1) {
      const nextIdx = (idx + 1) % filteredEvents.length;
      setActiveModalEvent(filteredEvents[nextIdx]);
    }
  };

  const handleModalPrev = () => {
    const idx = filteredEvents.findIndex((e) => e.id === activeModalEvent?.id);
    if (idx !== -1) {
      const prevIdx = (idx - 1 + filteredEvents.length) % filteredEvents.length;
      setActiveModalEvent(filteredEvents[prevIdx]);
    }
  };

  return (
    <div className="w-full space-y-8">
      
      {/* Header & Date Filter Control Bar matching wireframe brief */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-[#FDB913] text-slate-950 font-black text-xs uppercase font-heading">
              Past Events &amp; Championships
            </span>
            <QTMascot variant="trophy" size="sm" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading tracking-tight mt-2">
            Quiz Archive
          </h2>
          <p className="text-slate-600 text-sm font-semibold pt-1">
            Browse winner lists, school standings, event highlights, and event summary reports.
          </p>
        </div>

        {/* Date Filters Dropdown Bar (Matching Wireframe Brief) */}
        <div className="flex items-center gap-3 flex-wrap bg-white p-3 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-xs font-black uppercase text-slate-700 font-heading pl-2">
            Filter by Date:
          </span>

          {/* Year Filter */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 rounded-xl bg-slate-100 text-slate-900 font-black text-xs font-heading border border-slate-900 cursor-pointer focus:outline-none"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  Year: {y}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-900">
              <svg className="w-3.5 h-3.5 fill-current text-slate-900" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </div>
          </div>

          {/* Month Filter */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 rounded-xl bg-slate-100 text-slate-900 font-black text-xs font-heading border border-slate-900 cursor-pointer focus:outline-none"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  Month: {m}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-900">
              <svg className="w-3.5 h-3.5 fill-current text-slate-900" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </div>
          </div>

          {(selectedYear !== 'All Years' || selectedMonth !== 'All Months') && (
            <button
              onClick={() => {
                setSelectedYear('All Years');
                setSelectedMonth('All Months');
              }}
              className="text-xs font-black text-[#30B2E7] hover:underline px-2 font-heading"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Archive Event Cards List (Matching Brief Card Style) */}
      <div className="space-y-6 w-full">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border-2 border-slate-900 space-y-3">
            <QTMascot variant="curious" size="md" />
            <h3 className="text-xl font-black font-heading text-slate-900">No events found for selected date filter</h3>
            <p className="text-slate-600 text-xs font-semibold">Try selecting "All Years" or "All Months" to view past events.</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="p-5 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full"
              style={{ backgroundColor: event.cardColor }}
            >
              {/* Event Image */}
              <div className="md:col-span-4">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] border-2 border-slate-900 bg-white shadow-sm">
                  <img
                    src={event.imageSrc}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Event Details */}
              <div className="md:col-span-8 space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-0.5 rounded-full bg-white text-slate-900 font-black text-xs font-heading border border-slate-900 shadow-sm inline-flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 fill-current text-slate-900" viewBox="0 0 24 24">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                      </svg>
                      <span>{event.dateString}</span>
                    </span>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 font-heading">
                      Category: {event.category}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading leading-tight">
                    {event.title}
                  </h3>

                  <p className="text-slate-800 text-sm font-semibold leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Winners Badge List */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-black uppercase text-slate-600 font-heading inline-flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 fill-current text-amber-600" viewBox="0 0 24 24">
                      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 17.9V20H8v2h8v-2h-3v-2.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
                    </svg>
                    <span>Winners &amp; Standings:</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {event.winners.map((winner, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-white text-slate-900 font-black text-xs font-heading border border-slate-900 shadow-sm"
                      >
                        {winner}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA Button matching brief yellow Read More button */}
                <div className="pt-3 border-t border-slate-900/10 flex items-center justify-between">
                  <button
                    onClick={() => setActiveModalEvent(event)}
                    className="px-6 py-2.5 rounded-full bg-[#FDB913] hover:bg-amber-400 text-slate-950 font-black text-xs uppercase font-heading border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    <span>Read More</span>
                    <svg className="w-3.5 h-3.5 fill-current text-slate-950" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>

                  <span className="text-xs font-bold text-slate-600 hidden sm:inline font-heading">
                    Image Carousel &amp; Event Summary Available
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Detailed Report Viewer */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-[#FFFDF5] rounded-3xl border-4 border-slate-900 shadow-2xl max-w-2xl w-full p-5 sm:p-8 space-y-6 max-h-[calc(100dvh-2rem)] overflow-y-auto scroll-touch animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-[#FDB913] text-slate-950 font-black text-xs font-heading uppercase">
                  {activeModalEvent.badge}
                </span>
                <h3 className="text-2xl font-black text-slate-900 font-heading leading-tight pt-1">
                  {activeModalEvent.title}
                </h3>
                <p className="text-xs font-bold text-slate-500 font-heading">
                  {activeModalEvent.dateString}
                </p>
              </div>

              <button
                onClick={() => setActiveModalEvent(null)}
                aria-label="Close archive details dialog"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-sm border-2 border-slate-900 flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-transform"
              >
                <svg className="w-5 h-5 fill-current text-slate-900" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border-2 border-slate-900 aspect-[16/9]">
                <img
                  src={activeModalEvent.imageSrc}
                  alt={activeModalEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-black uppercase text-slate-900 font-heading">Event Highlights &amp; Summary:</h4>
                <ul className="space-y-1.5 text-xs font-semibold text-slate-700 list-disc list-inside">
                  {activeModalEvent.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-black uppercase text-slate-900 font-heading">Winners:</h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalEvent.winners.map((w, i) => (
                    <span key={i} className="px-3 py-1 bg-[#EDF7E5] text-slate-900 font-black text-xs rounded-full border border-slate-900">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-slate-900 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleModalPrev}
                  aria-label="Previous event"
                  className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs font-heading border border-slate-300 min-h-[40px] flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>&larr;</span>
                  <span>Prev Event</span>
                </button>
                <button
                  type="button"
                  onClick={handleModalNext}
                  aria-label="Next event"
                  className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs font-heading border border-slate-300 min-h-[40px] flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>Next Event</span>
                  <span>&rarr;</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  onClick={() => setActiveModalEvent(null)}
                  className="w-full sm:w-auto px-5 py-3 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-black text-xs font-heading text-center min-h-[44px]"
                >
                  Close
                </button>

                <a
                  href="/book-a-quiz"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#30B2E7] hover:bg-sky-400 text-white font-black text-xs uppercase font-heading border-2 border-slate-900 shadow-md text-center min-h-[44px] flex items-center justify-center"
                >
                  Host Quiz &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
