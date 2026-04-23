import { useEffect, useState } from 'react';

/** ease-out cubic count-up, returns the rounded current value. */
export function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
