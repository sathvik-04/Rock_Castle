import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import CastleDrawing from './CastleDrawing'
import './Hero.css'

// 3 Curated narrative states.
// Each state has:
// - Left paragraph: 5 lines, exactly 6 words each line (House of Yellow reference, primary font, bold scale)
// - Right paragraph: 5 lines, exactly 6 words each line (Same font, contrasting architectural scale)
const HERO_STATES = [
  {
    id: '01',
    tag: 'SPATIAL ARCHITECTURE',
    subTag: 'MANIFESTO // 01',
    leftLines: [
      'We architect monumental physical realms where',
      'visionary brands transcend ordinary human limits.',
      'Every bespoke installation marries structural precision',
      'with unfiltered stage drama and emotion.',
      'Engineering memories that endure for lifetimes.'
    ],
    rightLines: [
      'Based in Dubai and operating worldwide,',
      'our fabrication atelier transforms impossible concepts',
      'into tangible steel, luminous light, stone.',
      'Crafting unforgettable spaces for world leaders,',
      'luxury maisons, and visionary cultural pioneers.'
    ]
  },
  {
    id: '02',
    tag: 'FILMIC PRODUCTION',
    subTag: 'MANIFESTO // 02',
    leftLines: [
      'Physical fabrication merges with cinematic scale',
      'to construct scenes commanding total focus.',
      'Spatial narratives engineered without creative boundaries',
      'evoke awe through calculated architectural audacity.',
      'Turning fleeting glance into lifelong conviction.'
    ],
    rightLines: [
      'Twelve years of commanding international stages',
      'define our bespoke spatial production standard.',
      'From initial blueprint through complex engineering,',
      'we curate multisensory environments that resonate',
      'across culture, luxury, and global discourse.'
    ]
  },
  {
    id: '03',
    tag: 'MONUMENTAL EXPERIENCES',
    subTag: 'MANIFESTO // 03',
    leftLines: [
      'Between heavy raw stone and light,',
      'we carve enduring monuments of wonder.',
      'Designed to disrupt the modern skyline',
      'and elevate reality beyond standard convention.',
      'Pure architectural theater built to last.'
    ],
    rightLines: [
      'Our multidisciplinary studio unifies master craft,',
      'advanced robotics, and bespoke staging engineering.',
      'Every detail is meticulously honed to',
      'transform empty spaces into legendary landmarks,',
      'celebrated by audiences across the globe.'
    ]
  }
]

