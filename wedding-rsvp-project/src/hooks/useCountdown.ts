import { useCallback, useEffect, useState } from "react";

export function useCountdown(target: string) {
  const calculate = useCallback(() => {
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1000),
    };
  }, [target]);

  const [time, setTime] = useState(calculate);

  useEffect(() => {
    const id = window.setInterval(() => setTime(calculate()), 1000);
    return () => window.clearInterval(id);
  }, [calculate]);

  return time;
}
