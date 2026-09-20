import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MediaPlaceholder from './MediaPlaceholder'
import './Process.css'

const stages = [
  {
    num: '01',
    name: 'The Brief',
    quote: '"Every project starts with a conversation."',
    desc: 'A global brand needed more than a booth — they needed a destination. The challenge: create an architectural experience that would stop people in their tracks.',
    placeholder: 'BRIEF / 01',
    cls: 'brief',
    image: '/images/process.webp'
  },
  {
    num: '02',
    name: 'Strategy',
    quote: '"The brief becomes a point of view."',
    desc: 'We mapped the visitor journey. Every touchpoint, every sightline, every emotional beat. Research, moodboards, and strategic direction crystallized into a vision.',
    placeholder: 'STRATEGY / 02',
    cls: 'strategy',
    image: '/images/services.webp'
  },
  {
    num: '03',
    name: 'Design',
    quote: '"The idea takes form."',
    desc: 'Sketches became renders. Renders became plans. Materials were chosen, lighting designed, spatial flow refined into precise architectural intent.',
    placeholder: 'DESIGN / 03',
    cls: 'design',
    image: '/images/signature-01.webp'
  },
  {
    num: '04',
    name: 'Production',
    quote: '"The concept leaves the screen."',
    desc: 'Fabrication began. Steel, glass, wood, light — raw materials transformed by skilled hands in our Dubai atelier. Every joint and surface built to exact spec.',
    placeholder: 'PRODUCTION / 04',
    cls: 'production',
    image: '/images/work-01.webp'
  },
  {
    num: '05',
    name: 'Final Delivery',
    quote: '"The space is alive."',
    desc: 'Doors opened. Lights on. The space that began as a conversation now holds thousands. The idea became an experience people talk about long after they leave.',
    placeholder: 'FINAL DELIVERY / 05',
    cls: 'final',
    image: '/images/hero-reel.webp'
  },
]

const stageNames = ['Brief', 'Strategy', 'Design', 'Production', 'Delivery']

function ProcessStage({ s, index, isOpen, onToggle }) {
  const panelId = `process-panel-${index}`
  const btnId = `process-btn-${index}`
  return (
    <div className={`process__m-stage process__m-stage--${s.cls} ${isOpen ? 'is-open' : ''}`}>
      <h3 className="process__m-head-row">
        <button
          id={btnId}
          type="button"
          className="process__m-head"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="process__m-number">{s.num}</span>
          <span className="process__m-head-text">
            <span className="process__m-name">{s.name}</span>
            <span className="process__m-quote">{s.quote}</span>
          </span>
          <span className="process__m-icon" aria-hidden="true" />
        </button>
      </h3>
      <div className="process__m-panel-wrap" id={panelId} role="region" aria-labelledby={btnId}>
        <div className="process__m-panel-inner">
          <div className="process__m-image-wrap">
            <img src={s.image} alt={s.name} className="process__m-image" />
          </div>
          <p className="process__m-desc">{s.desc}</p>
        </div>
      </div>
    </div>
  )
}

