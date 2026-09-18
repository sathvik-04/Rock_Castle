import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Work.css'

const projects = [
  {
    name: 'The Pavilion',
    desc: 'An immersive brand pavilion that redefined visitor experience across 2,400 square metres.',
    category: 'experience',
    year: '2024',
    catLabel: 'Experience Design',
    placeholder: '[ PROJECT IMAGE ]'
  },
  {
    name: 'Meridian Tower',
    desc: 'Corporate headquarters transformed into a living, breathing spatial narrative.',
    category: 'spatial',
    year: '2023',
    catLabel: 'Spatial Design',
    placeholder: '[ PROJECT IMAGE ]'
  },
  {
    name: 'Horizon Festival',
    desc: 'A three-day experiential brand activation fusing architecture, light, and sound.',
    category: 'brand',
    year: '2024',
    catLabel: 'Brand Experience',
    placeholder: '[ PROJECT VIDEO ]'
  },
]

export default function Work() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const projects = ref.current.querySelectorAll('.work__project')
      projects.forEach(p => {
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
      <div className="work__header">
        <h2 className="work__title">
          <span className="work__label">Selected Projects</span>
          Our Work
        </h2>
      </div>
      <div className="work__projects">
        {projects.map((p, i) => (
          <article key={i} className="work__project" data-category={p.category}>
            <div className="work__placeholder-wrap">
              <div className="placeholder placeholder--16x9 work__placeholder">
                <span className="placeholder__label">{p.placeholder}</span>
              </div>
              <div className="work__overlay" />
            </div>
            <div className="work__info">
              <div>
                <h3 className="work__name">{p.name}</h3>
                <p className="work__desc">{p.desc}</p>
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
          </article>
        ))}
      </div>
    </section>
  )
}
