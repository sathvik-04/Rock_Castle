import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Testimonials.css'

const testimonials = [
  {
    quote: 'Rockcastle took a two-line brief and turned it into a launch our regional team still references. Nothing about it felt off-the-shelf.',
    name: 'Amara Reyes',
    role: 'Marketing Director, Global Corp',
  },
  {
    quote: 'They run production the way we wished we could — one crew, zero handoffs, and a build that matched the deck exactly.',
    name: 'Daniel Osei',
    role: 'Brand Manager, Meridian Group',
  },
  {
    quote: 'Our activation had eleven moving parts across three days. Rockcastle’s on-ground team never once made that our problem.',
    name: 'Priya Nandan',
    role: 'Events Lead, Apex Studios',
  },
  {
    quote: 'What sold us was the workshop visit. Watching them fabricate the set pieces themselves told us more than any pitch deck.',
    name: 'Lucas Ferreira',
    role: 'CMO, Nova Events',
  },
  {
    quote: 'Fast, direct, and unusually calm under a compressed timeline. The kind of studio you call when the date can’t move.',
    name: 'Hana Kobayashi',
    role: 'Producer, Vault Architecture',
  },
  {
    quote: 'They pushed back on our first concept — and were right to. The version we built performed far better than what we walked in with.',
    name: 'Tomás Albeck',
    role: 'Creative Director, Summit Partners',
  },
]

function calculateGap(width) {
  const minWidth = 480
  const maxWidth = 1100
  const minGap = 28
  const maxGap = 64
  if (width <= minWidth) return minGap
  if (width >= maxWidth) return maxGap
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth))
}

