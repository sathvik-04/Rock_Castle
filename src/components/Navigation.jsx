import { useEffect, useRef, useState } from 'react'
import './Navigation.css'

export default function Navigation() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastScroll = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 100)
      if (y > 300 && y > lastScroll.current && !menuOpen) setHidden(true)
      else setHidden(false)
      lastScroll.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen])

  const toggleMenu = () => {
    setMenuOpen(v => !v)
    document.body.style.overflow = menuOpen ? '' : 'hidden'
  }

  const closeMenu = () => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }

  const links = [
    { href: '#work', label: 'Work' },
    { href: '#process', label: 'Process' },
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#contact', label: 'Contact' },
    { href: '#faq', label: 'FAQ' },
  ]

  return (
    <>
      <nav className={`nav ${hidden ? 'nav--hidden' : ''} ${scrolled ? 'nav--scrolled' : ''}`}>
        <a href="#hero" className="nav__logo-link" aria-label="Rockcastle home">
          <img src="/rockcastle-logo.jpg" alt="Rockcastle" className="nav__logo" />
        </a>
        <div className="nav__links">
          {links.map(l => (
            <a key={l.href} href={l.href} className="nav__link">{l.label}</a>
          ))}
        </div>
        <button
          className={`nav__toggle ${menuOpen ? 'nav__toggle--active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`menu ${menuOpen ? 'menu--open' : ''}`} aria-hidden={!menuOpen}>
        {links.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            className="menu__link"
            onClick={closeMenu}
            style={{ transitionDelay: menuOpen ? `${0.1 + i * 0.05}s` : '0s' }}
          >
            {l.label}
          </a>
        ))}
        <span className="menu__accent">Experiences Un-Ltd.</span>
      </div>
    </>
  )
}
