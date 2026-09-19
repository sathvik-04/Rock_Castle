import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/projects'
import './Work.css'

export default function Work() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = ref.current.querySelectorAll('.work__project')
      items.forEach(p => {
        const placeholder = p.querySelector('.work__placeholder')
        if (placeholder) {
          gsap.fromTo(placeholder, { scale: 1.02 }, {
            scale: 1, ease: 'none',
            scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true }
          })
        }
        const info = p.querySelector('.work__info')
        if (info) {
          gsap.from(info, {
            y: 40, opacity: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: p, start: 'top 70%', toggleActions: 'play none none reverse' }
          })
        }
      })
    }, ref.current)
    return () => ctx.revert()
  }, [])

  return (
    <section className="work" id="work" ref={ref}>
      <div className="work__projects">
        {projects.map((p) => (
          <Link key={p.slug} to={`/work/${p.slug}`} className="work__project" data-category={p.category}>
            <div className="work__placeholder-wrap">
              <div className="placeholder placeholder--16x9 work__placeholder">
                <span className="placeholder__label">{p.placeholder}</span>
              </div>
              <div className="work__overlay" />
            </div>
            <div className="work__info">
              <div>
                <h3 className="work__name">{p.name}</h3>
                <p className="work__desc">{p.tagline}</p>
              </div>
              <div className="work__meta">
                <span className="work__cat">{p.catLabel}</span>
                <span className="work__year">{p.year}</span>
                <div className="work__arrow">
                  <span>View Project</span>
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 10h12M12 6l4 4-4 4"/></svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
