
export type QTMascotVariant =
  | 'normal'
  | 'curious'
  | 'idea'
  | 'quizzing'
  | 'reading'
  | 'sherlock'
  | 'sleeping'
  | 'happy'
  | 'trophy'
  | 'jumping'
  | 'holding_money'
  | 'professional';

interface QTMascotProps {
  variant?: QTMascotVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  className?: string;
  badgeText?: string;
}

const VARIANT_MAP: Record<QTMascotVariant, string> = {
  normal: '/assets/qt/QT normal.svg',
  curious: '/assets/qt/Qt curious.svg',
  idea: '/assets/qt/QT Idea.svg',
  quizzing: '/assets/qt/QT quizzing.svg',
  reading: '/assets/qt/QT reading.svg',
  sherlock: '/assets/qt/QT sherlock.svg',
  sleeping: '/assets/qt/QT Sleeping.svg',
  happy: '/assets/qt/QT happy.svg',
  trophy: '/assets/qt/QT with trophy.svg',
  jumping: '/assets/qt/QT jumping.svg',
  holding_money: '/assets/qt/QT holding money.svg',
  professional: '/assets/qt/QT professional.svg',
};

const SIZE_MAP = {
  sm: 64,
  md: 96,
  lg: 144,
  xl: 192,
  '2xl': 256,
  '3xl': 320,
  '4xl': 380,
};

export default function QTMascot({
  variant = 'normal',
  size = 'md',
  className = '',
  badgeText,
}: QTMascotProps) {
  const imageSrc = VARIANT_MAP[variant] || VARIANT_MAP.normal;
  const dimension = SIZE_MAP[size];

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
    >
      {badgeText && (
        <span className="absolute -top-6 px-3 py-1 bg-[#FDB913] text-black text-xs font-black rounded-full shadow-md z-10 border-2 border-black whitespace-nowrap font-heading">
          {badgeText}
        </span>
      )}

      <div className="relative flex items-center justify-center">
        <img
          src={imageSrc}
          alt={`QT Mascot ${variant}`}
          width={dimension}
          height={dimension}
          className="max-w-full h-auto object-contain pointer-events-none drop-shadow-lg"
          loading="eager"
        />
      </div>
    </div>
  );
}
