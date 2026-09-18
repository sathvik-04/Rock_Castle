import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './About.css'

const statsData = [
  { target: 140, suffix: '+', label: 'Projects\nDelivered', code: 'METRIC // 01' },
  { target: 12, suffix: '', label: 'Years of\nExperience', code: 'METRIC // 02' },
  { target: 85, suffix: '+', label: 'Clients &\nPartners', code: 'METRIC // 03' },
  { target: 24, suffix: '', label: 'Locations\nWorldwide', code: 'METRIC // 04' },
]

function StatCard({ stat, index, registerTrigger }) {
  const [displayValue, setDisplayValue] = useState('--')
  const [isScrambling, setIsScrambling] = useState(false)
  const cardRef = useRef(null)
  const timerRef = useRef(null)

  const runScramble = useCallback((duration = 1300) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsScrambling(true)

    const startTime = Date.now()
    const target = stat.target
    const suffix = stat.suffix
    const isThreeDigits = target >= 100

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(1, elapsed / duration)

      if (progress < 0.7) {
        // High-velocity random numbers phase
        const rand = isThreeDigits
          ? Math.floor(Math.random() * 900) + 100
          : Math.floor(Math.random() * 90) + 10
        setDisplayValue(`${rand}${suffix}`)
      } else if (progress < 0.92) {
        // Converging random numbers phase (near target)
        const jitter = Math.floor((1 - progress) * 20)
        const near = Math.max(1, target + (Math.random() > 0.5 ? jitter : -jitter))
        setDisplayValue(`${near}${suffix}`)
      } else {
        // Lock to final value
        clearInterval(timerRef.current)
        timerRef.current = null
        setDisplayValue(`${target}${suffix}`)
        setIsScrambling(false)
      }
    }, 35)
  }, [stat.target, stat.suffix])

  useEffect(() => {
    if (cardRef.current && registerTrigger) {
      registerTrigger(cardRef.current, () => {
        // Staggered trigger based on index
        setTimeout(() => {
          runScramble(1200 + index * 180)
        }, index * 120)
      })
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [registerTrigger, runScramble, index])

  const handleMouseEnter = () => {
    if (!isScrambling) {
      runScramble(650)
    }
  }

  return (
    <div
      ref={cardRef}
      className={`about__stat ${isScrambling ? 'is-scrambling' : ''}`}
      onMouseEnter={handleMouseEnter}
      onClick={handleMouseEnter}
      role="button"
      tabIndex={0}
      aria-label={`${stat.target}${stat.suffix} ${stat.label.replace('\n', ' ')}`}
    >
      <div className="about__stat-top">
        <span className="about__stat-code">{stat.code}</span>
        <span className={`about__stat-dot ${isScrambling ? 'is-active' : ''}`} />
      </div>
      <div className="about__stat-number">
        <span className="about__stat-val">{displayValue}</span>
        {isScrambling && <span className="about__stat-ticker-cursor" />}
      </div>
      <div className="about__stat-label">{stat.label}</div>
    </div>
  )
}

export default function About() {
  const ref = useRef(null)
  const triggersRef = useRef([])

  const registerTrigger = useCallback((element, callback) => {
    triggersRef.current.push({ element, callback })
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline reveal
      gsap.from('.about__statement-text', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about__statement',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      })

      // Register ScrollTriggers for each stat card
      triggersRef.current.forEach(({ element, callback }) => {
        ScrollTrigger.create({
          trigger: element,
          start: 'top 82%',
          once: true,
          onEnter: () => {
            element.classList.add('is-visible')
            callback()
          }
        })
      })

      // Bottom description and clients list reveal
      gsap.from('.about__bottom', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about__bottom',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      })
    }, ref.current)

    return () => ctx.revert()
  }, [])

  return (
    <section className="about" id="about" ref={ref} aria-label="About Rockcastle">
      <div className="about__container">
        <div className="about__statement">
          <div className="about__statement-tag">// PROVEN IMPACT</div>
          <h2 className="about__statement-text">
            Look at what we've <span>built</span>.
          </h2>
        </div>

        <div className="about__stats">
          {statsData.map((stat, i) => (
            <StatCard
              key={i}
              stat={stat}
              index={i}
              registerTrigger={registerTrigger}
            />
          ))}
        </div>

        <div className="about__bottom">
          <p className="about__bottom-text">
            Rockcastle is an architecture, experiential and spatial design studio. We create environments that move people — physically and emotionally. From concept to construction, we handle the entire journey. No shortcuts. No compromises.
          </p>
          <div>
            <div className="about__clients-label">Trusted by</div>
            <div className="about__clients-list">
              {['Global Corp', 'Meridian Group', 'Apex Studios', 'Nova Events', 'Vault Architecture', 'Summit Partners'].map(c => (
                <span key={c} className="about__client">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
