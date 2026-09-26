import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import WhoWeAreSignature from './components/WhoWeAreSignature'
import WhatWeProduce from './components/what-we-produce/WhatWeProduce'
import Leadership from './components/Leadership'
import Crew from './components/Crew'
import ClientStories from './components/client-stories/ClientStories'
import ConnectTeaser from './components/connect-teaser/ConnectTeaser'
import Footer from './components/Footer'

// Sections with no internal GSAP `pin:` of their own — safe to zoom-scale
const ZOOM_SAFE_SELECTORS = ['#testimonials', '#connect']

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

        {/* 2. WHO WE ARE & SIGNATURE & PROJECTS MATRIX (UNIFIED CINEMATIC EXPERIENCE) */}
        <WhoWeAreSignature />

        {/* 3. WHAT WE PRODUCE (VOCABULARY PARALLAX & DISCIPLINES) */}
        <WhatWeProduce id="what-we-produce" theme="light" />

        {/* 4. LEADERSHIP */}
        <Leadership />

        {/* 5. CREW / STACKING CARDS */}
        <Crew />

        {/* 6. CLIENT STORIES / TESTIMONIALS */}
        <ClientStories id="testimonials" theme="light" />

        {/* 7. CONNECT TEASER */}
        <ConnectTeaser id="connect" />
      </main>

      {/* 9. FOOTER WITH CURTAIN REVEAL SCROLL UP ANIMATION */}
      <Footer reveal={true} />
    </>
  )
}
