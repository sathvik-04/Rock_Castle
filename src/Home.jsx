import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Signature from './components/Signature'
import Work from './components/Work'
import Process from './components/Process'
import Crew from './components/Crew'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'

// Sections with no internal GSAP `pin:` of their own — safe to zoom-scale
const ZOOM_SAFE_SELECTORS = ['#work', '#testimonials', '.footer']

export default function Home() {
  const location = useLocation()

  // In-page anchor hash navigation
  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
    return () => clearTimeout(t)
  }, [location.hash])

  // Continuous subtle zoom on non-pinned sections
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      ZOOM_SAFE_SELECTORS.forEach((sel) => {
        const el = document.querySelector(sel)
        if (!el) return
        gsap.fromTo(
          el,
          { scale: 1.02, opacity: 0.85 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'top 70%',
              scrub: true
            }
          }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      <Navigation />
      <main>
        {/* 1. HERO / FULLSCREEN VIDEO */}
        <Hero />

        {/* 2. WHO WE ARE / ABOUT */}
        <About />

        {/* 3. WORKS INTRO ANIMATION / SIGNATURE SYSTEM */}
        <Signature />

        {/* 4. WORKS PROJECT GRID */}
        <Work />

        {/* 5. STRATEGY */}
        <Process />

        {/* 6. CREW / STACKING CARDS */}
        <Crew />

        {/* 7. TESTIMONIALS */}
        <Testimonials />

        {/* 8. CONTACT */}
        <Contact />
      </main>

      {/* 9. FOOTER */}
      <Footer />
    </>
  )
}
