import { useEffect, useRef } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getProjectBySlug, getAdjacentProject } from '../data/projects'
import MediaPlaceholder from './MediaPlaceholder'
import { usePageTransition, transitionClick } from '../hooks/usePageTransition'
import './CaseStudy.css'

// Shared image pool (the same photos used across Hero/Work/Services/Process)
// rotated per shot index so each project's detail grid shows real photography
// instead of a bare label, without needing a unique photo per named shot.
const SHOT_IMAGES = [
  '/images/work-01.webp', '/images/work-02.webp', '/images/work-03.webp',
  '/images/hero-reel.webp', '/images/services.webp', '/images/process.webp',
  '/images/signature-01.webp', '/images/about-intro.webp',
]

function Reveal({ children, className = '', ...rest }) {
  return (
    <div className={`case-reveal ${className}`} {...rest}>
      {children}
    </div>
  )
}

export default function CaseStudy() {
  const { slug } = useParams()
  const ref = useRef(null)
  const project = getProjectBySlug(slug)
  const next = project ? getAdjacentProject(slug) : null
  const transitionTo = usePageTransition()

  useEffect(() => {
    if (!project || !ref.current) return
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const els = ref.current.querySelectorAll('.case-reveal')
      els.forEach((el) => {
        if (reduced) {
          gsap.set(el, { opacity: 1, y: 0 })
          return
        }
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
          }
        )
      })
      ScrollTrigger.refresh()
    }, ref.current)
    return () => ctx.revert()
    // slug is the real dependency (project/next are derived from it each render)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  if (!project) return <Navigate to="/" replace />

  return (
    <div className="case-study" ref={ref}>
      <header className="case-header">
        <Link to="/" className="case-header__logo" onClick={(e) => transitionClick(e, transitionTo, '/')}>ROCKCASTLE</Link>
        <Link to="/#work" className="case-header__back" onClick={(e) => transitionClick(e, transitionTo, '/#work')}>← Back to Work</Link>
      </header>

      <section className="case-hero">
        <span className="case-hero__eyebrow">CASE STUDY — {project.catLabel}</span>
        <h1 className="case-hero__title">{project.name}</h1>
        <p className="case-hero__tagline">{project.tagline}</p>
        <div className="case-hero__meta">
          <div><span>Client</span><strong>{project.client}</strong></div>
          <div><span>Year</span><strong>{project.year}</strong></div>
          <div><span>Location</span><strong>{project.location}</strong></div>
          <div><span>Category</span><strong>{project.catLabel}</strong></div>
        </div>
        <Reveal>
          <MediaPlaceholder ratio="16/9" label={project.placeholder} className="case-hero__image" src={project.image} />
        </Reveal>
      </section>

      <section className="case-block">
        <Reveal className="case-block__row">
          <span className="case-block__num">01</span>
          <div className="case-block__body">
            <h2 className="case-block__title">The Brief</h2>
            <p className="case-block__text">{project.brief}</p>
          </div>
        </Reveal>
      </section>

      <section className="case-block case-block--alt">
        <Reveal className="case-block__row">
          <span className="case-block__num">02</span>
          <div className="case-block__body">
            <h2 className="case-block__title">The Idea</h2>
            <p className="case-block__text">{project.idea}</p>
          </div>
        </Reveal>
      </section>

      <section className="case-block">
        <Reveal className="case-block__row">
          <span className="case-block__num">03</span>
          <div className="case-block__body">
            <h2 className="case-block__title">The Design</h2>
            <p className="case-block__text">{project.design}</p>
          </div>
        </Reveal>
        <Reveal className="case-grid">
          {project.shots.map((label, i) => (
            <MediaPlaceholder
              key={label}
              ratio="4/3"
              label={label}
              className="case-grid__item"
              src={SHOT_IMAGES[(i + project.slug.length) % SHOT_IMAGES.length]}
            />
          ))}
        </Reveal>
      </section>

      <Reveal className="case-stats">
        {project.stats.map((s) => (
          <div key={s.label} className="case-stats__item">
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </Reveal>

      <section className="case-block case-block--alt">
        <Reveal className="case-block__row">
          <span className="case-block__num">04</span>
          <div className="case-block__body">
            <h2 className="case-block__title">The Result</h2>
            <p className="case-block__text case-block__text--pull">{project.result}</p>
          </div>
        </Reveal>
      </section>

      <Link to={`/work/${next.slug}`} className="case-next" onClick={(e) => transitionClick(e, transitionTo, `/work/${next.slug}`)}>
        <span className="case-next__label">Next Project</span>
        <span className="case-next__name">{next.name} →</span>
      </Link>
    </div>
  )
}
