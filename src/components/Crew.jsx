import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Crew.css'

const crewCards = [
  {
    tag: 'CREW 01',
    role: 'STRATEGY & CREATIVE',
    text: 'Strategy sits in the room from the very first brief. No diluted concepts, no agency disconnect.',
    image: '/images/founder-1.webp'
  },
  {
    tag: 'CREW 02',
    role: 'SPATIAL ARCHITECTURE',
    text: 'Design draws it at build scale, not slide scale. Every sightline, joint, and illumination angle mapped.',
    image: '/images/founder-2.webp'
  },
  {
    tag: 'CREW 03',
    role: 'ATELIER FABRICATION',
    text: 'Fabrication welds, mills, and programs in our own Dubai workshop. Physical craft under our direct control.',
    image: '/images/work-01.webp'
  },
  {
    tag: 'CREW 04',
    role: 'STAGE & LOAD-OUT',
    text: 'Our crew stands inside the venue the morning it opens. We calibrate every element until the curtain falls.',
    image: '/images/hero-reel.webp'
  },
]

export default function Crew() {
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const cardsRef = useRef([])
  const indexRef = useRef(null)
  const bridgeRef = useRef(null)

  const [activeIdx, setActiveIdx] = useState(1)

  useEffect(() => {
    const root = sectionRef.current
    const pinEl = pinRef.current
    const cards = cardsRef.current.filter(Boolean)
    if (!root || !pinEl || !cards.length) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 769px)', () => {
      // Set initial 3D stack state
      gsap.set(cards, {
        zIndex: (i) => cards.length - i,
        yPercent: (i) => (i === 0 ? 0 : 100),
        rotateX: (i) => (i === 0 ? 0 : 16),
        rotateZ: 0,
        z: 0,
        opacity: (i) => (i === 0 ? 1 : 0)
      })

      const deckTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=350%',
          scrub: 0.8,
          pin: pinEl,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const n = Math.min(cards.length, 1 + Math.floor(self.progress * cards.length * 0.999))
            setActiveIdx(n)
            if (indexRef.current) {
              indexRef.current.textContent = `0${n} / 04`
            }
          }
        }
      })

      // Card stacking animation on the left side
      cards.forEach((card, i) => {
        if (i > 0) {
          deckTl.to(
            card,
            { yPercent: 0, rotateX: 0, z: 0, opacity: 1, ease: 'power2.out', duration: 1 },
            i - 0.4
          )
        }
        if (i < cards.length - 1) {
          deckTl.to(
            card,
            { yPercent: -105, rotateX: -18, z: -150, opacity: 0, ease: 'power2.in', duration: 1 },
            i + 0.4
          )
        }
      })

      // Extensible transition bridge into Testimonials
      if (bridgeRef.current) {
        deckTl.fromTo(bridgeRef.current,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
          cards.length - 0.2
        )
      }
    })

    // Mobile adaptation
    mm.add('(max-width: 768px)', () => {
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="crew" id="crew" ref={sectionRef} aria-label="Rockcastle Crew and Collective">
      <div className="crew__pin-container" ref={pinRef}>
        <div className="crew__layout">
          {/* LEFT SIDE: Card Stacking Animation */}
          <div className="crew__col-left">
            <div className="crew__deck-meta">
              <span className="crew__meta-tag">[&nbsp;METHODOLOGY // IN-HOUSE&nbsp;]</span>
              <span ref={indexRef} className="crew__counter">
                0{activeIdx} / 04
              </span>
            </div>

            <div className="crew__stack-stage">
              {crewCards.map((c, i) => (
                <div
                  key={c.tag}
                  className={`crew__card crew__card--${i + 1}`}
                  ref={(el) => (cardsRef.current[i] = el)}
                >
                  <div className="crew__card-img-wrap">
                    <img src={c.image} alt={c.role} className="crew__card-img" />
                    <div className="crew__card-overlay" />
                  </div>
                  <div className="crew__card-content">
                    <span className="crew__card-tag">{c.tag}</span>
                    <h3 className="crew__card-role">{c.role}</h3>
                    <p className="crew__card-text">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Static Editorial Content (Does not change per card) */}
          <div className="crew__col-right">
            <div className="crew__static-content">
              <span className="crew__static-pill">[&nbsp;THE CREW&nbsp;]</span>
              <h2 className="crew__static-heading">
                <span>One Dedicated Team.</span>
                <span className="crew__static-heading--accent">Zero Subcontracting.</span>
              </h2>

              <p className="crew__static-paragraph">
                The studio and the fabrication floor are in the same building in Dubai. Strategy, spatial design, structural engineering, and CNC production argue in the same room.
              </p>

              <p className="crew__static-paragraph crew__static-paragraph--muted">
                What gets pitched to our clients is what our own crew builds, welds, and calibrates until the space opens. We stay on ground from the first render through final load-out.
              </p>

              <div className="crew__stats-grid">
                <div className="crew__stat-item">
                  <span className="crew__stat-num">4</span>
                  <span className="crew__stat-lbl">CORE DISCIPLINES</span>
                </div>
                <div className="crew__stat-item">
                  <span className="crew__stat-num">1</span>
                  <span className="crew__stat-lbl">UNIFIED ROOF</span>
                </div>
                <div className="crew__stat-item">
                  <span className="crew__stat-num">0</span>
                  <span className="crew__stat-lbl">OUTSOURCED BUILDS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extensible Transition Container into Testimonials */}
        <div className="crew__transition-bridge" ref={bridgeRef} aria-hidden="true" />
      </div>
    </section>
  )
}
