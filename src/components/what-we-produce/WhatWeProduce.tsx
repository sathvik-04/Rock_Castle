import React, { useEffect, useRef } from "react";
import "./what-we-produce.css";

export interface WhatWeProduceProps {
  /** Section HTML id */
  id?: string;
  /** Top label text (defaults to 'What we produce') */
  label?: string;
  /** Large vocabulary words to scroll through */
  words?: string[];
  /** Capability / discipline items in the lower band */
  capabilities?: string[];
  /** Color theme variant */
  theme?: "light" | "dark";
  /** Sensitivity of scroll-driven horizontal parallax (0 to disable) */
  scrollParallaxFactor?: number;
  /** Continuous auto-drift speed in pixels per frame (0 to disable) */
  autoMarqueeSpeed?: number;
  /** Additional CSS class names */
  className?: string;
  /** Inline style overrides */
  style?: React.CSSProperties;
}

export const DEFAULT_WORDS = [
  "Events",
  "Experiences",
  "Activations",
  "Spaces",
  "Production",
  "Content",
  "Creative",
];

export const DEFAULT_CAPABILITIES = [
  "Spatial design",
  "Brand activation",
  "Atelier fabrication",
  "Stage & lighting",
  "Film & motion",
  "Structural engineering",
  "CNC production",
  "Load\u2011out",
];

/**
 * WhatWeProduce Component
 * 
 * Standalone React component reproducing the 'What we produce' section:
 * - Architectural section label
 * - Oversized, high-impact vocabulary marquee with reactive scroll parallax
 * - Continuous infinite capability band ticker with hover pause
 */
export const WhatWeProduce: React.FC<WhatWeProduceProps> = ({
  id = "what-we-produce",
  label = "What we produce",
  words = DEFAULT_WORDS,
  capabilities = DEFAULT_CAPABILITIES,
  theme = "light",
  scrollParallaxFactor = 0.28,
  autoMarqueeSpeed = 0.5,
  className = "",
  style,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const vocabTrackRef = useRef<HTMLDivElement>(null);
  const currentPosRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const targetScrollOffsetRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);

  // Repeat words to create an uninterrupted infinite line
  const repeatedWords = React.useMemo(() => {
    return [...words, ...words, ...words, ...words];
  }, [words]);

  // Reactive scroll parallax combined with steady continuous drift
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight || 800;

      // Calculate progress relative to window viewport
      const progress = (windowH - rect.top) / (windowH + rect.height);
      targetScrollOffsetRef.current = progress * 100 * scrollParallaxFactor;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / (1000 / 60), 2.5);
      lastTime = time;

      // Smooth lerp of scroll offset
      scrollOffsetRef.current +=
        (targetScrollOffsetRef.current - scrollOffsetRef.current) * Math.min(0.08 * dt, 1);

      // Continuous drift
      if (!isHoveredRef.current && autoMarqueeSpeed > 0) {
        currentPosRef.current += autoMarqueeSpeed * dt;
      }

      if (vocabTrackRef.current) {
        const halfWidth = vocabTrackRef.current.scrollWidth / 2 || 1;
        const totalX = (currentPosRef.current + scrollOffsetRef.current * 15) % halfWidth;
        vocabTrackRef.current.style.transform = `translate3d(${-totalX}px, 0, 0)`;
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [scrollParallaxFactor, autoMarqueeSpeed]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`rc-produce-section rc-produce--${theme} ${className}`}
      style={style}
      aria-label={label}
    >
      <div className="rc-produce-container">
        <div className="rc-produce-head">
          <span className="rc-produce-label">{label}</span>
        </div>
      </div>

      {/* Giant vocabulary row moving against scroll */}
      <div
        className="rc-vocab-viewport"
        onMouseEnter={() => (isHoveredRef.current = true)}
        onMouseLeave={() => (isHoveredRef.current = false)}
        aria-hidden="true"
      >
        <div ref={vocabTrackRef} className="rc-vocab-track">
          <div className="rc-vocab-row">
            {repeatedWords.map((word, idx) => (
              <React.Fragment key={idx}>
                <span className={`rc-vocab-item ${idx % 2 === 1 ? "is-muted" : ""}`}>
                  {word}
                </span>
                <i className="rc-vocab-dot" />
              </React.Fragment>
            ))}
          </div>
          {/* Second identical row for smooth continuous translation */}
          <div className="rc-vocab-row" aria-hidden="true">
            {repeatedWords.map((word, idx) => (
              <React.Fragment key={`dup-${idx}`}>
                <span className={`rc-vocab-item ${idx % 2 === 1 ? "is-muted" : ""}`}>
                  {word}
                </span>
                <i className="rc-vocab-dot" />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Capabilities band — infinite disciplines loop */}
      <div className="rc-band" aria-label="Disciplines">
        <div className="rc-band-track animate-marquee">
          <ul className="rc-band-group">
            {capabilities.map((cap, i) => (
              <li key={`cap-1-${i}`} className="rc-band-item">
                {cap}
              </li>
            ))}
          </ul>
          {/* Seamless clone */}
          <ul className="rc-band-group" aria-hidden="true">
            {capabilities.map((cap, i) => (
              <li key={`cap-2-${i}`} className="rc-band-item">
                {cap}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhatWeProduce;
