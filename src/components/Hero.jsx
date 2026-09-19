import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Hero.css'

// Set once the asset exists (e.g. drop the file in /public and point here).
const HERO_VIDEO_SRC = ''
const HERO_VIDEO_POSTER = ''

// A single bottom-left caption that loops continuously (matching the
// reference), rather than cycling between five perimeter positions.
const FLOAT_FACTS = [
  { tag: 'EST.', text: '2013 — Dubai, UAE' },
  { tag: 'TRACK RECORD', text: '12 years · 140+ activations' },
  { tag: 'CRAFT', text: 'Film-level experiential craft' },
  { tag: 'DISCIPLINE', text: 'Spatial design × brand experiences' },
  { tag: 'WHY', text: 'Spaces people talk about a year later' },
]

export default function Hero() {
  const heroRef = useRef(null)
  const logoRef = useRef(null)
  const tagRef = useRef(null)
  const scanRef = useRef(null)
  const scrollRef = useRef(null)
  const videoRef = useRef(null)
  const floatRef = useRef(null)
  const floatIndexRef = useRef(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let stopFloatLoop = null

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 })
      tl.fromTo(logoRef.current, { opacity: 0, rotateY: 180, scale: 0.8 }, { opacity: 1, rotateY: 0, scale: 1, duration: 1.8, ease: 'expo.out' })
        .fromTo(tagRef.current, { opacity: 0, y: 20 }, { opacity: 0.7, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
        .fromTo(scanRef.current, { opacity: 0, scaleX: 0 }, { opacity: 0.8, scaleX: 1, duration: 2, ease: 'expo.out' }, '-=0.5')
        .fromTo(scrollRef.current, { opacity: 0 }, { opacity: 0.5, duration: 1 }, '-=1')

      // ── auto-cycling bottom-left caption — loops continuously while the
      // hero is at rest, and pauses the moment the viewer starts scrolling
      // (rather than ticking on invisibly behind a faded-out card) ──
      if (!reduced && floatRef.current) {
        const card = floatRef.current
        const ruleEl = card.querySelector('.hero__float-rule')
        const indexEl = card.querySelector('.hero__float-index')
        const textEl = card.querySelector('.hero__float-text')

        const setContent = () => {
          const i = floatIndexRef.current % FLOAT_FACTS.length
          const fact = FLOAT_FACTS[i]
          indexEl.textContent = `${String(i + 1).padStart(2, '0')} — ${fact.tag}`
          textEl.innerHTML = fact.text
            .split('')
            .map((ch) => (ch === ' ' ? ' ' : `<span class="hero__float-char-mask"><span class="hero__float-char">${ch}</span></span>`))
            .join('')
        }

        // Each cycle rebuilds its own one-shot timeline against freshly-minted
        // char spans (the previous cycle's spans get thrown away by setContent's
        // innerHTML swap), then schedules the next cycle from onComplete — a
        // single repeat:-1 timeline can't work here since its targets would go
        // stale the moment the text changes underneath it.
        let cancelled = false
        let paused = false
        let pendingCall = null
        let activeTl = null
        const runCycle = () => {
          if (cancelled || paused) return
          setContent()
          const chars = textEl.querySelectorAll('.hero__float-char')
          activeTl = gsap.timeline({
            onComplete: () => {
              floatIndexRef.current += 1
              pendingCall = gsap.delayedCall(0.3, runCycle)
            }
          })
          activeTl
            .fromTo(ruleEl, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power3.out' })
            .fromTo(indexEl, { opacity: 0, x: -8 }, { opacity: 0.75, x: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2')
            .fromTo(chars, { yPercent: 120, rotate: 6 }, { yPercent: 0, rotate: 0, duration: 0.4, ease: 'power3.out', stagger: 0.018 }, '-=0.15')
            .to(card, { y: -6, duration: 1.1, ease: 'sine.inOut' }, '+=0.7')
            .to(chars, { yPercent: -120, duration: 0.28, ease: 'power2.in', stagger: 0.012 }, '+=0.4')
            .to(indexEl, { opacity: 0, duration: 0.25, ease: 'power2.in' }, '<')
            .to(ruleEl, { scaleX: 0, duration: 0.3, ease: 'power2.in' }, '<')
            .set(card, { y: 0 })
        }

        gsap.delayedCall(1.6, runCycle)
        stopFloatLoop = () => {
          cancelled = true
          if (activeTl) activeTl.kill()
          if (pendingCall) pendingCall.kill()
        }

        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: '+=80',
          onEnter: () => { paused = true },
          onLeaveBack: () => { paused = false; if (!activeTl?.isActive()) runCycle() }
        })
      }

      // ── scroll-triggered "video cut" transition into the next section ──
      if (!reduced) {
        gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6
          }
        })
          .to(videoRef.current || '.hero__placeholder', { scale: 1.12, ease: 'none' }, 0)
          .to('.hero__overlay', { opacity: 1, ease: 'none' }, 0)
          .to(floatRef.current, { opacity: 0, duration: 0.2, ease: 'none' }, 0)
      }
    }, heroRef)

    return () => {
      ctx.revert()
      if (stopFloatLoop) stopFloatLoop()
    }
  }, [])

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div className="hero__video-wrap">
        {HERO_VIDEO_SRC ? (
          <video
            ref={videoRef}
            className="hero__video"
            autoPlay
            loop
            muted
            playsInline
            poster={HERO_VIDEO_POSTER || undefined}
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
        ) : (
          <div className="hero__placeholder" aria-label="Video placeholder">
            <span className="hero__placeholder-label">[ HERO VIDEO ]</span>
          </div>
        )}
      </div>
      <div className="hero__overlay" />
      <div ref={floatRef} className="hero__float hero__float--bl" aria-hidden="true">
        <span className="hero__float-rule" />
        <span className="hero__float-index" />
        <p className="hero__float-text" />
      </div>
      <div className="hero__content">
        <img ref={logoRef} src="/rockcastle-logo.png" alt="Rockcastle — Experiences Un-Ltd." className="hero__logo" />
        <p ref={tagRef} className="hero__tagline">Experiences Un-Ltd.</p>
      </div>
      <div ref={scanRef} className="hero__scanline" />
      <div ref={scrollRef} className="hero__scroll">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-text">Scroll</span>
      </div>
      <div className="hero__corner hero__corner--tl" />
      <div className="hero__corner hero__corner--tr" />
      <div className="hero__corner hero__corner--bl" />
      <div className="hero__corner hero__corner--br" />
    </section>
  )
}
