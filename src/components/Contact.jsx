import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Contact.css'

const directLinks = [
  { label: 'EMAIL', href: 'mailto:hello@rockcastle.com', external: false },
  { label: 'WHATSAPP', href: 'https://wa.me/1234567890', external: true },
]

const socialLinks = [
  { label: 'INSTAGRAM', href: '#' },
  { label: 'LINKEDIN', href: '#' },
  { label: 'BEHANCE', href: '#' },
]

const emailPattern = /^\S+@\S+\.\S+$/
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*'

// Ported from Contact.dc.html's Component class: D / E motion constants.
const D = { field: 0.62, stagger: 0.1, micro: 0.35 }
const E = { reveal: 'power4.out', field: 'power3.out', micro: 'power3.out' }

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// motion distance scale: desktop 1, tablet ~0.75, mobile ~0.55 — ported from `get k()`
function motionScale() {
  if (prefersReducedMotion()) return 0
  const w = window.innerWidth
  if (w < 700) return 0.55
  if (w < 1100) return 0.75
  return 1
}

// Ported from Component.scramble()
function scrambleText(el, finalText, dur = 0.5) {
  if (!el) return
  if (prefersReducedMotion()) { el.textContent = finalText; return }
  const len = finalText.length
  const start = performance.now()
  const total = dur * 1000
  if (el.__scram) cancelAnimationFrame(el.__scram)
  const step = (now) => {
    const p = Math.min((now - start) / total, 1)
    const locked = Math.floor(p * len)
    let out = finalText.slice(0, locked)
    for (let i = locked; i < len; i++) {
      const c = finalText[i]
      out += (c === ' ' || c === ' ' || c === '+') ? c : SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0]
    }
    el.textContent = out
    if (p < 1) el.__scram = requestAnimationFrame(step)
    else { el.textContent = finalText; el.__scram = null }
  }
  el.__scram = requestAnimationFrame(step)
}

function Chars({ text }) {
  return text.split('').map((ch, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <span className="contact__char" key={i}>{ch === ' ' ? ' ' : ch}</span>
  ))
}

