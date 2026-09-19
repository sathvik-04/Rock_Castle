import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Signature from './components/Signature'
import Testimonials from './components/Testimonials'
import Process from './components/Process'
import About from './components/About'
import Services from './components/Services'
import Contact from './components/Contact'
import Faq from './components/Faq'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

// Sections with no internal GSAP `pin:` / CSS `position:sticky` of their own —
// safe to zoom-scale as a whole root element on entry. Sections that DO pin
// internally (About, Signature, Process, Contact) are left alone here:
// a `transform`/`filter`/`scale` on an ANCESTOR breaks `position:fixed`/`sticky`
// for descendants (the same bug that broke About's zoom/crew-deck pins
// earlier), so those keep their own bespoke internal motion instead.
const ZOOM_SAFE_SELECTORS = ['#testimonials', '.services', '.footer']

export default function App() {
  const lenisRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  // ── sections with no internal pinning of their own zoom-settle in as
  // they arrive, so scrolling from Hero into Work (etc.) reads as one
  // continuous move instead of a hard cut. ──
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      ZOOM_SAFE_SELECTORS.forEach((sel) => {
        const el = document.querySelector(sel)
        if (!el) return
        gsap.fromTo(
          el,
          { scale: 1.05, opacity: 0.75 },
          { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 60%', scrub: true } }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Signature />
        <Testimonials />
        <Process />
        <Services />
        <Contact />
        <Faq />
      </main>
      <Footer />
    </>
  )
}
