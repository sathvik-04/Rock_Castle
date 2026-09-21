import { useEffect, useRef, useState } from 'react'
import { useMagnetic } from '../hooks/useMagnetic'
import './Navigation.css'

export default function Navigation() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)
  useMagnetic(navRef, '.nav__link, .nav__logo-link, .nav__cta-btn', 0.3)

  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 60)

      if (menuOpen) {
        setHidden(false)
        return
      }

      const prevY = lastScrollY.current
      const delta = y - prevY

      // Always show near top
      if (y < 80) {
        setHidden(false)
      } else if (delta > 6 && y > 140) {
        setHidden(true)
      } else if (delta < -8) {
        setHidden(false)
      }

      lastScrollY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      window.__lenis?.stop()
    } else {
      document.body.style.overflow = ''
      window.__lenis?.start()
    }
  }, [menuOpen])

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const handleAnchorClick = (e, href) => {
    e.preventDefault()
    closeMenu()

    if (window.__lenis) {
      window.__lenis.scrollTo(href, { offset: -20, duration: 1.2 })
    } else {
      const target = document.querySelector(href)
      if (target) target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const links = [
    { href: '#about', label: 'Who We Are' },
    { href: '#works', label: 'Works' },
    { href: '#strategy', label: 'Strategy' },
    { href: '#crew', label: 'Crew' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <>
      <header
        ref={navRef}
        className={`nav ${hidden ? 'nav--hidden' : ''} ${scrolled ? 'nav--scrolled' : ''}`}
      >
        <div className="nav__inner">
          {/* Left: Primary Section Navigation */}
          <nav className="nav__links" aria-label="Main Navigation">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="nav__link"
                onClick={(e) => handleAnchorClick(e, l.href)}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Center: Brand Monogram / Identity */}
          <a
            href="#hero"
            className="nav__logo-link"
            aria-label="Rockcastle Home"
            onClick={(e) => handleAnchorClick(e, '#hero')}
          >
            <img src="/rockcastle-logo.jpg" alt="Rockcastle" className="nav__logo" />
            <span className="nav__logo-text">ROCKCASTLE</span>
          </a>

          {/* Right: Action CTA & Direct Inquiry */}
          <div className="nav__right">
            <a
              href="#contact"
              className="nav__cta-btn"
              onClick={(e) => handleAnchorClick(e, '#contact')}
            >
              <span className="nav__cta-dot" />
              <span className="nav__cta-text">INITIATE PROJECT</span>
              <span className="nav__cta-arrow">↗</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              className={`nav__toggle ${menuOpen ? 'nav__toggle--active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle Navigation Menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div className={`menu ${menuOpen ? 'menu--open' : ''}`} aria-hidden={!menuOpen}>
        <div className="menu__header">
          <span className="menu__tag">[ NAVIGATION ]</span>
          <span className="menu__location">DUBAI // GLOBAL</span>
        </div>

        <nav className="menu__nav">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className="menu__link"
              onClick={(e) => handleAnchorClick(e, l.href)}
              style={{ transitionDelay: menuOpen ? `${0.06 + i * 0.04}s` : '0s' }}
            >
              <span className="menu__link-index">0{i + 1}</span>
              <span className="menu__link-label">{l.label}</span>
            </a>
          ))}
        </nav>

        <div className="menu__footer">
          <a
            href="#contact"
            className="menu__cta"
            onClick={(e) => handleAnchorClick(e, '#contact')}
          >
            <span>START A CONVERSATION</span>
            <span>→</span>
          </a>
          <span className="menu__accent">Architects of Unforgettable Spaces</span>
        </div>
      </div>
    </>
  )
}
