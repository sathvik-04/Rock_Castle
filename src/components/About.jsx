import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './About.css'

const founders = [
  { name: 'Founder & MD', tag: 'BRIEF → STRATEGY', label: 'PORTRAIT — FOUNDER & MD' },
  { name: 'Head of Creative', tag: 'CONCEPT → BUILD', label: 'PORTRAIT — HEAD OF CREATIVE' },
]

const crewSteps = [
  { tag: 'CREW 01', text: 'Strategy sits in the room from the first brief' },
  { tag: 'CREW 02', text: 'Design draws it at build scale, not slide scale' },
  { tag: 'CREW 03', text: 'Fabrication welds it in our own workshop' },
  { tag: 'CREW 04', text: 'Crew stands in the venue the morning it opens' },
]

function MaskWords({ text }) {
  return text.split(' ').flatMap((w, i, arr) => {
    const nodes = [
      // eslint-disable-next-line react/no-array-index-key
      <span className="about__mask" key={`w-${i}`}><span className="about__mask-word">{w}</span></span>
    ]
    if (i < arr.length - 1) nodes.push(' ')
    return nodes
  })
}

export default function About() {
  const ref = useRef(null)
  const zoomTextRef = useRef(null)
  const zoomZeroRef = useRef(null)
  const cardsRef = useRef([])
  const deckIndexRef = useRef(null)

  useEffect(() => {
    let planeObserver
    const cleanupFns = []
    ScrollTrigger.config({ ignoreMobileResize: true })

    const ctx = gsap.context(() => {
      const root = ref.current

      // ── INTRO (s1) + 2013 ZOOM, merged into one pinned sequence: parallax
      // first, then the small "Founded — 2013" mark under the founder-film
      // caption takes over the screen (everything else fades, the number
      // scales up through its own "0", a veil closes to dark) and hands off
      // straight into the manifesto — no separate section just for the zoom. ──
      const introSection = root.querySelector('.about__intro')
      const introPin = root.querySelector('.about__intro-grid')
      const introHead = root.querySelector('.about__intro-head')
      const introP1 = root.querySelector('.about__intro-p1')
      const introP2 = root.querySelector('.about__intro-p2')
      const introCard = root.querySelector('.about__video-card')
      const introPlane = root.querySelector('.about__video-plate')
      const zoomTxt = zoomTextRef.current
      const zero = zoomZeroRef.current
      const fadeEls = root.querySelectorAll('.about__intro-fade')
      const manifesto = root.querySelector('.about__manifesto')
      const manifestoRule = manifesto?.querySelector('.about__rule')
      const manifestoTag = manifesto?.querySelector('.about__manifesto-tag')
      const manifestoQuote = manifesto?.querySelector('.about__manifesto-quote span')

      let zoomDrift = { x: 0, y: 0 }

      if (introSection && introPin) {
        const setZoomOrigin = () => {
          if (!zoomTxt || !zero) return
          gsap.set(zoomTxt, { scale: 1, x: 0, y: 0, opacity: 1 })
          const t = zoomTxt.getBoundingClientRect()
          const z = zero.getBoundingClientRect()
          if (!t.width || !z.width) return
          const ox = ((z.left + z.width * 0.5) - t.left) / t.width * 100
          const oy = ((z.top + z.height * 0.52) - t.top) / t.height * 100
          gsap.set(zoomTxt, { transformOrigin: `${ox.toFixed(2)}% ${oy.toFixed(2)}%` })
          const pinRect = introPin.getBoundingClientRect()
          const pivotX = z.left + z.width * 0.5
          const pivotYInPin = (z.top - pinRect.top) + z.height * 0.52
          zoomDrift = { x: window.innerWidth / 2 - pivotX, y: window.innerHeight / 2 - pivotYInPin }
        }
        setZoomOrigin()

        const parTl = gsap.timeline({
          scrollTrigger: {
            trigger: introSection,
            start: 'top top',
            end: '+=1500',
            scrub: 0.5,
            pin: introPin,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: setZoomOrigin
          }
        })
        // phase 1 — parallax
        if (introHead) parTl.to(introHead, { yPercent: -15, ease: 'none', duration: 1 }, 0)
        if (introP1) parTl.to(introP1, { yPercent: -7, ease: 'none', duration: 1 }, 0)
        if (introP2) parTl.to(introP2, { yPercent: -11, ease: 'none', duration: 1 }, 0)
        if (introCard) parTl.to(introCard, { yPercent: -16, ease: 'none', duration: 1 }, 0)

        // phase 2 — the "2013" mark takes over, zooms and fades out
        if (zoomTxt) {
          if (fadeEls.length) parTl.to(fadeEls, { opacity: 0, ease: 'power1.in', duration: 0.4 }, 1.0)
          parTl.fromTo(zoomTxt, { x: 0, y: 0 }, { x: () => zoomDrift.x, y: () => zoomDrift.y, ease: 'power2.out', duration: 0.85, force3D: true }, 1.0)
          parTl.fromTo(zoomTxt, { scale: 1 }, { scale: 35, ease: 'power3.in', duration: 1.3, force3D: true }, 1.0)
          // 2013 dissolves out as it expands past the viewport
          parTl.to(zoomTxt, { opacity: 0, ease: 'power2.out', duration: 0.45 }, 1.8)
        }

        // phase 3 — as soon as 2013 fades out, the manifesto emerges immediately (no black page)
        if (manifesto) {
          parTl.fromTo(manifesto,
            { opacity: 0, scale: 0.93, y: 25 },
            { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'power3.out' },
            1.95
          )
          if (manifestoRule) {
            parTl.fromTo(manifestoRule,
              { scaleX: 0 },
              { scaleX: 1, duration: 0.45, ease: 'power3.out' },
              2.05
            )
          }
          if (manifestoTag) {
            parTl.fromTo(manifestoTag,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
              2.1
            )
          }
          if (manifestoQuote) {
            parTl.fromTo(manifestoQuote,
              { clipPath: 'inset(0 100% 0 0)', filter: 'blur(8px)', opacity: 0 },
              { clipPath: 'inset(0 0% 0 0)', filter: 'blur(0px)', opacity: 1, duration: 0.75, ease: 'power4.out' },
              2.15
            )
          }
          // Hold the manifesto clearly in view before unpinning
          parTl.to({}, { duration: 0.7 }, 2.9)
        }

        const lines = root.querySelectorAll('.about__intro h2 > span, .about__intro p > span')
        const ent = gsap.timeline({ defaults: { overwrite: 'auto' } })
        if (lines.length) {
          ent.fromTo(lines, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 1.05, stagger: 0.055, ease: 'power3.out' }, 0)
        }
        if (introPlane) {
          ent.fromTo(introPlane, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.15, ease: 'power3.out' }, 0.35)
        }

        if (document.fonts?.ready) {
          document.fonts.ready.then(() => ScrollTrigger.refresh())
        }
      }

      // ── CREW DECK — ported 1:1 from the `deck` block, including the 3D
      // rotate/z exit and the live "0x / 04" index counter ──
      const deckSection = root.querySelector('.about__crew-deck')
      const deckPinEl = root.querySelector('.about__crew-pin')
      const cards = cardsRef.current.filter(Boolean)

      if (deckSection && cards.length) {
        gsap.set(cards, {
          zIndex: (i) => cards.length - i,
          yPercent: (i) => (i === 0 ? 0 : 100),
          rotateX: (i) => (i === 0 ? 0 : 18),
          rotateZ: 0,
          z: 0,
          opacity: (i) => (i === 0 ? 1 : 0)
        })
        const deckTl = gsap.timeline({
          scrollTrigger: {
            trigger: deckSection,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            pin: deckPinEl,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (!deckIndexRef.current) return
              const n = Math.min(cards.length, 1 + Math.floor(self.progress * cards.length * 0.999))
              deckIndexRef.current.textContent = `${String(n).padStart(2, '0')} / 04`
            }
          }
        })
        cards.forEach((card, i) => {
          if (i > 0) deckTl.to(card, { yPercent: 0, rotateX: 0, rotateZ: 0, z: 0, opacity: 1, ease: 'power2.out', duration: 1 }, i - 0.5)
          if (i < cards.length - 1) deckTl.to(card, { yPercent: -120, rotateX: -25, rotateZ: -5, z: -200, opacity: 0, ease: 'power2.in', duration: 1 }, i + 0.5)
        })
      }

      // ── PLANE ENTRANCE SETTLE — the mockup drives this off a WebGL shader
      // uniform (uProgress) via an IntersectionObserver; we don't ship
      // three.js here, so the same observer + easing/duration is used to
      // settle a blur/scale on the plate elements instead (video card,
      // founder portraits) the moment each scrolls into view. ──
      const planeEls = root.querySelectorAll('.about__video-plate, .about__portrait')
      if (planeEls.length) {
        const entered = new WeakSet()
        planeObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || entered.has(entry.target)) return
            entered.add(entry.target)
            gsap.fromTo(entry.target,
              { filter: 'blur(10px)', scale: 1.04 },
              { filter: 'blur(0px)', scale: 1, duration: 2.2, ease: 'elastic.out(1, 0.3)' })
          })
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 })
        planeEls.forEach((el) => planeObserver.observe(el))
      }

      // ── scroll reveals for the previously-static blocks (manifesto,
      // founders, FAQ, closing CTA) — a thin rule overshoots then settles,
      // headings cascade in word-by-word, and each section gets one
      // signature move (clip-path wipe / rotateZ tilt / bounce) instead of
      // a flat fade, matching the Hero and intro headline's craft ──
      const reveal = (selector, build) => {
        const el = root.querySelector(selector)
        if (!el) return
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' }
        })
        const ruleEl = el.querySelector('.about__rule')
        if (ruleEl) {
          tl.fromTo(ruleEl, { scaleX: 0 }, { scaleX: 1.15, duration: 0.4, ease: 'power3.out' })
            .to(ruleEl, { scaleX: 1, duration: 0.22, ease: 'power2.out' })
        }
        build(tl, el)
      }



      reveal('.about__founders', (tl, el) => {
        const words = el.querySelectorAll('.about__founders-title .about__mask-word')
        tl.fromTo(el.querySelector('.about__section-tag'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
          .fromTo(words, { yPercent: 112, rotate: 5 }, { yPercent: 0, rotate: 0, duration: 0.75, ease: 'power4.out', stagger: 0.025 }, '-=0.2')
          .fromTo(el.querySelectorAll('.about__founder'),
            { opacity: 0, y: 50, rotateZ: -2.5 },
            { opacity: 1, y: 0, rotateZ: 0, duration: 1, ease: 'power4.out', stagger: 0.18 },
            '-=0.35')
          .fromTo(el.querySelectorAll('.about__portrait'),
            { clipPath: 'inset(0 0 100% 0)' },
            { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.inOut', stagger: 0.18 },
            '<')
      })

      reveal('.about__cta', (tl, el) => {
        const words = el.querySelectorAll('.about__cta-heading .about__mask-word')
        tl.fromTo(el.querySelector('.about__cta-pill'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
          .fromTo(words, { yPercent: 118, rotate: 6, skewX: -6 }, { yPercent: 0, rotate: 0, skewX: 0, duration: 0.8, ease: 'power4.out', stagger: 0.03 }, '-=0.2')
          .fromTo(el.querySelector('.about__cta-arrow'), { opacity: 0, x: -10, rotate: -30 }, { opacity: 1, x: 0, rotate: 0, duration: 0.5, ease: 'back.out(2)' }, '<+=0.1')
          .fromTo(el.querySelector('.about__cta-em'), { opacity: 0, y: 10, skewX: 8 }, { opacity: 1, y: 0, skewX: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
          .fromTo(el.querySelector('.about__cta-btn'), { opacity: 0, scale: 0.8, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.55)' }, '-=0.2')
      })

      // ── CTA button: magnetic hover, matching Contact's submit button ──
      const ctaBtn = root.querySelector('.about__cta-btn')
      if (ctaBtn) {
        const onMove = (e) => {
          const r = ctaBtn.getBoundingClientRect()
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height
          gsap.to(ctaBtn, { x: dx * 14, y: dy * 10, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
        }
        const onLeave = () => gsap.to(ctaBtn, { x: 0, y: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
        ctaBtn.addEventListener('mousemove', onMove)
        ctaBtn.addEventListener('mouseleave', onLeave)
        cleanupFns.push(() => {
          ctaBtn.removeEventListener('mousemove', onMove)
          ctaBtn.removeEventListener('mouseleave', onLeave)
        })
      }
    }, ref.current)

    return () => {
      ctx.revert()
      if (planeObserver) planeObserver.disconnect()
      cleanupFns.forEach((fn) => fn())
    }
  }, [])

  return (
    <section className="about" id="about" ref={ref} aria-label="About Rockcastle">

      {/* ── INTRO — How it began, with the "2013" zoom folded in below the
          founder-film card instead of wasting a whole separate section ── */}
      <div className="about__intro">
        <div className="about__intro-grid">
          <div className="about__intro-head about__intro-fade">
            <h2 className="about__headline">
              <span className="about__headline-line">How it</span>
              <span className="about__headline-line about__headline-line--accent">
                <span className="about__headline-arrow" aria-hidden="true">↳</span>Began
              </span>
            </h2>
            <div className="about__eyebrow">EST 2013 — DUBAI, UAE</div>
          </div>
          <div className="about__intro-copy">
            <p className="about__intro-p1 about__intro-fade">
              <span>
                Rockcastle started in 2013 with a small crew and a single ambitious brief — turn a
                product launch into something people would still talk about a year later.
              </span>
            </p>
            <p className="about__intro-p2 about__intro-fade">
              <span>
                No in-house studio yet, just a conviction that experiential work deserved film-level
                craft. Twelve years and 140 activations later, that is still the whole model.
              </span>
            </p>
            <div className="about__video-card">
              <div className="placeholder placeholder--16x9 about__video-plate about__intro-fade">
                <span className="placeholder__label">FOUNDER FILM</span>
              </div>
              <span className="about__video-caption about__intro-fade">FOUNDER FILM — WATCH THE STORY</span>
              <div className="about__found-year">
                <span className="about__found-label about__intro-fade">FOUNDED —</span>
                <div className="about__zoom-number" ref={zoomTextRef}>
                  <span>2</span><span ref={zoomZeroRef}>0</span><span>1</span><span>3</span>
                </div>
              </div>
            </div>
          </div>
          {/* ── MANIFESTO — emerges seamlessly as 2013 zooms and fades out ── */}
          <div className="about__manifesto">
            <span className="about__rule about__rule--center" aria-hidden="true" />
            <span className="about__manifesto-tag">[&nbsp;NO SHORTCUTS&nbsp;]</span>
            <p className="about__manifesto-quote">
              <span>
                Nobody claps for a cable run or a rehearsal at 4am — and that is exactly where the
                night is won or lost.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ── FOUNDERS ── */}
      <div className="about__founders">
        <div className="about__founders-head">
          <span className="about__rule" aria-hidden="true" />
          <span className="about__section-tag">[&nbsp;FOUNDERS&nbsp;]</span>
          <h2 className="about__founders-title"><MaskWords text="Two people sign off on every show we put out" /></h2>
        </div>
        <div className="about__founders-grid">
          {founders.map((f) => (
            <div className="about__founder" key={f.name}>
              <div className="placeholder placeholder--tall about__portrait">
                <span className="placeholder__label">{f.label}</span>
              </div>
              <div className="about__founder-meta">
                <span className="about__founder-name">{f.name}</span>
                <span className="about__founder-tag">[&nbsp;{f.tag}&nbsp;]</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CREW / PROCESS DECK ── */}
      <div className="about__crew-deck">
        <div className="about__crew-pin">
          <div className="about__crew-top">
            <span>[&nbsp;THE CREW&nbsp;]</span>
            <span ref={deckIndexRef} className="about__crew-index">01 / 04</span>
          </div>
          <div className="about__crew-stack">
            {crewSteps.map((c, i) => (
              <div
                className={`about__crew-card about__crew-card--${i + 1}`}
                key={c.tag}
                ref={(el) => { cardsRef.current[i] = el }}
              >
                <span className="about__crew-tag">{c.tag}</span>
                <span className="about__crew-text">{c.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ── CLOSING CTA ── */}
      <div className="about__cta">
        <div className="about__cta-inner">
          <span className="about__rule" aria-hidden="true" />
          <span className="about__cta-pill">STAY IN TOUCH</span>
          <h2 className="about__cta-heading">
            <span className="about__cta-line"><MaskWords text="Let’s build" /></span>
            <span className="about__cta-line about__cta-line--accent">
              <span className="about__cta-arrow" aria-hidden="true">↳</span>
              <MaskWords text="something" /> <em className="about__cta-em">loud</em>
            </span>
          </h2>
          <a href="#contact" className="about__cta-btn">
            <span>Start a project</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
