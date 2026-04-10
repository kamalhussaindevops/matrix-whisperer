"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const steps = [
      { target: 30, delay: 80 },
      { target: 60, delay: 200 },
      { target: 85, delay: 350 },
      { target: 100, delay: 500 },
    ];
    const timers: NodeJS.Timeout[] = [];
    steps.forEach(({ target, delay }) => {
      timers.push(setTimeout(() => setProgress(target), delay));
    });
    timers.push(setTimeout(() => setVisible(false), 750));
    return () => timers.forEach(clearTimeout);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="page-loader"
      style={{ opacity: progress >= 100 ? 0 : 1 }}
    >
      {/* Animated octagon */}
      <div className="loader-icon">
        <svg viewBox="0 0 100 100" width="56" height="56">
          <polygon
            className="loader-octagon"
            points="50,5 79,15 95,42 95,58 79,85 50,95 21,85 5,58 5,42 21,15"
            fill="none"
            stroke="#667eea"
            strokeWidth="2.5"
          />
          <polygon
            className="loader-diamond"
            points="50,20 75,50 50,80 25,50"
            fill="none"
            stroke="#764ba2"
            strokeWidth="2"
          />
          <circle
            className="loader-center"
            cx="50"
            cy="50"
            r="8"
            fill="#667eea"
          />
        </svg>
      </div>

      {/* Brand */}
      <p className="loader-brand">DestinyMatrix</p>

      {/* Progress bar */}
      <div className="loader-bar-track">
        <div
          className="loader-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
