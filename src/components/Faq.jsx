import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Faq.css'

const faqs = [
  {
    q: 'Who is Rock Castle?',
    a: 'An architecture, experiential and spatial design studio working out of Dubai since 2013. A close-knit crew in-house across strategy, creative, design and production.'
  },
  {
    q: 'What does Rock Castle do?',
    a: 'Launches, brand festivals, road shows, conferences, retail theatre and the films that carry them afterwards — concept, design, fabrication and on-ground delivery under one roof.'
  },
  {
    q: 'What clients do you work with?',
    a: 'Category leaders and challengers alike — auto, telecom, hospitality, sport and tech — across 24 markets, from a single city activation to a national tour.'
  },
  {
    q: 'What makes Rock Castle different?',
    a: 'The studio is in the building. Strategy, design and production argue in the same room, so what gets sold is what gets built — and the leads stay on it until load-out.'
  },
  {
    q: 'How much does an activation cost?',
    a: 'It is scoped, never listed. A one-city launch, a multi-market tour and a flagship festival sit in very different ranges; every number comes out of a scoping conversation.'
  },
]

function FaqItem({ item, index, isOpen, onToggle }) {
  const panelId = `faq-panel-${index}`
  const btnId = `faq-btn-${index}`

  return (
    <div className={`faq__item ${isOpen ? 'is-open' : ''}`}>
      <h3 className="faq__q-row">
        <button
          id={btnId}
          type="button"
          className="faq__q"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="faq__index">{String(index + 1).padStart(2, '0')}</span>
          <span className="faq__question">{item.q}</span>
          <span className="faq__icon" aria-hidden="true" />
        </button>
      </h3>
      <div className="faq__answer-wrap" id={panelId} role="region" aria-labelledby={btnId}>
        <div className="faq__answer-inner">
          <p className="faq__answer">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function Faq() {
  const ref = useRef(null)
  const [openFaq, setOpenFaq] = useState(0)

  const toggleFaq = useCallback((i) => {
    setOpenFaq((prev) => (prev === i ? -1 : i))
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      })

      const ruleEl = el.querySelector('.faq__rule')
      if (ruleEl) {
        tl.fromTo(ruleEl, { scaleX: 0 }, { scaleX: 1.15, duration: 0.4, ease: 'power3.out' })
          .to(ruleEl, { scaleX: 1, duration: 0.22, ease: 'power2.out' })
      }

      tl.fromTo(el.querySelector('.faq__tag'),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo(el.querySelector('.faq__title'),
        { opacity: 0, scale: 0.85, rotate: -3 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.7)' },
        '-=0.35'
      )
      .fromTo(el.querySelectorAll('.faq__item'),
        { clipPath: 'inset(0 0 0 100%)', opacity: 0 },
        { clipPath: 'inset(0 0 0 0%)', opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1 },
        '-=0.4'
      )
      .fromTo(el.querySelectorAll('.faq__index'),
        { scale: 0.4, rotate: -20, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.5, ease: 'back.out(2.4)', stagger: 0.1 },
        '<'
      )
      .fromTo(el.querySelector('.faq__footer'),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.2'
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section className="faq" id="faq" ref={ref} aria-label="Frequently Asked Questions">
      <div className="faq__container">
        <span className="faq__rule" aria-hidden="true" />
        <span className="faq__tag">COMMON QUESTIONS</span>
        <h2 className="faq__title">
          FAQ<span className="faq__title-italic">(s)</span>
        </h2>
        <div className="faq__list">
          {faqs.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              index={i}
              isOpen={openFaq === i}
              onToggle={() => toggleFaq(i)}
            />
          ))}
        </div>
        <div className="faq__footer">
          <p className="faq__footer-text">Have a question that is not answered here?</p>
          <a href="#contact" className="faq__footer-link">
            Get in touch with the team <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
