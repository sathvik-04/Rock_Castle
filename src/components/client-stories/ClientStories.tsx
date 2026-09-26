import React, { useEffect, useRef } from "react";
import "./client-stories.css";

export interface TestimonialItem {
  id: number;
  num: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  tag?: string;
}

export interface ClientStoriesProps {
  /** Optional HTML id attribute (defaults to 'testimonials') */
  id?: string;
  /** Section title */
  title?: string;
  /** Section label text */
  label?: string;
  /** Index marker e.g. '[ 05 ]' */
  index?: string;
  /** Array of testimonial items */
  testimonials?: TestimonialItem[];
  /** Color theme variant */
  theme?: "light" | "dark";
  /** Continuous base ticker speed in px per frame at 60fps (default: 0.35) */
  baseVelocity?: number;
  /** Enable scroll acceleration effect */
  enableScrollBoost?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Inline style overrides */
  style?: React.CSSProperties;
}

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    num: "01",
    tag: "Client review",
    quote: "\u201cRockcastle took a two-line brief and turned it into a launch our regional team still references. Nothing about it felt off-the-shelf.\u201d",
    author: "Amara Reyes",
    role: "Marketing Director",
    company: "Global Corp",
    avatar: "/images/testimonial-1.webp",
  },
  {
    id: 2,
    num: "02",
    tag: "Client review",
    quote: "\u201cThey run production the way we wished we could \u2014 one crew, zero handoffs, and a build that matched the deck exactly.\u201d",
    author: "Daniel Osei",
    role: "Brand Manager",
    company: "Meridian Group",
    avatar: "/images/testimonial-2.webp",
  },
  {
    id: 3,
    num: "03",
    tag: "Client review",
    quote: "\u201cOur activation had eleven moving parts across three days. Rockcastle\u2019s on-ground team never once made that our problem.\u201d",
    author: "Priya Nandan",
    role: "Events Lead",
    company: "Apex Studios",
    avatar: "/images/testimonial-4.webp",
  },
  {
    id: 4,
    num: "04",
    tag: "Client review",
    quote: "\u201cWhat sold us was the workshop visit. Watching them fabricate the set pieces themselves told us more than any pitch deck.\u201d",
    author: "Lucas Ferreira",
    role: "CMO",
    company: "Nova Events",
    avatar: "/images/testimonial-3.webp",
  },
  {
    id: 5,
    num: "05",
    tag: "Client review",
    quote: "\u201cFast, direct, and unusually calm under a compressed timeline. The kind of studio you call when the date can\u2019t move.\u201d",
    author: "Hana Kobayashi",
    role: "Producer",
    company: "Vault Architecture",
    avatar: "/images/testimonial-5.webp",
  },
  {
    id: 6,
    num: "06",
    tag: "Client review",
    quote: "\u201cThey pushed back on our first concept \u2014 and were right to. The version we built performed far better than what we walked in with.\u201d",
    author: "Tom\u00e1s Albeck",
    role: "Creative Director",
    company: "Summit Partners",
    avatar: "/images/testimonial-6.webp",
  },
];

/**
 * ClientStories Component
 * 
 * Standalone React component reproducing the 'Client stories' / 'What they say.' section:
 * - Editorial header with label, index and next/prev circle controls
 * - Infinite continuous ticker track with smooth jump easing
 * - Hover pause, drag/swipe, and scroll-velocity boost
 * - Testimonial cards with client avatars, quotes, roles and hover lift
 */
