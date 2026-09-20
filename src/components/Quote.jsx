import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Quote.css'

export default function Quote() {
  const ref = useRef(null)
  const accentRef = useRef(null)

  // Exactly one phrase carries the orange accent — everything else in the
  // statement stays black-on-white, per the "orange is ~10% weight, used as
  // environmental material" rule.
  const words = [
    { text: 'We', accent: false },
    { text: "don't", accent: false },
    { text: 'just', accent: false },
    { text: 'build', accent: false },
    { text: 'spaces.', accent: false },
    { text: null }, // line break
    { text: 'We', accent: false },
    { text: 'architect', accent: false },
    { text: 'experiences', accent: true },
    { text: 'people', accent: false },
    { text: 'never', accent: false },
    { text: 'forget.', accent: false },
  ]

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const wordEls = ref.current.querySelectorAll('.quote__word')

    if (reduced) {
      gsap.set(wordEls, { opacity: 1, y: 0, scale: 1 })
      gsap.set(accentRef.current, { scaleX: 1 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(wordEls, { opacity: 0, y: 50, scale: 0.95 })

      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 80%',
        end: 'center center',
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress
          wordEls.forEach((el, i) => {
            const wp = Math.max(0, Math.min(1, (p - i * 0.05) / 0.15))
            gsap.set(el, { opacity: wp, y: 50 * (1 - wp), scale: 0.95 + 0.05 * wp })
          })
        }
      })

      // The first seed of orange: a thin rule pinned to the section's own
      // bottom edge that draws itself in lockstep with scroll progress through
      // the whole section, landing at full width exactly as the black stretch
      // (About onward) arrives — a visual hand-off rather than a one-shot reveal.
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        onUpdate: (self) => gsap.set(accentRef.current, { scaleX: self.progress })
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section className="quote" id="quote" ref={ref}>
      <div className="quote__content">
        <h2 className="quote__text">
          {words.map((w, i) =>
            w.text === null
              ? <br key={i} />
              : <span key={i} className={`quote__word ${w.accent ? 'quote__word--orange' : ''}`}>{w.text} </span>
          )}
        </h2>
        <div ref={accentRef} className="quote__accent" />
      </div>
    </section>
  )
}
