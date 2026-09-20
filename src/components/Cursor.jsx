import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './Cursor.css'

const HOVER_SELECTOR = 'a, button, [role="button"], input, textarea, .cursor-hover'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    document.body.classList.add('has-custom-cursor')

    const dot = dotRef.current
    const ring = ringRef.current
    const moveDot = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' })
    const moveDotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' })
    const moveRing = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3.out' })
    const moveRingY = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3.out' })

    const onMove = (e) => {
      moveDot(e.clientX)
      moveDotY(e.clientY)
      moveRing(e.clientX)
      moveRingY(e.clientY)
    }

    // Delegated on document (not bound per-element) so it keeps working across
    // route changes and dynamically rendered content (FAQ accordion, case studies).
    const onOverDelegated = (e) => { if (e.target.closest(HOVER_SELECTOR)) ring.classList.add('cursor__ring--hover') }
    const onOutDelegated = (e) => { if (e.target.closest(HOVER_SELECTOR)) ring.classList.remove('cursor__ring--hover') }
    const onDown = () => ring.classList.add('cursor__ring--down')
    const onUp = () => ring.classList.remove('cursor__ring--down')
    const onLeaveWindow = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 })
    const onEnterWindow = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 })

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseover', onOverDelegated)
    document.addEventListener('mouseout', onOutDelegated)
    document.addEventListener('mouseleave', onLeaveWindow)
    document.addEventListener('mouseenter', onEnterWindow)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', onOverDelegated)
      document.removeEventListener('mouseout', onOutDelegated)
      document.removeEventListener('mouseleave', onLeaveWindow)
      document.removeEventListener('mouseenter', onEnterWindow)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor__dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor__ring" aria-hidden="true" />
    </>
  )
}
