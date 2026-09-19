import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Quote from './components/Quote'
import About from './components/About'
import Signature from './components/Signature'
import Work from './components/Work'
import Testimonials from './components/Testimonials'
import Process from './components/Process'
import Services from './components/Services'
import Contact from './components/Contact'
import Faq from './components/Faq'
import Footer from './components/Footer'

// Sections with no internal GSAP `pin:` / CSS `position:sticky` of their own —
// safe to zoom-scale as a whole root element on entry. Sections that DO pin
// internally (About, Signature, Process, Contact) are left alone here:
// a `transform`/`filter`/`scale` on an ANCESTOR breaks `position:fixed`/`sticky`
// for descendants (the same bug that broke About's zoom/crew-deck pins
// earlier), so those keep their own bespoke internal motion instead.
const ZOOM_SAFE_SELECTORS = ['#quote', '#work', '#testimonials', '.services', '.footer']

export default function Home() {
  const location = useLocation()

  // Arriving here with a hash (e.g. from CaseStudy's "Back to Work" link,
  // which navigates cross-page rather than doing an in-page anchor jump)
  // scrolls to that section once the layout has settled.
  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
    return () => clearTimeout(t)
  }, [location.hash])

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
        <Quote />
        <About />
        <Signature />
        <Work />
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