export default function Process() {
  const triggerRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)
  const labelRef = useRef(null)
  const indicatorsRef = useRef([])
  const mobileRef = useRef(null)
  const [openStage, setOpenStage] = useState(0)
  const toggleStage = useCallback((i) => setOpenStage((prev) => (prev === i ? -1 : i)), [])

  const scrollToStage = useCallback((index) => {
    const st = ScrollTrigger.getById('process-scroll')
    if (!st) return
    const stageP = (index / 4) * 0.92
    const targetScroll = st.start + stageP * (st.end - st.start)
    window.scrollTo({ top: targetScroll, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const mm = gsap.matchMedia()

    // Desktop: Calibrated horizontal scroll rhythm so stages 04 & 05 match stages 01-03
    mm.add('(min-width: 769px)', () => {
      const track = trackRef.current
      const trigger = triggerRef.current
      if (!track || !trigger) return

      const getScrollAmount = () => track.scrollWidth - window.innerWidth
      const getTotalDistance = () => getScrollAmount() + window.innerHeight * 0.25

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          id: 'process-scroll',
          trigger: trigger,
          start: 'top top',
          end: () => '+=' + getTotalDistance(),
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress
            // Evenly distributed across all 5 stages (no slow dragging at 04/05)
            const animP = Math.min(1, p / 0.92)
            if (progressRef.current) progressRef.current.style.width = (animP * 100) + '%'
            const idx = Math.min(4, Math.floor(animP * 4.999))
            if (labelRef.current) labelRef.current.textContent = `0${idx + 1} / 05`
            indicatorsRef.current.forEach((ind, i) => {
              if (ind) ind.classList.toggle('is-active', i === idx)
            })
          }
        }
      })

      // Horizontal track scroll: linear, even translation
      scrollTl.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        duration: 0.92
      })
      // Subtle settle on stage 5 before unpinning into Crew
      scrollTl.to({}, { duration: 0.08 })

      // Individual stage text reveals timed evenly with containerAnimation
      track.querySelectorAll('.process__stage').forEach((stage) => {
        const textEls = stage.querySelectorAll(
          '.process__stage-number, .process__stage-name, .process__stage-quote, .process__stage-desc'
        )
        gsap.from(textEls, {
          y: 30,
          opacity: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stage,
            start: 'left 85%',
            end: 'left 25%',
            containerAnimation: scrollTl,
            toggleActions: 'play none none reverse'
          }
        })

        const scanline = stage.querySelector('.process__scanline')
        if (scanline) {
          gsap.fromTo(scanline, { x: '-100%' }, {
            x: '50vw',
            ease: 'none',
            scrollTrigger: {
              trigger: stage,
              start: 'left center',
              end: 'right center',
              containerAnimation: scrollTl,
              scrub: true
            }
          })
        }
      })
    })

    // Mobile: vertical stacked
    mm.add('(max-width: 768px)', () => {
      if (!mobileRef.current) return

      mobileRef.current.querySelectorAll('.process__m-stage').forEach((stage) => {
        const els = stage.querySelectorAll('.process__m-number, .process__m-name, .process__m-quote')
        gsap.from(els, {
          y: 35,
          opacity: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stage,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        })
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="process" id="process" aria-label="Strategy and Process">
      {/* Desktop horizontal scroll */}
      <div className="process__desktop">
        <div className="process__trigger" ref={triggerRef}>
          <div className="process__sticky">
            <div className="process__header">
              <span className="process__title">STRATEGY // FROM BRIEF TO SPACE</span>
              <span className="process__title" ref={labelRef}>01 / 05</span>
            </div>

            <div className="process__progress">
              <div className="process__progress-bar" ref={progressRef} />
            </div>

            <div className="process__indicators">
              {stageNames.map((name, i) => (
                <div
                  key={i}
                  className={`process__ind ${i === 0 ? 'is-active' : ''}`}
                  ref={(el) => (indicatorsRef.current[i] = el)}
                  onClick={() => scrollToStage(i)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Jump to stage ${i + 1}: ${name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      scrollToStage(i)
                    }
                  }}
                >
                  <div className="process__ind-dot" />
                  <span className="process__ind-label">{name}</span>
                </div>
              ))}
            </div>

            <div className="process__track" ref={trackRef}>
              {stages.map((s, i) => (
                <div key={i} className={`process__stage process__stage--${s.cls}`}>
                  <div className="process__stage-content">
                    <div className="process__stage-text">
                      <div className="process__stage-number">{s.num}</div>
                      <h3 className="process__stage-name">{s.name}</h3>
                      <p className="process__stage-quote">{s.quote}</p>
                      <p className="process__stage-desc">{s.desc}</p>
                    </div>

                    <div className="process__stage-visual">
                      <div className="process__image-wrapper">
                        <img src={s.image} alt={s.name} className="process__stage-img" />
                        <div className="process__image-overlay" />
                        <span className="process__image-caption">{s.num} // {s.name.toUpperCase()}</span>
                      </div>
                      <div className="process__grid-overlay" />
                      <div className="process__scanline" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile vertical stacked */}
      <div className="process__mobile" ref={mobileRef}>
        <div className="process__m-header">
          <span className="section-label">STRATEGY // FROM BRIEF TO SPACE</span>
          <h2 className="process__m-title">The Journey</h2>
        </div>
        {stages.map((s, i) => (
          <ProcessStage key={i} s={s} index={i} isOpen={openStage === i} onToggle={() => toggleStage(i)} />
        ))}
      </div>
    </section>
  )
}
