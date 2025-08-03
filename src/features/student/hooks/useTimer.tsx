import { useState, useEffect, useCallback } from 'react';

export function useExamTimer(initialTime: number, onTimeUp: () => void) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) {
      if (timeRemaining <= 0) {
        onTimeUp();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, onTimeUp]);

  const pause = useCallback(() => setIsActive(false), []);
  const resume = useCallback(() => setIsActive(true), []);
  const stop = useCallback(() => {
    setIsActive(false);
    setTimeRemaining(0);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timeRemaining,
    isActive,
    pause,
    resume,
    stop,
    formatTime: formatTime(timeRemaining)
  };
}