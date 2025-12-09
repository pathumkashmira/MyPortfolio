import React, { useState, useEffect, useRef } from 'react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const buttonRef = useRef(null);

  // Play/Pause Function
  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Autoplay blocked:", e));
    }
    setIsPlaying(!isPlaying);
  };

  // Try Autoplay logic
  useEffect(() => {
    if(audioRef.current) {
        audioRef.current.volume = 0.4; // Volume level
    }

    const startAudio = () => {
        if(audioRef.current && !isPlaying) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.log("Waiting for interaction..."));
        }
        // Remove listeners after first interaction
        document.removeEventListener('click', startAudio);
        document.removeEventListener('scroll', startAudio);
    };

    // Listen for user interaction
    document.addEventListener('click', startAudio);
    document.addEventListener('scroll', startAudio);

    return () => {
        document.removeEventListener('click', startAudio);
        document.removeEventListener('scroll', startAudio);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <audio ref={audioRef} loop>
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      <button 
        ref={buttonRef}
        onClick={toggleMusic}
        className={`p-3 rounded-full backdrop-blur-md border shadow-2xl transition-all duration-300 hover:scale-110 group animate-float-slow
        ${isPlaying ? 'bg-emerald-500/80 border-emerald-400 ring-2 ring-emerald-500' : 'bg-stone-900/80 dark:bg-stone-100/80 border-stone-700 dark:border-stone-300'}
        `}
      >
        {isPlaying ? (
           // Playing Icon
           <div className="relative flex items-center justify-center w-6 h-6">
                <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping"></span>
                <svg xmlns="http://www.w3.org/2000/svg" className="relative h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
           </div>
        ) : (
           // Muted Icon
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white dark:text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
           </svg>
        )}
      </button>
    </div>
  );
}