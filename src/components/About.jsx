import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Factory, DraftingCompass, Zap, Cpu, HardHat, Leaf } from 'lucide-react'
import SlideUpText from './ui/slide-up-text'
import { Device } from './ui/device'
import './About.css'

gsap.registerPlugin(ScrollTrigger)

const founders = [
  {
    name: 'Founder & MD',
    tag: 'BRIEF → STRATEGY',
    credential: '12 YRS',
    quote: 'Every brief gets interrogated until the idea can survive contact with steel and a deadline.',
    image: '/images/founder-1.webp'
  },
  {
    name: 'Head of Creative',
    tag: 'CONCEPT → BUILD',
    credential: '9 YRS',
    quote: 'A concept that only works as a rendering is not a concept — it’s a wish.',
    image: '/images/founder-2.webp'
  },
  {
    // Placeholder until a real third portrait is supplied — reuses an existing image.
    name: 'Head of Operations',
    tag: 'SITE → DELIVERY',
    credential: '10 YRS',
    quote: 'The build is only as good as the crew still standing in the venue at load-in.',
    image: '/images/founder-1.webp'
  },
]

const _differentiators = [
  { icon: Factory, name: 'In-House Fabrication', desc: 'Every weld, mill, and CNC cut happens on our own Dubai floor — nothing subcontracted, nothing diluted.' },
  { icon: DraftingCompass, name: 'Engineering-Led Design', desc: 'Structural sign-off happens before a single panel is built, not after something fails on site.' },
  { icon: Zap, name: 'Compressed Timelines', desc: 'Fabrication and install run in parallel under one roof, so builds move at the speed a launch date demands.' },
  { icon: Cpu, name: 'Show Control In-House', desc: 'Lighting, motion, and AV systems are programmed and stress-tested on our own floor before they reach a venue.' },
  { icon: HardHat, name: 'Boots on Site, Always', desc: 'Our own crew rigs, calibrates, and stands inside the build until the moment the doors open.' },
  { icon: Leaf, name: 'Built to Be Reused', desc: 'Structural systems are engineered for multiple lifecycles, not a single night.' },
]

