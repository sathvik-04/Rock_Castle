import './Footer.css'

export default function Footer() {
  const links = ['Work', 'Process', 'About', 'Services', 'Contact']

  return (
    <footer className="footer" id="footer">
      <div className="footer__content">
        <div className="footer__top">
          <img src="/rockcastle-logo.png" alt="Rockcastle" className="footer__logo" />
          <nav className="footer__nav" aria-label="Footer navigation">
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="footer__nav-link">{l}</a>
            ))}
          </nav>
          <div className="footer__contact">
            <a href="mailto:hello@rockcastle.com" className="footer__contact-line">hello@rockcastle.com</a>
            <span className="footer__contact-line">Dubai, UAE</span>
          </div>
        </div>
        <div className="footer__bottom">
          <span className="footer__copyright">© 2024 Rockcastle. All rights reserved.</span>
          <div className="footer__social">
            {[{l:'IG',h:'#'},{l:'LI',h:'#'},{l:'BE',h:'#'}].map(s => (
              <a key={s.l} href={s.h} className="footer__social-link">{s.l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
