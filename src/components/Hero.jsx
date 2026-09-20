import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Hero.css'

const heroStates = [
  {
    id: '01',
    tag: 'SPATIAL ARCHITECTURE',
    text: 'We architect physical realms where brand identity takes monumental form. Spaces sculpted with filmic precision to turn fleeting observation into lifelong emotional conviction.'
  },
  {
    id: '02',
    tag: 'FILM-GRADE PRODUCTION',
    text: 'Every activation is conceived as a living cinematic scene with real-time drama. We merge physical fabrication with stage engineering to construct spaces that command total focus.'
  },
  {
    id: '03',
    tag: 'EXPERIENCES UN-LTD.',
    text: 'Twelve years across Dubai and international stages engineering bespoke worlds. We build what conventional agencies consider unbuildable, uniting audacity with flawless execution.'
  }
]

export default function Hero() {
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const cursorRef = useRef(null)
  const textRef = useRef(null)
  const tagRef = useRef(null)
  const cardRef = useRef(null)
  const stateIndexRef = useRef(0)

  const [activeStateIndex, setActiveStateIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [cursorVisible, setCursorVisible] = useState(false)

  // Switch hero text state smoothly using GSAP
  const transitionToState = useCallback((nextIndex) => {
    const nextState = heroStates[nextIndex]
    if (!textRef.current || !tagRef.current) {
      setActiveStateIndex(nextIndex)
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        stateIndexRef.current = nextIndex
        setActiveStateIndex(nextIndex)
      }
    })

    tl.to([textRef.current, tagRef.current], {
      opacity: 0,
      y: -8,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        if (textRef.current) textRef.current.textContent = nextState.text
        if (tagRef.current) tagRef.current.textContent = `${nextState.id} — ${nextState.tag}`
      }
    })
    .to([tagRef.current, textRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.45,
      stagger: 0.06,
      ease: 'power3.out'
    })
  }, [])

  // Auto-cycle through states every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const next = (stateIndexRef.current + 1) % heroStates.length
      transitionToState(next)
    }, 6000)

    return () => clearInterval(timer)
  }, [transitionToState])

  // Custom Play/Pause Video toggle
  const toggleVideoPlayback = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  useEffect(() => {
    const heroEl = heroRef.current
    const cursorEl = cursorRef.current
    if (!heroEl) return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    let moveX, moveY

    if (finePointer && cursorEl) {
      moveX = gsap.quickTo(cursorEl, 'x', { duration: 0.25, ease: 'power3.out' })
      moveY = gsap.quickTo(cursorEl, 'y', { duration: 0.25, ease: 'power3.out' })

      const handleMouseMove = (e) => {
        const rect = heroEl.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        moveX(x)
        moveY(y)
      }

      const handleMouseEnter = () => setCursorVisible(true)
      const handleMouseLeave = () => setCursorVisible(false)

      heroEl.addEventListener('mousemove', handleMouseMove)
      heroEl.addEventListener('mouseenter', handleMouseEnter)
      heroEl.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        heroEl.removeEventListener('mousemove', handleMouseMove)
        heroEl.removeEventListener('mouseenter', handleMouseEnter)
        heroEl.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  // Entrance and scroll-driven parallax
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })
      tl.fromTo('.hero__brand-bar', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
        .fromTo('.hero__bottom-narrative', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
        .fromTo('.hero__ticker', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.4')

      // Subtle scroll parallax on the background video
      gsap.to('.hero__video', {
        yPercent: 18,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const currentState = heroStates[activeStateIndex]

  return (
    <section className="hero" id="hero" ref={heroRef} onClick={toggleVideoPlayback}>
      {/* Fullscreen Video Background */}
      <div className="hero__video-container" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero__video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/images/rockcastle.mp4" type="video/mp4" />
        </video>
        <div className="hero__scrim" />
        <div className="hero__grain" />
      </div>

      {/* Interactive Custom Cursor (Desktop only) */}
      <div
        ref={cursorRef}
        className={`hero__cursor ${cursorVisible ? 'is-visible' : ''}`}
        aria-hidden="true"
      >
        <span className="hero__cursor-dot" />
        <span className="hero__cursor-text">{isPlaying ? 'PAUSE VIDEO' : 'PLAY VIDEO'}</span>
      </div>

      {/* Top Brand & Status Bar */}
      <div className="hero__brand-bar">
        <div className="hero__brand-left">
          <img src="/rockcastle-logo.jpg" alt="Rockcastle" className="hero__logo-mark" />
          <span className="hero__status-label">STUDIO DUBAI // GLOBAL ACTIVATIONS</span>
        </div>
        <div className="hero__state-indicators">
          {heroStates.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              className={`hero__state-pill ${idx === activeStateIndex ? 'is-active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                transitionToState(idx)
              }}
              aria-label={`Go to narrative phase ${s.id}`}
            >
              <span>{s.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Single Editorial Text Box Positioned at Left Bottom */}
      <div className="hero__bottom-narrative">
        <div className="hero__narrative-card" ref={cardRef}>
          <div className="hero__card-header">
            <span ref={tagRef} className="hero__state-tag">
              {currentState.id} — {currentState.tag}
            </span>
            <span className="hero__block-rule" />
          </div>
          <p ref={textRef} className="hero__paragraph">
            {currentState.text}
          </p>
        </div>
      </div>

      {/* Mobile Playback Badge */}
      <div className="hero__mobile-badge" onClick={(e) => { e.stopPropagation(); toggleVideoPlayback() }}>
        <span className="hero__mobile-badge-dot" />
        <span className="hero__mobile-badge-text">{isPlaying ? 'TAP TO PAUSE' : 'TAP TO PLAY'}</span>
      </div>

      {/* Bottom Continuous Moving Ticker */}
      <div className="hero__ticker" aria-hidden="true">
        <div className="hero__ticker-track">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="hero__ticker-group">
              <span className="hero__ticker-item">ROCKCASTLE // EXPERIENCES UN-LTD.</span>
              <span className="hero__ticker-sep">✦</span>
              <span className="hero__ticker-item">25.2048° N, 55.2708° E</span>
              <span className="hero__ticker-sep">✦</span>
              <span className="hero__ticker-item">SPATIAL DESIGN × BRAND ACTIVATION</span>
              <span className="hero__ticker-sep">✦</span>
              <span className="hero__ticker-item">140+ MONUMENTAL BUILDS</span>
              <span className="hero__ticker-sep">✦</span>
              <span className="hero__ticker-item">DUBAI ATELIER & FABRICATION</span>
              <span className="hero__ticker-sep">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Architectural Viewport Corners */}
      <div className="hero__corner hero__corner--tl" />
      <div className="hero__corner hero__corner--tr" />
      <div className="hero__corner hero__corner--bl" />
      <div className="hero__corner hero__corner--br" />
    </section>
  )
}
