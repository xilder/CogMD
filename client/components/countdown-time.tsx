'use client';
import { useEffect, useRef, useState } from 'react';

interface CountdownTimerProps {
  initialSeconds: number;
  onComplete?: () => void;
}

export default function CountdownTimer({
  initialSeconds,
  onComplete,
}: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    start();
    return pause;
  }, []);

  if (initialSeconds <= 0) return null;

  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='text-4xl font-bold'>
        {String(Math.floor(seconds / 60)).padStart(2, '0')}:
        {String(seconds % 60).padStart(2, '0')}
      </div>
    </div>
  );
}
