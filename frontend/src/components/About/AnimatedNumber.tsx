import { useEffect, useState } from "react";

interface Props {
  value: number;
  duration?: number; // default: 2000ms
}

export default function AnimatedNumber({ value, duration = 2000 }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);

    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        start = value;
        clearInterval(timer);
      }
      setCurrent(Math.floor(start));
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{current}</span>;
}