export default function Testimonials() {
  const ref = useRef(null)
  const stageRef = useRef(null)
  const quoteRef = useRef(null)
  const autoplayRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [stageWidth, setStageWidth] = useState(900)
  const [visibleCount, setVisibleCount] = useState(3)
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const len = testimonials.length
  const count = Math.min(visibleCount, len)
  const visible = testimonials.slice(0, count)

  useEffect(() => {
    const onResize = () => {
      if (stageRef.current) setStageWidth(stageRef.current.offsetWidth)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current)
  }, [])

  useEffect(() => {
    if (reduced) return
    autoplayRef.current = setInterval(() => setActiveIndex((i) => (i + 1) % count), 5000)
    return stopAutoplay
  }, [reduced, count, stopAutoplay])

  const goTo = useCallback((next) => {
    stopAutoplay()
    setActiveIndex(next)
  }, [stopAutoplay])
  const handlePrev = useCallback(() => goTo((activeIndex - 1 + count) % count), [activeIndex, count, goTo])
  const handleNext = useCallback(() => goTo((activeIndex + 1) % count), [activeIndex, count, goTo])

  // scroll-driven advancement: scrolling naturally through the section also
  // steps the active card through the currently-visible set (no pin/vh-jack —
  // just a scrub mapped onto the section's own height), on top of the
  // existing autoplay/arrow/dot navigation.
  useEffect(() => {
    if (reduced || !ref.current) return
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 65%',
      end: 'bottom 45%',
      scrub: true,
      onUpdate: (self) => {
        const idx = Math.min(count - 1, Math.max(0, Math.floor(self.progress * count)))
        setActiveIndex((prev) => {
          if (prev === idx) return prev
          stopAutoplay()
          return idx
        })
      }
    })
    return () => trigger.kill()
  }, [reduced, count, stopAutoplay])

  const revealMore = useCallback(() => {
    stopAutoplay()
    setVisibleCount(len)
  }, [stopAutoplay, len])

  useEffect(() => {
    const onKey = (e) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      if (rect.top > window.innerHeight || rect.bottom < 0) return
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handlePrev, handleNext])

  // section entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testimonials__head > *',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: 'top 75%', toggleActions: 'play none none reverse' }
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  // word-by-word blur-in reveal whenever the active testimonial changes,
  // synchronized with a camera-flash sweep + name/role cut on the portrait —
  // reads as one theatrical "cut" between clients rather than a plain swap.
  useEffect(() => {
    if (!quoteRef.current) return
    const words = quoteRef.current.querySelectorAll('.testimonials__word')
    const root = ref.current
    if (reduced) {
      gsap.set(words, { filter: 'blur(0px)', opacity: 1, y: 0 })
      return
    }
    gsap.fromTo(
      words,
      { filter: 'blur(10px)', opacity: 0, y: 6 },
      { filter: 'blur(0px)', opacity: 1, y: 0, duration: 0.28, ease: 'power2.out', stagger: 0.025 }
    )
    if (!root) return
    const nameEl = root.querySelector('.testimonials__name')
    const roleEl = root.querySelector('.testimonials__role')
    gsap.fromTo([nameEl, roleEl], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05 })

    const flash = root.querySelector('.testimonials__flash')
    if (flash) {
      gsap.fromTo(flash, { opacity: 0.9, xPercent: -120 }, { opacity: 0, xPercent: 120, duration: 0.55, ease: 'power2.in', overwrite: 'auto' })
    }
    const active = root.querySelector('.testimonials__portrait[data-active="true"]')
    if (active) {
      gsap.fromTo(active, { filter: 'brightness(2.2)' }, { filter: 'brightness(1)', duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
    }
  }, [activeIndex, reduced])

  const stageStyle = (index) => {
    const gap = calculateGap(stageWidth)
    const stickUp = gap * 0.7
    const isActive = index === activeIndex
    const isLeft = (activeIndex - 1 + count) % count === index
    const isRight = (activeIndex + 1) % count === index
    if (isActive) return { zIndex: 3, opacity: 1, transform: 'translate(0,0) scale(1) rotateY(0deg)' }
    if (isLeft) return { zIndex: 2, opacity: 1, transform: `translate(-${gap}px, -${stickUp}px) scale(0.85) rotateY(18deg)` }
    if (isRight) return { zIndex: 2, opacity: 1, transform: `translate(${gap}px, -${stickUp}px) scale(0.85) rotateY(-18deg)` }
    return { zIndex: 1, opacity: 0, pointerEvents: 'none' }
  }

  const active = testimonials[activeIndex]

  return (
    <section className="testimonials" id="testimonials" ref={ref} aria-label="Client testimonials" aria-roledescription="carousel">
      <div className="testimonials__head">
        <span className="testimonials__label">// CLIENTS</span>
        <h2 className="testimonials__title">What they say after load-out</h2>
      </div>

      <div className="testimonials__carousel">
        <div className="testimonials__stage" ref={stageRef} aria-hidden="true">
          {visible.map((t, i) => (
            <div key={t.name} className="testimonials__portrait" data-active={i === activeIndex} style={stageStyle(i)}>
              <span className="testimonials__initials">{t.name.split(' ').map((w) => w[0]).join('')}</span>
              {i === activeIndex && <span className="testimonials__flash" />}
              {i === activeIndex && (
                <span className="testimonials__slate">{String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
              )}
            </div>
          ))}
        </div>

        <div className="testimonials__panel">
          <span className="testimonials__quote-mark" aria-hidden="true">&ldquo;</span>
          <div key={activeIndex} className="testimonials__body">
            <h3 className="testimonials__name">{active.name}</h3>
            <p className="testimonials__role">{active.role}</p>
            <p className="testimonials__quote" ref={quoteRef}>
              {active.quote.split(' ').map((w, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <span className="testimonials__word" key={i}>{w}&nbsp;</span>
              ))}
            </p>
          </div>

          <div className="testimonials__nav">
            <button type="button" className="testimonials__arrow" onClick={handlePrev} aria-label="Previous testimonial">‹</button>
            <div className="testimonials__dots">
              {visible.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  className={`testimonials__dot ${i === activeIndex ? 'is-active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Show testimonial from ${t.name}`}
                  aria-current={i === activeIndex}
                />
              ))}
            </div>
            <button type="button" className="testimonials__arrow" onClick={handleNext} aria-label="Next testimonial">›</button>
          </div>

          {visibleCount < len && (
            <button type="button" className="testimonials__more" onClick={revealMore}>
              <span>More client stories</span>
              <span aria-hidden="true">+</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
