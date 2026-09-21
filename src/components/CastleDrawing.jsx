import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './CastleDrawing.css'

export default function CastleDrawing() {
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const paths = svg.querySelectorAll('.castle-path')

    // Prepare path lengths for SVG line drawing
    paths.forEach((path) => {
      const length = path.getTotalLength ? path.getTotalLength() : 100
      path.style.strokeDasharray = length
      path.style.strokeDashoffset = length
    })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.8,
        defaults: { ease: 'power2.inOut' }
      })

      // Phase 1: Draw the foundation and walls upward
      tl.to('.castle-path--base', {
        strokeDashoffset: 0,
        duration: 1.4,
        stagger: 0.15
      })
        // Phase 2: Draw the towers, gatehouse, battlements
        .to(
          '.castle-path--towers',
          {
            strokeDashoffset: 0,
            duration: 1.8,
            stagger: 0.12
          },
          '-=0.8'
        )
        // Phase 3: Draw spires, flags, and ornamental windows
        .to(
          '.castle-path--details',
          {
            strokeDashoffset: 0,
            duration: 1.4,
            stagger: 0.08
          },
          '-=0.9'
        )
        // Phase 4: Golden bloom highlight pulse
        .to('.castle-svg', {
          filter: 'drop-shadow(0 0 10px rgba(255, 246, 214, 0.9)) drop-shadow(0 0 20px rgba(245, 224, 134, 0.45))',
          duration: 0.8,
          ease: 'power1.out'
        })
        // Phase 5: Hold steady
        .to({}, { duration: 1.8 })
        // Phase 6: Graceful erase / dissolve
        .to('.castle-path', {
          strokeDashoffset: (i, target) => {
            const len = target.getTotalLength ? target.getTotalLength() : 100
            return -len
          },
          duration: 1.2,
          stagger: 0.04,
          ease: 'power2.in'
        })
        .to(
          '.castle-svg',
          {
            filter: 'drop-shadow(0 0 4px rgba(255, 246, 214, 0.3))',
            duration: 0.6
          },
          '-=0.8'
        )
        .set('.castle-path', {
          strokeDashoffset: (i, target) => (target.getTotalLength ? target.getTotalLength() : 100)
        })
    }, svgRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="castle-drawing-container" aria-label="Rockcastle architectural loop animation">
      <div className="castle-drawing-frame">
        <svg
          ref={svgRef}
          className="castle-svg"
          viewBox="0 0 420 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle blueprint axis lines */}
          <line x1="20" y1="200" x2="400" y2="200" className="castle-path castle-path--base castle-axis" />
          <line x1="210" y1="20" x2="210" y2="200" className="castle-path castle-path--base castle-axis-center" strokeDasharray="3 3" />

          {/* Foundation & outer rampart steps */}
          <path
            d="M 40 200 L 40 188 L 380 188 L 380 200"
            className="castle-path castle-path--base"
          />
          <path
            d="M 55 188 L 55 180 L 365 180 L 365 188"
            className="castle-path castle-path--base"
          />

          {/* Left curtain wall & battlements */}
          <path
            d="M 85 180 L 85 125 L 150 125 L 150 180"
            className="castle-path castle-path--towers"
          />
          <path
            d="M 85 125 L 85 116 L 98 116 L 98 125 L 111 125 L 111 116 L 124 116 L 124 125 L 137 125 L 137 116 L 150 116"
            className="castle-path castle-path--details"
          />

          {/* Right curtain wall & battlements */}
          <path
            d="M 270 180 L 270 125 L 335 125 L 335 180"
            className="castle-path castle-path--towers"
          />
          <path
            d="M 270 116 L 283 116 L 283 125 L 296 125 L 296 116 L 309 116 L 309 125 L 322 125 L 322 116 L 335 116 L 335 125"
            className="castle-path castle-path--details"
          />

          {/* Left Flanking Watchtower */}
          <path
            d="M 50 180 L 50 85 L 90 85 L 90 180"
            className="castle-path castle-path--towers"
          />
          <path
            d="M 44 85 L 96 85 L 96 72 L 44 72 Z"
            className="castle-path castle-path--towers"
          />
          <path
            d="M 44 72 L 44 62 L 54 62 L 54 72 L 64 72 L 64 62 L 76 62 L 76 72 L 86 72 L 86 62 L 96 62 L 96 72"
            className="castle-path castle-path--details"
          />
          <path
            d="M 47 62 L 70 24 L 93 62 Z"
            className="castle-path castle-path--towers"
          />
          <path
            d="M 70 24 L 70 10 M 70 10 L 86 16 L 70 22"
            className="castle-path castle-path--details"
          />
          {/* Left Tower Arrow Slit Windows */}
          <line x1="70" y1="105" x2="70" y2="125" className="castle-path castle-path--details" />
          <line x1="70" y1="142" x2="70" y2="162" className="castle-path castle-path--details" />

          {/* Right Flanking Watchtower */}
          <path
            d="M 330 180 L 330 85 L 370 85 L 370 180"
            className="castle-path castle-path--towers"
          />
          <path
            d="M 324 85 L 376 85 L 376 72 L 324 72 Z"
            className="castle-path castle-path--towers"
          />
          <path
            d="M 324 72 L 324 62 L 334 62 L 334 72 L 344 72 L 344 62 L 356 62 L 356 72 L 366 72 L 366 62 L 376 62 L 376 72"
            className="castle-path castle-path--details"
          />
          <path
            d="M 327 62 L 350 24 L 373 62 Z"
            className="castle-path castle-path--towers"
          />
          <path
            d="M 350 24 L 350 10 M 350 10 L 366 16 L 350 22"
            className="castle-path castle-path--details"
          />
          {/* Right Tower Arrow Slit Windows */}
          <line x1="350" y1="105" x2="350" y2="125" className="castle-path castle-path--details" />
          <line x1="350" y1="142" x2="350" y2="162" className="castle-path castle-path--details" />

          {/* Central Fortress Keep */}
          <path
            d="M 150 180 L 150 68 L 270 68 L 270 180"
            className="castle-path castle-path--towers"
          />
          <line x1="146" y1="120" x2="274" y2="120" className="castle-path castle-path--details" />
          <path
            d="M 144 68 L 276 68 L 276 54 L 144 54 Z"
            className="castle-path castle-path--towers"
          />
          <path
            d="M 144 54 L 144 42 L 158 42 L 158 54 L 172 54 L 172 42 L 186 42 L 186 54 L 200 54 L 200 42 L 220 42 L 220 54 L 234 54 L 234 42 L 248 42 L 248 54 L 262 54 L 262 42 L 276 42 L 276 54"
            className="castle-path castle-path--details"
          />

          {/* High Citadel Spire & Turret */}
          <path
            d="M 185 54 L 185 28 L 235 28 L 235 54"
            className="castle-path castle-path--towers"
          />
          <path
            d="M 180 28 L 210 2 L 240 28 Z"
            className="castle-path castle-path--details"
          />
          {/* Sovereign Royal Flag */}
          <path
            d="M 210 2 L 210 -12 M 210 -12 L 232 -5 L 210 2"
            className="castle-path castle-path--details"
          />

          {/* Grand Arch Portal & Portcullis */}
          <path
            d="M 185 180 L 185 140 Q 210 115 235 140 L 235 180"
            className="castle-path castle-path--base"
          />
          <path
            d="M 191 180 L 191 144 Q 210 124 229 144 L 229 180"
            className="castle-path castle-path--details"
          />
          {/* Portcullis Grate */}
          <line x1="191" y1="154" x2="229" y2="154" className="castle-path castle-path--details" />
          <line x1="191" y1="166" x2="229" y2="166" className="castle-path castle-path--details" />
          <line x1="200" y1="135" x2="200" y2="180" className="castle-path castle-path--details" />
          <line x1="210" y1="125" x2="210" y2="180" className="castle-path castle-path--details" />
          <line x1="220" y1="135" x2="220" y2="180" className="castle-path castle-path--details" />

          {/* Rosette Window / Oculi */}
          <circle cx="210" cy="94" r="13" className="castle-path castle-path--details" />
          <circle cx="210" cy="94" r="5" className="castle-path castle-path--details" />
          <line x1="210" y1="81" x2="210" y2="107" className="castle-path castle-path--details" />
          <line x1="197" y1="94" x2="223" y2="94" className="castle-path castle-path--details" />

          {/* Arched Keep Windows */}
          <path
            d="M 162 102 L 162 90 Q 169 82 176 90 L 176 102 Z"
            className="castle-path castle-path--details"
          />
          <path
            d="M 244 102 L 244 90 Q 251 82 258 90 L 258 102 Z"
            className="castle-path castle-path--details"
          />
        </svg>

        <div className="castle-drawing-caption">
          <span className="castle-caption-line" />
          <span className="castle-caption-text">ROCKCASTLE ATELIER // ARCHITECTURAL FORTRESS</span>
          <span className="castle-caption-line" />
        </div>
      </div>
    </div>
  )
}