export const ClientStories: React.FC<ClientStoriesProps> = ({
  id = "testimonials",
  title = "What they say.",
  label = "Client stories",
  index = "[ 05 ]",
  testimonials = DEFAULT_TESTIMONIALS,
  theme = "light",
  baseVelocity = 0.35,
  enableScrollBoost = true,
  className = "",
  style,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstGroupRef = useRef<HTMLDivElement>(null);

  const positionRef = useRef(0);
  const scrollBoostRef = useRef(0);
  const jumpRemainingRef = useRef(0);
  const hoveringRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPosRef = useRef(0);
  const isVisibleRef = useRef(true);

  const groupWidthRef = useRef(0);
  const cardStepRef = useRef(350);

  // Measure card group width and single card width + gap
  const measure = () => {
    if (!firstGroupRef.current || !trackRef.current) return;
    const gap = parseFloat(window.getComputedStyle(trackRef.current).columnGap) || 20;
    const groupW = firstGroupRef.current.getBoundingClientRect().width;
    groupWidthRef.current = groupW + gap;

    const firstCard = firstGroupRef.current.querySelector(".rc-story-card");
    if (firstCard) {
      cardStepRef.current = firstCard.getBoundingClientRect().width + gap;
    }
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [testimonials]);

  // Main animation ticker loop
  useEffect(() => {
    let lastTime = performance.now();
    let rafId: number;

    const BOOST_DECAY = 0.06;
    const JUMP_EASE = 0.14;

    const tick = (time: number) => {
      const dt = Math.min((time - lastTime) / (1000 / 60), 2.5);
      lastTime = time;

      if (isVisibleRef.current && groupWidthRef.current > 0) {
        // Decay scroll boost
        scrollBoostRef.current += (0 - scrollBoostRef.current) * Math.min(BOOST_DECAY * dt, 1);

        // Calculate velocity
        const effectiveVelocity = hoveringRef.current || isDraggingRef.current
          ? 0
          : baseVelocity + scrollBoostRef.current;

        positionRef.current += effectiveVelocity * dt;

        // Apply jump step from next/prev buttons
        if (jumpRemainingRef.current !== 0) {
          const step = jumpRemainingRef.current * Math.min(JUMP_EASE * dt, 1);
          positionRef.current += step;
          jumpRemainingRef.current -= step;
          if (Math.abs(jumpRemainingRef.current) < 0.5) {
            positionRef.current += jumpRemainingRef.current;
            jumpRemainingRef.current = 0;
          }
        }

        // Infinite modulo loop
        const gWidth = groupWidthRef.current;
        positionRef.current = ((positionRef.current % gWidth) + gWidth) % gWidth;

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${-positionRef.current}px, 0, 0)`;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [baseVelocity]);

  // Scroll acceleration listener
  useEffect(() => {
    if (!enableScrollBoost) return;

    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();

    const handleScroll = () => {
      const now = performance.now();
      const dt = Math.max(now - lastScrollTime, 10);
      const dy = Math.abs(window.scrollY - lastScrollY);

      const velocity = dy / dt;
      scrollBoostRef.current = Math.min(scrollBoostRef.current + velocity * 0.45, 1.4);

      lastScrollY = window.scrollY;
      lastScrollTime = now;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enableScrollBoost]);

  // Pause when offscreen
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || !viewportRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });

    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, []);

  // Next / Prev jump navigation
  const handlePrev = () => {
    jumpRemainingRef.current -= cardStepRef.current;
  };

  const handleNext = () => {
    jumpRemainingRef.current += cardStepRef.current;
  };

  // Pointer drag handling
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartPosRef.current = positionRef.current;
    if (viewportRef.current) {
      viewportRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    positionRef.current = dragStartPosRef.current - deltaX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    if (viewportRef.current && viewportRef.current.hasPointerCapture(e.pointerId)) {
      viewportRef.current.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`rc-stories-section rc-stories--${theme} ${className}`}
      style={style}
      aria-label={label}
    >
      <div className="rc-stories-container">
        <div className="rc-stories-head">
          <div className="rc-stories-meta">
            <span className="rc-stories-label">{label}</span>
            <span className="rc-stories-index">{index}</span>
          </div>

          <h2 className="rc-stories-title">{title}</h2>

          <div className="rc-stories-nav">
            <button
              className="rc-stories-btn"
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5m6-6-6 6 6 6" />
              </svg>
            </button>
            <button
              className="rc-stories-btn"
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials Ticker Viewport */}
      <div
        ref={viewportRef}
        className="rc-stories-viewport"
        onMouseEnter={() => (hoveringRef.current = true)}
        onMouseLeave={() => (hoveringRef.current = false)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div ref={trackRef} className="rc-stories-track">
          {/* Primary Group */}
          <div ref={firstGroupRef} className="rc-stories-group">
            {testimonials.map((item) => (
              <article key={item.id} className="rc-story-card">
                <div className="rc-story-top">
                  <span className="rc-story-num">{item.num}</span>
                  <span className="rc-story-tag">{item.tag || "Client review"}</span>
                </div>

                <p className="rc-story-quote">{item.quote}</p>

                <div className="rc-story-client">
                  <img
                    className="rc-story-avatar"
                    src={item.avatar}
                    alt={item.author}
                    loading="lazy"
                    draggable={false}
                  />
                  <div className="rc-story-author">
                    <b>{item.author}</b>
                    <span>{item.company}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Cloned Group for Seamless Endless Loop */}
          <div className="rc-stories-group" aria-hidden="true">
            {testimonials.map((item) => (
              <article key={`clone-${item.id}`} className="rc-story-card">
                <div className="rc-story-top">
                  <span className="rc-story-num">{item.num}</span>
                  <span className="rc-story-tag">{item.tag || "Client review"}</span>
                </div>

                <p className="rc-story-quote">{item.quote}</p>

                <div className="rc-story-client">
                  <img
                    className="rc-story-avatar"
                    src={item.avatar}
                    alt=""
                    loading="lazy"
                    draggable={false}
                  />
                  <div className="rc-story-author">
                    <b>{item.author}</b>
                    <span>{item.company}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientStories;
