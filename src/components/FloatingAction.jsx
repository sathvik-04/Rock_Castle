import { useState, useEffect } from 'react'
import './FloatingAction.css'

export default function FloatingAction() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const contactEl = document.getElementById('contact')
      
      let contactVisible = false
      if (contactEl) {
        const rect = contactEl.getBoundingClientRect()
        // If contact section is in viewport, hide floating button so it doesn't collide
        if (rect.top < window.innerHeight * 0.85) {
          contactVisible = true
        }
      }

      if (scrollY > 300 && !contactVisible) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (e) => {
    e.preventDefault()
    if (window.__lenis) {
      window.__lenis.scrollTo('#contact', { offset: -20, duration: 1.2 })
    } else {
      const el = document.getElementById('contact')
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <aside
      className={`floating-action ${visible ? 'is-visible' : ''}`}
      aria-label="Quick Project Inquiry"
    >
      <a
        href="#contact"
        onClick={handleClick}
        className="floating-action__btn"
        title="Start A Project Inquiry"
      >
        <span className="floating-action__pulse" />
        <span className="floating-action__text">LET'S TALK</span>
        <span className="floating-action__arrow">↗</span>
      </a>
    </aside>
  )
}
