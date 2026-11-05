import { useState } from 'react';

const SIZE_MAP = {
  sm: 72,
  md: 110,
  lg: 160,
  xl: 200,
};

interface QTAnimatedPlayerProps {
  mode?: 'playing' | 'walking' | 'curious';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fps?: number;
  className?: string;
}

export default function QTAnimatedPlayer({
  size = 'md',
  className = '',
}: QTAnimatedPlayerProps) {
  const dimension = SIZE_MAP[size];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none group cursor-pointer ${className}`}
      style={{ width: dimension, height: dimension }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="QT - The Qurious Cat"
    >
      {/* Soft playful ambient glow */}
      <div className="absolute inset-0 bg-[#FDB913]/20 rounded-full blur-xl scale-110 group-hover:scale-135 transition-transform duration-500 pointer-events-none" />

      {/* QT Animated Mascot from Brand Assets */}
      <picture className="relative z-10 w-full h-full flex items-center justify-center">
        <source srcSet="/assets/qt/animation/qt_curious_animated.webp" type="image/webp" />
        <img
          src="/assets/qt/animation/qt_curious_animated.gif"
          alt="QT Qurious Cat Animation"
          width={dimension}
          height={dimension}
          className={`object-contain pointer-events-none drop-shadow-md transition-all duration-300 ${
            isHovered ? 'scale-110 -rotate-3' : 'scale-100 hover:scale-105'
          }`}
          loading="eager"
        />
      </picture>
    </div>
  );
}

