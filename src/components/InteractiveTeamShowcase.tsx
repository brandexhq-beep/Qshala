import QTMascot from './QTMascot';

interface TeamMember {
  id?: string;
  name: string;
  role: string;
  category: string;
  bio?: string;
  image?: any;
  imageUrl?: string;
  variant?: 'sherlock' | 'quizzing' | 'reading' | 'idea' | 'curious' | 'professional' | 'holding_money' | 'trophy';
  mascotVariant?: string;
  color?: string;
  accentColor?: string;
  bg?: string;
  tag?: string;
  [key: string]: any;
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: 'ahil-abraham-thachil',
    name: 'Ahil Abraham Thachil',
    role: 'Lead - Client Success, Partnership & Delivery',
    category: 'Partnerships',
    bio: 'Leading strategic accounts, client partnerships, and ensuring seamless program delivery across India.',
    imageUrl: '/assets/team/ahil-abraham-thachil.webp',
    mascotVariant: 'professional',
    accentColor: '#EC4899',
  },
  {
    id: 'alwin-roshan-lobo',
    name: 'Alwin Roshan Lobo',
    role: 'School Sales Manager',
    category: 'Schools',
    bio: 'Partnering with institutional leaders to expand inquiry-driven quizzing and life skills curricula.',
    imageUrl: '/assets/team/alwin-roshan-lobo.webp',
    mascotVariant: 'idea',
    accentColor: '#75B543',
  },
  {
    id: 'anagha',
    name: 'Anagha',
    role: 'Lead - School Content',
    category: 'Content',
    bio: 'Curating rich, socratic classroom questions and inquiry modules that bring school syllabi alive.',
    imageUrl: '/assets/team/anagha.webp',
    mascotVariant: 'reading',
    accentColor: '#30B2E7',
  },
  {
    id: 'annette-l-colney',
    name: 'Annette L Colney',
    role: 'Engagement Associate',
    category: 'Engagement',
    bio: 'Connecting with young quizzers, coordinating dynamic clubs, and facilitating curiosity sessions.',
    imageUrl: '/assets/team/annette-l-colney.webp',
    mascotVariant: 'curious',
    accentColor: '#FDB913',
  },
  {
    id: 'deeksha-s',
    name: 'Deeksha S',
    role: 'Engagement Associate',
    category: 'Engagement',
    bio: 'Fostering active student participation and driving joyful question-first learning experiences.',
    imageUrl: '/assets/team/deeksha-s.webp',
    mascotVariant: 'quizzing',
    accentColor: '#FDB913',
  },
  {
    id: 'durga-venkataraman',
    name: 'Durga Venkataraman',
    role: 'Engagement Associate',
    category: 'Engagement',
    bio: 'Sparking meaningful discussions and mentoring students to explore real-world topics beyond textbooks.',
    imageUrl: '/assets/team/durga-venkataraman.webp',
    mascotVariant: 'curious',
    accentColor: '#FDB913',
  },
  {
    id: 'elvis-francis',
    name: 'Elvis Francis',
    role: 'Quizmaster & Engagement Associate',
    category: 'Quizmaster',
    bio: 'Hosting high-energy quiz showdowns and energizing auditorium audiences with quick-witted trivia.',
    imageUrl: '/assets/team/elvis-francis.webp',
    mascotVariant: 'quizzing',
    accentColor: '#30B2E7',
  },
  {
    id: 'flavia-reena-dcunha',
    name: 'Flavia Reena Dcunha',
    role: 'Engagement Associate',
    category: 'Engagement',
    bio: 'Championing interactive classroom engagement and socratic storytelling for curious learners.',
    imageUrl: '/assets/team/flavia-reena-dcunha.webp',
    mascotVariant: 'idea',
    accentColor: '#FDB913',
  },
  {
    id: 'gauri-kashyap',
    name: 'Gauri Kashyap',
    role: 'Brand and Marketing Manager',
    category: 'Marketing',
    bio: 'Directing brand voice, educational campaigns, and celebrating the power of asking "Why?".',
    imageUrl: '/assets/team/gauri-kashyap.webp',
    mascotVariant: 'idea',
    accentColor: '#EC4899',
  },
  {
    id: 'hakkim-ibraheem',
    name: 'Hakkim Ibraheem',
    role: 'Graphic Designer',
    category: 'Design',
    bio: 'Crafting vibrant visual designs, multimedia assets, and bringing QT the cat to life across screens.',
    imageUrl: '/assets/team/hakkim-ibraheem.webp',
    mascotVariant: 'idea',
    accentColor: '#9333EA',
  },
  {
    id: 'harini-ayyappan',
    name: 'Harini Ayyappan',
    role: 'School Operations Associate',
    category: 'Operations',
    bio: 'Coordinating timetables, school partner onboarding, and smooth delivery of weekly club sessions.',
    imageUrl: '/assets/team/harini-ayyappan.webp',
    mascotVariant: 'reading',
    accentColor: '#75B543',
  },
  {
    id: 'janane-mohan',
    name: 'Janane Mohan',
    role: 'Growth & Engagement Associate',
    category: 'Engagement',
    bio: 'Driving community growth and igniting curiosity across schools and family quiz networks.',
    imageUrl: '/assets/team/janane-k-janane-mohan.webp',
    mascotVariant: 'curious',
    accentColor: '#FDB913',
  },
  {
    id: 'jiya-m-jacob',
    name: 'Jiya M Jacob',
    role: 'Training and Quality Manager',
    category: 'Quality',
    bio: 'Ensuring world-class pedagogical delivery and coaching quizmasters on Socratic methodologies.',
    imageUrl: '/assets/team/jiya-m-jacob.webp',
    mascotVariant: 'professional',
    accentColor: '#75B543',
  },
  {
    id: 'kuriakose-george',
    name: 'Kuriakose George',
    role: 'Quizmaster & Engagement Associate',
    category: 'Quizmaster',
    bio: 'Crafting captivating buzzer questions and hosting memorable quiz events across India.',
    imageUrl: '/assets/team/kuriakose-george.webp',
    mascotVariant: 'quizzing',
    accentColor: '#30B2E7',
  },
  {
    id: 'lalnunhlimi',
    name: 'Lalnunhlimi',
    role: 'Engagement Associate',
    category: 'Engagement',
    bio: 'Nurturing student curiosity through engaging discussions, inquiry activities, and quiz games.',
    imageUrl: '/assets/team/lalnunhlimi.webp',
    mascotVariant: 'curious',
    accentColor: '#FDB913',
  },
  {
    id: 'manju-sendil-kumar',
    name: 'Manju Sendil Kumar',
    role: 'School Operations Associate',
    category: 'Operations',
    bio: 'Managing partner school communication, schedules, and seamless operational execution.',
    imageUrl: '/assets/team/manju-sendil-kumar.webp',
    mascotVariant: 'reading',
    accentColor: '#75B543',
  },
  {
    id: 'nikhil-jacob',
    name: 'Nikhil Jacob',
    role: 'Senior Manager - Strategy and Partnerships',
    category: 'Partnerships',
    bio: 'Building long-term institutional relationships and scaling QShala impact nationwide.',
    imageUrl: '/assets/team/nikhil-jacob.webp',
    mascotVariant: 'professional',
    accentColor: '#EC4899',
  },
  {
    id: 'poonam-bathija',
    name: 'Poonam Bathija',
    role: 'School Account Manager',
    category: 'Schools',
    bio: 'Partnering with school principals to create thriving environments of wonder and learning.',
    imageUrl: '/assets/team/poonam-bathija.webp',
    mascotVariant: 'reading',
    accentColor: '#75B543',
  },
  {
    id: 'prathika-suresh',
    name: 'Prathika Suresh',
    role: 'Growth & Engagement Associate',
    category: 'Engagement',
    bio: 'Connecting learners with curiosity clubs and inspiring young thinkers through questions.',
    imageUrl: '/assets/team/prathika-suresh.webp',
    mascotVariant: 'curious',
    accentColor: '#FDB913',
  },
  {
    id: 'praveesha-vinayagamoorthy',
    name: 'Praveesha Vinayagamoorthy',
    role: 'Business Operations Associate',
    category: 'Operations',
    bio: 'Optimizing business workflows and supporting on-ground quiz event execution.',
    imageUrl: '/assets/team/praveesha-vinayagamoorthy.webp',
    mascotVariant: 'reading',
    accentColor: '#75B543',
  },
  {
    id: 'radhika-p',
    name: 'Radhika P',
    role: 'Accounts Associate',
    category: 'Finance',
    bio: 'Managing financial administration, operational accounts, and institutional partner coordination.',
    imageUrl: '/assets/team/radhika-p.webp',
    mascotVariant: 'holding_money',
    accentColor: '#FDB913',
  },
  {
    id: 'rima-kalita',
    name: 'Rima Kalita',
    role: 'Human Resource Associate',
    category: 'People',
    bio: 'Championing culture, talent development, and welcoming curious minds to the QShala crew.',
    imageUrl: '/assets/team/rima-kalita.webp',
    mascotVariant: 'curious',
    accentColor: '#EC4899',
  },
  {
    id: 'rini-ann-varghese',
    name: 'Rini Ann Varghese',
    role: 'Engagement Associate',
    category: 'Engagement',
    bio: 'Facilitating active inquiry rounds and empowering students to think critically and creatively.',
    imageUrl: '/assets/team/rini-ann-varghese.webp',
    mascotVariant: 'curious',
    accentColor: '#FDB913',
  },
  {
    id: 'shreeman-debasmit',
    name: 'Shreeman Debasmit',
    role: 'Social Media Associate',
    category: 'Marketing',
    bio: 'Amplifying student questions, event highlights, and viral trivia across social media channels.',
    imageUrl: '/assets/team/shreeman-debasmit.webp',
    mascotVariant: 'idea',
    accentColor: '#30B2E7',
  },
  {
    id: 'shruthi-varkhedkar',
    name: 'Shruthi Varkhedkar',
    role: 'Program Manager, Bootcamps & Varsity Tribe',
    category: 'Programs',
    bio: 'Leading intensive quizzing bootcamps, collegiate networks, and nationwide youth initiatives.',
    imageUrl: '/assets/team/shruthi-varkhedkar.webp',
    mascotVariant: 'trophy',
    accentColor: '#75B543',
  },
  {
    id: 'vaibhav-chaturvedi',
    name: 'Vaibhav Chaturvedi',
    role: 'Business Operations Associate',
    category: 'Operations',
    bio: 'Driving seamless business operations and event execution across corporate and campus setups.',
    imageUrl: '/assets/team/vaibhav-chaturvedi.webp',
    mascotVariant: 'reading',
    accentColor: '#75B543',
  },
];

