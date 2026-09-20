import { useEffect } from 'react'
import gsap from 'gsap'

// Magnetic-pull hover: every element matching `selector` inside
// containerRef nudges toward the cursor while hovered and springs back on
// leave. `strength` (0-1) controls how far it follows relative to cursor
// offset from the element's own center. No-op on touch/coarse pointers and
// under prefers-reduced-motion.
export function useMagnetic(containerRef, selector, strength = 0.35) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const els = container.querySelectorAll(selector)
    const cleanups = []
    els.forEach((el) => {
      const moveX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
      const moveY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })
      const onMove = (e) => {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        moveX((e.clientX - cx) * strength)
        moveY((e.clientY - cy) * strength)
      }
      const onLeave = () => { moveX(0); moveY(0) }
      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
      })
    })
    return () => cleanups.forEach((fn) => fn())
  }, [containerRef, selector, strength])
}
