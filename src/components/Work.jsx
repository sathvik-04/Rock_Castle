import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/projects'
import { usePageTransition, transitionClick } from '../hooks/usePageTransition'
import './Work.css'

export default function Work() {
  const ref = useRef(null)
  const transitionTo = usePageTransition()

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cleanupFns = []

    const ctx = gsap.context(() => {
      // ── Clean transition header reveal ──
      gsap.fromTo('.work__header-wrap',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.work__header-wrap',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // ── Project cards entry stagger ──
      const cards = root.querySelectorAll('.work__card')
      cards.forEach((card, index) => {
        gsap.fromTo(card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay: index * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )

        // Mouse tilt and subtle interactive zoom
        if (fine && !reduced) {
          const img = card.querySelector('.work__card-img')
          const quickTiltX = gsap.quickTo(img, 'rotationX', { duration: 0.5, ease: 'power3.out' })
          const quickTiltY = gsap.quickTo(img, 'rotationY', { duration: 0.5, ease: 'power3.out' })
          const quickScale = gsap.quickTo(img, 'scale', { duration: 0.4, ease: 'power3.out' })

          const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect()
            const px = (e.clientX - rect.left) / rect.width - 0.5
            const py = (e.clientY - rect.top) / rect.height - 0.5
            quickTiltX(py * -6)
            quickTiltY(px * 6)
          }

          const handleMouseEnter = () => quickScale(1.04)
          const handleMouseLeave = () => {
            quickTiltX(0)
            quickTiltY(0)
            quickScale(1)
          }

          card.addEventListener('mousemove', handleMouseMove)
          card.addEventListener('mouseenter', handleMouseEnter)
          card.addEventListener('mouseleave', handleMouseLeave)

          cleanupFns.push(() => {
            card.removeEventListener('mousemove', handleMouseMove)
            card.removeEventListener('mouseenter', handleMouseEnter)
            card.removeEventListener('mouseleave', handleMouseLeave)
          })
        }
      })

      // ── Bottom Quote & Button Reveal ──
      gsap.fromTo('.work__footer-block',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.work__footer-block',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, root)

    return () => {
      ctx.revert()
      cleanupFns.forEach((fn) => fn())
    }
  }, [])

  return (
    <section className="work" id="work" ref={ref} aria-label="Selected Works">
      {/* Clean Transition Area After Signature */}
      <div className="work__transition-buffer" aria-hidden="true" />

      <div className="work__container">
        {/* Editorial Section Header */}
        <div className="work__header-wrap">
          <div className="work__meta-tag">[&nbsp;SELECTED PORTFOLIO&nbsp;]</div>
          <div className="work__header-row">
            <h2 className="work__title">
              <span>Featured</span>
              <span className="work__title--accent">Projects.</span>
            </h2>
            <p className="work__subtitle">
              Every build is bespoke. Every spatial experience is engineered to command attention and endure in memory.
            </p>
          </div>
        </div>

        {/* 4-Project Editorial Card Grid (Occupies ~40-50% Viewport Area) */}
        <div className="work__grid">
          {projects.slice(0, 4).map((p, i) => (
            <Link
              key={p.slug}
              to={`/work/${p.slug}`}
              className="work__card"
              onClick={(e) => transitionClick(e, transitionTo, `/work/${p.slug}`)}
            >
              <div className="work__card-visual">
                <img src={p.image} alt={p.name} className="work__card-img" />
                <div className="work__card-overlay" />
                <span className="work__card-index">0{i + 1}</span>
                <div className="work__card-view-badge">
                  <span>VIEW CASE STUDY</span>
                  <span className="work__badge-arrow">↗</span>
                </div>
              </div>

              <div className="work__card-body">
                <div className="work__card-meta">
                  <span className="work__card-cat">{p.catLabel}</span>
                  <span className="work__card-dot">·</span>
                  <span className="work__card-client">{p.client}</span>
                  <span className="work__card-year">{p.year}</span>
                </div>
                <h3 className="work__card-title">{p.name}</h3>
                <p className="work__card-desc">{p.tagline}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quote & "SHOW ALL PROJECTS" Button */}
        <div className="work__footer-block">
          <blockquote className="work__quote">
            &ldquo;We don’t believe in temporary structures that feel disposable. If it commands human time, it demands architectural permanence.&rdquo;
          </blockquote>

          <div className="work__cta-wrap">
            <a
              href="#contact"
              className="work__show-all-btn"
              onClick={(e) => {
                e.preventDefault()
                const el = document.querySelector('#contact')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span className="work__btn-text">SHOW ALL PROJECTS</span>
              <span className="work__btn-icon">
                <span className="work__btn-arrow">→</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
