import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import WhoWeAre from './WhoWeAre'
import Signature from './Signature'
import { ProjectsMatrix } from './projects-matrix/ProjectsMatrix'
import './WhoWeAreSignature.css'

gsap.registerPlugin(ScrollTrigger)

export default function WhoWeAreSignature() {
  const containerRef = useRef(null)
  const whoLayerRef = useRef(null)
  const sigLayerRef = useRef(null)
  const matrixLayerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const whoLayer = whoLayerRef.current
    const sigLayer = sigLayerRef.current
    const matrixLayer = matrixLayerRef.current
    if (!container || !whoLayer || !sigLayer || !matrixLayer) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // 1. Hero Slide-Over (Hero recedes as this container slides up)
      const heroEl = document.querySelector('#hero')
      if (heroEl) {
        gsap.timeline({
          scrollTrigger: {
            trigger: heroEl,
            start: 'top top',
            end: '+=100%',
            scrub: 0.8,
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: (value) => (value < 0.35 ? 0 : 1),
              duration: { min: 0.25, max: 0.45 },
              ease: 'power2.inOut'
            }
          }
        }).to(heroEl, { yPercent: -18, ease: 'none', duration: 1 }, 0)
      }

      if (reduced) {
        gsap.set(matrixLayer, { opacity: 1, pointerEvents: 'auto' })
        gsap.set(sigLayer, { display: 'none' })
        gsap.set(whoLayer, { display: 'none' })
        return
      }

      // Query animated elements from WhoWeAre
      const textCol = container.querySelector('.who-we-are__text-column')
      const textChildren = container.querySelectorAll(
        '.who-we-are__header, .who-we-are__narrative, .who-we-are__metrics-row, .who-we-are__cta'
      )
      const mover = container.querySelector('.who-we-are__device-mover')
      const scaler = container.querySelector('.who-we-are__device-scaler')
      const fragments = container.querySelector('.who-we-are__fragments')
      const video = container.querySelector('.who-we-are__screen-video')
      const deviceAccessories = container.querySelectorAll(
        '.rc-device-status-bar, .rc-device-dynamic-island, .rc-device-home-bar, .rc-device-buttons-left, .rc-device-buttons-right, .rc-device-reflection, .who-we-are__device-frame-wrap::before'
      )
      const deviceScreens = container.querySelectorAll('.rc-device-body, .rc-device-screen')
      const whoRoot = container.querySelector('.who-we-are')

      // Centering delta calculation for the phone (scroll-invariant & container-relative)
      const calculateCenterDelta = () => {
        if (!mover || !container) return { x: 0, y: 0 }
        const containerRect = container.getBoundingClientRect()
        const moverRect = mover.getBoundingClientRect()
        const currentX = gsap.getProperty(mover, 'x') || 0
        const currentY = gsap.getProperty(mover, 'y') || 0
        const naturalCenterX = (moverRect.left - currentX - containerRect.left) + moverRect.width / 2
        const naturalCenterY = (moverRect.top - currentY - containerRect.top) + moverRect.height / 2
        return {
          x: window.innerWidth / 2 - naturalCenterX,
          y: window.innerHeight / 2 - naturalCenterY
        }
      }

      // Autoplay video
      if (video) {
        video.defaultMuted = true
        video.muted = true
        video.play().catch(() => {})
      }

      const isMobile = () => window.innerWidth <= 959

      // ── MASTER PINNED TIMELINE ──
      // Pins the single experience container at top top for 780% scroll distance.
      // Seamlessly transitions from WhoWeAre into Signature into ProjectsMatrix with ZERO physical scroll down.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=780%',
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      })

      // ─────────────────────────────────────────────────────────────
      // PART 1: WHO WE ARE (0.00 → 0.42)
      // ─────────────────────────────────────────────────────────────
      // Phase 1 (0.00 -> 0.10): Reading Phase
      if (textCol) {
        tl.to(textCol, { y: -12, ease: 'none', duration: 0.10 }, 0.00)
      }
      if (textChildren.length) {
        tl.to(textChildren, { y: -6, ease: 'none', duration: 0.10 }, 0.00)
      }

      // Phase 2 (0.10 -> 0.20): Smooth Glide to Center
      // Fade out both textCol and textChildren so even with display:contents on mobile, text fades away smoothly!
      if (textCol) {
        tl.to(textCol, {
          opacity: 0,
          x: () => isMobile() ? 0 : 80,
          y: () => isMobile() ? -24 : 0,
          filter: 'blur(8px)',
          duration: 0.08,
          ease: 'power2.in'
        }, 0.10)
      }
      if (textChildren.length) {
        tl.to(textChildren, {
          opacity: 0,
          y: -24,
          filter: 'blur(6px)',
          duration: 0.08,
          ease: 'power2.in'
        }, 0.10)
      }

      if (mover) {
        tl.to(mover, {
          x: () => calculateCenterDelta().x,
          y: () => calculateCenterDelta().y,
          duration: 0.10,
          ease: 'power1.inOut'
        }, 0.10)
      }

      // Brand fragments appear (0.13 -> 0.22)
      if (fragments) {
        const fragmentItems = fragments.querySelectorAll('.who-we-are__fragment')
        tl.to(fragments, { opacity: 1, duration: 0.03 }, 0.13)
        tl.fromTo(fragmentItems,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.07, stagger: 0.02, ease: 'power2.out' },
          0.13
        )
        // Fragments fade out (0.22 -> 0.25)
        tl.to(fragments, {
          opacity: 0,
          y: -16,
          filter: 'blur(6px)',
          duration: 0.03,
          ease: 'power2.in'
        }, 0.22)
      }

      // Phase 3 (0.25 -> 0.33): Phone rotates 90° landscape in dead center
      if (scaler) {
        tl.to(scaler, {
          rotation: 90,
          transformOrigin: '50% 50%',
          duration: 0.08,
          ease: 'power1.inOut'
        }, 0.25)
      }

      if (deviceAccessories.length) {
        tl.to(deviceAccessories, {
          opacity: 0,
          duration: 0.05,
          ease: 'power1.out'
        }, 0.26)
      }

      // Phase 4 (0.33 -> 0.42): Phone zooms up to cover screen, video fades away
      if (scaler) {
        tl.to(scaler, {
          scale: () => isMobile() ? 10 : 9,
          duration: 0.09,
          ease: 'power1.inOut'
        }, 0.33)
      }

      if (deviceScreens.length) {
        tl.to(deviceScreens, {
          borderRadius: 0,
          boxShadow: 'none',
          duration: 0.06,
          ease: 'power1.inOut'
        }, 0.34)
      }

      if (video) {
        tl.to(video, {
          opacity: 0,
          duration: 0.07,
          ease: 'power1.inOut'
        }, 0.34)
      }

      if (whoRoot) {
        tl.to(whoRoot, {
          backgroundColor: '#0a0a0a',
          duration: 0.07,
          ease: 'power1.inOut'
        }, 0.34)
      }

      // ─────────────────────────────────────────────────────────────
      // THE SEAMLESS HAND-OFF (0.39 → 0.45)
      // As phone reaches full-bleed and video fades out, Signature BLENDS IN directly on screen!
      // ZERO upward scroll. Viewport remains perfectly pinned.
      // ─────────────────────────────────────────────────────────────
      tl.to(sigLayer, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.05,
        ease: 'power1.out'
      }, 0.39)

      tl.to(whoLayer, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.04,
        ease: 'power1.in'
      }, 0.42)

      // Signature ambient atmosphere & telemetry HUD emerge
      tl.fromTo('.sig__glow', { opacity: 0 }, { opacity: 0.6, duration: 0.04, ease: 'power1.out' }, 0.40)
        .fromTo('.sig__hud', { opacity: 0 }, { opacity: 0.75, duration: 0.04, ease: 'power1.out' }, 0.40)
        .fromTo('.sig__indicator', { opacity: 0 }, { opacity: 1, duration: 0.04, ease: 'power1.out' }, 0.41)
        .fromTo('.sig__plane--grid', { opacity: 0 }, { opacity: 0.25, duration: 0.04, ease: 'power1.out' }, 0.41)

      // ─────────────────────────────────────────────────────────────
      // PART 2: SIGNATURE ARCHITECTURAL EXPERIENCE (0.42 → 1.00)
      // ─────────────────────────────────────────────────────────────
      // Phase indicator tracking
      tl.to('.sig__ind--space', { color: '#fa5a32', opacity: 1, duration: 0.01 }, 0.42)
        .to('.sig__ind--space', { color: 'rgba(245,240,235,0.4)', duration: 0.01 }, 0.54)
        .to('.sig__ind--structure', { color: '#fa5a32', opacity: 1, duration: 0.01 }, 0.54)
        .to('.sig__ind--structure', { color: 'rgba(245,240,235,0.4)', duration: 0.01 }, 0.67)
        .to('.sig__ind--experience', { color: '#fa5a32', opacity: 1, duration: 0.01 }, 0.67)
        .to('.sig__ind--experience', { color: 'rgba(245,240,235,0.4)', duration: 0.01 }, 0.79)
        .to('.sig__ind--memory', { color: '#fa5a32', opacity: 1, duration: 0.01 }, 0.79)
        .to('.sig__ind--memory', { color: 'rgba(245,240,235,0.4)', duration: 0.01 }, 0.89)
        .to('.sig__indicator', { opacity: 0, duration: 0.03 }, 0.91)

      // SEQUENCE 1: "WE CREATE" (0.43 → 0.54)
      tl.fromTo('.sig__word--we', {
        opacity: 0, scale: 0.6, z: -300
      }, {
        opacity: 0.75, scale: 1, z: 0, duration: 0.05, ease: 'power2.out'
      }, 0.43)

      tl.fromTo('.sig__word--create', {
        opacity: 0, scale: 0.7, z: -350
      }, {
        opacity: 1, scale: 1, z: 0, duration: 0.06, ease: 'power2.out'
      }, 0.44)

      tl.to('.sig__line--h-axis', { scaleX: 1, opacity: 0.25, duration: 0.06 }, 0.45)
      tl.to('.sig__line--v-axis', { scaleY: 1, opacity: 0.25, duration: 0.06 }, 0.46)
      tl.to('.sig__node--center', { scale: 1, opacity: 1, duration: 0.04 }, 0.47)

      tl.to('.sig__word--we', { opacity: 0, scale: 1.2, z: 150, duration: 0.04, ease: 'power2.in' }, 0.51)
      tl.to('.sig__word--create', { opacity: 0, scale: 0.8, y: -30, duration: 0.04, ease: 'power2.in' }, 0.51)

      // SEQUENCE 2: "SPACES" (0.52 → 0.66)
      tl.fromTo('.sig__word--spaces', {
        opacity: 0, scale: 1.6, z: -300
      }, {
        opacity: 1, scale: 1, z: 0, duration: 0.06, ease: 'power3.out'
      }, 0.52)

      tl.to('.sig__line--h1', { scaleX: 1, opacity: 0.12, duration: 0.05 }, 0.53)
      tl.to('.sig__line--h2', { scaleX: 1, opacity: 0.12, duration: 0.05 }, 0.55)
      tl.to('.sig__line--v1', { scaleY: 1, opacity: 0.12, duration: 0.05 }, 0.55)
      tl.to('.sig__line--v2', { scaleY: 1, opacity: 0.12, duration: 0.05 }, 0.56)

      tl.fromTo('.sig__wireframe--1', {
        opacity: 0, scale: 0.7, rotateX: 20, rotateY: -15
      }, {
        opacity: 0.5, scale: 1, rotateX: 10, rotateY: -8, duration: 0.07
      }, 0.54)

      tl.to('.sig__orange-line--1', { scaleX: 1, opacity: 0.7, duration: 0.05 }, 0.56)
      tl.to('.sig__orange-node--1', { opacity: 1, scale: 1, duration: 0.04 }, 0.57)

      tl.to('.sig__word--spaces', { opacity: 0, scale: 0.7, z: 200, duration: 0.04, ease: 'power2.in' }, 0.63)

      // SEQUENCE 3: "EXPERIENCES" (0.64 → 0.78)
      tl.fromTo('.sig__word--experiences', {
        opacity: 0, scale: 0.65, z: -380
      }, {
        opacity: 1, scale: 1, z: 0, duration: 0.06, ease: 'power3.out'
      }, 0.64)

      tl.to('.sig__line--h3', { scaleX: 1, opacity: 0.15, duration: 0.05 }, 0.65)
      tl.to('.sig__line--v3', { scaleY: 1, opacity: 0.15, duration: 0.05 }, 0.66)
      tl.to('.sig__orange-line--2', { scaleY: 1, opacity: 0.7, duration: 0.05 }, 0.66)
      tl.to('.sig__orange-node--2', { opacity: 1, scale: 1, duration: 0.03 }, 0.67)

      tl.fromTo('.sig__slot--1', {
        opacity: 0, x: -70, y: 30, scale: 0.9, rotateY: 12
      }, {
        opacity: 1, x: 0, y: 0, scale: 1, rotateY: 6, duration: 0.07, ease: 'power2.out'
      }, 0.66)

      tl.fromTo('.sig__slot--2', {
        opacity: 0, x: 70, y: -20, scale: 0.9, rotateY: -12
      }, {
        opacity: 1, x: 0, y: 0, scale: 1, rotateY: -6, duration: 0.07, ease: 'power2.out'
      }, 0.68)

      tl.to('.sig__word--experiences', { opacity: 0, scale: 1.2, z: 180, duration: 0.04, ease: 'power2.in' }, 0.75)

      // SEQUENCE 4: "MEMORY" (0.74 → 0.81)
      tl.fromTo('.sig__word--memory', {
        opacity: 0, scale: 0.6, z: -350
      }, {
        opacity: 1, scale: 1, z: 0, duration: 0.04, ease: 'power3.out'
      }, 0.74)

      tl.fromTo('.sig__wireframe--2', {
        opacity: 0, scale: 0.8
      }, {
        opacity: 0.6, scale: 1, duration: 0.04
      }, 0.75)

      tl.to('.sig__plane--grid', { opacity: 0.12, duration: 0.04 }, 0.75)
      tl.to('.sig__orange-line--3', { scaleX: 1, opacity: 0.8, duration: 0.03 }, 0.76)

      // MEMORY zooms into the camera and fades out
      tl.to('.sig__word--memory', {
        opacity: 0, scale: 2.2, z: 320, duration: 0.05, ease: 'power2.in'
      }, 0.80)

      // SEQUENCE 5: IMMERSIVE DISSOLVE & TRANSITION INTO PROJECTS MATRIX (0.80 → 1.00)
      tl.to('.sig__world', { scale: 2.2, z: 280, opacity: 0, duration: 0.05, ease: 'power2.in' }, 0.80)
      tl.to('.sig__slot--1', { x: '-40%', y: '-20%', scale: 1.6, opacity: 0, duration: 0.04, ease: 'none' }, 0.80)
      tl.to('.sig__slot--2', { x: '40%', y: '25%', scale: 1.6, opacity: 0, duration: 0.04, ease: 'none' }, 0.80)
      tl.to('.sig__hud', { opacity: 0, duration: 0.03 }, 0.81)
      tl.to('.sig__vignette', { opacity: 0, duration: 0.03 }, 0.81)

      // Cross-fade: Signature layer fades out, Projects Matrix layer fades in!
      tl.to(sigLayer, { opacity: 0, duration: 0.04 }, 0.83)
      tl.fromTo(matrixLayer, {
        opacity: 0, pointerEvents: 'none'
      }, {
        opacity: 1, pointerEvents: 'auto', duration: 0.04, ease: 'power2.out'
      }, 0.83)

      // Projects Matrix: 10 Cards and Centerpiece fly in from the edges
      tl.fromTo('.rc-mslot--1, .rc-mslot--2, .rc-mslot--3', {
        x: -140, opacity: 0, scale: 0.88
      }, {
        x: 0, opacity: 1, scale: 1, duration: 0.06, ease: 'power3.out', stagger: 0.015
      }, 0.84)

      tl.fromTo('.rc-mslot--4, .rc-mslot--5', {
        y: -110, opacity: 0, scale: 0.88
      }, {
        y: 0, opacity: 1, scale: 1, duration: 0.06, ease: 'power3.out', stagger: 0.015
      }, 0.84)

      tl.fromTo('.rc-mslot--6, .rc-mslot--7', {
        x: 140, opacity: 0, scale: 0.88
      }, {
        x: 0, opacity: 1, scale: 1, duration: 0.06, ease: 'power3.out', stagger: 0.015
      }, 0.85)

      tl.fromTo('.rc-mslot--8, .rc-mslot--9, .rc-mslot--10', {
        y: 110, opacity: 0, scale: 0.88
      }, {
        y: 0, opacity: 1, scale: 1, duration: 0.06, ease: 'power3.out', stagger: 0.015
      }, 0.85)

      tl.fromTo('.rc-matrix-centre', {
        y: 35, opacity: 0, scale: 0.95
      }, {
        y: 0, opacity: 1, scale: 1, duration: 0.06, ease: 'power3.out'
      }, 0.85)

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="who-sig-experience" id="who-we-are" ref={containerRef} aria-label="Who We Are, Signature and Projects Experience">
      {/* Anchor targets for seamless nav */}
      <span id="about" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} aria-hidden="true" />
      <span id="signature" style={{ position: 'absolute', top: '40%', left: 0, pointerEvents: 'none' }} aria-hidden="true" />
      <span id="work" style={{ position: 'absolute', top: '80%', left: 0, pointerEvents: 'none' }} aria-hidden="true" />

      {/* Layer 1: Who We Are (starts visible) */}
      <div className="who-sig-layer who-sig-layer--who" ref={whoLayerRef}>
        <WhoWeAre isCombined={true} />
      </div>

      {/* Layer 2: Signature (starts hidden at top: 0, blends in after phone zoom) */}
      <div className="who-sig-layer who-sig-layer--sig" ref={sigLayerRef}>
        <Signature isCombined={true} />
      </div>

      {/* Layer 3: Projects Matrix (Architecture in Motion - transitions in when memory fades) */}
      <div className="who-sig-layer who-sig-layer--matrix" ref={matrixLayerRef}>
        <ProjectsMatrix id="work" />
      </div>
    </div>
  )
}
