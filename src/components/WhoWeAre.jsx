import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SlideUpText from './ui/slide-up-text'
import { Device } from './ui/device'
import './WhoWeAre.css'

gsap.registerPlugin(ScrollTrigger)

export default function WhoWeAre({ isCombined = false }) {
  const ref = useRef(null)
  const deviceMoverRef = useRef(null)
  const deviceScalerRef = useRef(null)
  const textColumnRef = useRef(null)
  const fragmentsRef = useRef(null)
  const videoRef = useRef(null)

  // Autoplay video reliably
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
    }
  }, [])

  useEffect(() => {
    const root = ref.current
    const mover = deviceMoverRef.current
    const scaler = deviceScalerRef.current
    const textCol = textColumnRef.current
    const fragments = fragmentsRef.current
    if (!root || !mover || !scaler) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || isCombined) return

    const ctx = gsap.context(() => {
      // Dynamic calculation of delta to move phone to exact viewport center
      // Since section is pinned at top:top, viewport center = true visual center
      const calculateCenterDelta = () => {
        if (!mover || !root) return { x: 0, y: 0 }
        const col = root.querySelector('.who-we-are__device-column')
        // Target: exact viewport center
        const targetX = window.innerWidth / 2
        const targetY = window.innerHeight / 2

        if (col) {
          const colRect = col.getBoundingClientRect()
          const colCenterX = colRect.left + colRect.width / 2
          const colCenterY = colRect.top + colRect.height / 2
          return {
            x: targetX - colCenterX,
            y: targetY - colCenterY
          }
        }

        const moverRect = mover.getBoundingClientRect()
        const currentX = gsap.getProperty(mover, 'x') || 0
        const currentY = gsap.getProperty(mover, 'y') || 0
        const naturalCenterXInRoot = (moverRect.left - currentX) + moverRect.width / 2
        const naturalCenterYInRoot = (moverRect.top - currentY) + moverRect.height / 2
        return {
          x: targetX - naturalCenterXInRoot,
          y: targetY - naturalCenterYInRoot
        }
      }

      // Query phone chrome elements to fade during rotation & zoom
      const getPhoneAccessories = () => {
        return root.querySelectorAll(
          '.rc-device-status-bar, .rc-device-dynamic-island, .rc-device-home-bar, .rc-device-buttons-left, .rc-device-buttons-right, .rc-device-reflection, .who-we-are__device-frame-wrap::before'
        )
      }

      const mm = gsap.matchMedia()

      // ── 1. Hero Slide-Over / Sheet Reveal ──
      // Hero pins in place and subtly recedes (yPercent: -18) while WhoWeAre slides up over it
      const heroEl = document.querySelector('#hero')
      if (heroEl) {
        mm.add('(min-width: 769px)', () => {
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
            .to(heroEl, { yPercent: -18, ease: 'none', duration: 1 }, 0)
        })

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
        })
      }

      // ── 2. Pinned Interactive Sequence for Who We Are ──
      // Desktop sequence (min-width: 769px) - Pinned from start: 'top top' for a unified, fixed & smooth experience
      mm.add('(min-width: 769px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=280%',
            pin: true,
            pinSpacing: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        })

        // Phase 1 (0.00 -> 0.25): Reading Phase
        // The phone is 100% fixed on the left playing the video.
        // Subtle upward drift on text column provides tactile scroll response while reading.
        if (textCol) {
          tl.to(textCol, {
            y: -12,
            ease: 'none',
            duration: 0.25
          }, 0.00)
        }

        // Phase 2 (0.25 -> 0.48): Smooth Glide to Center
        // Text column fades out and slides right; phone smoothly glides from left column to exact dead-center.
        if (textCol) {
          tl.to(textCol, {
            opacity: 0,
            x: 80,
            filter: 'blur(8px)',
            duration: 0.20,
            ease: 'power2.in'
          }, 0.25)
        }

        tl.to(mover, {
          x: () => calculateCenterDelta().x,
          y: () => calculateCenterDelta().y,
          duration: 0.23,
          ease: 'power1.inOut'
        }, 0.25)

        // Fragmented brand text appears around centered phone (0.32 -> 0.50)
        if (fragments) {
          const fragmentItems = fragments.querySelectorAll('.who-we-are__fragment')
          tl.to(fragments, { opacity: 1, duration: 0.06 }, 0.32)
          tl.fromTo(fragmentItems,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.16, stagger: 0.05, ease: 'power2.out' },
            0.32
          )
        }

        // Phase 3 (0.50 -> 0.56): Brief pause at center with fragments readable

        // Phase 4 (0.56 -> 0.62): Fragments fade out
        if (fragments) {
          tl.to(fragments, {
            opacity: 0,
            y: -16,
            filter: 'blur(6px)',
            duration: 0.06,
            ease: 'power2.in'
          }, 0.56)
        }

        // Phase 5 (0.62 -> 0.80): Phone rotates smoothly from portrait to landscape (90 deg) in dead-center
        tl.to(scaler, {
          rotation: 90,
          transformOrigin: '50% 50%',
          duration: 0.18,
          ease: 'power1.inOut'
        }, 0.62)

        // Hardware chrome accessories fade away during rotation
        tl.to(getPhoneAccessories(), {
          opacity: 0,
          duration: 0.12,
          ease: 'power1.out'
        }, 0.64)

        // Phase 6 (0.80 -> 0.84): Brief settle in landscape orientation

        // Phase 7 (0.84 -> 0.98): Phone zooms up to cover full viewport, video smoothly fades away into dark canvas
        tl.to(root, { overflow: 'hidden', duration: 0.01 }, 0.83)
        tl.to(scaler, {
          scale: 9,
          duration: 0.14,
          ease: 'power1.inOut'
        }, 0.84)

        tl.to(root.querySelectorAll('.rc-device-body, .rc-device-screen'), {
          borderRadius: 0,
          boxShadow: 'none',
          duration: 0.10,
          ease: 'power1.inOut'
        }, 0.86)

        // Video inside phone fades away smoothly into dark canvas
        if (videoRef.current) {
          tl.to(videoRef.current, {
            opacity: 0,
            duration: 0.12,
            ease: 'power1.inOut'
          }, 0.86)
        }

        // Section background fades to dark #0a0a0a matching Signature
        tl.to(root, {
          backgroundColor: '#0a0a0a',
          duration: 0.12,
          ease: 'power1.inOut'
        }, 0.86)

        // Phase 8 (0.98 -> 1.00): Full-bleed hold into Signature hand-off
      })

      // Mobile sequence (max-width: 768px)
      mm.add('(max-width: 768px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=200%',
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        })

        const textChildren = root.querySelectorAll(
          '.who-we-are__header, .who-we-are__narrative, .who-we-are__metrics-row, .who-we-are__cta'
        )
        if (textCol) {
          tl.to(textCol, {
            opacity: 0,
            y: -24,
            filter: 'blur(6px)',
            duration: 0.20,
            ease: 'power2.in'
          }, 0.15)
        }
        if (textChildren.length) {
          tl.to(textChildren, {
            opacity: 0,
            y: -24,
            filter: 'blur(6px)',
            duration: 0.20,
            ease: 'power2.in'
          }, 0.15)
        }

        tl.to(mover, {
          x: () => calculateCenterDelta().x,
          y: () => calculateCenterDelta().y,
          duration: 0.22,
          ease: 'power1.inOut'
        }, 0.15)

        if (fragments) {
          tl.to(fragments, { opacity: 1, duration: 0.05 }, 0.25)
          tl.fromTo(fragments.querySelectorAll('.who-we-are__fragment'),
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.16, stagger: 0.04, ease: 'power2.out' },
            0.25
          )
          tl.to(fragments, { opacity: 0, duration: 0.06 }, 0.48)
        }

        tl.to(scaler, {
          rotation: 90,
          transformOrigin: '50% 50%',
          duration: 0.18,
          ease: 'power1.inOut'
        }, 0.50)

        tl.to(getPhoneAccessories(), {
          opacity: 0,
          duration: 0.12,
        }, 0.52)

        tl.to(root, { overflow: 'hidden', duration: 0.01 }, 0.68)
        tl.to(scaler, {
          scale: 9,
          duration: 0.22,
          ease: 'power1.inOut'
        }, 0.70)

        if (videoRef.current) {
          tl.to(videoRef.current, {
            opacity: 0,
            duration: 0.15,
          }, 0.72)
        }

        tl.to(root, {
          backgroundColor: '#0a0a0a',
          duration: 0.15,
        }, 0.72)
      })

    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section
      className={`who-we-are ${isCombined ? 'who-we-are--combined' : ''}`}
      id={isCombined ? undefined : "who-we-are"}
      ref={ref}
      aria-label="Who We Are / Rockcastle"
    >
      {/* Anchor for backward compatibility with #about navigation */}
      {!isCombined && (
        <span id="about" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} aria-hidden="true" />
      )}

      {/* Floating Brand Fragments (Appearing during scroll glide) */}
      <div className="who-we-are__fragments" ref={fragmentsRef} aria-hidden="true">
        <div className="who-we-are__fragment who-we-are__fragment--top">
          <span className="who-we-are__fragment-label">[ 01 // IMMERSIVE ARCHITECTURE ]</span>
          <span className="who-we-are__fragment-text">SPATIAL WORLDS CRAFTED FOR SCALE</span>
        </div>
        <div className="who-we-are__fragment who-we-are__fragment--bottom">
          <span className="who-we-are__fragment-label">[ 02 // ATELIER EXECUTION ]</span>
          <span className="who-we-are__fragment-text">WHERE CONCEPT CONFRONTS REALITY</span>
        </div>
      </div>

      <div className="who-we-are__intro">
        {/* Decorative right-edge accent */}
        <div className="who-we-are__accent-strip" aria-hidden="true" />
        <span className="who-we-are__accent-label" aria-hidden="true">EXPERIENTIAL DESIGN STUDIO</span>

        <div className="who-we-are__container">
          <div className="who-we-are__grid">
            {/* Left Column: Device Mockup (Media Composition) */}
            <div className="who-we-are__device-column">
              <div className="who-we-are__device-mover" ref={deviceMoverRef}>
                <div className="who-we-are__device-scaler" ref={deviceScalerRef}>
                  <div className="who-we-are__device-frame-wrap">
                    <Device
                      width="100%"
                      alt="Rockcastle Experiential Production"
                      className="who-we-are__device-element"
                      showDynamicIsland={true}
                      showStatusBar={true}
                      showHomeIndicator={true}
                      showButtons={true}
                      showReflection={true}
                    >
                      <div className="who-we-are__screen-inner">
                        <video
                          ref={videoRef}
                          src="/images/video1.mp4"
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="who-we-are__screen-video"
                        />
                      </div>
                    </Device>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Header, Studio Narrative, Metrics & CTA */}
            <div className="who-we-are__text-column" ref={textColumnRef}>
              {/* Header: Small Label & Main Heading */}
              <div className="who-we-are__header">
                <SlideUpText
                  split="characters"
                  stagger={0.02}
                  inView={true}
                  once={true}
                  className="who-we-are__tag"
                >
                  [&nbsp;WHO WE ARE&nbsp;]
                </SlideUpText>
                <h2 className="who-we-are__headline">
                  <SlideUpText
                    split="words"
                    stagger={0.05}
                    inView={true}
                    once={true}
                    className="who-we-are__headline-part"
                  >
                    ARCHITECTS OF
                  </SlideUpText>
                  <SlideUpText
                    split="words"
                    stagger={0.05}
                    delay={0.08}
                    inView={true}
                    once={true}
                    className="who-we-are__headline-part"
                  >
                    UNFORGETTABLE EXPERIENCES.
                  </SlideUpText>
                </h2>
              </div>

              {/* Narrative: Primary & Secondary Descriptions */}
              <div className="who-we-are__narrative">
                <SlideUpText
                  split="words"
                  stagger={0.02}
                  inView={true}
                  once={true}
                  className="who-we-are__p who-we-are__p--lead"
                >
                  Rock Castle is an experiential design and production studio creating immersive environments where architecture, storytelling, and human connection come together.
                </SlideUpText>
                <SlideUpText
                  split="words"
                  stagger={0.018}
                  delay={0.1}
                  inView={true}
                  once={true}
                  className="who-we-are__p who-we-are__p--sub"
                >
                  From concept to execution, we bring ideas to life through experience design, brand activations, events, exhibitions, and spatial production — all delivered with precision, detail, and craftsmanship.
                </SlideUpText>
              </div>

              {/* Three-Column Statistics with Subtle Vertical Dividers */}
              <div className="who-we-are__metrics-row">
                <div className="who-we-are__metric">
                  <SlideUpText split="characters" stagger={0.03} inView={true} once={true} className="who-we-are__metric-num">
                    12+
                  </SlideUpText>
                  <span className="who-we-are__metric-label">
                    YEARS OF EXPERIENCE
                  </span>
                </div>
                <div className="who-we-are__metric">
                  <SlideUpText split="characters" stagger={0.03} delay={0.05} inView={true} once={true} className="who-we-are__metric-num">
                    140+
                  </SlideUpText>
                  <span className="who-we-are__metric-label">
                    ACTIVATIONS DELIVERED
                  </span>
                </div>
                <div className="who-we-are__metric">
                  <SlideUpText split="characters" stagger={0.03} delay={0.1} inView={true} once={true} className="who-we-are__metric-num">
                    100%
                  </SlideUpText>
                  <span className="who-we-are__metric-label">
                    IN-HOUSE FABRICATION
                  </span>
                </div>
              </div>

              {/* CTA Section */}
              <div className="who-we-are__cta">
                <div className="who-we-are__prompt">
                  <SlideUpText
                    split="words"
                    stagger={0.025}
                    inView={true}
                    once={true}
                    className="who-we-are__prompt-line"
                  >
                    Planning an experience that needs
                  </SlideUpText>
                  <SlideUpText
                    split="words"
                    stagger={0.025}
                    delay={0.06}
                    inView={true}
                    once={true}
                    className="who-we-are__prompt-line"
                  >
                    to make an impact?
                  </SlideUpText>
                  <SlideUpText
                    split="words"
                    stagger={0.025}
                    delay={0.12}
                    inView={true}
                    once={true}
                    className="who-we-are__prompt-line who-we-are__prompt-line--bold"
                  >
                    Let’s make it unforgettable.
                  </SlideUpText>
                </div>

                <div className="who-we-are__actions">
                  <Link
                    to="/connect"
                    className="who-we-are__pill-btn who-we-are__pill-btn--connect"
                    aria-label="Connect with Rockcastle"
                  >
                    <div className="who-we-are__pill-track-mask">
                      <div className="who-we-are__pill-track">
                        <span>CONNECT</span>
                        <span>CONNECT</span>
                        <span>CONNECT</span>
                        <span>CONNECT</span>
                        <span>CONNECT</span>
                        <span>CONNECT</span>
                      </div>
                    </div>
                    <span className="who-we-are__pill-plus">+</span>
                  </Link>

                  <Link
                    to="/stories"
                    className="who-we-are__pill-btn who-we-are__pill-btn--culture"
                    aria-label="Explore Rockcastle Stories"
                  >
                    <div className="who-we-are__pill-track-mask">
                      <div className="who-we-are__pill-track">
                        <span>OUR STORIES</span>
                        <span>OUR STORIES</span>
                        <span>OUR STORIES</span>
                        <span>OUR STORIES</span>
                        <span>OUR STORIES</span>
                        <span>OUR STORIES</span>
                      </div>
                    </div>
                    <span className="who-we-are__pill-plus">+</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
