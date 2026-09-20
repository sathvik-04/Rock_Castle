import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { TransitionCtx } from '../hooks/usePageTransition'
import './PageTransition.css'

// A single fixed panel, pinned at the top edge (transform-origin: top).
// "Cover": scaleY 0→1 grows down from the top and hides the outgoing page.
// Navigation happens the instant it's fully covered, then "reveal": scaleY
// 1→0 shrinks back toward the top, uncovering the new page from the bottom
// up. Because the origin never changes, the panel's bottom edge is always
// the moving edge in both phases — a single border-bottom reads as one
// continuous traveling accent line across the whole cut.
export function PageTransitionProvider({ children }) {
  const panelRef = useRef(null)
  const navigate = useNavigate()
  const busyRef = useRef(false)

  const transitionTo = useCallback((path) => {
    if (busyRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      navigate(path)
      return
    }
    busyRef.current = true
    gsap.to(panelRef.current, {
      scaleY: 1,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        navigate(path)
        // Two rAFs: the first lets React commit the new route, the second
        // guarantees a paint has happened before we start uncovering it —
        // without this the reveal can start over the still-blank/old frame.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            gsap.to(panelRef.current, {
              scaleY: 0,
              duration: 0.7,
              delay: 0.05,
              ease: 'power4.inOut',
              onComplete: () => { busyRef.current = false }
            })
          })
        })
      }
    })
  }, [navigate])

  return (
    <TransitionCtx.Provider value={transitionTo}>
      <div ref={panelRef} className="page-transition" aria-hidden="true" />
      {children}
    </TransitionCtx.Provider>
  )
}
