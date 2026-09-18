import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Contact.css'

export default function Contact() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact__cta-label', {
        y: 20, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 70%', toggleActions: 'play none none reverse' }
      })
      gsap.from('.contact__cta-text', {
        y: 60, opacity: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact__cta', start: 'top 70%', toggleActions: 'play none none reverse' }
      })
      gsap.from('.contact__btn', {
        y: 20, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact__buttons', start: 'top 85%', toggleActions: 'play none none reverse' }
      })
      gsap.from('.contact__detail', {
        y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact__details', start: 'top 85%', toggleActions: 'play none none reverse' }
      })
    }, ref.current)
    return () => ctx.revert()
  }, [])

  return (
    <section className="contact" id="contact" ref={ref}>
      <div className="contact__content">
        <div className="contact__cta">
          <div className="contact__cta-label">Ready?</div>
          <h2 className="contact__cta-text">Let's Build <span>Something</span>.</h2>
        </div>
        <div className="contact__buttons">
          <a href="mailto:hello@rockcastle.com" className="contact__btn contact__btn--primary">
            <span>Let's Talk</span>
          </a>
          <a href="https://wa.me/1234567890" className="contact__btn contact__btn--outline" target="_blank" rel="noopener noreferrer">
            <span>WhatsApp</span>
          </a>
        </div>
        <div className="contact__details">
          <div className="contact__detail">
            <div className="contact__detail-label">Email</div>
            <a href="mailto:hello@rockcastle.com" className="contact__detail-value">hello@rockcastle.com</a>
          </div>
          <div className="contact__detail">
            <div className="contact__detail-label">WhatsApp</div>
            <a href="https://wa.me/1234567890" className="contact__detail-value" target="_blank" rel="noopener noreferrer">+1 (234) 567-890</a>
          </div>
          <div className="contact__detail">
            <div className="contact__detail-label">Location</div>
            <span className="contact__detail-value">Dubai, UAE</span>
          </div>
        </div>
        <div className="contact__social">
          {['Instagram','LinkedIn','Behance'].map(s => (
            <a key={s} href="#" className="contact__social-link" target="_blank" rel="noopener noreferrer">{s}</a>
          ))}
        </div>
      </div>
    </section>
  )
}
