import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SlideUpText from './ui/slide-up-text'
import FlipCard from './FlipCard'
import './Leadership.css'

gsap.registerPlugin(ScrollTrigger)

const founders = [
  {
    num: '01',
    track: 'STRATEGY & ARCHITECTURE',
    name: 'Founder & MD',
    tag: 'BRIEF → STRATEGY',
    credential: '12 YRS',
    quote: 'Every brief gets interrogated until the idea can survive contact with steel and a deadline.',
    image: '/images/founder-1.webp'
  },
  {
    num: '02',
    track: 'CONCEPT & SCENOGRAPHY',
    name: 'Head of Creative',
    tag: 'CONCEPT → BUILD',
    credential: '9 YRS',
    quote: 'A concept that only works as a rendering is not a concept — it’s a wish.',
    image: '/images/founder-2.webp'
  },
  {
    num: '03',
    track: 'SITE & STRUCTURAL BUILD',
    name: 'Head of Operations',
    tag: 'SITE → DELIVERY',
    credential: '10 YRS',
    quote: 'The build is only as good as the crew still standing in the venue at load-in.',
    image: '/images/founder-1.webp'
  },
]

export default function Leadership() {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const cards = root.querySelectorAll('.leadership__founder-item')
      const head = root.querySelector('.leadership__head')
      const ticker = root.querySelector('.leadership__transition-ticker')

      // ── 1. Leadership Entrance Reveal ──
      if (cards.length) {
        gsap.fromTo(cards,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.16,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: root,
              start: 'top 78%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }

      // ── 2. Scroll Animation from Leadership into Crew Section ──
      if (!prefersReduced && cards.length >= 3) {
        ScrollTrigger.create({
          trigger: root,
          start: 'bottom 92%',
          end: 'bottom top',
          scrub: 0.8,
          onUpdate: (self) => {
            const p = self.progress
            // Outer cards fan out and float with 3D perspective
            gsap.set(cards[0], {
              y: -80 * p,
              rotateZ: -3 * p,
              scale: 1 - 0.04 * p,
              opacity: 1 - 0.35 * p
            })
            // Middle card lifts higher
            gsap.set(cards[1], {
              y: -105 * p,
              scale: 1 - 0.05 * p,
              opacity: 1 - 0.35 * p
            })
            gsap.set(cards[2], {
              y: -80 * p,
              rotateZ: 3 * p,
              scale: 1 - 0.04 * p,
              opacity: 1 - 0.35 * p
            })

            if (head) {
              gsap.set(head, { y: -45 * p, opacity: 1 - 0.45 * p })
            }

            // Scrub kinetic transition ribbon across screen
            if (ticker) {
              gsap.set(ticker, { xPercent: -22 * p })
            }
          }
        })
      }
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section className="leadership" id="leadership" ref={ref} aria-label="Leadership / Rockcastle">
      <div className="leadership__inner">
        {/* Top Architectural Header */}
        <div className="leadership__head">
          <div className="leadership__meta-bar">
            <span className="leadership__tag">[ 04 // EXECUTIVE DIRECTION ]</span>
            <span className="leadership__coords">[ 25.2048° N, 55.2708° E ] // DUBAI ATELIER</span>
          </div>

          <h2 className="leadership__title">
            <SlideUpText
              split="words"
              stagger={0.03}
              inView={true}
              once={true}
            >
              Three leads personally sign off on every activation we build
            </SlideUpText>
          </h2>

          <p className="leadership__subtitle">
            No account managers in between. No diluted briefs. Every bespoke installation, stage, and spatial monument is steered directly by our three studio partners from concept napkin to midnight load-out.
          </p>
        </div>

        {/* 3 Prominent Executive FlipCards with Track Badges */}
        <div className="leadership__grid">
          {founders.map((f) => (
            <div className="leadership__founder-item" key={f.name}>
              {/* Column Track Badge */}
              <div className="leadership__card-header-track">
                <span className="leadership__track-num">{f.num}</span>
                <span className="leadership__track-sep">//</span>
                <span className="leadership__track-label">{f.track}</span>
              </div>

              {/* 3D Interactive Physics FlipCard */}
              <FlipCard
                axis="y"
                flipOnClick={true}
                draggable={true}
                dragDistance={0}
                tilt={true}
                tiltMax={12}
                glare={true}
                glareOpacity={0.24}
                hoverScale={1.03}
                perspective={1100}
                stiffness={170}
                damping={20}
                width={350}
                height={500}
                radius={24}
                background="#141413"
                color="#f5f5f5"
                shadow={true}
                shadowColor="#0c0d0c"
                shadowOpacity={0.35}
                ariaLabel={`${f.name} - ${f.tag}`}
                className="leadership__flipcard"
                front={
                  <div className="leadership__card-front">
                    <img src={f.image} alt={f.name} className="leadership__card-img" />
                    <div className="leadership__card-front-overlay" />
                    <span className="leadership__card-credential">{f.credential}</span>

                    <div className="leadership__card-front-info">
                      <span className="leadership__card-tag">[ {f.tag} ]</span>
                      <h3 className="leadership__card-name">{f.name}</h3>
                      <div className="leadership__card-flip-hint">
                        <span>DRAG OR CLICK TO FLIP</span>
                        <span className="leadership__card-flip-icon">↻</span>
                      </div>
                    </div>
                  </div>
                }
                back={
                  <div className="leadership__card-back">
                    <div className="leadership__card-back-header">
                      <span className="leadership__card-back-tag">[ {f.tag} ]</span>
                      <span className="leadership__card-back-cred">{f.credential}</span>
                    </div>

                    <div className="leadership__card-back-body">
                      <span className="leadership__quote-mark">“</span>
                      <p className="leadership__card-quote">{f.quote}</p>

                      <div className="leadership__card-back-divider" />
                      <h4 className="leadership__card-back-name">{f.name}</h4>
                      <span className="leadership__card-back-role">EXECUTIVE LEADERSHIP // ROCKCASTLE</span>
                    </div>

                    <div className="leadership__card-back-action">
                      <span>CLICK TO FLIP BACK</span>
                      <span className="leadership__card-flip-icon">↺</span>
                    </div>
                  </div>
                }
              />
            </div>
          ))}
        </div>

        {/* Kinetic Transition Ribbon leading into Crew Section */}
        <div className="leadership__transition-wrap" aria-hidden="true">
          <div className="leadership__transition-divider">
            <span className="leadership__transition-dot" />
            <span className="leadership__transition-line" />
            <span className="leadership__transition-badge">SCROLL TO ATELIER CREW ↓</span>
            <span className="leadership__transition-line" />
            <span className="leadership__transition-dot" />
          </div>

          <div className="leadership__transition-ticker-track">
            <div className="leadership__transition-ticker">
              <span>FROM EXECUTIVE SIGN-OFF</span>
              <span className="leadership__ticker-bullet">✦</span>
              <span>TO THE FABRICATION FLOOR</span>
              <span className="leadership__ticker-bullet">✦</span>
              <span>ZERO SUBCONTRACTING</span>
              <span className="leadership__ticker-bullet">✦</span>
              <span>100% IN-HOUSE ATELIER</span>
              <span className="leadership__ticker-bullet">✦</span>
              <span>FROM EXECUTIVE SIGN-OFF</span>
              <span className="leadership__ticker-bullet">✦</span>
              <span>TO THE FABRICATION FLOOR</span>
              <span className="leadership__ticker-bullet">✦</span>
              <span>ZERO SUBCONTRACTING</span>
              <span className="leadership__ticker-bullet">✦</span>
              <span>100% IN-HOUSE ATELIER</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
