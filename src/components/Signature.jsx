import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { projects } from '../data/projects'
import { usePageTransition, transitionClick } from '../hooks/usePageTransition'
import './Signature.css'

const sigProjects = [projects[0], projects[1] || projects[0]]

export default function Signature({ isCombined = false }) {
  const sceneRef = useRef(null)
  const transitionTo = usePageTransition()

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || isCombined) return

    const ctx = gsap.context(() => {
      const scene = sceneRef.current
      if (!scene) return

      // All pre-animations removed: section is natively visible and seamlessly blends in
      // GSAP Pinning: pin scene directly for 360% scroll distance with pinSpacing
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: '+=360%',
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      })

      if (prefersReduced) {
        tl.to('.sig__phase--we-create', { opacity: 1, duration: 0.15 }, 0.05)
          .to('.sig__phase--we-create', { opacity: 0, duration: 0.1 }, 0.2)
          .to('.sig__phase--spaces', { opacity: 1, duration: 0.15 }, 0.25)
          .to('.sig__phase--spaces', { opacity: 0, duration: 0.1 }, 0.4)
          .to('.sig__phase--experiences', { opacity: 1, duration: 0.15 }, 0.45)
          .to('.sig__phase--experiences', { opacity: 0, duration: 0.1 }, 0.6)
          .to('.sig__phase--memory', { opacity: 1, duration: 0.15 }, 0.65)
          .to('.sig__phase--memory', { opacity: 0, duration: 0.1 }, 0.75)
          .to('.sig__final', { opacity: 1, duration: 0.15 }, 0.8)
          .to('.sig__final', { opacity: 0, duration: 0.08 }, 0.92)
          .to('.sig__transition', { opacity: 1, duration: 0.08 }, 0.94)
        return
      }

      // ─────────────────────────────────────────────────────────────
      // SMOOTH SECTION ENTRANCE (0.00 → 0.06)
      // As the phone covers the screen and video fades out, Signature seamlessly appears
      // ─────────────────────────────────────────────────────────────
      tl.fromTo('.sig__glow', { opacity: 0 }, { opacity: 0.6, duration: 0.05, ease: 'power1.out' }, 0.00)
        .fromTo('.sig__hud', { opacity: 0 }, { opacity: 0.75, duration: 0.05, ease: 'power1.out' }, 0.00)
        .fromTo('.sig__indicator', { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'power1.out' }, 0.01)
        .fromTo('.sig__plane--grid', { opacity: 0 }, { opacity: 0.25, duration: 0.06, ease: 'power1.out' }, 0.01)

      // ─────────────────────────────────────────────────────────────
      // PHASE INDICATOR TRACKING (0.00 → 1.00)
      // ─────────────────────────────────────────────────────────────
      tl.to('.sig__ind--space', { color: '#fa5a32', opacity: 1, duration: 0.01 }, 0.02)
        .to('.sig__ind--space', { color: 'rgba(245,240,235,0.4)', duration: 0.01 }, 0.21)
        .to('.sig__ind--structure', { color: '#fa5a32', opacity: 1, duration: 0.01 }, 0.21)
        .to('.sig__ind--structure', { color: 'rgba(245,240,235,0.4)', duration: 0.01 }, 0.40)
        .to('.sig__ind--experience', { color: '#fa5a32', opacity: 1, duration: 0.01 }, 0.40)
        .to('.sig__ind--experience', { color: 'rgba(245,240,235,0.4)', duration: 0.01 }, 0.59)
        .to('.sig__ind--memory', { color: '#fa5a32', opacity: 1, duration: 0.01 }, 0.59)
        .to('.sig__ind--memory', { color: 'rgba(245,240,235,0.4)', duration: 0.01 }, 0.77)
        .to('.sig__indicator', { opacity: 0, duration: 0.04 }, 0.82)

      // ─────────────────────────────────────────────────────────────
      // SEQUENCE 1: "WE CREATE" (0.04 → 0.22)
      // ─────────────────────────────────────────────────────────────
      tl.fromTo('.sig__word--we', {
        opacity: 0, scale: 0.6, z: -300
      }, {
        opacity: 0.75, scale: 1, z: 0, duration: 0.08, ease: 'power2.out'
      }, 0.04)

      tl.fromTo('.sig__word--create', {
        opacity: 0, scale: 0.7, z: -350
      }, {
        opacity: 1, scale: 1, z: 0, duration: 0.09, ease: 'power2.out'
      }, 0.06)

      // First architectural datum lines
      tl.to('.sig__line--h-axis', { scaleX: 1, opacity: 0.25, duration: 0.10 }, 0.08)
      tl.to('.sig__line--v-axis', { scaleY: 1, opacity: 0.25, duration: 0.10 }, 0.10)
      tl.to('.sig__node--center', { scale: 1, opacity: 1, duration: 0.06 }, 0.11)

      // Smooth exit of WE CREATE overlapping into SPACES
      tl.to('.sig__word--we', { opacity: 0, scale: 1.2, z: 150, duration: 0.06, ease: 'power2.in' }, 0.18)
      tl.to('.sig__word--create', { opacity: 0, scale: 0.8, y: -30, duration: 0.06, ease: 'power2.in' }, 0.18)

      // ─────────────────────────────────────────────────────────────
      // SEQUENCE 2: "SPACES" (0.19 → 0.40) — Seamless overlap
      // ─────────────────────────────────────────────────────────────
      tl.fromTo('.sig__word--spaces', {
        opacity: 0, scale: 1.6, z: -300
      }, {
        opacity: 1, scale: 1, z: 0, duration: 0.08, ease: 'power3.out'
      }, 0.19)

      // Grid lines expand
      tl.to('.sig__line--h1', { scaleX: 1, opacity: 0.12, duration: 0.08 }, 0.21)
      tl.to('.sig__line--h2', { scaleX: 1, opacity: 0.12, duration: 0.08 }, 0.23)
      tl.to('.sig__line--v1', { scaleY: 1, opacity: 0.12, duration: 0.08 }, 0.23)
      tl.to('.sig__line--v2', { scaleY: 1, opacity: 0.12, duration: 0.08 }, 0.25)

      // Wireframe volume 1
      tl.fromTo('.sig__wireframe--1', {
        opacity: 0, scale: 0.7, rotateX: 20, rotateY: -15
      }, {
        opacity: 0.5, scale: 1, rotateX: 10, rotateY: -8, duration: 0.10
      }, 0.23)

      tl.to('.sig__orange-line--1', { scaleX: 1, opacity: 0.7, duration: 0.08 }, 0.25)
      tl.to('.sig__orange-node--1', { opacity: 1, scale: 1, duration: 0.06 }, 0.27)

      // Smooth exit of SPACES overlapping into EXPERIENCES
      tl.to('.sig__word--spaces', { opacity: 0, scale: 0.7, z: 200, duration: 0.06, ease: 'power2.in' }, 0.37)

      // ─────────────────────────────────────────────────────────────
      // SEQUENCE 3: "EXPERIENCES" (0.38 → 0.59) — Seamless overlap
      // ─────────────────────────────────────────────────────────────
      tl.fromTo('.sig__word--experiences', {
        opacity: 0, scale: 0.65, z: -380
      }, {
        opacity: 1, scale: 1, z: 0, duration: 0.08, ease: 'power3.out'
      }, 0.38)

      tl.to('.sig__line--h3', { scaleX: 1, opacity: 0.15, duration: 0.07 }, 0.40)
      tl.to('.sig__line--v3', { scaleY: 1, opacity: 0.15, duration: 0.07 }, 0.41)
      tl.to('.sig__orange-line--2', { scaleY: 1, opacity: 0.7, duration: 0.07 }, 0.41)
      tl.to('.sig__orange-node--2', { opacity: 1, scale: 1, duration: 0.05 }, 0.43)

      // Photographic project cards slide in
      tl.fromTo('.sig__slot--1', {
        opacity: 0, x: -70, y: 30, scale: 0.9, rotateY: 12
      }, {
        opacity: 1, x: 0, y: 0, scale: 1, rotateY: 6, duration: 0.10, ease: 'power2.out'
      }, 0.42)

      tl.fromTo('.sig__slot--2', {
        opacity: 0, x: 70, y: -20, scale: 0.9, rotateY: -12
      }, {
        opacity: 1, x: 0, y: 0, scale: 1, rotateY: -6, duration: 0.10, ease: 'power2.out'
      }, 0.44)

      // Smooth exit of EXPERIENCES overlapping into MEMORY
      tl.to('.sig__word--experiences', { opacity: 0, scale: 1.2, z: 180, duration: 0.06, ease: 'power2.in' }, 0.56)

      // ─────────────────────────────────────────────────────────────
      // SEQUENCE 4: "MEMORY" (0.57 → 0.76) — Seamless overlap
      // ─────────────────────────────────────────────────────────────
      tl.fromTo('.sig__word--memory', {
        opacity: 0, scale: 0.6, z: -350
      }, {
        opacity: 1, scale: 1, z: 0, duration: 0.08, ease: 'power3.out'
      }, 0.57)

      tl.fromTo('.sig__wireframe--2', {
        opacity: 0, scale: 0.8
      }, {
        opacity: 0.6, scale: 1, duration: 0.08
      }, 0.59)

      tl.to('.sig__plane--grid', { opacity: 0.12, duration: 0.08 }, 0.59)
      tl.to('.sig__orange-line--3', { scaleX: 1, opacity: 0.8, duration: 0.06 }, 0.61)

      // Smooth exit of MEMORY overlapping into final drive
      tl.to('.sig__word--memory', { opacity: 0, scale: 1.4, z: 260, duration: 0.06, ease: 'power2.in' }, 0.72)

      // ─────────────────────────────────────────────────────────────
      // SEQUENCE 5: IMMERSIVE DRIVE FORWARD (0.68 → 0.80)
      // ─────────────────────────────────────────────────────────────
      tl.to('.sig__world', {
        scale: 2.1,
        z: 280,
        duration: 0.14,
        ease: 'none'
      }, 0.68)

      tl.to('.sig__slot--1', {
        x: '-35%',
        y: '-15%',
        scale: 1.45,
        opacity: 0.35,
        duration: 0.14,
        ease: 'none'
      }, 0.68)

      tl.to('.sig__slot--2', {
        x: '35%',
        y: '20%',
        scale: 1.5,
        opacity: 0.35,
        duration: 0.14,
        ease: 'none'
      }, 0.68)

      tl.to('.sig__vignette', { opacity: 0.95, duration: 0.12 }, 0.70)

      // ─────────────────────────────────────────────────────────────
      // SEQUENCE 6: MONUMENTAL FINAL STATEMENT (0.78 → 0.90)
      // ─────────────────────────────────────────────────────────────
      tl.to('.sig__world', { opacity: 0.06, duration: 0.08 }, 0.78)
      tl.to('.sig__hud', { opacity: 0, duration: 0.06 }, 0.78)

      tl.fromTo('.sig__final-line1', {
        opacity: 0, y: 40
      }, {
        opacity: 1, y: 0, duration: 0.07, ease: 'power3.out'
      }, 0.80)

      tl.fromTo('.sig__final-line2', {
        opacity: 0, y: 45
      }, {
        opacity: 1, y: 0, duration: 0.08, ease: 'power3.out'
      }, 0.83)

      tl.fromTo('.sig__final-underline', {
        scaleX: 0
      }, {
        scaleX: 1, duration: 0.05, ease: 'power2.out'
      }, 0.87)

      // ─────────────────────────────────────────────────────────────
      // SEQUENCE 7: DISSOLVE TO BLACK & SMOOTH HAND-OFF INTO WORK (0.90 → 1.00)
      // ─────────────────────────────────────────────────────────────
      tl.to('.sig__final', { opacity: 0, y: -25, duration: 0.05 }, 0.91)
      tl.to('.sig__world', { opacity: 0, duration: 0.04 }, 0.91)

      tl.fromTo('.sig__transition', {
        opacity: 0, y: 30
      }, {
        opacity: 1, y: 0, duration: 0.06, ease: 'power3.out'
      }, 0.94)

    }, sceneRef.current)

    return () => ctx.revert()
  }, [])

  return (
    <section
      className={`sig ${isCombined ? 'sig--combined' : ''}`}
      id={isCombined ? undefined : "signature"}
      ref={sceneRef}
      aria-label="Rockcastle Signature Experience"
    >
      {/* SVG Grain Filter Definition */}
      <svg className="sig__noise-svg" width="0" height="0" aria-hidden="true">
        <filter id="rc-arch-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.16 0" />
        </filter>
      </svg>

      {/* Atmospheric glow & vignette */}
      <div className="sig__glow" aria-hidden="true" />
      <div className="sig__vignette" aria-hidden="true" />

      {/* THE CONSUME — expanding black circular mask */}
      <div className="sig__consume" aria-hidden="true" />

      {/* Architectural Telemetry HUD */}
      <div className="sig__hud" aria-hidden="true">
        <div className="sig__hud-corner sig__hud-corner--tl">
          <span className="sig__hud-code">// RC-EXP-08</span>
          <span className="sig__hud-sub">SIGNATURE SYSTEM</span>
        </div>
        <div className="sig__hud-corner sig__hud-corner--tr">
          <span className="sig__hud-coord">25.2048° N · 55.2708° E</span>
          <span className="sig__hud-sub">DUBAI ATELIER</span>
        </div>
        <div className="sig__hud-corner sig__hud-corner--bl">
          <span className="sig__hud-elev">AXIS // Z-DEPTH</span>
        </div>
        <div className="sig__hud-corner sig__hud-corner--br">
          <span className="sig__hud-elev">ELEV +00.00M</span>
        </div>
      </div>

      {/* Core Concept Indicator */}
      <nav className="sig__indicator" aria-label="Experience Progress">
        <span className="sig__ind-step sig__ind--space">SPACE</span>
        <span className="sig__ind-divider">→</span>
        <span className="sig__ind-step sig__ind--structure">STRUCTURE</span>
        <span className="sig__ind-divider">→</span>
        <span className="sig__ind-step sig__ind--experience">EXPERIENCE</span>
        <span className="sig__ind-divider">→</span>
        <span className="sig__ind-step sig__ind--memory">MEMORY</span>
      </nav>

      {/* 3D Camera World Rig */}
      <div className="sig__world">
        {/* Architectural Geometry Layer */}
        <div className="sig__geom-layer">
          <div className="sig__plane--grid" />
          <div className="sig__line sig__line--h-axis" />
          <div className="sig__line sig__line--v-axis" />
          <div className="sig__node sig__node--center" />

          <div className="sig__line sig__line--h1" />
          <div className="sig__line sig__line--h2" />
          <div className="sig__line sig__line--h3" />
          <div className="sig__line sig__line--v1" />
          <div className="sig__line sig__line--v2" />
          <div className="sig__line sig__line--v3" />

          <div className="sig__wireframe sig__wireframe--1">
            <div className="sig__wf-corner sig__wf-corner--tl" />
            <div className="sig__wf-corner sig__wf-corner--tr" />
            <div className="sig__wf-corner sig__wf-corner--bl" />
            <div className="sig__wf-corner sig__wf-corner--br" />
          </div>

          <div className="sig__wireframe sig__wireframe--2">
            <div className="sig__wf-corner sig__wf-corner--tl" />
            <div className="sig__wf-corner sig__wf-corner--tr" />
            <div className="sig__wf-corner sig__wf-corner--bl" />
            <div className="sig__wf-corner sig__wf-corner--br" />
          </div>

          <div className="sig__orange-line sig__orange-line--1" />
          <div className="sig__orange-node sig__orange-node--1" />
          <div className="sig__orange-line sig__orange-line--2" />
          <div className="sig__orange-node sig__orange-node--2" />
          <div className="sig__orange-line sig__orange-line--3" />
        </div>

        {/* Real Project Imagery Layer (No blank placeholder boxes) */}
        <div className="sig__photos-layer">
          <div className="sig__slot sig__slot--1">
            <Link
              className="sig__image-frame"
              to={`/work/${sigProjects[0].slug}`}
              onClick={(e) => transitionClick(e, transitionTo, `/work/${sigProjects[0].slug}`)}
            >
              <img src={sigProjects[0].image} alt={sigProjects[0].name} className="sig__project-photo" />
              <div className="sig__photo-overlay" />
              <div className="sig__photo-info">
                <span className="sig__photo-cat">{sigProjects[0].catLabel}</span>
                <span className="sig__photo-name">{sigProjects[0].name}</span>
              </div>
            </Link>
          </div>

          <div className="sig__slot sig__slot--2">
            <Link
              className="sig__image-frame"
              to={`/work/${sigProjects[1].slug}`}
              onClick={(e) => transitionClick(e, transitionTo, `/work/${sigProjects[1].slug}`)}
            >
              <img src={sigProjects[1].image} alt={sigProjects[1].name} className="sig__project-photo" />
              <div className="sig__photo-overlay" />
              <div className="sig__photo-info">
                <span className="sig__photo-cat">{sigProjects[1].catLabel}</span>
                <span className="sig__photo-name">{sigProjects[1].name}</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Depth Typography Rig with Calibrated Delays */}
        <div className="sig__typo-rig">
          <div className="sig__phase sig__phase--we-create">
            <span className="sig__word sig__word--we">WE</span>
            <span className="sig__word sig__word--create">CREATE</span>
          </div>

          <div className="sig__phase sig__phase--spaces">
            <span className="sig__word sig__word--spaces">SPACES</span>
          </div>

          <div className="sig__phase sig__phase--experiences">
            <span className="sig__word sig__word--experiences">EXPERIENCES</span>
          </div>

          <div className="sig__phase sig__phase--memory">
            <span className="sig__word sig__word--memory">MEMORY</span>
          </div>
        </div>
      </div>

      {/* Monumental Final Statement */}
      <div className="sig__final">
        <h2 className="sig__final-line1">We don't just create spaces.</h2>
        <h2 className="sig__final-line2">
          We create <span className="sig__final-accent">experiences.</span>
          <span className="sig__final-underline" />
        </h2>
      </div>

      {/* Smooth Transition Hand-off Into Selected Work */}
      <div className="sig__transition">
        <p className="sig__trans-heading">ARCHITECTURE IN MOTION</p>
        <a href="#work" className="sig__trans-cta">
          <span className="sig__trans-cta-text">EXPLORE PROJECTS</span>
          <span className="sig__trans-cta-arrow">↓</span>
        </a>
      </div>
    </section>
  )
}
