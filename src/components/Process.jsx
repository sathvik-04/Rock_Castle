import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Process.css'

const stages = [
  {
    num: '01',
    name: 'The Brief',
    quote: '"Every project starts with a conversation."',
    desc: 'A global brand needed more than a booth — they needed a destination. The challenge: create an architectural experience that would stop people in their tracks.',
    placeholder: '[ CLIENT BRIEF / IMAGE GOES HERE ]',
    cls: 'brief'
  },
  {
    num: '02',
    name: 'Strategy',
    quote: '"The brief becomes a point of view."',
    desc: 'We mapped the visitor journey. Every touchpoint, every sightline, every emotional beat. Research, moodboards, and strategic direction crystallized into a vision.',
    placeholder: '[ STRATEGY / MOODBOARD GOES HERE ]',
    cls: 'strategy'
  },
  {
    num: '03',
    name: 'Design',
    quote: '"The idea takes form."',
    desc: 'Sketches became renders. Renders became plans. Materials were chosen, lighting designed, spatial flow refined into precise architectural intent.',
    placeholder: '[ DESIGN / DRAWING GOES HERE ]',
    cls: 'design'
  },
  {
    num: '04',
    name: 'Production',
    quote: '"The concept leaves the screen."',
    desc: 'Fabrication began. Steel, glass, wood, light — raw materials transformed by skilled hands. Every joint, every surface built to specification.',
    placeholder: '[ PRODUCTION / SITE IMAGE GOES HERE ]',
    cls: 'production'
  },
  {
    num: '05',
    name: 'Final Delivery',
    quote: '"The space is alive."',
    desc: 'Doors opened. Lights on. The space that began as a conversation now holds thousands. The idea became an experience people talk about long after they\'ve left.',
    placeholder: '[ FINAL PROJECT IMAGE / VIDEO GOES HERE ]',
    cls: 'final'
  },
]

const stageNames = ['Brief', 'Strategy', 'Design', 'Production', 'Delivery']

export default function Process() {
  const triggerRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)
  const labelRef = useRef(null)
  const indicatorsRef = useRef([])
  const mobileRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    // Desktop: horizontal scroll
    mm.add('(min-width: 769px)', () => {
      const track = trackRef.current
      if (!track) return

      const scrollTween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: () => '+=' + (track.scrollWidth - window.innerWidth),
          scrub: 1,
          pin: '.process__sticky',
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress
            if (progressRef.current) progressRef.current.style.width = (p * 100) + '%'
            const idx = Math.min(4, Math.floor(p * 5))
            if (labelRef.current) labelRef.current.textContent = `0${idx + 1} / 05`
            indicatorsRef.current.forEach((ind, i) => {
              if (ind) ind.classList.toggle('is-active', i === idx)
            })
          }
        }
      })

      // Stage animations within horizontal scroll
      track.querySelectorAll('.process__stage').forEach(stage => {
        const textEls = stage.querySelectorAll('.process__stage-number, .process__stage-name, .process__stage-quote, .process__stage-desc')
        gsap.from(textEls, {
          y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: stage, start: 'left 80%', end: 'left 20%',
            containerAnimation: scrollTween, toggleActions: 'play none none reverse'
          }
        })

        const scanline = stage.querySelector('.process__scanline')
        if (scanline) {
          gsap.fromTo(scanline, { x: '-100%' }, {
            x: '50vw', ease: 'none',
            scrollTrigger: {
              trigger: stage, start: 'left center', end: 'right center',
              containerAnimation: scrollTween, scrub: true
            }
          })
        }
      })
    })

    // Mobile: vertical stacked with scroll reveals
    mm.add('(max-width: 768px)', () => {
      if (!mobileRef.current) return

      mobileRef.current.querySelectorAll('.process__m-stage').forEach(stage => {
        const els = stage.querySelectorAll('.process__m-number, .process__m-name, .process__m-quote, .process__m-desc, .process__m-placeholder')
        gsap.from(els, {
          y: 40, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: stage, start: 'top 80%', toggleActions: 'play none none reverse' }
        })
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="process" id="process">
      {/* Desktop horizontal scroll */}
      <div className="process__desktop">
        <div className="process__trigger" ref={triggerRef}>
          <div className="process__sticky">
            <div className="process__header">
              <span className="process__title">From Idea to Space</span>
              <span className="process__title" ref={labelRef}>01 / 05</span>
            </div>
            <div className="process__progress">
              <div className="process__progress-bar" ref={progressRef} />
            </div>
            <div className="process__indicators">
              {stageNames.map((name, i) => (
                <div key={i} className={`process__ind ${i === 0 ? 'is-active' : ''}`} ref={el => indicatorsRef.current[i] = el}>
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
                      <div className="placeholder placeholder--3x2">
                        <span className="placeholder__label">{s.placeholder}</span>
                      </div>
                      <div className="process__grid-overlay" />
                      <div className="process__scanline" />
                    </div>
                  </div>
                  <div className={`process__orbital process__orbital--${i % 2 === 0 ? '1' : '2'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile vertical stacked */}
      <div className="process__mobile" ref={mobileRef}>
        <div className="process__m-header">
          <span className="section-label">From Idea to Space</span>
          <h2 className="process__m-title">The Journey</h2>
        </div>
        {stages.map((s, i) => (
          <div key={i} className={`process__m-stage process__m-stage--${s.cls}`}>
            <div className="process__m-number">{s.num}</div>
            <h3 className="process__m-name">{s.name}</h3>
            <p className="process__m-quote">{s.quote}</p>
            <div className="placeholder placeholder--16x9 process__m-placeholder">
              <span className="placeholder__label">{s.placeholder}</span>
            </div>
            <p className="process__m-desc">{s.desc}</p>
            {i < stages.length - 1 && <div className="process__m-divider" />}
          </div>
        ))}
      </div>
    </section>
  )
}
