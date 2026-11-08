import { useState } from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  category: 'Blog' | 'Events';
  readTime: string;
  summary: string;
  image: string;
  date?: string;
  photoCount?: number;
}

const ALL_BLOG_POSTS: BlogPost[] = [
  {
    slug: "bangalore-inter-school-quriosity-cup-2026",
    title: "Bangalore Inter-School Quriosity Cup 2026",
    category: "Events",
    readTime: "Photo Gallery",
    summary: "Over 1,200 student quizzers representing 64 schools competed across 4 adrenaline-pumping buzzer rounds at St. John's Auditorium.",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "dps-bangalore-quriosity-league",
    title: "How DPS Transformed General Knowledge into an Active Weekly Sport for 4,000+ Students",
    category: "Events",
    readTime: "Photo Gallery",
    summary: "Replacing static encyclopedic learning with QShala interactive storytelling and weekly quriosity modules increased student participation by 340%.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "why-rote-learning-kills-quriosity",
    title: "Why Rote Learning Kills Quriosity (And How to Fix It)",
    category: "Blog",
    readTime: "5 min read",
    summary: "Standard GK worksheets ask children to memorize facts without asking why. We explore socratic dialogue methods that unlock original thinking.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop"
  }
];

const FILTERS = [
  { id: 'All', label: 'All' },
  { id: 'Blog', label: 'Blog' },
  { id: 'Events', label: 'Events' },
] as const;

interface BlogShowcaseProps {
  initialPosts?: BlogPost[];
}

export default function BlogShowcase({ initialPosts }: BlogShowcaseProps = {}) {
  const [filter, setFilter] = useState<'All' | 'Blog' | 'Events'>('All');

  // If initialPosts is provided (even if empty after deleting old placeholder blocks), respect it!
  const sourcePosts = initialPosts !== undefined ? initialPosts : ALL_BLOG_POSTS;

  const visiblePosts = filter === 'All'
    ? sourcePosts
    : sourcePosts.filter((p) => p.category === filter);

  return (
    <div className="w-full space-y-8">
      {/* Category Filter Pills */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-none pb-2 px-1">
        {FILTERS.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-full font-black text-xs font-heading transition-all whitespace-nowrap cursor-pointer min-h-[38px] ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Unified Blog Grid (Title, Summary, Action Button - extraneous date/photo labels excluded per client preference) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
        {visiblePosts.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-3">
            <p className="text-slate-700 font-bold text-base sm:text-lg">No stories published in this category yet.</p>
            <p className="text-slate-500 text-sm font-medium">New posts published in Sanity will appear here automatically.</p>
          </div>
        ) : (
          visiblePosts.map((post) => {
            const isEvent = post.category === 'Events';

            return (
              <article 
                key={post.slug}
                className="rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {post.image && (
                  <a href={`/blog/${post.slug}`} className="block h-52 w-full overflow-hidden shrink-0 bg-slate-100 relative">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy"
                    />
                  </a>
                )}
                
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow space-y-5">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-black uppercase font-heading">
                      <span 
                        className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wider ${
                          isEvent 
                            ? 'bg-[#FDB913]/25 text-amber-900 border border-amber-300/60' 
                            : 'bg-[#30B2E7]/15 text-[#30B2E7] border border-sky-200/60'
                        }`}
                      >
                        {post.category}
                      </span>
                      {post.readTime && (
                        <span className="text-slate-500 text-[11px] font-bold">{post.readTime}</span>
                      )}
                    </div>

                    <a href={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-black font-heading group-hover:text-[#30B2E7] transition-colors leading-snug text-slate-900 line-clamp-2">
                        {post.title}
                      </h2>
                    </a>

                    <p className="text-slate-700 text-xs sm:text-sm font-semibold leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>
                  </div>

                  {/* Clean Action Button */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                    <a
                      href={`/blog/${post.slug}`}
                      className="px-5 py-2.5 rounded-full bg-[#FDB913] hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider font-heading shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all inline-flex items-center gap-1.5 min-h-[44px]"
                    >
                      <span>Read</span>
                      <span>&rarr;</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
