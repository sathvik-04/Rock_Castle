import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Quote from './components/Quote'
import Doors from './components/Doors'
import Work from './components/Work'
import Process from './components/Process'
import About from './components/About'
import Services from './components/Services'
import Signature from './components/Signature'
import Contact from './components/Contact'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

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

  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Quote />
        <Doors />
        <Work />
        <Process />
        <About />
        <Services />
        <Signature />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
