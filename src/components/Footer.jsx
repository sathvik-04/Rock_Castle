import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Footer.css'

gsap.registerPlugin(ScrollTrigger)

export default function Footer({ reveal = false }) {
  const footerRef = useRef(null)

  const sitemapLinks = [
    { label: 'What We Produce', href: '/#what-we-produce' },
    { label: 'Who We Are', href: '/#who-we-are' },
    { label: 'Leadership', href: '/#leadership' },
    { label: 'Client Stories', href: '/stories' },
    { label: 'Connect', href: '/connect' },
  ]

  useEffect(() => {
    if (!reveal) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const footerEl = footerRef.current
    if (!footerEl) return

    const mainEl = document.querySelector('main')
    if (!mainEl) return

    let ro = null
    let ctx = null

    const initReveal = () => {
      // Degrade gracefully on small screens if footer is taller than viewport
      const isMobile = window.innerWidth < 768 || footerEl.offsetHeight > window.innerHeight
      if (isMobile) {
        footerEl.classList.remove('footer--reveal')
        footerEl.style.visibility = 'visible'
        footerEl.style.pointerEvents = 'auto'
        mainEl.style.marginBottom = ''
        return
      }

      footerEl.classList.add('footer--reveal')
      const h = footerEl.offsetHeight
      mainEl.style.marginBottom = `${h}px`

      if (ctx) ctx.revert()

      ctx = gsap.context(() => {
        // Gated visibility: only activate when near bottom of main
        ScrollTrigger.create({
          trigger: mainEl,
          start: () => `bottom bottom+=${Math.min(window.innerHeight, 700)}`,
          onEnter: () => {
            footerEl.style.visibility = 'visible'
            footerEl.style.pointerEvents = 'auto'
          },
          onLeaveBack: () => {
            footerEl.style.visibility = 'hidden'
            footerEl.style.pointerEvents = 'none'
          },
        })
      })

      ScrollTrigger.refresh()
    }

    initReveal()

    ro = new ResizeObserver(() => {
      initReveal()
    })
    ro.observe(footerEl)

    window.addEventListener('resize', initReveal)

    return () => {
      if (ro) ro.disconnect()
      window.removeEventListener('resize', initReveal)
      if (ctx) ctx.revert()
      if (mainEl) mainEl.style.marginBottom = ''
      footerEl.classList.remove('footer--reveal')
      footerEl.style.visibility = ''
      footerEl.style.pointerEvents = ''
    }
  }, [reveal])

  return (
    <footer ref={footerRef} className="footer" id="footer" aria-label="Site Footer">
      <div className="footer__inner">
        {/* Main 5-Column Studio Grid: Office (Far Left), Contact, Center Logo, Sitemap, Movement (Far Right) */}
        <div className="footer__grid">
          {/* Column 1: Office (Far Left) */}
          <div className="footer__col footer__col--office">
            <h4 className="footer__col-heading">Office</h4>
            <div className="footer__col-content">
              <p>Al Quoz Industrial Area 1</p>
              <p>Dubai, United Arab Emirates</p>
            </div>
          </div>

          {/* Column 2: Contact */}
          <div className="footer__col footer__col--contact">
            <h4 className="footer__col-heading">Contact</h4>
            <div className="footer__col-content">
              <a href="tel:+97142888888" className="footer__link">+971 4 288 8888</a>
              <a href="mailto:hello@rockcastle.com" className="footer__link">hello@rockcastle.com</a>
              <div className="footer__indicator" aria-hidden="true" />
            </div>
          </div>

          {/* Center Column: Rock Castle Logo */}
          <div className="footer__col footer__col--center">
            <Link to="/" className="footer__logo-link" aria-label="Rock Castle Home">
              <img
                src="/rockcastle-logo-black.png"
                alt="Rock Castle"
                className="footer__logo-img"
              />
            </Link>
          </div>

          {/* Column 3: Sitemap */}
          <div className="footer__col footer__col--sitemap">
            <h4 className="footer__col-heading">Sitemap</h4>
            <nav className="footer__nav" aria-label="Footer Sitemap">
              {sitemapLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="footer__link footer__link--nav"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 4: Join the movement (Far Right) */}
          <div className="footer__col footer__col--movement">
            <h4 className="footer__col-heading footer__col-heading--movement">
              <span className="footer__plus">+</span> Join the movement
            </h4>
            <div className="footer__col-content">
              <p className="footer__movement-text">
                Architects of the untold —<br />
                monumental builds worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Copyright Bar */}
        <div className="footer__bottom">
          <span className="footer__copyright">
            © {new Date().getFullYear()} Rock Castle
          </span>
          <div className="footer__bottom-links">
            <a href="#cookies" className="footer__bottom-link">Cookies</a>
            <span className="footer__bottom-sep">/</span>
            <span className="footer__bottom-motto">Experiences Un-ltd.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
