import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './Hero.css'

export default function Hero() {
  const logoRef = useRef(null)
  const tagRef = useRef(null)
  const scanRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 })
    tl.fromTo(logoRef.current, { opacity: 0, rotateY: 180, scale: 0.8 }, { opacity: 1, rotateY: 0, scale: 1, duration: 1.8, ease: 'expo.out' })
      .fromTo(tagRef.current, { opacity: 0, y: 20 }, { opacity: 0.7, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
      .fromTo(scanRef.current, { opacity: 0, scaleX: 0 }, { opacity: 0.8, scaleX: 1, duration: 2, ease: 'expo.out' }, '-=0.5')
      .fromTo(scrollRef.current, { opacity: 0 }, { opacity: 0.5, duration: 1 }, '-=1')
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="hero__video-wrap">
        <div className="hero__placeholder" aria-label="Video placeholder">
          <span className="hero__placeholder-label">[ HERO VIDEO ]</span>
        </div>
      </div>
      <div className="hero__overlay" />
      <div className="hero__content">
        <img ref={logoRef} src="/rockcastle-logo.png" alt="Rockcastle — Experiences Un-Ltd." className="hero__logo" />
        <p ref={tagRef} className="hero__tagline">Experiences Un-Ltd.</p>
      </div>
      <div ref={scanRef} className="hero__scanline" />
      <div ref={scrollRef} className="hero__scroll">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-text">Scroll</span>
      </div>
      <div className="hero__corner hero__corner--tl" />
      <div className="hero__corner hero__corner--tr" />
      <div className="hero__corner hero__corner--bl" />
      <div className="hero__corner hero__corner--br" />
    </section>
  )
}
