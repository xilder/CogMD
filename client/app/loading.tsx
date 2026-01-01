'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// The PLAB-themed loading states
const LOADING_PHASES = [
  'Triaging clinical scenarios...',
  'Checking vital signs...',
  'Consulting NICE guidelines...',
  'Preparing differential diagnosis...',
  'Loading answer keys...',
];

export default function Loading({ className }: { className?: string }) {
  const [phaseIndex, setPhaseIndex] = useState(0);

  // Cycle through text phrases
  useEffect(() => {
    const timer = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % LOADING_PHASES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[300px] w-full p-8',
        className
      )}
    >
      {/* 1. The Medical Icon / Heartbeat Container */}
      <div className='relative w-64 h-32 flex items-center justify-center mb-8'>
        {/* Background Grid (Like an ECG Paper) */}
        <div className='absolute inset-0 grid grid-cols-6 grid-rows-2 opacity-10'>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className='border-[0.5px] border-blue-500/50 w-full h-full'
            />
          ))}
        </div>

        {/* The ECG SVG Path */}
        <svg
          viewBox='0 0 200 100'
          className='w-full h-full stroke-blue-600 dark:stroke-blue-400 stroke-2 fill-none drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]'
        >
          {/* Path Logic: 
            Start (0,50) -> Flat -> P wave -> Dip -> QRS Complex (High Spike) -> Dip -> T wave -> Flat -> End 
          */}
          <motion.path
            d='M 0,50 L 30,50 L 45,40 L 55,50 L 65,50 L 70,70 L 80,10 L 90,80 L 100,50 L 120,50 L 135,35 L 150,50 L 200,50'
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0], // Draw, hold, erase
              opacity: [0, 1, 1, 0],
              pathOffset: [0, 0, 1, 0], // Creates the moving line effect
            }}
            transition={{
              duration: 2.5,
              ease: 'easeInOut',
              repeat: Infinity,
              times: [0, 0.4, 0.6, 1],
            }}
          />
        </svg>

        {/* The "Pulse" Dot scanning across */}
        <motion.div
          className='absolute w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,1)] z-10'
          animate={{
            offsetDistance: '100%',
            scale: [1, 1.5, 1],
            opacity: [0, 1, 0],
          }}
          // Note: offset-path requires CSS usage in some browsers,
          // but for simplicity we can simulate the dot at the center pulse
        />

        {/* Central "Heart" Pulse Effect (Simpler cross-browser approach for the dot) */}
        <motion.div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full'
          animate={{
            scale: [1, 20],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      </div>

      {/* 2. Text Scrambler / Phrase Cycler */}
      <div className='h-8 relative flex items-center justify-center overflow-hidden'>
        <AnimatePresence mode='wait'>
          <motion.p
            key={phaseIndex}
            initial={{ y: 20, opacity: 0, filter: 'blur(5px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -20, opacity: 0, filter: 'blur(5px)' }}
            transition={{ duration: 0.5 }}
            className='text-sm font-medium tracking-widest uppercase text-slate-500 dark:text-slate-400'
          >
            {LOADING_PHASES[phaseIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* 3. Subtle Progress Bar */}
      <div className='w-48 h-1 bg-slate-200 dark:bg-slate-800 mt-4 rounded-full overflow-hidden'>
        <motion.div
          className='h-full bg-blue-500'
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </div>
  );
}
