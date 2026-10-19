import { useState } from 'react';
import { motion } from 'framer-motion';

interface GalleryPhoto {
  id: string;
  title: string;
  tag: string;
  category: 'School' | 'Corporate' | 'College';
  tagColor: string;
  image: string;
  objectPosition?: string;
}

const CATEGORIES = ['All Moments', 'Schools', 'Corporate', 'Colleges'] as const;

const CATEGORY_LINKS: Record<string, string> = {
  School: '/schools',
  Schools: '/schools',
  Corporate: '/companies',
  College: '/colleges',
  Colleges: '/colleges'
};

const AUDIENCE_PHOTOS: GalleryPhoto[] = [
  {
    id: 'school-1',
    title: 'Curious students with QShala learning kits in classroom',
    tag: 'Schools',
    category: 'School',
    tagColor: '#75B543',
    image: '/assets/media/schools/qe1.webp',
    objectPosition: 'center 40%'
  },
  {
    id: 'corporate-1',
    title: 'Cross-functional teams cheering during live trivia round',
    tag: 'Corporate',
    category: 'Corporate',
    tagColor: '#FDB913',
    image: '/assets/media/corporate/qe3.webp',
    objectPosition: 'center 45%'
  },
  {
    id: 'college-1',
    title: 'Campus festival championship with collegiate delegates',
    tag: 'Colleges',
    category: 'College',
    tagColor: '#30B2E7',
    image: '/assets/media/colleges/c1.webp',
    objectPosition: 'center 45%'
  },
  {
    id: 'school-2',
    title: 'Auditorium buzzing with students eagerly raising hands to answer',
    tag: 'Schools',
    category: 'School',
    tagColor: '#75B543',
    image: '/assets/media/crowd/dsc07829.webp',
    objectPosition: 'center 55%'
  },
  {
    id: 'corporate-2',
    title: 'Leadership quiz tournament with QShala challenge banner',
    tag: 'Corporate',
    category: 'Corporate',
    tagColor: '#FDB913',
    image: '/assets/media/corporate/photo-2026-10-09-16-30-40.webp',
    objectPosition: 'center 75%'
  },
  {
    id: 'college-2',
    title: 'National championship grand finale stage',
    tag: 'Colleges',
    category: 'College',
    tagColor: '#30B2E7',
    image: '/assets/media/banners/nlq_final.webp',
    objectPosition: 'center 50%'
  },
  {
    id: 'school-3',
    title: 'Primary school classroom curiosity showcase',
    tag: 'Schools',
    category: 'School',
    tagColor: '#75B543',
    image: '/assets/media/schools/2.webp',
    objectPosition: 'center 50%'
  }
];

