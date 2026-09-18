import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas } from '@react-three/fiber'
import DoorScene from './DoorScene'
import './Doors.css'

export default function Doors() {
  const wrapRef = useRef(null)
  const sceneRef = useRef(null)
  const progressRef = useRef(0)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const scene = sceneRef.current
      if (!scene) return

      const label = scene.querySelector('.doors__label')
      const glow = scene.querySelector('.doors__glow')
      const vignette = scene.querySelector('.doors__vignette')
      const revealText = scene.querySelector('.doors__reveal')
      const interior = scene.querySelector('.doors__interior')
      const canvasWrap = scene.querySelector('.doors__canvas-wrap')

      // Check reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) {
        progressRef.current = 1
        gsap.set(interior, { opacity: 1, scale: 1, y: 0 })
        gsap.set(label, { opacity: 0 })
        gsap.set(revealText, { opacity: 0 })
        gsap.set(canvasWrap, { opacity: 0 })
        return
      }

      // Preserved master pinned scroll timeline — exact original timings & scrub
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          pin: sceneRef.current,
          anticipatePin: 1,
          pinSpacing: false,
          onUpdate: (self) => {
            progressRef.current = self.progress
          }
        }
      })

      // ── Phase 1: 0% → 25% — Doors begin opening (Interior is strictly hidden) ──
      tl.to(label, {
        opacity: 0,
        y: -30,
        duration: 0.08,
        ease: 'power1.out'
      }, 0)

      // Warm orange glow leaks through the gap
      tl.to(glow, {
        opacity: 0.8,
        duration: 0.2
      }, 0.05)

      // ── Phase 2: 25% → 55% — Doors open, "Step Inside" appears against atmospheric glow ──
      // Glow widens in the open doorway
      tl.to(glow, {
        opacity: 0.7,
        width: '40vw',
        duration: 0.3
      }, 0.25)

      // "Step inside" text appears in the doorway (NO work content behind it!)
      tl.fromTo(revealText, {
        opacity: 0,
        scale: 0.75,
        y: 20
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.12,
        ease: 'power2.out'
      }, 0.28)

      // "Step inside" text scales forward and disappears completely before 0.58
      tl.to(revealText, {
        opacity: 0,
        scale: 1.8,
        y: -20,
        duration: 0.14,
        ease: 'power2.in'
      }, 0.44)

      // ── Phase 3: 55% → 85% — Camera moves FORWARD through doorway ──
      // Vignette intensifies for depth
      tl.to(vignette, {
        opacity: 0.9,
        duration: 0.15
      }, 0.56)

      // Glow softens as we pass through threshold
      tl.to(glow, {
        opacity: 0.15,
        duration: 0.2
      }, 0.58)

      // ── ONLY AFTER "Step Inside" disappears (0.58+): The Work Page Starts! ──
      tl.fromTo(interior, {
        opacity: 0,
        scale: 0.88,
        y: 50
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.24,
        ease: 'power2.out'
      }, 0.62)

      // ── Phase 4: 85% → 100% — Full transition, doorway cleared, Work page in place ──
      tl.to(vignette, {
        opacity: 0,
        duration: 0.15
      }, 0.85)

      tl.to(glow, {
        opacity: 0,
        duration: 0.1
      }, 0.85)

      // Canvas layer fades out cleanly as user passes completely inside
      tl.to(canvasWrap, {
        opacity: 0,
        duration: 0.12,
        ease: 'power1.in'
      }, 0.86)

      // Interior settles into full presence
      tl.to(interior, {
        scale: 1,
        opacity: 1,
        duration: 0.15
      }, 0.85)

    }, wrapRef.current)

    return () => ctx.revert()
  }, [])

  return (
    <div className="doors-wrap" ref={wrapRef}>
      <section className="doors" id="doors" ref={sceneRef}>

        {/* 1. Interior — exists BEHIND the doors from the start */}
        <div className="doors__interior">
          <div className="doors__interior-content">
            <span className="doors__interior-label">Selected Projects</span>
            <h3 className="doors__interior-title">Our Work</h3>
            <div className="doors__interior-preview">
              <div className="placeholder placeholder--16x9">
                <span className="placeholder__label">[ PROJECT IMAGE ]</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Orange glow behind doors */}
        <div className="doors__glow" />

        {/* 3. Realistic 3D Architectural Double Door Canvas */}
        <div className="doors__canvas-wrap">
          <Canvas
            camera={{ position: [0, 0, 5.0], fov: 44, near: 0.1, far: 50 }}
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
            }}
          >
            <DoorScene progressRef={progressRef} />
          </Canvas>
        </div>

        {/* 4. Vignette — darkens edges during forward motion */}
        <div className="doors__vignette" />

        {/* 5. Reveal text — mid-animation */}
        <div className="doors__reveal">
          <span className="doors__reveal-line">Step</span>
          <span className="doors__reveal-accent">Inside</span>
        </div>

        {/* 6. Label — top */}
        <div className="doors__label">Enter the world of Rockcastle</div>

      </section>
    </div>
  )
}
