import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EyeTracking } from "../ui/eye-tracking";
import "./connect-teaser.css";

gsap.registerPlugin(ScrollTrigger);

export interface ConnectTeaserProps {
  /** Section HTML id (defaults to 'connect') */
  id?: string;
  /** Section index identifier */
  index?: string;
  /** Editorial label above headline */
  label?: string;
  /** Primary impactful statement relating to Rock Castle */
  headline?: string;
  /** Secondary narrative subtext */
  subtext?: string;
  /** Pill button text */
  buttonText?: string;
  /** Destination route */
  to?: string;
  /** Optional additional class names */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

/**
 * ConnectTeaser Component
 * 
 * High-impact Rock Castle transition section:
 * - Left column: Interactive EyeTracking component styled with Rock Castle yellow accents
 * - Right column: Bold architectural brand statement and animated marquee capsule CTA
 * - GSAP ScrollTrigger entrance transition when scrolled down
 */
export const ConnectTeaser: React.FC<ConnectTeaserProps> = ({
  id = "connect",
  index = "[ 07 // INITIATE ]",
  label = "Let's Connect",
  headline = "Every monumental build begins with an impossible brief. If you're ready to construct an experience that commands the world's attention, let's talk.",
  subtext = "140+ monumental builds worldwide. Spatial design, kinetic engineering, and architectural staging at unprecedented scale.",
  buttonText = "CONNECT",
  to = "/connect",
  className = "",
  style,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Overall section subtle entrance
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0.88, scale: 0.99 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. Left column interactive eyes entrance with bounce
      if (leftRef.current) {
        gsap.fromTo(
          leftRef.current,
          { opacity: 0, y: 35, scale: 0.82 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: "back.out(1.6)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 3. Right column text elements reveal in staggered sequence
      const textElements = [
        labelRef.current,
        headlineRef.current,
        subtextRef.current,
        ctaRef.current,
      ].filter(Boolean);

      if (textElements.length > 0) {
        gsap.fromTo(
          textElements,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`rc-connect-teaser ${className}`}
      style={style}
      aria-label={label}
    >
      <div className="rc-connect-teaser-container">
        <div className="rc-connect-teaser-grid">
          {/* Left Column: Index, Live Marker & Interactive Eyes */}
          <div ref={leftRef} className="rc-connect-teaser-left">
            <div className="rc-connect-teaser-meta-left">
              <span className="rc-connect-teaser-index">{index}</span>
              <span className="rc-connect-dot-live" aria-hidden="true" />
            </div>

            <div className="rc-connect-eyes-stage" aria-label="Interactive eyes looking towards cursor">
              <EyeTracking
                variant="cartoon"
                eyeSize={88}
                gap={22}
                irisColor="#f2efa3"
                irisColorSecondary="#dfdc85"
                pupilColor="#0d0e0c"
                scleraColor="#faf9eb"
                showReflection={true}
                showIrisDetail={true}
                reactivePupil={true}
                blinkInterval={3800}
              />
            </div>

            <p className="rc-connect-atelier-caption">
              Rock Castle
            </p>
          </div>

          {/* Right Column: Rock Castle Architectural Narrative & Marquee CTA */}
          <div className="rc-connect-teaser-right">
            <span ref={labelRef} className="rc-connect-teaser-label">
              {label}
            </span>

            <h2 ref={headlineRef} className="rc-connect-teaser-headline">
              {headline}
            </h2>

            <p ref={subtextRef} className="rc-connect-teaser-subtext">
              {subtext}
            </p>

            <div ref={ctaRef} className="rc-connect-teaser-cta">
              <Link to={to} className="rc-connect-pill-btn" aria-label={`Go to ${to}`}>
                <span className="rc-connect-pill-track">
                  <span>{buttonText}</span>
                  <span>{buttonText}</span>
                  <span>{buttonText}</span>
                  <span>{buttonText}</span>
                </span>
                <span className="rc-connect-pill-plus" aria-hidden="true">+</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectTeaser;
