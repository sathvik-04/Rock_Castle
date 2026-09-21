import './Footer.css'

export default function Footer() {
  const sitemapLinks = [
    { label: 'Who We Are', href: '#about' },
    { label: 'Works', href: '#works' },
    { label: 'Strategy', href: '#strategy' },
    { label: 'Crew', href: '#crew' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ]

  const socialLinks = [
    { label: 'Instagram', href: 'https://instagram.com', tag: 'IG' },
    { label: 'LinkedIn', href: 'https://linkedin.com', tag: 'LI' },
    { label: 'Behance', href: 'https://behance.net', tag: 'BE' },
  ]

  return (
    <footer className="footer" id="footer" aria-label="Site Footer">
      <div className="footer__inner">
        {/* Brand Emblem Row */}
        <div className="footer__brand-row">
          <div className="footer__brand-id">
            <img src="/rockcastle-logo.jpg" alt="Rockcastle" className="footer__logo" />
            <div className="footer__brand-text">
              <span className="footer__brand-name">ROCKCASTLE</span>
              <span className="footer__brand-sub">SPATIAL ARCHITECTURE & PRODUCTION</span>
            </div>
          </div>
          <div className="footer__brand-badge">
            <span className="footer__badge-dot" />
            <span>DUBAI ATELIER // WORLDWIDE</span>
          </div>
        </div>

        {/* 3-Column Studio Grid (Inspired by Reference Architecture) */}
        <div className="footer__grid">
          {/* Column 1: Studio & Atelier */}
          <div className="footer__col">
            <h4 className="footer__col-heading">[ 01 // ATELIER ]</h4>
            <p className="footer__atelier-desc">
              Bespoke spatial environments engineered for global cultural institutions, luxury maisons, and visionary brands.
            </p>
            <div className="footer__atelier-meta">
              <span className="footer__meta-line">Al Quoz Industrial Area 1</span>
              <span className="footer__meta-line">Dubai, United Arab Emirates</span>
              <span className="footer__meta-line footer__meta-line--muted">GST // UTC+4</span>
            </div>
          </div>

          {/* Column 2: Direct Inquiries */}
          <div className="footer__col">
            <h4 className="footer__col-heading">[ 02 // DIRECT INQUIRIES ]</h4>
            <div className="footer__contact-links">
              <a href="mailto:hello@rockcastle.com" className="footer__contact-item">
                <span className="footer__contact-type">EMAIL</span>
                <span className="footer__contact-val">hello@rockcastle.com</span>
              </a>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="footer__contact-item">
                <span className="footer__contact-type">WHATSAPP</span>
                <span className="footer__contact-val">+971 (0)4 000 0000 ↗</span>
              </a>
            </div>

            <div className="footer__socials">
              {socialLinks.map((s) => (
                <a
                  key={s.tag}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-tag"
                  aria-label={s.label}
                >
                  [{s.tag}]
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Sitemap */}
          <div className="footer__col">
            <h4 className="footer__col-heading">[ 03 // SITEMAP ]</h4>
            <nav className="footer__nav" aria-label="Footer Navigation">
              {sitemapLinks.map((l) => (
                <a key={l.href} href={l.href} className="footer__nav-link">
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Legal & Motto Bar */}
        <div className="footer__bottom">
          <span className="footer__copyright">
            © 2026 ROCKCASTLE SPATIAL ATELIER. ALL RIGHTS RESERVED.
          </span>
          <span className="footer__motto">EXPERIENCES UN-LTD.</span>
        </div>
      </div>
    </footer>
  )
}