export default function About() {
  const ref = useRef(null)
  const mainImageRef = useRef(null)
  const imageFrameRef = useRef(null)
  const imageWrapRef = useRef(null)
  const imageBadgeRef = useRef(null)
  const foundersGridRef = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // Font / editorial lines inside Intro
      // Font / editorial lines inside Intro handled by SlideUpText
      const textLines = []

      // ── 1. Slide-over / Sheet Reveal onto Hero ──
      // Hero pins in place and eases back while About slides up from
      // below, over one screen's worth of scroll, to fully cover it.
      const heroEl = document.querySelector('#hero')
      if (heroEl) {
        const mm = gsap.matchMedia()

        mm.add('(min-width: 769px)', () => {
          gsap.set(root, { y: '100vh' })
          if (!reduced && textLines.length) {
            gsap.set(textLines, { opacity: 0, y: 28 })
          }

          gsap.timeline({
            scrollTrigger: {
              trigger: heroEl,
              start: 'top top',
              end: '+=100%',
              scrub: 0.8,
              pin: true,
              pinSpacing: false,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              snap: {
                snapTo: (value) => (value < 0.35 ? 0 : 1),
                duration: { min: 0.25, max: 0.45 },
                ease: 'power2.inOut'
              }
            }
          })
            .to(root, { y: '0vh', ease: 'none', duration: 1 }, 0)
            .to(heroEl, { yPercent: -18, ease: 'none', duration: 1 }, 0)

          // ── 2. Editorial Text Reveal: Starts as sheet begins entering so text is ready right on time ──
          // ── Editorial Text Pop Reveal ──
          // Text appears when the About section reaches 35% from the bottom.
          // 35% from bottom = top 65% of the viewport.

          if (!reduced && textLines.length) {
            gsap.set(textLines, {
              opacity: 0,
              y: 32,
              scale: 0.94,
              rotateX: -8,
              transformOrigin: '50% 100%'
            })

            gsap.to(textLines, {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              duration: 0.65,
              stagger: 0.055,
              ease: 'back.out(1.5)',
              scrollTrigger: {
                trigger: root,
                start: 'top 125%',
                toggleActions: 'play none none reverse',
                invalidateOnRefresh: true
              }
            })
          }
        })

        // Mobile: pinning full-height sections fights the dynamic address
        // bar, so let About settle in with a responsive reveal.
        mm.add('(max-width: 768px)', () => {
          gsap.fromTo(root,
            { y: '8vh', opacity: 0.8 },
            {
              y: '0vh',
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: root,
                start: 'top bottom',
                end: 'top 70%',
                scrub: true
              }
            }
          )

          // On mobile, appear right as the section enters the viewport (top 85%)
          if (!reduced && textLines.length) {
            gsap.fromTo(textLines,
              { opacity: 0, y: 26 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.04,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: root,
                  start: 'top 75%',
                  toggleActions: 'play none none reverse'
                }
              }
            )
          }
        })
      } else if (!reduced && textLines.length) {
        gsap.fromTo(textLines,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.04,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: root,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }

      // ── 3. Scroll-Driven Studio Image Parallax ──
      if (mainImageRef.current && imageFrameRef.current) {
        gsap.fromTo(mainImageRef.current,
          { yPercent: -12, scale: 1.15, filter: 'brightness(0.92)' },
          {
            yPercent: 12,
            scale: 1.15,
            filter: 'brightness(1.05)',
            ease: 'none',
            scrollTrigger: {
              trigger: imageFrameRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true
            }
          }
        )

        if (imageWrapRef.current) {
          gsap.fromTo(imageWrapRef.current,
            { borderRadius: 16, y: 30 },
            {
              borderRadius: 4,
              y: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: imageFrameRef.current,
                start: 'top bottom',
                end: 'top 70%',
                scrub: 0.6,
                invalidateOnRefresh: true
              }
            }
          )
        }

        if (imageBadgeRef.current) {
          gsap.fromTo(imageBadgeRef.current,
            { x: -20, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: imageFrameRef.current,
                start: 'top 85%',
                end: 'top 50%',
                scrub: 0.6,
                invalidateOnRefresh: true
              }
            }
          )
        }
      }

      // ── 3b. "Why Rockcastle" Differentiators Grid Reveal ──
      const valuesEl = root.querySelector('.about__values')
      if (valuesEl) {
        const valueItems = valuesEl.querySelectorAll('.about__value')
        const valueIcons = valuesEl.querySelectorAll('.about__value-icon')

        const vTl = gsap.timeline({
          scrollTrigger: {
            trigger: valuesEl,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        })

        vTl.fromTo(valueItems,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
        )
          .fromTo(valueIcons,
            { scale: 0.4, rotate: -12 },
            { scale: 1, rotate: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(2.4)' },
            '<'
          )
      }

      // ── 4. Founders Section Reveal — clip-path mask cards + credential pop ──
      const foundersEl = root.querySelector('.about__founders')
      if (foundersEl) {
        const cards = foundersEl.querySelectorAll('.about__founder')
        const portraits = foundersEl.querySelectorAll('.about__portrait-wrap')
        const credentials = foundersEl.querySelectorAll('.about__founder-credential')
        const metas = foundersEl.querySelectorAll('.about__founder-meta')

        const fTl = gsap.timeline({
          scrollTrigger: {
            trigger: foundersEl,
            start: 'top 135%',
            toggleActions: 'play none none reverse'
          }
        })

        fTl.fromTo(cards,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' }
        )
          .fromTo(portraits,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, stagger: 0.12, ease: 'power4.out' },
            '<'
          )
          .fromTo(metas,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' },
            '<+0.25'
          )
          .fromTo(credentials,
            { opacity: 0, scale: 0.4 },
            { opacity: 1, scale: 1, duration: 0.45, stagger: 0.12, ease: 'back.out(2.2)' },
            '<+0.15'
          )

        if (!reduced) {
          portraits.forEach((pWrap) => {
            const img = pWrap.querySelector('img')
            if (img) {
              gsap.fromTo(img,
                { yPercent: -8, scale: 1.12 },
                {
                  yPercent: 8,
                  scale: 1.12,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: pWrap,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                  }
                }
              )
            }
          })
        }
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

    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section className="about" id="about" ref={ref} aria-label="Who We Are / About Rockcastle">
      {/* ── WHO WE ARE / INTRO ── */}
      <div className="about__intro">
        <div className="about__intro-container">
          <div className="about__intro-header">
            <SlideUpText
              split="characters"
              stagger={0.02}
              inView={true}
              once={true}
              className="about__intro-tag"
            >
              [&nbsp;WHO WE ARE&nbsp;]
            </SlideUpText>
            <h2 className="about__intro-headline">
              <SlideUpText
                split="words"
                stagger={0.06}
                inView={true}
                once={true}
              >
                Architects of
              </SlideUpText>
              <SlideUpText
                split="words"
                stagger={0.06}
                delay={0.12}
                inView={true}
                once={true}
                className="about__intro-headline--accent"
              >
                Unforgettable Spaces.
              </SlideUpText>
            </h2>
          </div>

          <div className="about__intro-grid">
            {/* Left Column: Device Mockup (Left Center of Who We Are) */}
            <div className="about__intro-device-column">
              <div className="about__device-frame-wrap">
                <Device
                  width={225}
                  src="/images/video1.mp4"
                  alt="Rockcastle Experience"
                  className="about__device-element"
                />
              </div>
            </div>

            {/* Right Column: Studio Narrative & Metrics */}
            <div className="about__intro-text-column">
              <div className="about__intro-narrative">
                <SlideUpText
                  split="words"
                  stagger={0.025}
                  inView={true}
                  once={true}
                  className="about__intro-p about__intro-p--lead"
                >
                  Rockcastle was founded in Dubai with an uncompromising belief: experiential environments should possess the structural grandeur of architecture and the narrative weight of cinema.
                </SlideUpText>
                <SlideUpText
                  split="words"
                  stagger={0.02}
                  delay={0.12}
                  inView={true}
                  once={true}
                  className="about__intro-p"
                >
                  Over twelve years and more than 140 monumental activations, our studio has expanded from a visionary design atelier into a full-scale spatial production engine. We weld, program, and build our own concepts in-house.
                </SlideUpText>
              </div>

              <div className="about__metrics-row">
                <div className="about__metric">
                  <SlideUpText split="characters" stagger={0.03} inView={true} once={true} className="about__metric-num">
                    12+
                  </SlideUpText>
                  <SlideUpText split="words" stagger={0.04} delay={0.08} inView={true} once={true} className="about__metric-label">
                    YEARS IN DUBAI
                  </SlideUpText>
                </div>
                <div className="about__metric">
                  <SlideUpText split="characters" stagger={0.03} inView={true} once={true} className="about__metric-num">
                    140+
                  </SlideUpText>
                  <SlideUpText split="words" stagger={0.04} delay={0.08} inView={true} once={true} className="about__metric-label">
                    ACTIVATIONS DELIVERED
                  </SlideUpText>
                </div>
                <div className="about__metric">
                  <SlideUpText split="characters" stagger={0.03} inView={true} once={true} className="about__metric-num">
                    100%
                  </SlideUpText>
                  <SlideUpText split="words" stagger={0.04} delay={0.08} inView={true} once={true} className="about__metric-label">
                    IN-HOUSE FABRICATION
                  </SlideUpText>
                </div>
              </div>

              {/* Prompt Text Above Action Buttons */}
              <div className="about__intro-prompt">
                <SlideUpText
                  split="words"
                  stagger={0.025}
                  inView={true}
                  once={true}
                  className="about__intro-prompt-line"
                >
                  Planning an event that needs
                </SlideUpText>
                <SlideUpText
                  split="words"
                  stagger={0.025}
                  delay={0.1}
                  inView={true}
                  once={true}
                  className="about__intro-prompt-line about__intro-prompt-line--bold"
                >
                  to make an impact? Let’s talk.
                </SlideUpText>
              </div>

              {/* Action Buttons: CONNECT (Marquee Pill) & STORIES (Marquee Pill) */}
              <div className="about__intro-actions">
                <Link
                  to="/connect"
                  className="about__pill-btn about__pill-btn--connect"
                  aria-label="Connect with Rockcastle"
                >
                  <div className="about__pill-track-mask">
                    <div className="about__pill-track">
                      <span>CONNECT</span>
                      <span>CONNECT</span>
                      <span>CONNECT</span>
                      <span>CONNECT</span>
                      <span>CONNECT</span>
                      <span>CONNECT</span>
                    </div>
                  </div>
                  <span className="about__pill-plus">+</span>
                </Link>

                <Link
                  to="/stories"
                  className="about__pill-btn about__pill-btn--culture"
                  aria-label="Explore Rockcastle Stories"
                >
                  <div className="about__pill-track-mask">
                    <div className="about__pill-track">
                      <span>STORIES</span>
                      <span>STORIES</span>
                      <span>STORIES</span>
                      <span>STORIES</span>
                      <span>STORIES</span>
                      <span>STORIES</span>
                    </div>
                  </div>
                  <span className="about__pill-plus">+</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── WHY ROCKCASTLE — Differentiators Grid ── */}
      {/* <div className="about__values">
        <div className="about__values-inner">
          <div className="about__values-head">
            <span className="about__section-tag">[&nbsp;WHY ROCKCASTLE&nbsp;]</span>
            <h2 className="about__values-title">What sets the studio apart</h2>
          </div>
          <div className="about__values-grid">
            {differentiators.map((v) => {
              const Icon = v.icon
              return (
                <div className="about__value" key={v.name}>
                  <div className="about__value-icon">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <h3 className="about__value-name">{v.name}</h3>
                  <p className="about__value-desc">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div> */}

      {/* ── FOUNDERS — Orange Accented Editorial Grid ── */}
      <div className="about__founders">
        <div className="about__founders-inner">
          <div className="about__founders-head">
            <span className="about__rule" aria-hidden="true" />
            <SlideUpText
              split="characters"
              stagger={0.02}
              inView={true}
              once={true}
              className="about__section-tag"
            >
              [&nbsp;LEADERSHIP&nbsp;]
            </SlideUpText>
            <h2 className="about__founders-title">
              <SlideUpText
                split="words"
                stagger={0.03}
                inView={true}
                once={true}
              >
                Three leads personally sign off on every activation we build
              </SlideUpText>
            </h2>
          </div>
          <div className="about__founders-grid" ref={foundersGridRef}>
            {founders.map((f) => (
              <div className="about__founder" key={f.name}>
                <div className="about__parallax-target">
                  <div className="about__portrait-wrap">
                    <img src={f.image} alt={f.name} className="about__portrait-img" />
                    <div className="about__portrait-overlay" />
                    <span className="about__founder-credential">{f.credential}</span>
                    <div className="about__founder-quote">
                      <p>&ldquo;{f.quote}&rdquo;</p>
                    </div>
                  </div>
                </div>
                <div className="about__founder-meta">
                  <SlideUpText split="words" stagger={0.03} inView={true} once={true} className="about__founder-name">
                    {f.name}
                  </SlideUpText>
                  <SlideUpText split="characters" stagger={0.02} inView={true} once={true} className="about__founder-tag">
                    {`[ ${f.tag} ]`}
                  </SlideUpText>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
