import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './Loader.css'

const SESSION_KEY = 'rc-intro-seen'

export default function Loader() {
  const [active] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) !== '1'
    } catch {
      return true
    }
  })
  const [done, setDone] = useState(!active)
  const rootRef = useRef(null)
  const countRef = useRef(null)
  const barRef = useRef(null)

  useEffect(() => {
    if (!active) {
      window.__RC_LOADER_DONE__ = true
      window.dispatchEvent(new CustomEvent('rc-loader-done'))
      return
    }
    try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* private mode */ }

    document.documentElement.classList.add('is-loading')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const counter = { value: 0 }
    const finish = () => {
      document.documentElement.classList.remove('is-loading')
      gsap.timeline({
        onComplete: () => {
          setDone(true)
          window.__RC_LOADER_DONE__ = true
          window.dispatchEvent(new CustomEvent('rc-loader-done'))
        }
      })
        .to(barRef.current, { scaleX: 1, duration: 0.2, ease: 'power2.out' })
        .to(rootRef.current, {
          yPercent: -100,
          duration: reduced ? 0.01 : 0.85,
          ease: 'expo.inOut',
          onStart: () => {
            window.dispatchEvent(new CustomEvent('rc-loader-lifting'))
          }
        }, '+=0.15')
    }

    if (reduced) {
      finish()
      return
    }

    const tl = gsap.timeline({ delay: 0.2, onComplete: finish })
    tl.to(counter, {
      value: 100,
      duration: 1.3,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (countRef.current) countRef.current.textContent = String(Math.round(counter.value)).padStart(3, '0')
        if (barRef.current) gsap.set(barRef.current, { scaleX: counter.value / 100 })
      }
    })

    return () => tl.kill()
  }, [active])

  if (done) return null

  return (
    <div ref={rootRef} className="loader" role="status" aria-label="Loading">
      <div className="loader__mark">ROCKCASTLE</div>
      <div className="loader__meta">
        <span ref={countRef} className="loader__count">000</span>
        <span className="loader__label">Experiences Un-Ltd.</span>
      </div>
      <div className="loader__track">
        <div ref={barRef} className="loader__bar" />
      </div>
    </div>
  )
}
