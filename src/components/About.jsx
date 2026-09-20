import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MediaPlaceholder from './MediaPlaceholder'
import './About.css'

const founders = [
  { name: 'Founder & MD', tag: 'BRIEF → STRATEGY', label: 'PORTRAIT — FOUNDER & MD', image: '/images/founder-1.webp' },
  { name: 'Head of Creative', tag: 'CONCEPT → BUILD', label: 'PORTRAIT — HEAD OF CREATIVE', image: '/images/founder-2.webp' },
]

function MaskWords({ text }) {
  return text.split(' ').flatMap((w, i, arr) => {
    const nodes = [
      // eslint-disable-next-line react/no-array-index-key
      <span className="about__mask" key={`w-${i}`}><span className="about__mask-word">{w}</span></span>
    ]
    if (i < arr.length - 1) nodes.push(' ')
    return nodes
  })
}

export default function About() {
  const ref = useRef(null)
  const mainImageRef = useRef(null)
  const imageFrameRef = useRef(null)
  const foundersGridRef = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // ── 1. Slide-over / Sheet Reveal onto Hero ──
      // As About arrives at top of viewport, it covers Hero with solid elevation
      gsap.fromTo(root, 
        { yPercent: 0 },
        { 
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          }
        }
      )

      // ── 2. Editorial Text Reveal (Lines & Headings) ──
      const textLines = root.querySelectorAll('.about__intro-headline span, .about__intro-p span, .about__intro-tag')
      if (textLines.length) {
        gsap.fromTo(textLines,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.about__intro',
              start: 'top 75%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }

      // ── 3. Scroll-Driven Main Image Gradual Zoom ──
      // Connected smoothly to scroll progress without sudden jumps
      if (mainImageRef.current && imageFrameRef.current) {
        gsap.fromTo(mainImageRef.current,
          { scale: 1, filter: 'brightness(0.95)' },
          {
            scale: 1.22,
            filter: 'brightness(1.05)',
            ease: 'none',
            scrollTrigger: {
              trigger: imageFrameRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
              invalidateOnRefresh: true
            }
          }
        )
      }

      // ── 4. Founders Section Reveal ──
      const foundersEl = root.querySelector('.about__founders')
      if (foundersEl) {
        const titleWords = foundersEl.querySelectorAll('.about__founders-title .about__mask-word')
        const cards = foundersEl.querySelectorAll('.about__founder')

        const fTl = gsap.timeline({
          scrollTrigger: {
            trigger: foundersEl,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        })

        fTl.fromTo(foundersEl.querySelector('.about__section-tag'),
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        )
        .fromTo(titleWords,
          { yPercent: 110, rotate: 4 },
          { yPercent: 0, rotate: 0, duration: 0.75, ease: 'power4.out', stagger: 0.02 },
          '-=0.2'
        )
        .fromTo(cards,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
          '-=0.3'
        )
      }

      // ── 5. Mouse Parallax on Images (Desktop only) ──
      if (finePointer && !reduced) {
        const parallaxImages = root.querySelectorAll('.about__parallax-target')
        parallaxImages.forEach((imgWrap) => {
          const quickX = gsap.quickTo(imgWrap, 'x', { duration: 0.4, ease: 'power3.out' })
          const quickY = gsap.quickTo(imgWrap, 'y', { duration: 0.4, ease: 'power3.out' })

          const handleMouseMove = (e) => {
            const rect = imgWrap.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const deltaX = (e.clientX - centerX) / (rect.width / 2)
            const deltaY = (e.clientY - centerY) / (rect.height / 2)
            quickX(deltaX * 12)
            quickY(deltaY * 12)
          }

          const handleMouseLeave = () => {
            quickX(0)
            quickY(0)
          }

          imgWrap.addEventListener('mousemove', handleMouseMove)
          imgWrap.addEventListener('mouseleave', handleMouseLeave)
        })
      }

      // ── 6. Manifesto Banner Reveal ──
      const manifesto = root.querySelector('.about__manifesto')
      if (manifesto) {
        gsap.fromTo(manifesto,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: manifesto,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section className="about" id="about" ref={ref} aria-label="Who We Are / About Rockcastle">
      {/* ── WHO WE ARE / INTRO ── */}
      <div className="about__intro">
        <div className="about__intro-container">
          <div className="about__intro-header">
            <span className="about__intro-tag">[&nbsp;WHO WE ARE&nbsp;]</span>
            <h2 className="about__intro-headline">
              <span>Architects of</span>
              <span className="about__intro-headline--accent">Unforgettable Spaces.</span>
            </h2>
          </div>

          <div className="about__intro-content">
            <div className="about__intro-text-column">
              <p className="about__intro-p about__intro-p--lead">
                <span>
                  Rockcastle was founded in Dubai with an uncompromising belief: experiential environments should possess the structural grandeur of architecture and the narrative weight of cinema.
                </span>
              </p>
              <p className="about__intro-p">
                <span>
                  Over twelve years and more than 140 monumental activations, our studio has expanded from a visionary design atelier into a full-scale spatial production engine. We weld, program, and build our own concepts in-house.
                </span>
              </p>
              <div className="about__metrics-row">
                <div className="about__metric">
                  <span className="about__metric-num">12+</span>
                  <span className="about__metric-label">YEARS IN DUBAI</span>
                </div>
                <div className="about__metric">
                  <span className="about__metric-num">140+</span>
                  <span className="about__metric-label">ACTIVATIONS DELIVERED</span>
                </div>
                <div className="about__metric">
                  <span className="about__metric-num">100%</span>
                  <span className="about__metric-label">IN-HOUSE FABRICATION</span>
                </div>
              </div>
            </div>

            {/* Main Interactive Zoom Image with Mouse Parallax */}
            <div className="about__image-column" ref={imageFrameRef}>
              <div className="about__parallax-target">
                <div className="about__main-image-wrap">
                  <img
                    ref={mainImageRef}
                    src="/images/about-intro.webp"
                    alt="Rockcastle Dubai Studio & Fabrication"
                    className="about__main-image"
                  />
                  <div className="about__image-overlay" />
                  <span className="about__image-badge">STUDIO & ATELIER // DUBAI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MANIFESTO BANNER ── */}
      <div className="about__manifesto">
        <div className="about__manifesto-inner">
          <span className="about__rule" aria-hidden="true" />
          <span className="about__manifesto-tag">[&nbsp;OUR CONVICTION&nbsp;]</span>
          <p className="about__manifesto-quote">
            &ldquo;Nobody claps for a cable run or a load calculation at 4am — yet that is precisely where monumental experiences are won or lost.&rdquo;
          </p>
        </div>
      </div>

      {/* ── FOUNDERS — Orange Accented Editorial Grid ── */}
      <div className="about__founders">
        <div className="about__founders-inner">
          <div className="about__founders-head">
            <span className="about__rule" aria-hidden="true" />
            <span className="about__section-tag">[&nbsp;LEADERSHIP&nbsp;]</span>
            <h2 className="about__founders-title">
              <MaskWords text="Two partners personally sign off on every activation we build" />
            </h2>
          </div>
          <div className="about__founders-grid" ref={foundersGridRef}>
            {founders.map((f) => (
              <div className="about__founder" key={f.name}>
                <div className="about__parallax-target">
                  <div className="about__portrait-wrap">
                    <img src={f.image} alt={f.name} className="about__portrait-img" />
                    <div className="about__portrait-overlay" />
                  </div>
                </div>
                <div className="about__founder-meta">
                  <span className="about__founder-name">{f.name}</span>
                  <span className="about__founder-tag">[&nbsp;{f.tag}&nbsp;]</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
