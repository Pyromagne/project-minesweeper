import { useEffect, useRef, useState } from 'react';
import type { t_timestamp } from '../game/minesweeper';

interface Stopwatch extends t_timestamp {
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export const useStopwatch = (): Stopwatch => {
  const [time, setTime] = useState<t_timestamp>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef<number>(0);

  const updateTime = (elapsed: number) => {
    const ms = Math.floor((elapsed % 1000) / 10);
    const totalSeconds = Math.floor(elapsed / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);

    setTime({
      hours,
      minutes,
      seconds,
      milliseconds: ms,
    });
  };

  const start = () => {
    if (intervalRef.current !== null) return;

    startTimeRef.current = Date.now() - elapsedRef.current;

    intervalRef.current = window.setInterval(() => {
      if (startTimeRef.current !== null) {
        const now = Date.now();
        const elapsed = now - startTimeRef.current;
        elapsedRef.current = elapsed;
        updateTime(elapsed);
      }
    }, 50);
  };

  const pause = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    pause();
    elapsedRef.current = 0;
    setTime({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    ...time,
    start,
    pause,
    reset,
  };
};
