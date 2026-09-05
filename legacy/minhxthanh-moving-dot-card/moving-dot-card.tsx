import React, { useState, useEffect } from 'react';

export default function DotCard({ target = 777000, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    const range = end - start;
    if (range <= 0) return;
    const increment = Math.ceil(end / (duration / 50));
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, 50);
    return () => clearInterval(timer);
  }, [target, duration]);

  const display = count < 1000 ? count : `${Math.floor(count / 1000)}k`;

  return (
    <div className="outer">
      <div className="dot"></div>
      <div className="card">
        <div className="ray"></div>
        <div className="text">{display}</div>
        <div className="label">Views</div>
        <div className="line topl"></div>
        <div className="line leftl"></div>
        <div className="line bottoml"></div>
        <div className="line rightl"></div>
      </div>
    </div>
  );
}
