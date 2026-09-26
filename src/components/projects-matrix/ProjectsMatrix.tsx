import React, { useEffect, useRef, useState } from "react";
import "./projects-matrix.css";

export interface ProjectItem {
  id: number;
  num: string;
  category: string;
  title: string;
  tags?: string;
  image: string;
  href?: string;
}

export interface ProjectsMatrixProps {
  /** Optional HTML id attribute (e.g. "work" for anchor navigation) */
  id?: string;
  /** Array of project items (defaults to Rock Castle's 10 showcase projects) */
  projects?: ProjectItem[];
  /** Eyebrow text above the center title */
  eyebrow?: string;
  /** Primary center heading text */
  titleMain?: string;
  /** Sub-heading center text */
  titleSub?: string;
  /** CTA button text */
  ctaText?: string;
  /** CTA link target */
  ctaHref?: string;
  /** Callback when CTA is clicked */
  onCtaClick?: () => void;
  /** Callback when a project card is clicked */
  onProjectClick?: (project: ProjectItem) => void;
  /** Enable the floating "VIEW" cursor badge on hover */
  showCustomCursor?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Inline style overrides */
  style?: React.CSSProperties;
}

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 1,
    num: "01",
    category: "Campaign",
    title: "Brand Campaign",
    tags: "Strategy / Direction / Film",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&crop=entropy&w=700&q=70",
    href: "#connect",
  },
  {
    id: 2,
    num: "02",
    category: "Production",
    title: "Hero Production",
    tags: "Direction / Stage / Lighting",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=entropy&w=700&q=70",
    href: "#connect",
  },
  {
    id: 3,
    num: "03",
    category: "Social",
    title: "Social Content",
    tags: "Motion / Post / Film",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&crop=entropy&w=700&q=70",
    href: "#connect",
  },
  {
    id: 4,
    num: "04",
    category: "Editorial",
    title: "Editorial",
    tags: "Strategy / Post / Motion",
    image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&crop=entropy&w=700&q=70",
    href: "#connect",
  },
  {
    id: 5,
    num: "05",
    category: "Film",
    title: "Film & Motion",
    tags: "Film / Motion / Post",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&crop=entropy&w=700&q=70",
    href: "#connect",
  },
  {
    id: 6,
    num: "06",
    category: "Spatial",
    title: "Spatial Design",
    tags: "Spatial Design / Fabrication / Stage",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=entropy&w=700&q=70",
    href: "#connect",
  },
  {
    id: 7,
    num: "07",
    category: "Stage",
    title: "Stage",
    tags: "Stage / Lighting / Load-Out",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&crop=entropy&w=700&q=70",
    href: "#connect",
  },
  {
    id: 8,
    num: "08",
    category: "Lighting",
    title: "Lighting",
    tags: "Lighting / Stage / Direction",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=entropy&w=700&q=70",
    href: "#connect",
  },
  {
    id: 9,
    num: "09",
    category: "Post",
    title: "Post",
    tags: "Post / Motion / Film",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&crop=entropy&w=700&q=70",
    href: "#connect",
  },
  {
    id: 10,
    num: "10",
    category: "Fabrication",
    title: "Fabrication",
    tags: "Fabrication / Spatial Design / Load-Out",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&crop=entropy&w=700&q=70",
    href: "#connect",
  },
];

/**
 * ProjectsMatrix Component
 * 
 * Standalone React component reproducing the 10-project architecture in motion
 * grid with smooth edge-slide entrance animations, corner-clipped cards,
 * monochrome-to-color hover zoom, and an interactive floating VIEW cursor.
 */
export const ProjectsMatrix: React.FC<ProjectsMatrixProps> = ({
  id = "work",
  projects = DEFAULT_PROJECTS,
  eyebrow = "10 Projects",
  titleMain = "Architecture",
  titleSub = "in motion",
  ctaText = "Explore Projects",
  ctaHref = "/made-by-rock-castle",
  onCtaClick,
  onProjectClick,
  showCustomCursor = true,
  className = "",
  style,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorActive, setCursorActive] = useState(false);

  // Trigger entrance animation when component scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Custom mouse follower cursor badge
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!showCustomCursor) return;
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  const handleCardMouseEnter = () => {
    if (showCustomCursor) setCursorActive(true);
  };

  const handleCardMouseLeave = () => {
    if (showCustomCursor) setCursorActive(false);
  };

  // Stagger delays for entrance animation
  const getSlotDelay = (slotId: number) => {
    const delays: Record<number, number> = {
      1: 0.05,
      2: 0.12,
      3: 0.18,
      4: 0.08,
      5: 0.15,
      6: 0.1,
      7: 0.16,
      8: 0.22,
      9: 0.14,
      10: 0.2,
    };
    return delays[slotId] || 0.1;
  };

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`rc-matrix-section ${className}`}
      data-animated={isAnimated ? "true" : "false"}
      onPointerMove={handlePointerMove}
      style={style}
    >
      {/* Floating interactive VIEW cursor */}
      {showCustomCursor && (
        <div
          className={`rc-cursor-badge ${cursorActive ? "is-visible" : ""}`}
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
          }}
          aria-hidden="true"
        >
          View
        </div>
      )}

      <div className="rc-matrix-container">
        <div className="rc-matrix-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`rc-mslot rc-mslot--${project.id}`}
              style={{
                transitionDelay: isAnimated ? `${getSlotDelay(project.id)}s` : "0s",
              }}
            >
              <a
                className="rc-mslot-card"
                href={project.href || "#"}
                onClick={(e) => {
                  if (onProjectClick) {
                    e.preventDefault();
                    onProjectClick(project);
                  }
                }}
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
              >
                <span className="rc-mslot-media" aria-hidden="true">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                  />
                </span>

                <span className="rc-mslot-top">
                  <span className="rc-mslot-num">{project.num}</span>
                  <span className="rc-mslot-cat">{project.category}</span>
                </span>

                <span className="rc-mslot-foot">
                  <span className="rc-mslot-title">{project.title}</span>
                  {project.tags && (
                    <span className="rc-mslot-tags">{project.tags}</span>
                  )}
                </span>

                <span className="rc-mslot-arrow" aria-hidden="true">
                  &#8599;
                </span>
              </a>
            </div>
          ))}

          {/* Centered Architecture in Motion statement */}
          <div
            className="rc-matrix-centre"
            style={{
              transitionDelay: isAnimated ? "0.25s" : "0s",
            }}
          >
            <span className="rc-centre-eyebrow">{eyebrow}</span>
            <p className="rc-centre-title">
              <span className="rc-centre-title-main">{titleMain}</span>
              <span className="rc-centre-title-sub">{titleSub}</span>
            </p>
            <a
              href={ctaHref}
              className="rc-trans-cta"
              onClick={(e) => {
                if (onCtaClick) {
                  e.preventDefault();
                  onCtaClick();
                }
              }}
            >
              <span>{ctaText}</span>
              <span className="rc-trans-cta-arrow" aria-hidden="true">
                &darr;
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsMatrix;
