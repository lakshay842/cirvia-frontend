"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

export function AuroraBackground() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion || !ref.current) return;

    let frame: number;
    let t = 0;

    const animate = () => {
      t += 0.003;
      if (ref.current) {
        ref.current.style.setProperty("--aurora-x", `${50 + Math.sin(t) * 20}%`);
        ref.current.style.setProperty("--aurora-y", `${40 + Math.cos(t * 0.7) * 15}%`);
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={
        {
          "--aurora-x": "50%",
          "--aurora-y": "40%",
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_var(--aurora-x)_var(--aurora-y),rgba(109,94,252,0.18),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(139,92,246,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(109,94,252,0.08),transparent_50%)]" />
      {!reduceMotion &&
        [1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10 blur-3xl"
            style={{
              width: `${200 + i * 80}px`,
              height: `${200 + i * 80}px`,
              left: `${10 + i * 25}%`,
              top: `${15 + i * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
    </div>
  );
}
