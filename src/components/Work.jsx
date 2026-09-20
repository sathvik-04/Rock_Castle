import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { projects } from '../data/projects'
import MediaPlaceholder from './MediaPlaceholder'
import { usePageTransition, transitionClick } from '../hooks/usePageTransition'
import './Work.css'

export default function Work() {
  const ref = useRef(null)
  const transitionTo = usePageTransition()

  useEffect(() => {
    const cleanupFns = []
    const ctx = gsap.context(() => {
      const items = ref.current.querySelectorAll('.work__project')
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

        // Cursor-reactive tilt on the image plate — a subtle 3D parallax
        // that follows the pointer instead of a flat hover state.
        if (fine && !reduced && placeholder) {
          p.style.perspective = '1000px'
          const rotateX = gsap.quickTo(placeholder, 'rotationX', { duration: 0.5, ease: 'power3.out' })
          const rotateY = gsap.quickTo(placeholder, 'rotationY', { duration: 0.5, ease: 'power3.out' })
          const scale = gsap.quickTo(placeholder, 'scale', { duration: 0.4, ease: 'power3.out' })
          const onMove = (e) => {
            const rect = p.getBoundingClientRect()
            const px = (e.clientX - rect.left) / rect.width - 0.5
            const py = (e.clientY - rect.top) / rect.height - 0.5
            rotateX(py * -8)
            rotateY(px * 8)
          }
          const onEnter = () => scale(1.03)
          const onLeave = () => { rotateX(0); rotateY(0); scale(1) }
          p.addEventListener('mousemove', onMove)
          p.addEventListener('mouseenter', onEnter)
          p.addEventListener('mouseleave', onLeave)
          cleanupFns.push(() => {
            p.removeEventListener('mousemove', onMove)
            p.removeEventListener('mouseenter', onEnter)
            p.removeEventListener('mouseleave', onLeave)
          })
        }
      })
    }, ref.current)
    return () => {
      ctx.revert()
      cleanupFns.forEach((fn) => fn())
    }
  }, [])

  return (
    <section className="work" id="work" ref={ref}>
      <div className="work__head">
        <span className="work__label">// SELECTED WORK</span>
        <h2 className="work__title">Projects</h2>
      </div>
      <div className="work__projects">
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            to={`/work/${p.slug}`}
            className="work__project"
            data-category={p.category}
            onClick={(e) => transitionClick(e, transitionTo, `/work/${p.slug}`)}
          >
            <div className="work__project-head">
              <span className="work__index">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="work__name">{p.name}</h3>
            </div>
            <div className="work__placeholder-wrap">
              <MediaPlaceholder ratio="16/9" label={p.placeholder} className="work__placeholder" src={p.image} />
            </div>
            <div className="work__info">
              <p className="work__desc">{p.tagline}</p>
              <div className="work__row">
                <div className="work__meta">
                  <span className="work__cat">{p.catLabel}</span>
                  <span className="work__divider" aria-hidden="true" />
                  <span className="work__year">{p.year}</span>
                </div>
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
