import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { 
  DEFAULT_EVENTS, 
  CATEGORY_BADGES, 
  type UpcomingEvent 
} from '../lib/eventsStore';

export default function UpcomingEventsSlider({ initialEvents }: { initialEvents?: UpcomingEvent[] } = {}) {
  const [events, setEvents] = useState<UpcomingEvent[]>(() => {
    return initialEvents && initialEvents.length > 0 ? initialEvents : DEFAULT_EVENTS;
  });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialEvents && initialEvents.length > 0) {
      setEvents(initialEvents);
    }
  }, [initialEvents]);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [events]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = 380; // Approximate card width + gap
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative w-full">
        {/* Left Sideways Navigation Arrow (Desktop / Tablet) */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            aria-label="Previous events"
            className="hidden sm:flex absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border-2 border-black bg-white hover:bg-slate-100 text-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] items-center justify-center font-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="w-full flex gap-5 sm:gap-6 overflow-x-auto scrollbar-none py-4 snap-x snap-mandatory scroll-smooth px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {events.map((ev) => {
            const badgeStyle = CATEGORY_BADGES[ev.category] || CATEGORY_BADGES.School;
            const hasButton = ev.buttonType && ev.buttonType !== 'none';
            const isRegister = ev.buttonType === 'register';
            const defaultBtnText = isRegister ? 'Register Now' : 'Learn More';
            const btnLabel = ev.buttonText?.trim() || defaultBtnText;
            const btnHref = ev.buttonUrl?.trim() || (isRegister ? '/book-a-quiz' : '/services');

            return (
              <div
                key={ev.id}
                className="w-[84vw] max-w-[340px] sm:w-[350px] md:w-[380px] shrink-0 bg-white rounded-3xl p-6 sm:p-7 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between snap-start transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group"
              >
                {/* Top Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    {/* Category badge strictly one of 4 options */}
                    <span
                      className={`px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider font-heading border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                    >
                      {ev.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.date}</span>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading leading-tight group-hover:text-[#30B2E7] transition-colors">
                    {ev.title}
                  </h3>

                  <p className="text-slate-600 text-sm font-medium leading-relaxed">
                    {ev.desc}
                  </p>
                </div>

                {/* Bottom CTA Button - Only rendered if buttonType is not 'none' */}
                {hasButton ? (
                  <div className="pt-6 mt-2">
                    <a
                      href={btnHref}
                      className={`w-full py-3.5 px-6 rounded-full font-black text-xs uppercase font-heading border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 ${
                        isRegister
                          ? 'bg-[#30B2E7] hover:bg-sky-400 text-white'
                          : 'bg-[#9333EA] hover:bg-purple-600 text-white'
                      }`}
                    >
                      <span>{btnLabel}</span>
                      <span className="text-sm">→</span>
                    </a>
                  </div>
                ) : (
                  <div className="pt-3">
                    <div className="h-2" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Sideways Navigation Arrow (Desktop / Tablet) */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            aria-label="Next events"
            className="hidden sm:flex absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border-2 border-black bg-[#FDB913] hover:bg-amber-400 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] items-center justify-center font-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Mobile-Only Navigation Controls Row (< sm) */}
      <div className="flex sm:hidden items-center justify-between px-2 pt-1">
        <span className="text-xs font-bold text-slate-500 font-heading">
          Swipe or tap &rarr;
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous events"
            className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border-2 border-black flex items-center justify-center font-black transition-all ${
              canScrollLeft
                ? 'bg-white text-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 cursor-pointer'
                : 'bg-slate-100 text-slate-300 border-slate-300 opacity-40 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Next events"
            className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border-2 border-black flex items-center justify-center font-black transition-all ${
              canScrollRight
                ? 'bg-[#FDB913] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 cursor-pointer'
                : 'bg-slate-100 text-slate-300 border-slate-300 opacity-40 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
