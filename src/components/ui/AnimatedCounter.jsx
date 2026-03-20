import { useEffect, useState, useRef } from 'react';

export function useAnimatedCounter(target, duration = 1000) {
  const [value, setValue] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(target * eased));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);

  return value;
}

export default function AnimatedCounter({ value, duration = 1000, prefix = '', suffix = '', className = '', style = {} }) {
  const count = useAnimatedCounter(value, duration);
  return (
    <span className={className} style={style}>
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}