export default function Contact() {
  const ref = useRef(null)
  const thresholdRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', company: '', brief: '' })
  const [locked, setLocked] = useState(false)
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const metaRef = useRef(null)
  const ctaRef = useRef(null)
  const noteRef = useRef(null)
  const flashRef = useRef(null)
  const flashLineRef = useRef(null)
  const flashCopyRef = useRef(null)
  const flashSubRef = useRef(null)
  const sendingRef = useRef(false)
  const lastRippleRef = useRef(0)

  const isValid = form.name.trim().length > 1 && emailPattern.test(form.email.trim())

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }, [])

  // ── ripple(): pulses the light field on focus/typing/submit ──
  const ripple = useCallback((strength = 0) => {
    const root = ref.current
    if (!root || prefersReducedMotion()) return
    const blobs = root.querySelectorAll('.contact__blob')
    const amt = 0.14 + strength * 0.5
    blobs.forEach((b, i) => {
      gsap.fromTo(b, { filter: 'blur(28px)' }, {
        filter: `blur(${18 - amt * 8}px)`, duration: 0.5 + i * 0.1,
        yoyo: true, repeat: 1, ease: 'power2.out', overwrite: 'auto'
      })
    })
    const rule = root.querySelector('.contact__rule')
    if (rule && strength) gsap.fromTo(rule, { opacity: 0.9 }, { opacity: 0.5, duration: 0.6, ease: 'power2.out' })
  }, [])

  // ── field focus/blur: underline wipe + label color + label scramble ──
  const handleFieldFocus = useCallback((e) => {
    const field = e.target.closest('.contact__field')
    if (!field) return
    const underline = field.querySelector('.contact__field-underline')
    const label = field.querySelector('.contact__field-label')
    if (prefersReducedMotion()) {
      if (underline) underline.style.transform = 'scaleX(1)'
    } else {
      if (underline) gsap.to(underline, { scaleX: 1, duration: 0.45, ease: E.micro, overwrite: 'auto' })
      if (label) gsap.to(label, { color: '#fa5a32', duration: 0.3, overwrite: 'auto' })
    }
    if (label) {
      if (!label.dataset.original) label.dataset.original = label.textContent
      scrambleText(label, label.dataset.original, 0.42)
    }
    ripple(0.5)
  }, [ripple])

  const handleFieldBlur = useCallback((e) => {
    const field = e.target.closest('.contact__field')
    if (!field) return
    const underline = field.querySelector('.contact__field-underline')
    const label = field.querySelector('.contact__field-label')
    const keep = e.target.value.trim().length > 0
    if (prefersReducedMotion()) {
      if (underline) underline.style.transform = keep ? 'scaleX(1)' : 'scaleX(0)'
      return
    }
    if (underline) gsap.to(underline, { scaleX: keep ? 1 : 0, duration: 0.4, ease: E.micro, overwrite: 'auto' })
    if (label) gsap.to(label, { color: keep ? 'rgba(10,10,10,0.72)' : 'rgba(10,10,10,0.5)', duration: 0.3, overwrite: 'auto' })
  }, [])

  const handleFieldInput = useCallback(() => {
    const now = Date.now()
    if (now - lastRippleRef.current > 420) {
      lastRippleRef.current = now
      ripple(0)
    }
  }, [ripple])

  // ── submit(): cinematic hand-off sequence, ported 1:1 (positions/eases/durations) ──
  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (sendingRef.current) return
    if (!isValid) {
      const target = form.name.trim().length > 1 ? emailRef.current : nameRef.current
      target?.focus()
      if (noteRef.current && !prefersReducedMotion()) {
        gsap.fromTo(noteRef.current, { opacity: 0.2 }, { opacity: 1, duration: 0.5, ease: E.micro })
      }
      return
    }
    sendingRef.current = true
    setLocked(true)

    // real, working submission — no backend, so hand off to the user's mail client
    const subject = encodeURIComponent(`Project brief — ${form.name}${form.company ? ` (${form.company})` : ''}`)
    const bodyLines = [
      form.brief || 'A date, a city, a product that needs an audience.',
      '',
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.company ? `Company / Brand: ${form.company}` : null
    ].filter(Boolean)
    const body = encodeURIComponent(bodyLines.join('\n'))
    window.location.href = `mailto:hello@rockcastle.com?subject=${subject}&body=${body}`

    const root = ref.current
    const reduced = prefersReducedMotion()
    const k = motionScale()
    const cta = ctaRef.current
    const flash = flashRef.current
    const line = flashLineRef.current
    const copy = flashCopyRef.current
    const flashChars = root.querySelectorAll('.contact__flash-char')
    const flashSub = flashSubRef.current
    const fields = root.querySelectorAll('.contact__field')
    const heads = root.querySelectorAll('.contact__headline-mask')
    const subs = root.querySelectorAll('.contact__sub, .contact__fields-note')
    const meta = metaRef.current

    const finish = () => {
      sendingRef.current = false
      root.querySelector('.contact__credits')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    }

    if (reduced) {
      gsap.set(flash, { visibility: 'visible', opacity: 1 })
      gsap.set([copy, flashSub], { opacity: 1 })
      gsap.set(flashChars, { yPercent: 0, opacity: 1, scaleY: 1 })
      setTimeout(() => {
        gsap.to(flash, { opacity: 0, duration: 0.4, onComplete: () => { gsap.set(flash, { visibility: 'hidden' }); finish() } })
      }, 2200)
      return
    }

    gsap.set(flash, { visibility: 'visible', opacity: 0 })
    gsap.set(line, { scaleX: 0, transformOrigin: 'center center' })
    gsap.set(copy, { opacity: 0 })
    gsap.set(flashChars, { yPercent: 115, opacity: 0, scaleY: 1.3 })
    gsap.set(flashSub, { opacity: 0, y: 16 * k })

    ripple(1.2)
    setTimeout(() => {
      const blobs = root.querySelectorAll('.contact__blob')
      const sweep = root.querySelector('.contact__sweep')
      gsap.to(blobs, { scale: 1.9, opacity: 1, duration: 1.5, ease: 'power3.in', stagger: 0.08, overwrite: 'auto' })
      if (sweep) gsap.fromTo(sweep, { x: '-30vw', scaleX: 3, opacity: 1 }, { x: '150vw', duration: 1.3, ease: 'power2.in', overwrite: 'auto' })
      gsap.to(blobs, { scale: 1, opacity: 0.8, duration: 2.2, ease: 'power2.out', delay: 2.6, overwrite: 'auto' })
      if (sweep) gsap.set(sweep, { scaleX: 1, delay: 3 })
    }, 240)

    gsap.timeline({ defaults: { overwrite: 'auto' }, onComplete: finish })
      .addLabel('submit', 0)
      .to(cta, { scale: 0.97, duration: 0.14, ease: 'power2.out' }, 0.10)
      .to(cta, { opacity: 0, y: -10 * k, duration: 0.4, ease: 'power3.in' }, 0.24)
      .to(fields, { x: 90 * k, opacity: 0, duration: 0.55, ease: 'power3.inOut', stagger: 0.06 }, 0.25)
      .to(subs, { opacity: 0, y: -18 * k, duration: 0.45, ease: 'power3.in' }, 0.45)
      .to(heads, { yPercent: -110, clipPath: 'inset(0 0 100% 0)', duration: 0.75, ease: 'power4.inOut' }, 0.65)
      .to(meta, { opacity: 0, duration: 0.35 }, 0.90)
      .to(line, { scaleX: 1, duration: 0.5, ease: 'power4.inOut' }, 1.05)
      .to(flash, { opacity: 1, duration: 0.3, ease: 'power2.inOut' }, 1.25)
      .to(line, { opacity: 0, duration: 0.25 }, 1.55)
      .addLabel('confirmation', 1.80)
      .set(copy, { opacity: 1 }, 1.80)
      .to(flashChars, { yPercent: 0, opacity: 1, scaleY: 1, duration: 0.95, ease: E.reveal, stagger: 0.035 }, 1.80)
      .to(flashSub, { opacity: 1, y: 0, duration: 0.7, ease: E.micro }, 2.30)
      .to(flash, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 2.90)
      .set(flash, { visibility: 'hidden' }, 3.75)
  }, [form, isValid, ripple])

  // scramble the "NAME + EMAIL REQUIRED" / "READY TO TRANSMIT" note whenever validity flips
  useEffect(() => {
    const note = noteRef.current
    if (!note) return
    const txt = isValid ? 'READY TO TRANSMIT' : 'NAME + EMAIL REQUIRED'
    if (note.textContent !== txt) scrambleText(note, txt, 0.55)
    note.style.color = isValid ? '#fa5a32' : 'rgba(10,10,10,0.55)'
  }, [isValid])

  // Bridges the hard black→white cut between the preceding all-black
  // Services section and Contact's white ground: a black panel covers the
  // section on entry and recedes upward as the user scrolls through, so the
  // black stretch visibly gives way to white instead of jump-cutting.
  useEffect(() => {
    if (prefersReducedMotion()) return
    const root = ref.current
    const panel = thresholdRef.current
    if (!root || !panel) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel,
        { clipPath: 'inset(0% 0 0 0)' },
        {
          clipPath: 'inset(100% 0 0 0)',
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'top 15%', scrub: true },
        }
      )
    }, root)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const root = ref.current
    const reduced = prefersReducedMotion()
    const k = motionScale()
    const cleanupFns = []

    const ctx = gsap.context(() => {
      const heads = root.querySelectorAll('.contact__headline-mask')
      const chars = root.querySelectorAll('.contact__char')
      const meta = metaRef.current
      const subs = root.querySelectorAll('.contact__sub, .contact__fields-note')
      const fields = root.querySelectorAll('.contact__field')
      const ctaRow = root.querySelector('.contact__cta-row')

      if (reduced) {
        gsap.set([heads, chars, meta, subs, fields, ctaRow], { clearProps: 'all', opacity: 1, y: 0, clipPath: 'none' })
      } else {
        // ── intro: metadata → headline (char reveal) → supporting copy ──
        // ported 1:1 from buildIntro(); gated behind a ScrollTrigger since this
        // section sits mid-page here rather than being the whole document.
        const intro = gsap.timeline({ defaults: { overwrite: 'auto' }, paused: true })
        intro.addLabel('intro', 0)
          .fromTo(meta, { opacity: 0, y: 14 * k }, { opacity: 1, y: 0, duration: 0.7, ease: E.micro }, 0.05)
          .fromTo(chars.length ? chars : heads,
            { yPercent: 118, opacity: 0, rotate: 5, scaleY: 1.25 },
            { yPercent: 0, opacity: 1, rotate: 0, scaleY: 1, duration: 1.15, ease: E.reveal, stagger: { each: 0.028, from: 'start' } }, 0.18)
          .fromTo(subs, { opacity: 0, y: 22 * k }, { opacity: 1, y: 0, duration: 0.8, ease: E.micro, stagger: 0.08 }, 0.9)
        ScrollTrigger.create({ trigger: root, start: 'top 75%', once: true, onEnter: () => intro.play() })

        // ── form: sequential field reveal + underline wipe, fired once on entry ──
        const formTl = gsap.timeline({ paused: true, defaults: { overwrite: 'auto' } })
        formTl.addLabel('form', 0)
          .fromTo(fields, { opacity: 0, y: 34 * k, skewY: 2.2 }, { opacity: 1, y: 0, skewY: 0, duration: D.field, ease: E.field, stagger: D.stagger }, 0)
          .fromTo(root.querySelectorAll('.contact__field-underline'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut', stagger: D.stagger }, 0.1)
          .to(root.querySelectorAll('.contact__field-underline'), { scaleX: 0, transformOrigin: 'right center', duration: 0.45, ease: 'power3.inOut', stagger: D.stagger }, 0.52)
          .set(root.querySelectorAll('.contact__field-underline'), { transformOrigin: 'left center' })
          .fromTo(root.querySelectorAll('.contact__field-label'), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: D.stagger }, 0.08)
          .fromTo(ctaRow, { opacity: 0, y: 26 * k }, { opacity: 1, y: 0, duration: 0.7, ease: E.field }, 0.42)
        gsap.set(fields, { opacity: 0 })
        gsap.set(ctaRow, { opacity: 0 })

        const formEl = root.querySelector('.contact__form')
        ScrollTrigger.create({ trigger: formEl, start: 'top 82%', once: true, onEnter: () => formTl.play() })
      }

      // ── CTA: micro hover-lift + magnetic follow + idle arrow float ──
      const cta = ctaRef.current
      if (cta && !reduced) {
        const arrow = cta.querySelector('.contact__submit-arrow')
        const text = cta.querySelector('.contact__submit-text')

        const onEnter = () => {
          gsap.to(cta, { y: -4 * (k || 1), duration: D.micro, ease: E.micro, overwrite: 'auto' })
          gsap.to(arrow, { x: 6, y: -6, duration: D.micro, ease: E.micro, overwrite: 'auto' })
          gsap.to(text, { x: 2, duration: D.micro, ease: E.micro, overwrite: 'auto' })
        }
        const onLeave = () => {
          gsap.to(cta, { x: 0, y: 0, duration: D.micro, ease: E.micro, overwrite: 'auto' })
          gsap.to([arrow, text], { x: 0, y: 0, duration: D.micro, ease: E.micro, overwrite: 'auto' })
        }
        const onMove = (e) => {
          const r = cta.getBoundingClientRect()
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height
          gsap.to(cta, { x: dx * 16, y: dy * 10, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
          gsap.to(text, { x: dx * 10, y: dy * 6, duration: 0.6, ease: 'power3.out', overwrite: 'auto' })
          gsap.to(arrow, { x: dx * 18, y: dy * 6, duration: 0.6, ease: 'power3.out', overwrite: 'auto' })
        }

        cta.addEventListener('mouseenter', onEnter)
        cta.addEventListener('focus', onEnter)
        cta.addEventListener('mouseleave', onLeave)
        cta.addEventListener('blur', onLeave)
        cta.addEventListener('mousemove', onMove)
        cleanupFns.push(() => {
          cta.removeEventListener('mouseenter', onEnter)
          cta.removeEventListener('focus', onEnter)
          cta.removeEventListener('mouseleave', onLeave)
          cta.removeEventListener('blur', onLeave)
          cta.removeEventListener('mousemove', onMove)
        })

        if (arrow) gsap.to(arrow, { y: -3, duration: 1.3, ease: 'sine.inOut', repeat: -1, yoyo: true })
      }

      // ── form card 3D tilt — subtle perspective follow, tactile depth cue
      // that wasn't there before (the form otherwise only reacts field by
      // field on focus) ──
      const formCol = root.querySelector('.contact__form-col')
      const formEl2 = root.querySelector('.contact__form')
      if (formCol && formEl2 && !reduced) {
        const onMove = (e) => {
          const r = formCol.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width - 0.5
          const py = (e.clientY - r.top) / r.height - 0.5
          gsap.to(formEl2, {
            rotateY: px * 6,
            rotateX: py * -6,
            transformPerspective: 1400,
            duration: 0.6,
            ease: 'power3.out',
            overwrite: 'auto'
          })
        }
        const onLeave = () => {
          gsap.to(formEl2, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' })
        }
        formCol.addEventListener('mousemove', onMove)
        formCol.addEventListener('mouseleave', onLeave)
        cleanupFns.push(() => {
          formCol.removeEventListener('mousemove', onMove)
          formCol.removeEventListener('mouseleave', onLeave)
        })
      }

      // ── social link arrow hover ──
      if (!reduced) {
        root.querySelectorAll('.contact__credits-link[data-soc]').forEach((a) => {
          const arrow = a.querySelector('.contact__credits-arrow')
          if (!arrow) return
          const onEnter = () => gsap.to(arrow, { x: 4, y: -4, duration: 0.28, ease: E.micro, overwrite: 'auto' })
          const onLeave = () => gsap.to(arrow, { x: 0, y: 0, duration: 0.28, ease: E.micro, overwrite: 'auto' })
          a.addEventListener('mouseenter', onEnter)
          a.addEventListener('mouseleave', onLeave)
          cleanupFns.push(() => {
            a.removeEventListener('mouseenter', onEnter)
            a.removeEventListener('mouseleave', onLeave)
          })
        })
      }

      // ── atmosphere: drifting light, sweep, grain, pointer parallax ──
      const blobs = root.querySelectorAll('.contact__blob')
      if (blobs.length && !reduced) {
        blobs.forEach((b, i) => {
          const amp = [90, 70, 120][i] || 90
          gsap.to(b, { x: amp, y: -amp * 0.5, scale: 1.12, duration: 14 + i * 3, ease: 'sine.inOut', repeat: -1, yoyo: true })
          gsap.to(b, { opacity: 0.55, duration: 6 + i * 2, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 1.4 })
        })

        const sweep = root.querySelector('.contact__sweep')
        if (sweep) gsap.fromTo(sweep, { x: '-10vw' }, { x: '150vw', duration: 9, ease: 'power2.inOut', repeat: -1, repeatDelay: 5 })

        const grain = root.querySelector('.contact__grain')
        if (grain) gsap.to(grain, { x: 90, y: -70, duration: 0.5, ease: 'steps(4)', repeat: -1, yoyo: true })

        const host = root.querySelector('.contact__atmos')
        const onMove = (e) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 2
          const y = (e.clientY / window.innerHeight - 0.5) * 2
          gsap.to(host, { x: x * 34, y: y * 24, duration: 1.4, ease: 'power3.out', overwrite: 'auto' })
          blobs.forEach((b, i) => gsap.to(b, { xPercent: x * (4 + i * 3), yPercent: y * (3 + i * 2), duration: 1.6, ease: 'power3.out', overwrite: 'auto' }))
        }
        window.addEventListener('mousemove', onMove, { passive: true })
        cleanupFns.push(() => window.removeEventListener('mousemove', onMove))
      }

      // ── page-wide scroll progress bar + horizontal rule ──
      const bar = root.querySelector('.contact__progress')
      const rule = root.querySelector('.contact__rule')
      if (bar) {
        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            gsap.set(bar, { scaleX: self.progress })
            if (rule) gsap.set(rule, { scaleX: 0.2 + self.progress * 0.8, opacity: 0.4 + self.progress * 0.6 })
          }
        })
      }

      // ── outro: credits columns + closing headline, ported 1:1 from buildOutro() ──
      const credits = root.querySelector('.contact__credits')
      if (credits && !reduced) {
        const rows = credits.querySelectorAll('.contact__credits-label, .contact__credits-link, .contact__credits-static')
        const closing = credits.querySelectorAll('.contact__closing-line')
        gsap.set(rows, { opacity: 0 })
        gsap.set(closing, { yPercent: 108, opacity: 0 })

        ScrollTrigger.create({
          trigger: credits, start: 'top 78%', once: true,
          onEnter: () => gsap.fromTo(rows, { opacity: 0, y: 20 * k, skewY: 1.5 }, { opacity: 1, y: 0, skewY: 0, duration: 0.6, ease: E.field, stagger: 0.045 })
        })
        ScrollTrigger.create({
          trigger: credits.querySelector('.contact__closing-heading'), start: 'top 88%', once: true,
          onEnter: () => gsap.fromTo(closing, { yPercent: 108, opacity: 0, skewY: 3 }, { yPercent: 0, opacity: 1, skewY: 0, duration: 1.2, ease: E.reveal, stagger: 0.12 })
        })
      }
    }, ref.current)

    return () => {
      ctx.revert()
      cleanupFns.forEach((fn) => fn())
    }
  }, [])

  return (
    <section className="contact" id="contact" ref={ref}>
      <div className="contact__threshold" ref={thresholdRef} aria-hidden="true" />
      <div className="contact__progress" aria-hidden="true" />

      <div className="contact__atmos" aria-hidden="true">
        <div className="contact__blob contact__blob--1" />
        <div className="contact__blob contact__blob--2" />
        <div className="contact__blob contact__blob--3" />
        <div className="contact__sweep" />
        <div className="contact__rule" />
        <div className="contact__grain" />
      </div>

      <div className="contact__grid">
        <div className="contact__intro">
          <div className="contact__meta" ref={metaRef}>
            <span>SECTION 02</span>
            <span className="contact__meta-rule" />
            <span className="contact__meta-strong">PROJECT / EVENT</span>
          </div>
          <h2 className="contact__headline">
            <span className="contact__headline-mask">
              <span className="contact__headline-line">
                <span className="contact__headline-word"><Chars text="GIVE" /></span>{' '}
                <span className="contact__headline-word"><Chars text="US" /></span>
              </span>
            </span>
            <span className="contact__headline-mask">
              <span className="contact__headline-line">
                <span className="contact__headline-word"><Chars text="THE" /></span>{' '}
                <span className="contact__headline-word contact__headline-word--italic"><Chars text="SIGNAL." /></span>
              </span>
            </span>
          </h2>
          <p className="contact__sub">
            Enough to understand the ambition. We&rsquo;ll handle the rest — the plan, the crew
            and the team who make it stand up.
          </p>
          <div className="contact__fields-note">[&nbsp;4 FIELDS · ONE TRANSMISSION&nbsp;]</div>
        </div>

        <div className="contact__form-col">
          <form className="contact__form" onSubmit={handleSubmit} noValidate>
            <div className="contact__field">
              <div className="contact__field-row">
                <label htmlFor="contact-name" className="contact__field-label">01 / YOUR NAME</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Type here"
                  className="contact__field-input"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={handleFieldFocus}
                  onBlur={handleFieldBlur}
                  onInput={handleFieldInput}
                  disabled={locked}
                  ref={nameRef}
                />
              </div>
              <span className="contact__field-underline" />
            </div>
            <div className="contact__field">
              <div className="contact__field-row">
                <label htmlFor="contact-email" className="contact__field-label">02 / EMAIL ADDRESS</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="contact__field-input"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={handleFieldFocus}
                  onBlur={handleFieldBlur}
                  onInput={handleFieldInput}
                  disabled={locked}
                  ref={emailRef}
                />
              </div>
              <span className="contact__field-underline" />
            </div>
            <div className="contact__field">
              <div className="contact__field-row">
                <label htmlFor="contact-company" className="contact__field-label contact__field-label--soft">03 / COMPANY / BRAND</label>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  placeholder="Optional"
                  className="contact__field-input"
                  value={form.company}
                  onChange={handleChange}
                  onFocus={handleFieldFocus}
                  onBlur={handleFieldBlur}
                  onInput={handleFieldInput}
                  disabled={locked}
                />
              </div>
              <span className="contact__field-underline" />
            </div>
            <div className="contact__field contact__field--textarea">
              <label htmlFor="contact-brief" className="contact__field-label">04 / TELL US WHAT YOU&rsquo;RE BUILDING</label>
              <textarea
                id="contact-brief"
                name="brief"
                rows={3}
                placeholder="A date, a city, a product that needs an audience."
                className="contact__field-textarea"
                value={form.brief}
                onChange={handleChange}
                onFocus={handleFieldFocus}
                onBlur={handleFieldBlur}
                onInput={handleFieldInput}
                disabled={locked}
              />
              <span className="contact__field-underline" />
            </div>

            <div className="contact__cta-row">
              <button type="submit" className="contact__submit" disabled={locked} ref={ctaRef}>
                <span className="contact__submit-text">Send the brief</span>
                <span className="contact__submit-arrow" aria-hidden="true">↗</span>
              </button>
              <span className="contact__cta-note" ref={noteRef}>NAME + EMAIL REQUIRED</span>
            </div>
          </form>
        </div>
      </div>

      {/* ── flash overlay: cinematic hand-off + confirmation, ported from the
          mockup's data-flash structure. Hidden until handleSubmit runs. ── */}
      <div className="contact__flash" ref={flashRef} aria-hidden="true">
        <span className="contact__flash-line" ref={flashLineRef} />
        <div className="contact__flash-copy" ref={flashCopyRef}>
          <h3 className="contact__confirm-title">
            <span className="contact__confirm-mask">
              <span className="contact__confirm-line">
                {'BRIEF'.split('').map((ch, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <span className="contact__flash-char" key={i}>{ch}</span>
                ))}
              </span>
            </span>
            <span className="contact__confirm-mask">
              <span className="contact__confirm-line contact__confirm-line--accent">
                {'RECEIVED.'.split('').map((ch, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <span className="contact__flash-char" key={i}>{ch}</span>
                ))}
              </span>
            </span>
          </h3>
          <p className="contact__confirm-sub" ref={flashSubRef}>
            WE HAVE THE SIGNAL.<br />WE&rsquo;LL TAKE IT FROM HERE.
          </p>
        </div>
      </div>

      <div className="contact__credits">
        <div className="contact__credits-grid">
          <div className="contact__credits-col">
            <div className="contact__credits-label">DIRECT</div>
            <div className="contact__credits-list">
              {directLinks.map((d) => (
                <a
                  key={d.label}
                  href={d.href}
                  className="contact__credits-link"
                  data-soc
                  target={d.external ? '_blank' : undefined}
                  rel={d.external ? 'noopener noreferrer' : undefined}
                >
                  [&nbsp;{d.label}&nbsp;] <span className="contact__credits-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
          <div className="contact__credits-col">
            <div className="contact__credits-label">SOCIAL</div>
            <div className="contact__credits-list">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} className="contact__credits-link" data-soc target="_blank" rel="noopener noreferrer">
                  {s.label} <span className="contact__credits-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
          <div className="contact__credits-col">
            <div className="contact__credits-label">LOCATION</div>
            <div className="contact__credits-static">DUBAI,<br />UNITED ARAB EMIRATES</div>
          </div>
        </div>

        <div className="contact__closing">
          <h2 className="contact__closing-heading">
            <span className="contact__closing-mask">
              <span className="contact__closing-line">ROCKCASTLE</span>
            </span>
            <span className="contact__closing-mask">
              <span className="contact__closing-line contact__closing-line--accent">BUILDS EXPERIENCES.</span>
            </span>
          </h2>
        </div>
      </div>
    </section>
  )
}
