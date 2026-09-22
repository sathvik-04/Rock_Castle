import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Home from './Home'
import CaseStudy from './components/CaseStudy'
import Cursor from './components/Cursor'
import FloatingAction from './components/FloatingAction'
import Loader from './components/Loader'
import { PageTransitionProvider } from './components/PageTransition'
import ScrollProgress from './components/ScrollProgress'
import DeviceDemo from './components/ui/device-demo'
import MadeByRockCastle from './pages/MadeByRockCastle'
import Stories from './pages/Stories'
import HowWeWork from './pages/HowWeWork'
import Connect from './pages/Connect'

gsap.registerPlugin(ScrollTrigger)


export default function App() {
  const lenisRef = useRef(null)
  const location = useLocation()

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
    window.__lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => {
      window.__lenis = null
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  // Reset scroll position on every route change (Lenis intercepts native
  // scroll restoration, so a plain browser back/forward or Link click would
  // otherwise leave the viewport wherever it was on the previous page).
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    ScrollTrigger.refresh()
  }, [location.pathname])

  return (
    <PageTransitionProvider>
      <Loader />
      <Cursor />
      <ScrollProgress />
      <FloatingAction />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/made-by-rock-castle" element={<MadeByRockCastle />} />
        <Route path="/work" element={<MadeByRockCastle />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/how-we-work" element={<HowWeWork />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/contact" element={<Connect />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/device-demo" element={<DeviceDemo />} />
      </Routes>
    </PageTransitionProvider>
  )
}
