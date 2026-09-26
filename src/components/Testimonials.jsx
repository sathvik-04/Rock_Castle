import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import gsap from 'gsap'
import './Testimonials.css'

const testimonials = [
  {
    quote: 'Rockcastle took a two-line brief and turned it into a launch our regional team still references. Nothing about it felt off-the-shelf.',
    name: 'Amara Reyes',
    role: 'Marketing Director, Global Corp',
    image: '/images/testimonial-1.webp',
  },
  {
    quote: 'They run production the way we wished we could — one crew, zero handoffs, and a build that matched the deck exactly.',
    name: 'Daniel Osei',
    role: 'Brand Manager, Meridian Group',
    image: '/images/testimonial-2.webp',
  },
  {
    quote: 'Our activation had eleven moving parts across three days. Rockcastle’s on-ground team never once made that our problem.',
    name: 'Priya Nandan',
    role: 'Events Lead, Apex Studios',
    image: '/images/testimonial-4.webp',
  },
  {
    quote: 'What sold us was the workshop visit. Watching them fabricate the set pieces themselves told us more than any pitch deck.',
    name: 'Lucas Ferreira',
    role: 'CMO, Nova Events',
    image: '/images/testimonial-3.webp',
  },
  {
    quote: 'Fast, direct, and unusually calm under a compressed timeline. The kind of studio you call when the date can’t move.',
    name: 'Hana Kobayashi',
    role: 'Producer, Vault Architecture',
    image: '/images/testimonial-5.webp',
  },
  {
    quote: 'They pushed back on our first concept — and were right to. The version we built performed far better than what we walked in with.',
    name: 'Tomás Albeck',
    role: 'Creative Director, Summit Partners',
    image: '/images/testimonial-6.webp',
  },
]

export default function Testimonials() {
  const ref = useRef(null)
  const stageRef = useRef(null)
  const quoteRef = useRef(null)
  const autoplayRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const len = testimonials.length
  const count = Math.min(visibleCount, len)
  const visible = testimonials.slice(0, count)

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

  // Pause autoplay on hover so users can read testimonials comfortably
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onEnter = () => stopAutoplay()
    const onLeave = () => {
      if (!reduced) {
        stopAutoplay()
        autoplayRef.current = setInterval(() => setActiveIndex((i) => (i + 1) % count), 6000)
      }
    }
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
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

  // section entrance and scroll-based image parallax
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testimonials__head > *',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: 'top 80%', toggleActions: 'play none none reverse' }
        }
      )

      gsap.fromTo(
        '.testimonials__carousel',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: '.testimonials__carousel', start: 'top 85%', toggleActions: 'play none none reverse' }
        }
      )

      // Parallax on the client photo
      if (!reduced && stageRef.current) {
        gsap.fromTo(stageRef.current,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        )
      }
    }, ref)
    return () => ctx.revert()
  }, [reduced])

  // word-by-word blur-in reveal whenever the active testimonial changes,
  // synchronized with a camera-flash sweep across the portrait frame and an
  // attribution cut — reads as one theatrical "cut" between clients rather
  // than a plain swap.
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
    const attributionEl = root.querySelector('.testimonials__attribution')
    if (attributionEl) {
      gsap.fromTo(attributionEl, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
    }

    const flash = root.querySelector('.testimonials__flash')
    if (flash) {
      gsap.fromTo(flash, { opacity: 0.9, xPercent: -120 }, { opacity: 0, xPercent: 120, duration: 0.55, ease: 'power2.in', overwrite: 'auto' })
    }
    const photo = root.querySelector('.testimonials__photo')
    if (photo) {
      gsap.fromTo(photo, { filter: 'brightness(2.2)' }, { filter: 'brightness(1)', duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
    }
  }, [activeIndex, reduced])

  const active = testimonials[activeIndex]

  return (
    <section className="testimonials" id="testimonials" ref={ref} aria-label="Client testimonials" aria-roledescription="carousel">
      <div className="testimonials__head">
        <span className="testimonials__label">// CLIENTS</span>
        <h2 className="testimonials__title">What they say after load-out</h2>
      </div>

      <div className="testimonials__carousel">
        <div className="testimonials__frame" ref={stageRef} aria-hidden="true">
          <img key={activeIndex} className="testimonials__photo" src={active.image} alt="" loading="lazy" decoding="async" />
          <span className="testimonials__flash" />
        </div>

        <div className="testimonials__panel">
          <span className="testimonials__quote-mark" aria-hidden="true">&ldquo;</span>
          <div key={activeIndex} className="testimonials__body">
            <p className="testimonials__quote" ref={quoteRef}>
              {active.quote.split(' ').map((w, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <span className="testimonials__word" key={i}>{w}&nbsp;</span>
              ))}
            </p>
            <div className="testimonials__rule" aria-hidden="true" />
            <div className="testimonials__attribution">
              <span className="testimonials__name">{active.name}</span>
              <span className="testimonials__role">{active.role}</span>
              <span className="testimonials__index">{String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
            </div>
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
