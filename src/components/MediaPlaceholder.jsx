import { forwardRef } from 'react'
import './MediaPlaceholder.css'

// Generative, code-only stand-in for real project photography/video.
// Swap for a real <img>/<video> later — just drop it in place of this
// component (or inside the same wrapper) once assets exist.
//
// Forwards its ref and passes through className/style/...rest so it can
// slot into any existing GSAP ref target, querySelector('.some-class')
// hook, or layout wrapper without touching that integration.
const MediaPlaceholder = forwardRef(function MediaPlaceholder(
  { label = 'MEDIA — COMING SOON', ratio = '16/9', className = '', style, src, video, alt = '', ...rest },
  ref
) {
  const hasMedia = Boolean(src || video)
  const classes = ['media-placeholder', hasMedia && 'media-placeholder--media', className].filter(Boolean).join(' ')
  const mergedStyle = ratio ? { aspectRatio: ratio, ...style } : style

  return (
    <div ref={ref} className={classes} style={mergedStyle} {...rest}>
      {video ? (
        <video className="media-placeholder__media" src={video} autoPlay loop muted playsInline aria-label={alt || label} />
      ) : src ? (
        <img className="media-placeholder__media" src={src} alt={alt || label} loading="lazy" decoding="async" />
      ) : null}
      <span className="media-placeholder__corner media-placeholder__corner--tl" aria-hidden="true" />
      <span className="media-placeholder__corner media-placeholder__corner--tr" aria-hidden="true" />
      <span className="media-placeholder__corner media-placeholder__corner--bl" aria-hidden="true" />
      <span className="media-placeholder__corner media-placeholder__corner--br" aria-hidden="true" />
      <span className="media-placeholder__caption">{label}</span>
    </div>
  )
})

export default MediaPlaceholder