export default function TheQshalaEffect() {
  const [selectedTag, setSelectedTag] = useState<string>('All Moments');

  const filteredPhotos = selectedTag === 'All Moments'
    ? AUDIENCE_PHOTOS
    : AUDIENCE_PHOTOS.filter((p) => p.tag === selectedTag);

  return (
    <section className="w-full py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-[#FFFDF5]">
      <div className="w-full max-w-[1536px] mx-auto space-y-8 sm:space-y-10 px-2 sm:px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#30B2E7] text-white font-black text-xs uppercase tracking-wider font-heading shadow-sm">
            Live Moments
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-heading">
            The QShala Effect.
          </h2>
          <p className="text-slate-600 font-semibold text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Moments of electric energy, high-fives, and unbridled curiosity captured across schools, colleges, and corporate stages across India.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-none pb-2 px-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedTag === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedTag(cat)}
                className={`px-4 py-1.5 rounded-full font-black text-xs font-heading transition-all whitespace-nowrap cursor-pointer min-h-[36px] ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Dynamic Curated Photo Gallery - Interactive Clickable Cards */}
        {selectedTag === 'All Moments' ? (
          <div className="space-y-6 pt-2">
            
            {/* Top Row: Large Feature (2 cols) + 2 Stacked Cards (1 col) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Main Large Feature Card */}
              <motion.a
                href={CATEGORY_LINKS[AUDIENCE_PHOTOS[0].tag] || CATEGORY_LINKS[AUDIENCE_PHOTOS[0].category] || '/services'}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="md:col-span-2 relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl group aspect-[4/3] sm:aspect-[16/10] flex flex-col justify-end cursor-pointer block no-underline bg-slate-900"
              >
                <img
                  src={AUDIENCE_PHOTOS[0].image}
                  alt={AUDIENCE_PHOTOS[0].tag}
                  style={{ objectPosition: AUDIENCE_PHOTOS[0].objectPosition || 'center' }}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-black uppercase font-heading px-3.5 py-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-1">
                  <span>Explore Programs</span>
                  <span>&rarr;</span>
                </span>

                <div className="relative z-10 p-6 md:p-8 flex items-center justify-between">
                  <span 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs sm:text-sm font-black uppercase font-heading shadow-md group-hover:shadow-lg transition-transform group-hover:scale-105"
                    style={{ backgroundColor: AUDIENCE_PHOTOS[0].tagColor }}
                  >
                    <span>{AUDIENCE_PHOTOS[0].tag}</span>
                    <span className="text-white/90 font-bold">&rarr;</span>
                  </span>
                </div>
              </motion.a>

              {/* Right Column Stack (2 cards with consistent aspect framing) */}
              <div className="flex flex-col gap-6 justify-between">
                {AUDIENCE_PHOTOS.slice(1, 3).map((photo, idx) => (
                  <motion.a
                    key={photo.id}
                    href={CATEGORY_LINKS[photo.tag] || CATEGORY_LINKS[photo.category] || '/services'}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * (idx + 1) }}
                    className="relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl group flex-1 aspect-[16/10] md:aspect-auto flex flex-col justify-end cursor-pointer block no-underline bg-slate-900"
                  >
                    <img
                      src={photo.image}
                      alt={photo.tag}
                      style={{ objectPosition: photo.objectPosition || 'center' }}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-black uppercase font-heading px-3 py-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-1">
                      <span>Explore</span>
                      <span>&rarr;</span>
                    </span>

                    <div className="relative z-10 p-5">
                      <span 
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white text-xs font-black uppercase font-heading shadow-md group-hover:shadow-lg transition-transform group-hover:scale-105"
                        style={{ backgroundColor: photo.tagColor }}
                      >
                        <span>{photo.tag}</span>
                        <span className="text-white/90 font-bold">&rarr;</span>
                      </span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Bottom Row: 3 Equal-Width Cards, Each With True 16:10 Aspect Ratio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {AUDIENCE_PHOTOS.slice(3, 6).map((photo, idx) => (
                <motion.a
                  key={photo.id}
                  href={CATEGORY_LINKS[photo.tag] || CATEGORY_LINKS[photo.category] || '/services'}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * (idx + 3) }}
                  className="relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl group aspect-[16/10] flex flex-col justify-end cursor-pointer block no-underline bg-slate-900"
                >
                  <img
                    src={photo.image}
                    alt={photo.tag}
                    style={{ objectPosition: photo.objectPosition || 'center' }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  
                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-black uppercase font-heading px-3 py-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-1">
                    <span>Explore</span>
                    <span>&rarr;</span>
                  </span>

                  <div className="relative z-10 p-5 md:p-6">
                    <span 
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white text-xs font-black uppercase font-heading shadow-md group-hover:shadow-lg transition-transform group-hover:scale-105"
                      style={{ backgroundColor: photo.tagColor }}
                    >
                      <span>{photo.tag}</span>
                      <span className="text-white/90 font-bold">&rarr;</span>
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredPhotos.map((photo, idx) => (
              <motion.a
                key={photo.id}
                href={CATEGORY_LINKS[photo.tag] || CATEGORY_LINKS[photo.category] || '/services'}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl group aspect-[16/10] flex flex-col justify-end cursor-pointer block no-underline bg-slate-900"
              >
                <img
                  src={photo.image}
                  alt={photo.tag}
                  style={{ objectPosition: photo.objectPosition || 'center' }}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-black uppercase font-heading px-3 py-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-1">
                  <span>Explore</span>
                  <span>&rarr;</span>
                </span>

                <div className="relative z-10 p-5 md:p-6">
                  <span 
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white text-xs font-black uppercase font-heading shadow-md group-hover:shadow-lg transition-transform group-hover:scale-105"
                    style={{ backgroundColor: photo.tagColor }}
                  >
                    <span>{photo.tag}</span>
                    <span className="text-white/90 font-bold">&rarr;</span>
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
