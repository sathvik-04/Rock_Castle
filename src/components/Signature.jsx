import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Signature.css'

export default function Signature() {
  const sceneRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const scene = sceneRef.current
      if (!scene) return

      // GSAP Pinning: pin scene directly for 500% scroll distance with pinSpacing
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: '+=500%',
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      })

      if (prefersReduced) {
        // Simplified non-motion fade sequence
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
      // PHASE INDICATOR TRACKING (0.00 → 1.00)
      // ─────────────────────────────────────────────────────────────
      tl.to('.sig__ind--space', { color: '#e87a2e', opacity: 1, duration: 0.01 }, 0.02)
        .to('.sig__ind--space', { color: 'rgba(245,240,235,0.4)', duration: 0.01 }, 0.24)
        .to('.sig__ind--structure', { color: '#e87a2e', opacity: 1, duration: 0.01 }, 0.24)
        .to('.sig__ind--structure', { color: 'rgba(245,240,235,0.4)', duration: 0.01 }, 0.44)
        .to('.sig__ind--experience', { color: '#e87a2e', opacity: 1, duration: 0.01 }, 0.44)
        .to('.sig__ind--experience', { color: 'rgba(245,240,235,0.4)', duration: 0.01 }, 0.64)
        .to('.sig__ind--memory', { color: '#e87a2e', opacity: 1, duration: 0.01 }, 0.64)
        .to('.sig__ind--memory', { color: 'rgba(245,240,235,0.4)', duration: 0.01 }, 0.84)
        .to('.sig__indicator', { opacity: 0, duration: 0.04 }, 0.86)

      // HUD & Atmosphere
      tl.to('.sig__hud', { opacity: 0.7, duration: 0.06 }, 0.02)
      tl.to('.sig__glow', { opacity: 0.35, duration: 0.2 }, 0.02)

      // ─────────────────────────────────────────────────────────────
      // SEQUENCE 1: SPACE (0.04 → 0.22)
      // Typography: "WE CREATE" emerges from depth
      // ─────────────────────────────────────────────────────────────
      tl.fromTo('.sig__word--we', {
        opacity: 0, scale: 0.6, z: -300
      }, {
        opacity: 0.7, scale: 1, z: 0, duration: 0.1, ease: 'none'
      }, 0.04)

      tl.fromTo('.sig__word--create', {
        opacity: 0, scale: 0.7, z: -350
      }, {
        opacity: 1, scale: 1, z: 0, duration: 0.11, ease: 'none'
      }, 0.06)

      // First architectural structural datum lines draw
      tl.to('.sig__line--h-axis', { scaleX: 1, opacity: 0.25, duration: 0.12 }, 0.08)
      tl.to('.sig__line--v-axis', { scaleY: 1, opacity: 0.25, duration: 0.12 }, 0.10)
      tl.to('.sig__node--center', { scale: 1, opacity: 1, duration: 0.06 }, 0.12)

      // ─────────────────────────────────────────────────────────────
      // SEQUENCE 2: SPACES (0.18 → 0.38)
      // "SPACES" enters dominantly, architectural grid forms
      // ─────────────────────────────────────────────────────────────
      tl.to('.sig__word--we', { opacity: 0, scale: 1.3, z: 200, duration: 0.08 }, 0.18)
      tl.to('.sig__word--create', { opacity: 0.15, scale: 0.75, y: -45, duration: 0.08 }, 0.18)

      tl.fromTo('.sig__word--spaces', {
        opacity: 0, scale: 2.2, z: -400
      }, {
        opacity: 1, scale: 1, z: 0, duration: 0.12, ease: 'none'
      }, 0.18)

      // Structural lines multiply into architectural grid
      tl.to('.sig__line--h1', { scaleX: 1, opacity: 0.12, duration: 0.1 }, 0.20)
      tl.to('.sig__line--h2', { scaleX: 1, opacity: 0.12, duration: 0.1 }, 0.22)
      tl.to('.sig__line--v1', { scaleY: 1, opacity: 0.12, duration: 0.1 }, 0.22)
      tl.to('.sig__line--v2', { scaleY: 1, opacity: 0.12, duration: 0.1 }, 0.24)

      // Wireframe volumes start materializing
      tl.fromTo('.sig__wireframe--1', {
        opacity: 0, scale: 0.7, rotateX: 20, rotateY: -15
      }, {
        opacity: 0.5, scale: 1, rotateX: 10, rotateY: -8, duration: 0.12
      }, 0.22)

      // Orange structural tension lines connect nodes
      tl.to('.sig__orange-line--1', { scaleX: 1, opacity: 0.7, duration: 0.08 }, 0.26)
      tl.to('.sig__orange-node--1', { opacity: 1, scale: 1, duration: 0.06 }, 0.28)

      // ─────────────────────────────────────────────────────────────
      // SEQUENCE 3: EXPERIENCES (0.34 → 0.52)
      // "EXPERIENCES" enters, photographic project placeholders arrive
      // ─────────────────────────────────────────────────────────────
      tl.to('.sig__word--create', { opacity: 0, duration: 0.05 }, 0.34)
      tl.to('.sig__word--spaces', { opacity: 0, scale: 0.6, z: 300, duration: 0.08 }, 0.34)

      tl.fromTo('.sig__word--experiences', {
        opacity: 0, scale: 0.6, z: -500
      }, {
        opacity: 1, scale: 1, z: 0, duration: 0.12, ease: 'none'
      }, 0.34)

      // Additional grid lines & depth planes
      tl.to('.sig__line--h3', { scaleX: 1, opacity: 0.15, duration: 0.08 }, 0.36)
      tl.to('.sig__line--v3', { scaleY: 1, opacity: 0.15, duration: 0.08 }, 0.38)
      tl.to('.sig__orange-line--2', { scaleY: 1, opacity: 0.7, duration: 0.08 }, 0.38)
      tl.to('.sig__orange-node--2', { opacity: 1, scale: 1, duration: 0.06 }, 0.40)

      // Photographic placeholders slide into 3D positions
      tl.fromTo('.sig__slot--1', {
        opacity: 0, x: -70, y: 30, scale: 0.9, rotateY: 12
      }, {
        opacity: 1, x: 0, y: 0, scale: 1, rotateY: 6, duration: 0.12, ease: 'power2.out'
      }, 0.38)

      tl.fromTo('.sig__slot--2', {
        opacity: 0, x: 70, y: -20, scale: 0.9, rotateY: -12
      }, {
        opacity: 1, x: 0, y: 0, scale: 1, rotateY: -6, duration: 0.12, ease: 'power2.out'
      }, 0.42)

      // ─────────────────────────────────────────────────────────────
      // SEQUENCE 4: MEMORY (0.48 → 0.62)
      // "MEMORY" enters, structure becomes increasingly complex
      // ─────────────────────────────────────────────────────────────
      tl.to('.sig__word--experiences', { opacity: 0, scale: 1.25, z: 200, duration: 0.08 }, 0.48)

      tl.fromTo('.sig__word--memory', {
        opacity: 0, scale: 0.5, z: -450
      }, {
        opacity: 1, scale: 1, z: 0, duration: 0.11, ease: 'none'
      }, 0.48)

      // Secondary wireframe volume forms
      tl.fromTo('.sig__wireframe--2', {
        opacity: 0, scale: 0.8
      }, {
        opacity: 0.6, scale: 1, duration: 0.1
      }, 0.50)

      // Perspective floor/ceiling datum planes
      tl.to('.sig__plane--grid', { opacity: 0.12, duration: 0.1 }, 0.50)
      tl.to('.sig__orange-line--3', { scaleX: 1, opacity: 0.8, duration: 0.08 }, 0.52)

      // ─────────────────────────────────────────────────────────────
      // SEQUENCE 5: IMMERSIVE MOMENT (0.58 → 0.76)
      // Camera forward movement: the visitor is INSIDE the experience
      // ─────────────────────────────────────────────────────────────
      tl.to('.sig__word--memory', { opacity: 0, scale: 1.8, z: 350, duration: 0.08 }, 0.58)

      // World scale & camera drive forward
      tl.to('.sig__world', {
        scale: 2.1,
        z: 280,
        duration: 0.18,
        ease: 'none'
      }, 0.58)

      // Differential parallax: foreground frames expand outward to envelop viewport
      tl.to('.sig__slot--1', {
        x: '-35%',
        y: '-15%',
        scale: 1.45,
        opacity: 0.4,
        duration: 0.18,
        ease: 'none'
      }, 0.58)

      tl.to('.sig__slot--2', {
        x: '35%',
        y: '20%',
        scale: 1.5,
        opacity: 0.4,
        duration: 0.18,
        ease: 'none'
      }, 0.58)

      // Wireframe structures expand around visitor
      tl.to('.sig__wireframe--1', {
        scale: 2.2,
        opacity: 0.3,
        duration: 0.18,
        ease: 'none'
      }, 0.58)

      tl.to('.sig__wireframe--2', {
        scale: 2.4,
        opacity: 0.25,
        duration: 0.18,
        ease: 'none'
      }, 0.58)

      // Deep vignette intensifies
      tl.to('.sig__vignette', { opacity: 0.9, duration: 0.14 }, 0.60)

      // Orange tension accents pulse
      tl.to('.sig__orange-line--1', { opacity: 0.9, duration: 0.06 }, 0.62)
      tl.to('.sig__orange-line--2', { opacity: 0.9, duration: 0.06 }, 0.64)

      // ─────────────────────────────────────────────────────────────
      // SEQUENCE 6: FINAL STATEMENT (0.74 → 0.88)
      // Environmental elements fade, monumental statement reveals
      // ─────────────────────────────────────────────────────────────
      tl.to('.sig__world', { opacity: 0.08, duration: 0.08 }, 0.74)
      tl.to('.sig__hud', { opacity: 0, duration: 0.06 }, 0.74)
      tl.to('.sig__vignette', { opacity: 1, duration: 0.08 }, 0.74)

      // "WE DON'T JUST CREATE SPACES."
      tl.fromTo('.sig__final-line1', {
        opacity: 0, y: 50
      }, {
        opacity: 1, y: 0, duration: 0.07, ease: 'power3.out'
      }, 0.76)

      // "WE CREATE EXPERIENCES."
      tl.fromTo('.sig__final-line2', {
        opacity: 0, y: 60
      }, {
        opacity: 1, y: 0, duration: 0.08, ease: 'power3.out'
      }, 0.80)

      // Orange underline accent
      tl.fromTo('.sig__final-underline', {
        scaleX: 0
      }, {
        scaleX: 1, duration: 0.06, ease: 'power2.out'
      }, 0.84)

      // ─────────────────────────────────────────────────────────────
      // SEQUENCE 7: DISSOLVE TO BLACK & CONTACT BRIDGE (0.88 → 1.00)
      // Dissolve to pure black, reveal "LET'S BUILD SOMETHING." + CTA
      // ─────────────────────────────────────────────────────────────
      tl.to('.sig__final', { opacity: 0, y: -30, duration: 0.05 }, 0.89)
      tl.to('.sig__world', { opacity: 0, duration: 0.04 }, 0.89)

      // Transition to Contact emerges
      tl.fromTo('.sig__transition', {
        opacity: 0, y: 40
      }, {
        opacity: 1, y: 0, duration: 0.07, ease: 'power3.out'
      }, 0.92)

    }, sceneRef.current)

    return () => ctx.revert()
  }, [])

  const handleScrollToContact = (e) => {
    e.preventDefault()
    const contactSection = document.querySelector('#contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="sig" id="signature" ref={sceneRef} aria-label="Rockcastle Signature Experience">

      {/* SVG Grain Filter Definition */}
      <svg className="sig__noise-svg" width="0" height="0" aria-hidden="true">
        <filter id="rc-arch-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.16 0" />
        </filter>
      </svg>

      {/* Deep atmospheric glow */}
      <div className="sig__glow" aria-hidden="true" />

      {/* Edge cinematic vignette */}
      <div className="sig__vignette" aria-hidden="true" />

      {/* ── ARCHITECTURAL TELEMETRY HUD ── */}
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

      {/* ── CORE CONCEPT INDICATOR ── */}
      <nav className="sig__indicator" aria-label="Experience Progress">
        <span className="sig__ind-step sig__ind--space">SPACE</span>
        <span className="sig__ind-divider">→</span>
        <span className="sig__ind-step sig__ind--structure">STRUCTURE</span>
        <span className="sig__ind-divider">→</span>
        <span className="sig__ind-step sig__ind--experience">EXPERIENCE</span>
        <span className="sig__ind-divider">→</span>
        <span className="sig__ind-step sig__ind--memory">MEMORY</span>
      </nav>

      {/* ── 3D CAMERA WORLD RIG ── */}
      <div className="sig__world">

        {/* ── ARCHITECTURAL GEOMETRY LAYER ── */}
        <div className="sig__geom-layer">

          {/* Perspective Ground Grid */}
          <div className="sig__plane--grid" />

          {/* Primary Orthogonal Datum Axes */}
          <div className="sig__line sig__line--h-axis" />
          <div className="sig__line sig__line--v-axis" />
          <div className="sig__node sig__node--center" />

          {/* Secondary Structural Grid Lines */}
          <div className="sig__line sig__line--h1" />
          <div className="sig__line sig__line--h2" />
          <div className="sig__line sig__line--h3" />
          <div className="sig__line sig__line--v1" />
          <div className="sig__line sig__line--v2" />
          <div className="sig__line sig__line--v3" />

          {/* 3D Wireframe Spatial Volumes */}
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

          {/* Precision Orange Structural Tension Lines & Nodes */}
          <div className="sig__orange-line sig__orange-line--1" />
          <div className="sig__orange-node sig__orange-node--1" />
          <div className="sig__orange-line sig__orange-line--2" />
          <div className="sig__orange-node sig__orange-node--2" />
          <div className="sig__orange-line sig__orange-line--3" />
        </div>

        {/* ── EDITORIAL PHOTOGRAPHIC PLACEHOLDERS ── */}
        <div className="sig__photos-layer">

          {/* Placeholder 1: 16:9 Architectural Wide Frame */}
          <div className="sig__slot sig__slot--1">
            <div className="sig__image-frame">
              {/* Ready for real image insertion: <img src="..." alt="..." /> */}
              <div className="sig__ph">
                <div className="sig__ph-lighting" />
                <div className="sig__ph-shadow-diagonal" />
                <div className="sig__ph-beam" />
                <div className="sig__ph-grid" />
                <div className="sig__ph-grain" />

                {/* Architectural crop registration crosshairs */}
                <span className="sig__ph-cross sig__ph-cross--tl">+</span>
                <span className="sig__ph-cross sig__ph-cross--tr">+</span>
                <span className="sig__ph-cross sig__ph-cross--bl">+</span>
                <span className="sig__ph-cross sig__ph-cross--br">+</span>

                {/* Understated Editorial Label */}
                <div className="sig__ph-meta">
                  <span className="sig__ph-dot" />
                  <span className="sig__ph-label">REAL IMAGE HERE</span>
                  <span className="sig__ph-ratio">[ 16:9 ]</span>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder 2: 3:2 Architectural Editorial Frame */}
          <div className="sig__slot sig__slot--2">
            <div className="sig__image-frame">
              {/* Ready for real image insertion: <img src="..." alt="..." /> */}
              <div className="sig__ph sig__ph--alt">
                <div className="sig__ph-lighting" />
                <div className="sig__ph-shadow-diagonal sig__ph-shadow--reverse" />
                <div className="sig__ph-beam sig__ph-beam--alt" />
                <div className="sig__ph-grid" />
                <div className="sig__ph-grain" />

                <span className="sig__ph-cross sig__ph-cross--tl">+</span>
                <span className="sig__ph-cross sig__ph-cross--tr">+</span>
                <span className="sig__ph-cross sig__ph-cross--bl">+</span>
                <span className="sig__ph-cross sig__ph-cross--br">+</span>

                <div className="sig__ph-meta">
                  <span className="sig__ph-dot" />
                  <span className="sig__ph-label">REAL IMAGE HERE</span>
                  <span className="sig__ph-ratio">[ 3:2 ]</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── DEPTH TYPOGRAPHY RIG ── */}
        <div className="sig__typo-rig">

          {/* Phase 1: WE CREATE */}
          <div className="sig__phase sig__phase--we-create">
            <span className="sig__word sig__word--we">WE</span>
            <span className="sig__word sig__word--create">CREATE</span>
          </div>

          {/* Phase 2: SPACES */}
          <div className="sig__phase sig__phase--spaces">
            <span className="sig__word sig__word--spaces">SPACES</span>
          </div>

          {/* Phase 3: EXPERIENCES */}
          <div className="sig__phase sig__phase--experiences">
            <span className="sig__word sig__word--experiences">EXPERIENCES</span>
          </div>

          {/* Phase 4: MEMORY */}
          <div className="sig__phase sig__phase--memory">
            <span className="sig__word sig__word--memory">MEMORY</span>
          </div>

        </div>

      </div>

      {/* ── MONUMENTAL FINAL STATEMENT ── */}
      <div className="sig__final">
        <h2 className="sig__final-line1">We don't just create spaces.</h2>
        <h2 className="sig__final-line2">
          We create <span className="sig__final-accent">experiences.</span>
          <span className="sig__final-underline" />
        </h2>
      </div>

      {/* ── TRANSITION TO CONTACT ── */}
      <div className="sig__transition">
        <p className="sig__trans-heading">Let's build something.</p>
        <a
          href="#contact"
          className="sig__trans-cta"
          onClick={handleScrollToContact}
          aria-label="Navigate to contact section"
        >
          <span className="sig__trans-cta-text">Start a Project</span>
          <span className="sig__trans-cta-arrow">→</span>
        </a>
      </div>

    </section>
  )
}
