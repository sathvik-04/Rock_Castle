import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import MediaPlaceholder from './MediaPlaceholder'
import './Services.css'

const services = [
  { num: '01', name: 'Experience Design', desc: 'We design experiences that immerse, engage, and transform. From visitor journeys to interactive installations, every touchpoint is choreographed to create lasting emotional impact.', tags: ['Visitor Experience','Interactive','Immersive','Wayfinding'] },
  { num: '02', name: 'Spatial Design', desc: 'Architecture at human scale. We shape spaces that breathe, flow, and respond. Interior architecture, spatial planning, and environmental design that puts people at the centre.', tags: ['Interior Architecture','Spatial Planning','Environmental'] },
  { num: '03', name: 'Project Delivery', desc: 'From concept through to construction handover. We manage every phase — procurement, fabrication, installation, commissioning — so the vision arrives exactly as designed.', tags: ['Project Management','Fabrication','Installation','Commissioning'] },
  { num: '04', name: 'Brand Experiences', desc: 'Brands need to be felt, not just seen. We translate brand identity into three-dimensional experiences — retail environments, showrooms, pop-ups, and activations.', tags: ['Retail','Showrooms','Pop-ups','Activations'] },
  { num: '05', name: 'Events & Exhibitions', desc: 'Stages, pavilions, exhibition stands, festival architecture. We design and deliver event environments that command attention and create unforgettable moments.', tags: ['Exhibitions','Festivals','Pavilions','Stage Design'] },
  { num: '06', name: 'Built Environments', desc: 'Permanent structures, lasting impact. We design and oversee the construction of built environments — offices, hospitality spaces, cultural venues, and urban installations.', tags: ['Offices','Hospitality','Cultural','Urban'] },
]

export default function Services() {
  const [openIdx, setOpenIdx] = useState(-1)
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.services__item', {
        y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.services__list', start: 'top 75%', toggleActions: 'play none none reverse' }
      })
    }, ref.current)
    return () => ctx.revert()
  }, [])

  const toggle = (i) => setOpenIdx(prev => prev === i ? -1 : i)

  return (
    <section className="services" id="services" ref={ref}>
      <div className="services__header">
        <div className="section-label">What We Do</div>
        <h2 className="services__title">Capabilities</h2>
      </div>
      <div className="services__list">
        {services.map((s, i) => (
          <div key={i} className={`services__item ${openIdx === i ? 'is-open' : ''}`} onClick={() => toggle(i)}>
            <div className="services__item-header">
              <div className="services__item-left">
                <span className="services__item-num">{s.num}</span>
                <h3 className="services__item-name">{s.name}</h3>
              </div>
              <div className="services__item-toggle" />
            </div>
            <div className="services__item-content">
              <div className="services__item-inner">
                <div>
                  <p className="services__item-desc">{s.desc}</p>
                  <div className="services__item-tags">
                    {s.tags.map(t => <span key={t} className="services__item-tag">{t}</span>)}
                  </div>
                </div>
                <MediaPlaceholder
                  ratio="16/9"
                  label={`${s.name.toUpperCase()} — COMING SOON`}
                  className="services__item-placeholder"
                  src="/images/services.webp"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
