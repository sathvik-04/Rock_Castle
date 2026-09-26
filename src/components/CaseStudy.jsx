import { useEffect, useRef, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getProjectBySlug, getAdjacentProject } from '../data/projects'
import MediaPlaceholder from './MediaPlaceholder'
import { usePageTransition, transitionClick } from '../hooks/usePageTransition'
import './CaseStudy.css'

function Reveal({ children, className = '', ...rest }) {
  return (
    <div className={`case-reveal ${className}`} {...rest}>
      {children}
    </div>
  )
}

function ProjectVideoPlayer({ src, poster, title }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setIsMuted(videoRef.current.muted)
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current || !videoRef.current.duration) return
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100)
  }

  const handleSeek = (e) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = pos * videoRef.current.duration
    }
  }

  const toggleFullscreen = (e) => {
    e.stopPropagation()
    if (!videoRef.current) return
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen()
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen()
    }
  }

  return (
    <div className="case-video-card" onClick={togglePlay}>
      <div className="case-video-container">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          loop
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="case-video-element"
        />

        {!isPlaying && (
          <div className="case-video-overlay">
            <div className="case-video-play-btn" aria-label="Play Video">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <span className="case-video-play-text">Click to Play Cinematic Reel</span>
          </div>
        )}
      </div>

      <div className="case-video-bar" onClick={(e) => e.stopPropagation()}>
        <div className="case-video-meta">
          <span className="case-video-badge">4K CINEMA</span>
          <span className="case-video-title">{title || 'Architectural Cinematography'}</span>
        </div>
        <div className="case-video-controls">
          <button
            type="button"
            onClick={togglePlay}
            className="case-video-ctrl-btn"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>

          <div className="case-video-scrub" onClick={handleSeek}>
            <div className="case-video-scrub-fill" style={{ width: `${progress}%` }} />
          </div>

          <button
            type="button"
            onClick={toggleMute}
            className="case-video-ctrl-btn"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="case-video-ctrl-btn"
            aria-label="Fullscreen"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CaseStudy() {
  const { slug } = useParams()
  const ref = useRef(null)
  const project = getProjectBySlug(slug)
  const next = project ? getAdjacentProject(slug) : null
  const transitionTo = usePageTransition()
  const [activeMedia, setActiveMedia] = useState(null)

  useEffect(() => {
    if (!project || !ref.current) return
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const els = ref.current.querySelectorAll('.case-reveal')
      els.forEach((el) => {
        if (reduced) {
          gsap.set(el, { opacity: 1, y: 0 })
          return
        }
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
          }
        )
      })
      ScrollTrigger.refresh()
    }, ref.current)
    return () => ctx.revert()
  }, [slug, project])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveMedia(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!project) return <Navigate to="/made-by-rock-castle" replace />

  const galleryItems = project.gallery || [
    { type: 'image', src: project.image, title: `${project.name} — Architecture`, caption: 'Primary perspective and environmental context.' },
    { type: 'video', src: project.video || '/video1.mp4', title: `${project.name} — Motion Reel`, caption: 'Spatial walkthrough and lighting choreography.' }
  ]

  return (
    <div className="case-study" ref={ref}>
      <header className="case-header">
        <Link to="/" className="case-header__logo" onClick={(e) => transitionClick(e, transitionTo, '/')}>
          ROCKCASTLE
        </Link>
        <div className="case-header__actions">
          <Link
            to="/made-by-rock-castle"
            className="case-header__back"
            onClick={(e) => transitionClick(e, transitionTo, '/made-by-rock-castle')}
          >
            ← Back to Dome Gallery
          </Link>
          <Link
            to="/#work"
            className="case-header__sublink"
            onClick={(e) => transitionClick(e, transitionTo, '/#work')}
          >
            All Work
          </Link>
        </div>
      </header>

      <section className="case-hero">
        <span className="case-hero__eyebrow">CASE STUDY — {project.catLabel}</span>
        <h1 className="case-hero__title">{project.name}</h1>
        <p className="case-hero__tagline">{project.tagline}</p>
        <div className="case-hero__meta">
          <div><span>Client</span><strong>{project.client}</strong></div>
          <div><span>Year</span><strong>{project.year}</strong></div>
          <div><span>Location</span><strong>{project.location}</strong></div>
          <div><span>Category</span><strong>{project.catLabel}</strong></div>
        </div>

        <Reveal>
          <MediaPlaceholder
            ratio="16/9"
            label={project.name}
            className="case-hero__image"
            src={project.image}
            video={project.video}
          />
        </Reveal>
      </section>

      {/* Featured Video Section */}
      {project.video && (
        <section className="case-video-section">
          <Reveal className="case-section-header">
            <span className="case-section-badge">CINEMATIC ARCHIVE</span>
            <h2 className="case-section-title">Motion & Spatial Flow</h2>
            <p className="case-section-desc">
              Experience the interplay of illumination, materiality, and visitor circulation captured in motion.
            </p>
          </Reveal>
          <Reveal>
            <ProjectVideoPlayer
              src={project.video}
              poster={project.image}
              title={project.videoTitle || `${project.name} — Cinematography`}
            />
          </Reveal>
        </section>
      )}

      {/* 01 The Brief */}
      <section className="case-block">
        <Reveal className="case-block__row">
          <span className="case-block__num">01</span>
          <div className="case-block__body">
            <h2 className="case-block__title">The Brief</h2>
            <p className="case-block__text">{project.brief}</p>
          </div>
        </Reveal>
      </section>

      {/* 02 The Idea */}
      <section className="case-block case-block--alt">
        <Reveal className="case-block__row">
          <span className="case-block__num">02</span>
          <div className="case-block__body">
            <h2 className="case-block__title">The Idea</h2>
            <p className="case-block__text">{project.idea}</p>
          </div>
        </Reveal>
      </section>

      {/* 03 The Design & Engineering */}
      <section className="case-block">
        <Reveal className="case-block__row">
          <span className="case-block__num">03</span>
          <div className="case-block__body">
            <h2 className="case-block__title">The Design & Technology</h2>
            <p className="case-block__text">{project.design}</p>
          </div>
        </Reveal>

        {/* Rich Media Gallery: Images & Videos */}
        <Reveal className="case-gallery-section">
          <div className="case-gallery-header">
            <span className="case-gallery-badge">VISUAL ARCHIVE</span>
            <h3 className="case-gallery-title">Artifacts, Stills & Motion Clips</h3>
            <span className="case-gallery-hint">Click any frame to view in high resolution</span>
          </div>

          <div className="case-gallery-grid">
            {galleryItems.map((item, i) => (
              <div
                key={i}
                className={`case-gallery-item ${item.type === 'video' ? 'case-gallery-item--video' : ''}`}
                onClick={() => setActiveMedia(item)}
              >
                <div className="case-gallery-media-wrap">
                  {item.type === 'video' ? (
                    <video
                      src={item.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="case-gallery-media"
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      className="case-gallery-media"
                    />
                  )}
                  <div className="case-gallery-item-overlay">
                    <span className="case-gallery-type-tag">
                      {item.type === 'video' ? '▶ MOTION' : 'PHOTOGRAPHY'}
                    </span>
                    <h4 className="case-gallery-item-title">{item.title}</h4>
                    <p className="case-gallery-item-caption">{item.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Key Statistics */}
      {project.stats && project.stats.length > 0 && (
        <Reveal className="case-stats">
          {project.stats.map((s) => (
            <div key={s.label} className="case-stats__item">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </Reveal>
      )}

      {/* 04 The Result */}
      <section className="case-block case-block--alt">
        <Reveal className="case-block__row">
          <span className="case-block__num">04</span>
          <div className="case-block__body">
            <h2 className="case-block__title">The Result</h2>
            <p className="case-block__text case-block__text--pull">{project.result}</p>
          </div>
        </Reveal>
      </section>

      {/* Next Project Footer */}
      {next && (
        <Link
          to={`/project/${next.slug}`}
          className="case-next"
          onClick={(e) => transitionClick(e, transitionTo, `/project/${next.slug}`)}
        >
          <span className="case-next__label">Next Project</span>
          <span className="case-next__name">{next.name} →</span>
        </Link>
      )}

      {/* Lightbox Modal for Gallery Images & Videos */}
      {activeMedia && (
        <div className="case-lightbox" onClick={() => setActiveMedia(null)}>
          <div className="case-lightbox__dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="case-lightbox__close"
              onClick={() => setActiveMedia(null)}
              aria-label="Close modal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="case-lightbox__content">
              {activeMedia.type === 'video' ? (
                <video
                  src={activeMedia.src}
                  autoPlay
                  loop
                  controls
                  playsInline
                  className="case-lightbox__media"
                />
              ) : (
                <img
                  src={activeMedia.src}
                  alt={activeMedia.title}
                  className="case-lightbox__media"
                />
              )}
            </div>
            <div className="case-lightbox__footer">
              <span className="case-lightbox__tag">
                {activeMedia.type === 'video' ? 'MOTION REEL' : 'PROJECT PHOTOGRAPHY'}
              </span>
              <h3 className="case-lightbox__title">{activeMedia.title}</h3>
              {activeMedia.caption && (
                <p className="case-lightbox__desc">{activeMedia.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