export default function Hero() {
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const cursorBoxRef = useRef(null)
  const leftParaRef = useRef(null)
  const rightParaRef = useRef(null)

  const [activeStateIndex, setActiveStateIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [cursorVisible, setCursorVisible] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const isTransitioningRef = useRef(false)
  const stateIndexRef = useRef(0)
  const isDraggingRef = useRef(false)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const cursorCoord = useRef({ x: 0, y: 0 })
  const dragDeltaTotal = useRef(0)
  const quickToX = useRef(null)
  const quickToY = useRef(null)
  const quickToRotate = useRef(null)

  // ----------------------------------------------------
  // REFINED ARCHITECTURAL 3D SLIDE-TILT TEXT ANIMATION
  // ----------------------------------------------------
  const transitionToState = useCallback((nextIndex) => {
    if (isTransitioningRef.current || nextIndex === stateIndexRef.current) return
    isTransitioningRef.current = true

    const nextState = HERO_STATES[nextIndex]
    const leftContainer = leftParaRef.current
    const rightContainer = rightParaRef.current

    if (!leftContainer || !rightContainer) {
      stateIndexRef.current = nextIndex
      setActiveStateIndex(nextIndex)
      isTransitioningRef.current = false
      return
    }

    const leftLines = leftContainer.querySelectorAll('.spiral-line-inner')
    const rightLines = rightContainer.querySelectorAll('.spiral-line-inner')

    const tl = gsap.timeline({
      onComplete: () => {
        stateIndexRef.current = nextIndex
        setActiveStateIndex(nextIndex)
        isTransitioningRef.current = false
      }
    })

    // Outgoing: Clean, quick architectural lift & fade
    tl.to(leftLines, {
      y: -18,
      rotateX: -16,
      opacity: 0,
      duration: 0.32,
      stagger: 0.03,
      ease: 'power2.in'
    }, 0)

    tl.to(rightLines, {
      y: -16,
      rotateX: 16,
      opacity: 0,
      duration: 0.32,
      stagger: 0.03,
      ease: 'power2.in'
    }, 0.02)

    // Mid-transition text update
    tl.add(() => {
      leftLines.forEach((el, idx) => {
        if (nextState.leftLines[idx]) el.textContent = nextState.leftLines[idx]
      })
      rightLines.forEach((el, idx) => {
        if (nextState.rightLines[idx]) el.textContent = nextState.rightLines[idx]
      })
    })

    // Prepare incoming lines
    tl.set(leftLines, {
      y: 20,
      rotateX: 16,
      opacity: 0
    })
    tl.set(rightLines, {
      y: 18,
      rotateX: -16,
      opacity: 0
    })

    // Incoming: smooth, confident descent to normal reading plane
    tl.to(leftLines, {
      y: 0,
      rotateX: 0,
      opacity: 1,
      duration: 0.55,
      stagger: 0.04,
      ease: 'power3.out'
    }, '+=0.02')

    tl.to(rightLines, {
      y: 0,
      rotateX: 0,
      opacity: 1,
      duration: 0.55,
      stagger: 0.04,
      ease: 'power3.out'
    }, '<0.03')
  }, [])

  // Auto-cycle through states every 9s with hover pause so users can read comfortably
  useEffect(() => {
    let isPaused = false
    const wrapper = document.querySelector('.hero__editorial-wrapper')
    const onEnter = () => { isPaused = true }
    const onLeave = () => { isPaused = false }

    if (wrapper) {
      wrapper.addEventListener('mouseenter', onEnter)
      wrapper.addEventListener('mouseleave', onLeave)
    }

    const timer = setInterval(() => {
      if (isPaused) return
      const next = (stateIndexRef.current + 1) % HERO_STATES.length
      transitionToState(next)
    }, 9000)

    return () => {
      clearInterval(timer)
      if (wrapper) {
        wrapper.removeEventListener('mouseenter', onEnter)
        wrapper.removeEventListener('mouseleave', onLeave)
      }
    }
  }, [transitionToState])

  // Toggle Video Play/Pause
  const toggleVideoPlayback = useCallback(() => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  // ----------------------------------------------------
  // DRAGGABLE SQUARE BOX CURSOR ("PLAYVIDEO")
  // ----------------------------------------------------
  useEffect(() => {
    const heroEl = heroRef.current
    const boxEl = cursorBoxRef.current
    if (!heroEl || !boxEl) return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!finePointer) return

    quickToX.current = gsap.quickTo(boxEl, 'x', { duration: 0.28, ease: 'power3.out' })
    quickToY.current = gsap.quickTo(boxEl, 'y', { duration: 0.28, ease: 'power3.out' })
    quickToRotate.current = gsap.quickTo(boxEl, 'rotation', { duration: 0.2, ease: 'power2.out' })

    let lastX = 0

    const handleMouseMove = (e) => {
      const rect = heroEl.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      cursorCoord.current = { x, y }

      if (isDraggingRef.current) {
        // Calculate drag delta and velocity tilt
        const dx = e.clientX - dragStartPos.current.startX
        const dy = e.clientY - dragStartPos.current.startY
        dragDeltaTotal.current += Math.abs(e.movementX || 0) + Math.abs(e.movementY || 0)

        const targetX = dragStartPos.current.boxOriginX + dx
        const targetY = dragStartPos.current.boxOriginY + dy

        const velX = e.movementX || 0
        const tilt = Math.max(-14, Math.min(14, velX * 1.8))

        quickToX.current(targetX)
        quickToY.current(targetY)
        quickToRotate.current(tilt)
      } else {
        const velX = x - lastX
        lastX = x
        const tilt = Math.max(-8, Math.min(8, velX * 0.4))

        quickToX.current(x)
        quickToY.current(y)
        quickToRotate.current(tilt)
      }
    }

    const handleMouseEnter = () => {
      document.body.classList.add('hero-hover-active')
      setCursorVisible(true)
    }

    const handleMouseLeave = () => {
      document.body.classList.remove('hero-hover-active')
      setCursorVisible(false)
      isDraggingRef.current = false
      setIsDragging(false)
    }

    heroEl.addEventListener('mousemove', handleMouseMove)
    heroEl.addEventListener('mouseenter', handleMouseEnter)
    heroEl.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.body.classList.remove('hero-hover-active')
      heroEl.removeEventListener('mousemove', handleMouseMove)
      heroEl.removeEventListener('mouseenter', handleMouseEnter)
      heroEl.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Drag start handler for the square box
  const handleBoxMouseDown = (e) => {
    e.stopPropagation()
    isDraggingRef.current = true
    setIsDragging(true)
    dragDeltaTotal.current = 0

    const boxEl = cursorBoxRef.current
    const transform = boxEl ? gsap.getProperty(boxEl, 'x') : cursorCoord.current.x
    const transformY = boxEl ? gsap.getProperty(boxEl, 'y') : cursorCoord.current.y

    dragStartPos.current = {
      startX: e.clientX,
      startY: e.clientY,
      boxOriginX: typeof transform === 'number' ? transform : cursorCoord.current.x,
      boxOriginY: typeof transformY === 'number' ? transformY : cursorCoord.current.y
    }
  }

  const handleBoxMouseUp = (e) => {
    e.stopPropagation()
    const wasDragging = isDraggingRef.current
    isDraggingRef.current = false
    setIsDragging(false)

    if (quickToRotate.current) quickToRotate.current(0)

    // If movement was negligible, treat as a click to toggle video playback
    if (wasDragging && dragDeltaTotal.current < 8) {
      toggleVideoPlayback()
    }
  }

  useEffect(() => {
    const onWindowMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false
        setIsDragging(false)
        if (quickToRotate.current) quickToRotate.current(0)
      }
    }
    window.addEventListener('mouseup', onWindowMouseUp)
    return () => window.removeEventListener('mouseup', onWindowMouseUp)
  }, [])

  // Initial Entrance Animation & Scroll Parallax
  useEffect(() => {
    const ctx = gsap.context(() => {
      const playEntrance = () => {
        const tl = gsap.timeline()

        tl.fromTo('.hero__brand-bar',
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        )
        .fromTo('.hero__tag-badge, .hero__subtag-badge, .hero__col-line',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo('.spiral-container--left .spiral-line-inner',
          { opacity: 0, y: 28, rotateX: 15 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo('.spiral-container--right .spiral-line-inner',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out' },
          '-=0.6'
        )
        .fromTo('.castle-drawing-container',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.4'
        )
      }

      // Check if loader is already done, or wait for it to lift so text reveal is seen right in time
      const isLoaderActive = document.documentElement.classList.contains('is-loading')
      if (window.__RC_LOADER_DONE__ || !isLoaderActive) {
        gsap.delayedCall(0.1, playEntrance)
      } else {
        const onLoaderLift = () => {
          window.removeEventListener('rc-loader-lifting', onLoaderLift)
          window.removeEventListener('rc-loader-done', onLoaderLift)
          gsap.delayedCall(0.05, playEntrance)
        }
        window.addEventListener('rc-loader-lifting', onLoaderLift)
        window.addEventListener('rc-loader-done', onLoaderLift)

        // Safety fallback in case loader events aren't captured
        const fallbackTimer = setTimeout(() => {
          onLoaderLift()
        }, 2200)

        return () => clearTimeout(fallbackTimer)
      }

      // Scroll-driven parallax for background video
      gsap.to('.hero__video', {
        yPercent: 22,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })

      // Scroll-driven lift and fade for editorial text
      gsap.to('.hero__editorial-wrapper', {
        yPercent: -18,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom 20%',
          scrub: true
        }
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const currentState = HERO_STATES[activeStateIndex]

  return (
    <section
      className="hero"
      id="hero"
      ref={heroRef}
      onClick={(e) => {
        // Hero background click toggles video if not clicking interactive UI
        if (!e.target.closest('.hero__interactive, button, a, .hero__cursor-box')) {
          toggleVideoPlayback()
        }
      }}
    >
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

      {/* DRAGGABLE SQUARE BOX CURSOR ("PLAYVIDEO") */}
      <div
        ref={cursorBoxRef}
        className={`hero__cursor-box ${cursorVisible ? 'is-visible' : ''} ${isDragging ? 'is-dragging' : ''}`}
        onMouseDown={handleBoxMouseDown}
        onMouseUp={handleBoxMouseUp}
        aria-hidden="true"
      >
        {/* Architectural 4-Corner Ticks */}
        <span className="box-corner box-corner--tl" />
        <span className="box-corner box-corner--tr" />
        <span className="box-corner box-corner--bl" />
        <span className="box-corner box-corner--br" />

        <div className="hero__cursor-inner">
          <div className="hero__cursor-icon-wrap">
            {isPlaying ? (
              <svg className="hero__cursor-icon" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg className="hero__cursor-icon" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="7,4 20,12 7,20" />
              </svg>
            )}
          </div>
          <span className="hero__cursor-txt">{isPlaying ? 'PAUSE VIDEO' : 'PLAY VIDEO'}</span>
          <span className="hero__cursor-action-hint">{isDragging ? 'DRAGGING' : 'DRAG / CLICK'}</span>
        </div>
      </div>

      {/* Top Controls / Phase Switcher Bar */}
      <div className="hero__brand-bar hero__interactive">
        {/* Phase / State Switcher Pills */}
        <div className="hero__state-indicators">
          {HERO_STATES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              className={`hero__state-pill ${idx === activeStateIndex ? 'is-active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                transitionToState(idx)
              }}
              aria-label={`Switch to narrative phase ${s.id}`}
            >
              <span>{s.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ====================================================
          DUAL EDITORIAL PARAGRAPHS (HOUSE OF YELLOW REFERENCE)
          - Left: 5 lines, 6 words per line (Primary font, bold scale)
          - Right: 5 lines, 6 words per line (Same font, sleek architectural scale)
          - Spiral rope twisting transition on line change
          ==================================================== */}
      <div className="hero__editorial-wrapper">
        {/* Left Side Paragraph */}
        <div className="hero__editorial-col hero__editorial-col--left">
          <div className="hero__col-header">
            <span className="hero__tag-badge">{currentState.id} — {currentState.tag}</span>
            <span className="hero__col-line" />
          </div>

          <div
            className="spiral-container spiral-container--left"
            ref={leftParaRef}
            aria-live="polite"
          >
            {currentState.leftLines.map((line, idx) => (
              <div key={idx} className="spiral-line-wrapper">
                <p className="spiral-line-inner">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Paragraph */}
        <div className="hero__editorial-col hero__editorial-col--right">
          <div className="hero__col-header">
            <span className="hero__subtag-badge">{currentState.subTag}</span>
            <span className="hero__col-line" />
          </div>

          <div
            className="spiral-container spiral-container--right"
            ref={rightParaRef}
            aria-live="polite"
          >
            {currentState.rightLines.map((line, idx) => (
              <div key={idx} className="spiral-line-wrapper">
                <p className="spiral-line-inner">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Video Playback Pill */}
      <div
        className="hero__mobile-badge hero__interactive"
        onClick={(e) => {
          e.stopPropagation()
          toggleVideoPlayback()
        }}
      >
        <span className="hero__mobile-badge-dot" />
        <span className="hero__mobile-badge-text">{isPlaying ? 'TAP TO PAUSE' : 'TAP TO PLAY'}</span>
      </div>

      {/* ====================================================
          BOTTOM: CASTLE BEING DRAWN WITH YELLOWISH-WHITE LINE
          IN A CONTINUOUS LOOP
          ==================================================== */}
      <CastleDrawing />

      {/* Architectural Viewport Corners */}
      <div className="hero__corner hero__corner--tl" />
      <div className="hero__corner hero__corner--tr" />
      <div className="hero__corner hero__corner--bl" />
      <div className="hero__corner hero__corner--br" />
    </section>
  )
}
