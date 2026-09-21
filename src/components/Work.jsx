import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { projects } from '../data/projects'
import { usePageTransition, transitionClick } from '../hooks/usePageTransition'
import './Work.css'

const ITEMS = projects.slice(0, 4)
// Triple the items for seamless infinite loop
const LOOP_ITEMS = [...ITEMS, ...ITEMS, ...ITEMS]

export default function Work() {
  const sectionRef = useRef(null)
  const stripRef = useRef(null)
  const dragCursorRef = useRef(null)
  const transitionTo = usePageTransition()

  // All mutable drag state lives in a single ref to avoid re-renders
  const drag = useRef({
    active: false,
    hasMoved: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    currentX: 0,
    singleSetWidth: 0,
    direction: null,       // 'horizontal' | 'vertical' | null  (touch only)
    insideMenu: false,
    momentumRaf: null,
  })

  useEffect(() => {
    const section = sectionRef.current
    const strip = stripRef.current
    const cursor = dragCursorRef.current
    if (!section || !strip) return

    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const d = drag.current
    const cleanups = []

    /* ──────────────────────────────────────────────
       Measure strip geometry
    ────────────────────────────────────────────── */
    const measure = () => {
      const cards = strip.querySelectorAll('.work__strip-card')
      if (cards.length < ITEMS.length * 2) return
      // Distance from first card of set-0 to first card of set-1
      d.singleSetWidth = cards[ITEMS.length].offsetLeft - cards[0].offsetLeft
      d.currentX = -d.singleSetWidth          // start on the middle copy
      gsap.set(strip, { x: d.currentX })
    }
    requestAnimationFrame(measure)

    const onResize = () => requestAnimationFrame(measure)
    window.addEventListener('resize', onResize)
    cleanups.push(() => window.removeEventListener('resize', onResize))

    /* ──────────────────────────────────────────────
       Seamless-loop position reset
    ────────────────────────────────────────────── */
    const resetLoop = () => {
      if (d.singleSetWidth === 0) return
      if (d.currentX > 0) {
        d.currentX -= d.singleSetWidth
        gsap.set(strip, { x: d.currentX })
      } else if (d.currentX < -d.singleSetWidth * 2) {
        d.currentX += d.singleSetWidth
        gsap.set(strip, { x: d.currentX })
      }
    }

    /* ──────────────────────────────────────────────
       GSAP scroll-triggered reveals
    ────────────────────────────────────────────── */
    const ctx = gsap.context(() => {
      gsap.fromTo('.work__header-wrap',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.work__header-wrap',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      gsap.fromTo('.work__menu-area',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.work__menu-area',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      gsap.fromTo('.work__footer-block',
        { opacity: 0, y: 35 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.work__footer-block',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, section)

    /* ──────────────────────────────────────────────
       Drag cursor (fine-pointer / desktop only)
    ────────────────────────────────────────────── */
    let quickCX, quickCY
    if (isFine && cursor) {
      quickCX = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' })
      quickCY = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' })
    }

    const showCursor = () => {
      document.body.classList.add('work-drag-active')
      if (cursor) gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' })
    }
    const hideCursor = () => {
      document.body.classList.remove('work-drag-active')
      if (cursor) gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2, ease: 'power3.in' })
    }

    /* ──────────────────────────────────────────────
       Menu area enter / leave
    ────────────────────────────────────────────── */
    const menuArea = section.querySelector('.work__menu-area')

    const onMenuEnter = () => { d.insideMenu = true; showCursor() }
    const onMenuLeave = () => {
      d.insideMenu = false
      if (!d.active) hideCursor()
    }
    const onMenuMouseMove = (e) => {
      if (quickCX) quickCX(e.clientX)
      if (quickCY) quickCY(e.clientY)
    }

    if (menuArea) {
      menuArea.addEventListener('mouseenter', onMenuEnter)
      menuArea.addEventListener('mouseleave', onMenuLeave)
      menuArea.addEventListener('mousemove', onMenuMouseMove)
      cleanups.push(() => {
        menuArea.removeEventListener('mouseenter', onMenuEnter)
        menuArea.removeEventListener('mouseleave', onMenuLeave)
        menuArea.removeEventListener('mousemove', onMenuMouseMove)
      })
    }

    /* ──────────────────────────────────────────────
       Drag: pointer-down
    ────────────────────────────────────────────── */
    const onPointerDown = (e) => {
      const isTouch = e.type === 'touchstart'
      const cx = isTouch ? e.touches[0].clientX : e.clientX
      const cy = isTouch ? e.touches[0].clientY : e.clientY

      d.active = true
      d.hasMoved = false
      d.startX = cx
      d.startY = cy
      d.lastX = cx
      d.lastTime = performance.now()
      d.velocity = 0
      d.direction = null

      // Kill any ongoing momentum
      if (d.momentumRaf) { cancelAnimationFrame(d.momentumRaf); d.momentumRaf = null }
      gsap.killTweensOf(strip)

      if (!isTouch) e.preventDefault()           // prevent text selection on desktop
    }

    /* ──────────────────────────────────────────────
       Drag: pointer-move
    ────────────────────────────────────────────── */
    const onPointerMove = (e) => {
      if (!d.active) return

      const isTouch = e.type === 'touchmove'
      const cx = isTouch ? e.touches[0].clientX : e.clientX
      const now = performance.now()

      // Touch direction lock — only commit once
      if (isTouch && !d.direction) {
        const cy = isTouch ? e.touches[0].clientY : e.clientY
        const dx = Math.abs(cx - d.startX)
        const dy = Math.abs(cy - d.startY)
        if (dx > 8 || dy > 8) {
          d.direction = dx > dy ? 'horizontal' : 'vertical'
        }
        if (!d.direction) return                 // not enough movement yet
        if (d.direction === 'vertical') {        // let browser handle vertical scroll
          d.active = false
          return
        }
      }

      if (isTouch) e.preventDefault()            // horizontal drag — stop page scroll

      const dx = cx - d.lastX
      const dt = now - d.lastTime

      if (Math.abs(cx - d.startX) > 4) d.hasMoved = true

      if (dt > 0) d.velocity = (dx / dt) * 16   // normalise to ~60 fps frame

      d.currentX += dx
      gsap.set(strip, { x: d.currentX })
      resetLoop()

      d.lastX = cx
      d.lastTime = now
    }

    /* ──────────────────────────────────────────────
       Drag: pointer-up  (+ momentum decay)
    ────────────────────────────────────────────── */
    const onPointerUp = () => {
      if (!d.active) return
      d.active = false

      if (!d.insideMenu) hideCursor()

      // Momentum
      if (Math.abs(d.velocity) > 0.5) {
        const tick = () => {
          d.velocity *= 0.94                     // friction
          if (Math.abs(d.velocity) < 0.3) { d.velocity = 0; return }
          d.currentX += d.velocity
          gsap.set(strip, { x: d.currentX })
          resetLoop()
          d.momentumRaf = requestAnimationFrame(tick)
        }
        d.momentumRaf = requestAnimationFrame(tick)
      }
    }

    // Bind drag events
    if (menuArea) {
      menuArea.addEventListener('mousedown', onPointerDown)
      menuArea.addEventListener('touchstart', onPointerDown, { passive: true })
      cleanups.push(() => {
        menuArea.removeEventListener('mousedown', onPointerDown)
        menuArea.removeEventListener('touchstart', onPointerDown)
      })
    }
    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('mouseup', onPointerUp)
    window.addEventListener('touchmove', onPointerMove, { passive: false })
    window.addEventListener('touchend', onPointerUp)
    cleanups.push(() => {
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('touchend', onPointerUp)
    })

    /* ──────────────────────────────────────────────
       Card hover tilt (desktop only)
    ────────────────────────────────────────────── */
    if (isFine && !isReduced) {
      strip.querySelectorAll('.work__strip-card').forEach((card) => {
        const img = card.querySelector('.work__strip-img')
        if (!img) return
        const qx = gsap.quickTo(img, 'rotationX', { duration: 0.5, ease: 'power3.out' })
        const qy = gsap.quickTo(img, 'rotationY', { duration: 0.5, ease: 'power3.out' })

        const move = (e) => {
          const r = card.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width - 0.5
          const py = (e.clientY - r.top) / r.height - 0.5
          qx(py * -5)
          qy(px * 5)
        }
        const leave = () => { qx(0); qy(0) }

        card.addEventListener('mousemove', move)
        card.addEventListener('mouseleave', leave)
        cleanups.push(() => {
          card.removeEventListener('mousemove', move)
          card.removeEventListener('mouseleave', leave)
        })
      })
    }

    return () => {
      ctx.revert()
      cleanups.forEach((fn) => fn())
      if (d.momentumRaf) cancelAnimationFrame(d.momentumRaf)
      document.body.classList.remove('work-drag-active')
    }
  }, [])

  // Prevent navigation when the user was dragging, not clicking
  const handleCardClick = (e, slug) => {
    if (drag.current.hasMoved) {
      e.preventDefault()
      return
    }
    transitionClick(e, transitionTo, `/work/${slug}`)
  }

  return (
    <section className="work" id="work" ref={sectionRef} aria-label="Selected Works">
      {/* Clean Transition Area After Signature */}
      <div className="work__transition-buffer" aria-hidden="true" />

      <div className="work__container">
        {/* Editorial Section Header */}
        <div className="work__header-wrap">
          <div className="work__meta-tag">[&nbsp;SELECTED PORTFOLIO&nbsp;]</div>
          <div className="work__header-row">
            <h2 className="work__title">
              <span>Featured</span>
              <span className="work__title--accent">Projects.</span>
            </h2>
            <p className="work__subtitle">
              Every build is bespoke. Every spatial experience is engineered to command attention and endure in memory.
            </p>
          </div>
        </div>

        {/* ── Infinite Draggable Project Strip ── */}
        <div className="work__menu-area">
          <div className="work__strip" ref={stripRef}>
            {LOOP_ITEMS.map((p, i) => (
              <Link
                key={`${p.slug}-${i}`}
                to={`/work/${p.slug}`}
                className="work__strip-card"
                onClick={(e) => handleCardClick(e, p.slug)}
                draggable={false}
              >
                <div className="work__strip-visual">
                  <img src={p.image} alt={p.name} className="work__strip-img" draggable={false} />
                  <div className="work__strip-overlay" />
                  <span className="work__strip-index">0{(i % ITEMS.length) + 1}</span>
                  <div className="work__strip-info">
                    <span className="work__strip-cat">{p.catLabel}</span>
                    <h3 className="work__strip-name">{p.name}</h3>
                    <p className="work__strip-tagline">{p.tagline}</p>
                  </div>
                  <div className="work__strip-badge">
                    <span>VIEW</span>
                    <span className="work__strip-badge-arrow">↗</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Square drag cursor */}
          <div className="work__drag-cursor" ref={dragCursorRef} aria-hidden="true">
            <span>DRAG</span>
          </div>
        </div>

        {/* Quote & "SHOW ALL PROJECTS" Button */}
        <div className="work__footer-block">
          <blockquote className="work__quote">
            &ldquo;We don't believe in temporary structures that feel disposable. If it commands human time, it demands architectural permanence.&rdquo;
          </blockquote>

          <div className="work__cta-wrap">
            <a
              href="#contact"
              className="work__show-all-btn"
              onClick={(e) => {
                e.preventDefault()
                const el = document.querySelector('#contact')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span className="work__btn-text">SHOW ALL PROJECTS</span>
              <span className="work__btn-icon">
                <span className="work__btn-arrow">→</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
