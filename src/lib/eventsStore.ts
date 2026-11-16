export type EventCategory = 'School' | 'College' | 'Corporate' | 'Community';
export type EventButtonType = 'none' | 'register' | 'learn_more' | 'host_similar' | 'private';

export interface UpcomingEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  isoDate?: string;
  desc: string;
  venue?: string;
  isPrivate?: boolean;
  hideHostCta?: boolean;
  buttonType: EventButtonType;
  buttonText?: string;
  buttonUrl?: string;
}

/**
 * Filter out events whose dates have passed.
 * An event stays visible throughout the event day until midnight of that day.
 */
export function isEventUpcoming(ev: UpcomingEvent): boolean {
  try {
    const now = new Date();
    // Start of current day (00:00:00) - events occurring today remain visible
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    if (ev.isoDate) {
      const parsedIso = new Date(ev.isoDate).getTime();
      if (!isNaN(parsedIso)) {
        return parsedIso >= todayStart;
      }
    }

    if (ev.date) {
      const parsedDate = new Date(ev.date).getTime();
      if (!isNaN(parsedDate)) {
        return parsedDate >= todayStart;
      }
    }

    return true;
  } catch {
    return true;
  }
}

export const CATEGORY_OPTIONS: EventCategory[] = [
  'School',
  'College',
  'Corporate',
  'Community'
];

export const CATEGORY_BADGES: Record<EventCategory, { bg: string; text: string; border: string }> = {
  School: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-300'
  },
  Corporate: {
    bg: 'bg-amber-100',
    text: 'text-amber-900',
    border: 'border-amber-300'
  },
  College: {
    bg: 'bg-sky-100',
    text: 'text-sky-800',
    border: 'border-sky-300'
  },
  Community: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300'
  }
};

export const DEFAULT_EVENTS: UpcomingEvent[] = [
  {
    id: 'ev-1',
    title: 'Bengaluru Grand Quiz Fest',
    category: 'Community',
    date: 'Oct 15, 2026',
    desc: 'A massive city-wide trivia showdown for all age groups. Bring your family!',
    venue: 'Bengaluru / Public Arena',
    buttonType: 'register',
    buttonText: 'Register Now',
    buttonUrl: '/book-a-quiz'
  },
  {
    id: 'ev-2',
    title: 'The Tech History Showdown',
    category: 'College',
    date: 'Oct 22, 2026',
    desc: 'Test your knowledge on the evolution of technology, from the abacus to AI.',
    venue: 'Online & Campus Hubs',
    buttonType: 'register',
    buttonText: 'Register Now',
    buttonUrl: '/book-a-quiz'
  },
  {
    id: 'ev-3',
    title: 'QShala Corporate Clash',
    category: 'Corporate',
    date: 'Nov 05, 2026',
    desc: 'Compete against other top companies in this team-building trivia tournament.',
    venue: 'Bengaluru Tech Corridor',
    buttonType: 'learn_more',
    buttonText: 'Learn More',
    buttonUrl: '/companies'
  },
  {
    id: 'ev-4',
    title: 'National Curiosity Cup',
    category: 'School',
    date: 'Dec 10, 2026',
    desc: 'The grand finale of our nation-wide inter-school quiz competition.',
    venue: 'Pan-India Hybrid',
    buttonType: 'learn_more',
    buttonText: 'Learn More',
    buttonUrl: '/schools'
  }
];
