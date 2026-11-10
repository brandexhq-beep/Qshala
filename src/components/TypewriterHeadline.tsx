import { useState, useEffect } from 'react';

const WORDS_TO_ROTATE = [
  "Quriosity.",
  "Questions.",
  "Discovery.",
  "Wonder."
];

export default function TypewriterHeadline() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(WORDS_TO_ROTATE[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    const currentWord = WORDS_TO_ROTATE[currentWordIndex];

    // Pause when the word is fully typed before starting deletion
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 1800);
      return () => clearTimeout(pauseTimer);
    }

    if (!isDeleting) {
      // Typing phase: append next character
      if (displayedText === currentWord) {
        setIsPaused(true);
        return;
      }

      const typingTimer = setTimeout(() => {
        setDisplayedText(currentWord.slice(0, displayedText.length + 1));
      }, 90);

      return () => clearTimeout(typingTimer);
    } else {
      // Deleting phase: remove last character
      if (displayedText === '') {
        const pauseTimer = setTimeout(() => {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % WORDS_TO_ROTATE.length);
        }, 300);
        return () => clearTimeout(pauseTimer);
      }

      const deletingTimer = setTimeout(() => {
        setDisplayedText(currentWord.slice(0, displayedText.length - 1));
      }, 50);

      return () => clearTimeout(deletingTimer);
    }
  }, [displayedText, isDeleting, isPaused, currentWordIndex]);

  return (
    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.15] font-heading">
      Replacing Rote Learning With
      <span className="block text-[#0284C7] font-mikado mt-2 sm:mt-3 min-h-[1.2em]">
        {displayedText}
        <span className="inline-block w-[3px] sm:w-[4px] h-[0.75em] bg-[#0284C7] ml-1.5 align-baseline animate-pulse" />
      </span>
    </h1>
  );
}

