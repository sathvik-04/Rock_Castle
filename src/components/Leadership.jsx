import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SlideUpText from './ui/slide-up-text'
import './Leadership.css'

gsap.registerPlugin(ScrollTrigger)

const founders = [
  {
    name: 'Founder & MD',
    tag: 'BRIEF → STRATEGY',
    credential: '12 YRS',
    quote: 'Every brief gets interrogated until the idea can survive contact with steel and a deadline.',
    image: '/images/founder-1.webp'
  },
  {
    name: 'Head of Creative',
    tag: 'CONCEPT → BUILD',
    credential: '9 YRS',
    quote: 'A concept that only works as a rendering is not a concept — it’s a wish.',
    image: '/images/founder-2.webp'
  },
  {
    name: 'Head of Operations',
    tag: 'SITE → DELIVERY',
    credential: '10 YRS',
    quote: 'The build is only as good as the crew still standing in the venue at load-in.',
    image: '/images/founder-1.webp'
  },
]

export default function Leadership() {
  const ref = useRef(null)
  const foundersGridRef = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // ── 1. Founders Section Reveal — clip-path mask cards + credential pop ──
      const cards = root.querySelectorAll('.leadership__founder')
      const portraits = root.querySelectorAll('.leadership__portrait-wrap')
      const credentials = root.querySelectorAll('.leadership__credential')
      const metas = root.querySelectorAll('.leadership__meta')

      if (cards.length) {
        const fTl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        })

        fTl.fromTo(cards,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' }
        )
          .fromTo(portraits,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, stagger: 0.12, ease: 'power4.out' },
            '<'
          )
          .fromTo(metas,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' },
            '<+0.25'
          )
          .fromTo(credentials,
            { opacity: 0, scale: 0.4 },
            { opacity: 1, scale: 1, duration: 0.45, stagger: 0.12, ease: 'back.out(2.2)' },
            '<+0.15'
          )

        if (!reduced) {
          portraits.forEach((pWrap) => {
            const img = pWrap.querySelector('img')
            if (img) {
              gsap.fromTo(img,
                { yPercent: -8, scale: 1.12 },
                {
                  yPercent: 8,
                  scale: 1.12,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: pWrap,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                  }
                }
              )
            }
          })
        }
      }

      // ── 2. Mouse Parallax on Images (Desktop only) ──
      if (finePointer && !reduced) {
        const parallaxImages = root.querySelectorAll('.leadership__parallax-target')
        const handlers = []

        parallaxImages.forEach((imgWrap) => {
          const quickX = gsap.quickTo(imgWrap, 'x', { duration: 0.4, ease: 'power3.out' })
          const quickY = gsap.quickTo(imgWrap, 'y', { duration: 0.4, ease: 'power3.out' })

          const handleMouseMove = (e) => {
            const rect = imgWrap.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const deltaX = (e.clientX - centerX) / (rect.width / 2)
            const deltaY = (e.clientY - centerY) / (rect.height / 2)
            quickX(deltaX * 12)
            quickY(deltaY * 12)
          }

          const handleMouseLeave = () => {
            quickX(0)
            quickY(0)
          }

          imgWrap.addEventListener('mousemove', handleMouseMove)
          imgWrap.addEventListener('mouseleave', handleMouseLeave)
          handlers.push({ imgWrap, handleMouseMove, handleMouseLeave })
        })

        return () => {
          handlers.forEach(({ imgWrap, handleMouseMove, handleMouseLeave }) => {
            imgWrap.removeEventListener('mousemove', handleMouseMove)
            imgWrap.removeEventListener('mouseleave', handleMouseLeave)
          })
        }
      }
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section className="leadership" id="leadership" ref={ref} aria-label="Leadership / Rockcastle">
      <div className="leadership__inner">
        <div className="leadership__head">
          <span className="leadership__rule" aria-hidden="true" />
          <SlideUpText
            split="characters"
            stagger={0.02}
            inView={true}
            once={true}
            className="leadership__tag"
          >
            [&nbsp;LEADERSHIP&nbsp;]
          </SlideUpText>
          <h2 className="leadership__title">
            <SlideUpText
              split="words"
              stagger={0.03}
              inView={true}
              once={true}
            >
              Three leads personally sign off on every activation we build
            </SlideUpText>
          </h2>
        </div>

        <div className="leadership__grid" ref={foundersGridRef}>
          {founders.map((f) => (
            <div className="leadership__founder" key={f.name}>
              <div className="leadership__parallax-target">
                <div className="leadership__portrait-wrap">
                  <img src={f.image} alt={f.name} className="leadership__portrait-img" />
                  <div className="leadership__portrait-overlay" />
                  <span className="leadership__credential">{f.credential}</span>
                  <div className="leadership__quote">
                    <p>&ldquo;{f.quote}&rdquo;</p>
                  </div>
                </div>
              </div>
              <div className="leadership__meta">
                <SlideUpText split="words" stagger={0.03} inView={true} once={true} className="leadership__name">
                  {f.name}
                </SlideUpText>
                <SlideUpText split="characters" stagger={0.02} inView={true} once={true} className="leadership__founder-tag">
                  {`[ ${f.tag} ]`}
                </SlideUpText>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