interface Props {
  members?: TeamMember[] | any[];
}

export default function InteractiveTeamShowcase({ members }: Props = {}) {
  const sourceCrew = (members && members.length > 0 ? members : DEFAULT_MEMBERS)
    .filter((m) => m.name !== 'Sachin Ravi' && m.name !== 'Raghav Chakravarthy');

  const sortedCrew = [...sourceCrew].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-8 sm:space-y-10 w-full">

      {/* Main Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#75B543] text-white font-black text-xs uppercase tracking-wider font-heading shadow-sm">
          Meet Our Team
        </span>
        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading leading-tight">
          The Quriosity Crew.
        </h2>
        <p className="text-slate-600 font-semibold text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Archaeologists, architects, lawyers, educators and more, sparking Quriosity across India.
        </p>
      </div>

      {/* Single Alphabetical Grid (Department groupings removed per client feedback) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full pt-2">
        {sortedCrew.map((member) => {
          const imgSrc = member.imageUrl || (typeof member.image === 'string' ? member.image : member.image?.asset?.url) || '/assets/team/gauri-kashyap.webp';
          const mascot = (member.variant || member.mascotVariant || 'curious') as any;

          return (
            <div 
              key={member.id || member.name}
              className="p-6 sm:p-7 rounded-3xl shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group border border-slate-200/90 bg-white"
            >
              <div className="space-y-4 flex-grow flex flex-col">
                <div className="flex items-center justify-end">
                  <div className="group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                    <QTMascot variant={mascot} size="sm" />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center pt-1">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl md:rounded-3xl overflow-hidden aspect-square border-2 border-slate-100 shadow-md mb-4 bg-slate-50 group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src={imgSrc} 
                      alt={member.name} 
                      className="w-full h-full object-cover object-top" 
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading leading-tight group-hover:text-[#30B2E7] transition-colors text-center">
                    {member.name}
                  </h3>
                  <div className="text-xs font-bold text-slate-600 mt-1 font-heading text-center">
                    {member.role}
                  </div>
                </div>

                {member.bio && (
                  <p className="text-slate-700 text-xs sm:text-sm font-semibold leading-relaxed text-center pt-3 border-t border-slate-100">
                    {member.bio}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
