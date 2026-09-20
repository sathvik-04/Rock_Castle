import { createContext, useContext } from 'react'

export const TransitionCtx = createContext(null)

export function usePageTransition() {
  return useContext(TransitionCtx)
}

// Drop-in onClick handler for react-router <Link>: preserves modified
// clicks (new tab / new window / middle-click) as native navigation, and
// only intercepts a plain left-click to run the curtain first.
export function transitionClick(e, transitionTo, path) {
  if (!transitionTo || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  transitionTo(path)
}
