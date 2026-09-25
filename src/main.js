import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// ── MOTION SYSTEM ────────────────────────────────────────────────────────
// One scale for every real-time animation on the site. The numbers mirror the
// --dur-* / --ease-* custom properties in styles.css so JS and CSS motion
// cannot drift apart.
//
// NOTE: the scrubbed Signature timeline deliberately does NOT use this scale.
// Its durations are timeline positions normalised 0 -> 1 against scroll
// progress, not seconds.
const MOTION = {
    dur: {
        instant: 0.18,   // state flips, indicator swaps
        fast: 0.32,      // micro-interactions: hover, cursor, buttons
        normal: 0.45,    // component transitions
        reveal: 0.72,    // typography and media entrances
        cinematic: 1.2,  // large spatial moves
    },
    ease: {
        ui: 'power3.out',        // anything the pointer touches
        exit: 'power2.in',       // things leaving
        spatial: 'power4.out',   // large entrances
        linear: 'none',          // continuous / scrubbed motion
        inOut: 'power2.inOut',   // symmetric moves that come back
    },
};

const root = document.documentElement;
const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const reduced = reducedQuery.matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)').matches;

// The header is fixed, so every scroll target and pin start is offset by it.
// Read from CSS so the one --header-h token drives both.
const headerH = () => parseFloat(getComputedStyle(root).getPropertyValue('--header-h')) || 64;

// Cursor refs are declared up front: the hero reads them when it syncs the
// play/pause label, before the cursor block further down runs.
const cursorEl = document.querySelector('#cursor');
const cursorLabel = document.querySelector('#cursor-label');
let cursorHost = null;

function setCursorLabel(host) {
    if (!cursorLabel) return;
    const kind = host.dataset.cursor;
    cursorLabel.textContent = kind === 'play' ? (host.dataset.cursorLabel || 'Play') : 'View';
}

const yearNode = document.getElementById('year');
if (yearNode) yearNode.textContent = new Date().getFullYear();

// ── Smooth scroll ────────────────────────────────────────────────────────
// Lenis only when motion is allowed; reduced-motion users get native scroll.
// Its `duration` is a smoothing constant, not an animation duration.
let lenis = null;
if (!reduced) {
    lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
}

const scrollToTarget = (target) => {
    const y = target.id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY - headerH();
    if (lenis) lenis.scrollTo(y, { duration: MOTION.dur.cinematic });
    else window.scrollTo({ top: y, behavior: 'auto' });
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
        const hash = link.getAttribute('href');
        if (hash.length < 2) return;
        const target = document.querySelector(hash);
        if (!target) return;
        event.preventDefault();
        closeMenu();
        scrollToTarget(target);
    });
});

// ── Header: current-section state ────────────────────────────────────────
// The header itself never moves — it is primary navigation and the page's
// fixed frame. Only the underline follows the section in view.
const navLinks = Array.from(document.querySelectorAll('.site-header__nav .nav-link'));
navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    if (!section) return;
    ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
            if (!self.isActive) return;
            navLinks.forEach((l) => l.classList.toggle('is-current', l === link));
        },
    });
});

// ── Mobile menu ──────────────────────────────────────────────────────────
const menuButton = document.querySelector('#menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');

function openMenu() {
    if (!mobileMenu || !menuButton) return;
    mobileMenu.hidden = false;
    requestAnimationFrame(() => mobileMenu.classList.add('is-open'));
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.querySelector('.menu-toggle__label').textContent = 'Close';
    lenis?.stop();
    root.style.overflow = 'hidden';
    mobileMenu.querySelector('a')?.focus();
}

function closeMenu() {
    if (!mobileMenu || !menuButton || mobileMenu.hidden) return;
    mobileMenu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('.menu-toggle__label').textContent = 'Menu';
    lenis?.start();
    root.style.overflow = '';
    setTimeout(() => { if (!mobileMenu.classList.contains('is-open')) mobileMenu.hidden = true; }, MOTION.dur.normal * 1000);
}

menuButton?.addEventListener('click', () => {
    if (menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } else openMenu();
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); }
});
window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) closeMenu(); });

// ── Shared reveal helpers ────────────────────────────────────────────────
// Start states live in CSS under .has-motion (set before paint in <head>),
// so these only ever animate TO the resting state. fromTo with explicit y:0
// on both ends: GSAP parses the CSS translate into a standing px offset
// otherwise, and the element would stop short of its resting position.
const revealLines = (lines, trigger, start = 'top 80%') => {
    if (reduced || !lines.length) return;
    gsap.fromTo(lines,
        { yPercent: 105, y: 0 },
        {
            yPercent: 0, y: 0, duration: MOTION.dur.cinematic, ease: MOTION.ease.spatial, stagger: 0.09,
            scrollTrigger: { trigger, start, once: true },
        });
};

if (!reduced) {
    ScrollTrigger.batch('[data-reveal]', {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => gsap.fromTo(batch,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: MOTION.dur.reveal, ease: MOTION.ease.ui, stagger: 0.08, clearProps: 'transform' }),
    });

    // Media frames open from the bottom edge while the image inside settles
    // from a slight overscale. clearProps hands the transform back to CSS so
    // the hover scale works afterwards.
    ScrollTrigger.batch('.media-reveal', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => {
            gsap.fromTo(batch,
                { clipPath: 'inset(100% 0% 0% 0%)' },
                { clipPath: 'inset(0% 0% 0% 0%)', duration: MOTION.dur.cinematic, ease: MOTION.ease.spatial, stagger: 0.12 });
            gsap.fromTo(batch.map((el) => el.querySelector('img')),
                { scale: 1.14 },
                { scale: 1, duration: MOTION.dur.cinematic * 1.3, ease: MOTION.ease.spatial, stagger: 0.12, clearProps: 'transform' });
        },
    });
}

// ── HERO ─────────────────────────────────────────────────────────────────
const heroStates = [
    {
        tag: 'Spatial architecture',
        text: 'We architect physical realms where brand identity takes monumental form. Spaces sculpted with filmic precision to turn fleeting observation into lifelong emotional conviction.'
    },
    {
        tag: 'Film-grade production',
        text: 'Every activation is conceived as a living cinematic scene with real-time drama. We merge physical fabrication with stage engineering to construct spaces that command total focus.'
    },
    {
        tag: 'Experiences un-ltd.',
        text: 'Twelve years across Dubai and international stages engineering bespoke worlds. We build what conventional agencies consider unbuildable, uniting audacity with flawless execution.'
    }
];

const heroEl = document.querySelector('#top.hero');
const heroVideo = document.querySelector('#hero-video');
const heroMedia = document.querySelector('#hero-media');
const heroPlay = document.querySelector('#hero-play');
const heroPlayLabel = document.querySelector('#hero-play-label');
let heroUserPaused = false;

if (heroEl) {
    const heroTag = document.querySelector('#hero-state-tag');
    const heroParagraph = document.querySelector('#hero-paragraph');
    const heroTabs = Array.from(document.querySelectorAll('.hero__tab'));
    let heroStateIndex = 0;
    let heroSwapping = false;

    const setTabs = (index) => heroTabs.forEach((tab, i) => {
        tab.classList.toggle('is-active', i === index);
        tab.setAttribute('aria-pressed', String(i === index));
    });

    // Fade out, swap text, fade in. Guarded so a click mid-transition cannot
    // interleave two swaps on the same nodes.
    const transitionToState = (nextIndex) => {
        if (heroSwapping || nextIndex === heroStateIndex || !heroTag || !heroParagraph) return;
        const next = heroStates[nextIndex];
        heroSwapping = true;
        setTabs(nextIndex);
        if (reduced) {
            heroTag.textContent = next.tag;
            heroParagraph.textContent = next.text;
            heroStateIndex = nextIndex;
            heroSwapping = false;
            return;
        }
        gsap.timeline({ onComplete: () => { heroStateIndex = nextIndex; heroSwapping = false; } })
            .to([heroTag, heroParagraph], {
                opacity: 0, y: -6, duration: MOTION.dur.fast, ease: MOTION.ease.exit,
                onComplete: () => { heroTag.textContent = next.tag; heroParagraph.textContent = next.text; }
            })
            .to([heroTag, heroParagraph], { opacity: 1, y: 0, duration: MOTION.dur.normal, stagger: 0.06, ease: MOTION.ease.ui });
    };

    // Auto-advance is decorative: reduced-motion users get the tabs only.
    const HERO_CYCLE_MS = 7000;
    let heroTimer = null;
    const cycleStart = () => {
        if (heroTimer || reduced) return;
        heroTimer = setInterval(() => transitionToState((heroStateIndex + 1) % heroStates.length), HERO_CYCLE_MS);
    };
    const cycleStop = () => { clearInterval(heroTimer); heroTimer = null; };
    cycleStart();
    document.addEventListener('visibilitychange', () => { if (document.hidden) cycleStop(); else cycleStart(); });

    heroTabs.forEach((tab) => tab.addEventListener('click', () => {
        cycleStop();
        transitionToState(Number(tab.dataset.state));
        cycleStart();
    }));

    // ── reel ──
    // 39MB source: only attached on wide, non-data-saver screens with motion
    // allowed. Everyone else sees the poster and can still press play.
    const HERO_LOOP_SECONDS = 20;
    const loadVideo = () => {
        if (!heroVideo || heroVideo.getAttribute('src')) return;
        // 16MB VP8 encode where supported; the 39MB MP4 is the fallback.
        const webm = heroVideo.dataset.srcWebm;
        heroVideo.src = webm && heroVideo.canPlayType('video/webm; codecs="vp8"') ? webm : heroVideo.dataset.src;
        // The source reel is 175s / 39MB at 853x480, and the browser
        // range-streams it progressively. A hero backdrop only needs a short
        // loop, so capping the segment bounds worst-case transfer to roughly
        // the first 20s instead of the whole file. Re-encoding the asset
        // itself would be the real fix; no encoder exists in this environment.
        heroVideo.addEventListener('timeupdate', () => {
            // only cap when the asset is actually longer than the segment
            if (heroVideo.duration > HERO_LOOP_SECONDS && heroVideo.currentTime >= HERO_LOOP_SECONDS) {
                heroVideo.currentTime = 0;
            }
        });
    };
    const syncPlayState = () => {
        const playing = heroVideo && !heroVideo.paused;
        heroPlay?.setAttribute('aria-pressed', String(playing));
        if (heroPlayLabel) heroPlayLabel.textContent = playing ? 'Pause reel' : 'Play reel';
        if (heroMedia) heroMedia.dataset.cursorLabel = playing ? 'Pause' : 'Play';
        if (cursorEl?.classList.contains('is-active') && cursorHost === heroMedia) setCursorLabel(heroMedia);
    };
    const toggleVideo = () => {
        if (!heroVideo) return;
        loadVideo();
        if (heroVideo.paused) { heroUserPaused = false; heroVideo.play().catch(() => { }); }
        else { heroUserPaused = true; heroVideo.pause(); }
    };

    heroPlay?.addEventListener('click', toggleVideo);
    heroMedia?.addEventListener('click', toggleVideo);
    heroVideo?.addEventListener('play', syncPlayState);
    heroVideo?.addEventListener('pause', syncPlayState);

    const saveData = navigator.connection && navigator.connection.saveData;
    if (heroVideo && !reduced && !saveData && window.matchMedia('(min-width: 768px)').matches) {
        loadVideo();
        heroVideo.play().catch(() => { });
    }
    syncPlayState();

    // Nothing to decode while the hero is off screen.
    ScrollTrigger.create({
        trigger: heroEl,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
            if (!heroVideo || !heroVideo.getAttribute('src') || heroUserPaused) return;
            if (self.isActive) heroVideo.play().catch(() => { }); else heroVideo.pause();
        },
    });

    if (!reduced) {
        gsap.timeline({ delay: 0.15 })
            .fromTo('.hero__line', { yPercent: 105, y: 0 }, { yPercent: 0, y: 0, duration: 1.4, ease: MOTION.ease.spatial, stagger: 0.1 })
            .fromTo('[data-hero-in]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: MOTION.dur.reveal, ease: MOTION.ease.ui, stagger: 0.08, clearProps: 'transform' }, 0.55);

        // Understated parallax: the reel sinks slower than the page.
        gsap.to('.hero__media', {
            yPercent: 22,
            ease: MOTION.ease.linear,
            scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true },
        });
    }
}

// ── Hero: scroll-out ─────────────────────────────────────────────────────
// Separate from the hero's own intro/parallax (untouched above). As the page
// leaves the hero, the reel's frame narrows and lifts off the section edges
// and the two display lines drift apart at different speeds. Phones keep the
// line drift only.
if (heroEl && !reduced) {
    const heroMasks = heroEl.querySelectorAll('.hero__title .mask');
    gsap.matchMedia().add({ wide: '(min-width: 640px)', narrow: '(max-width: 639px)' }, (ctx) => {
        const tl = gsap.timeline({
            defaults: { ease: MOTION.ease.linear },
            scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true },
        });
        if (ctx.conditions.wide) {
            tl.fromTo('.hero__media', { clipPath: 'inset(0% 0% 0% 0% round 0px)' }, { clipPath: 'inset(0% 2.5% 8% 2.5% round 6px)' }, 0);
            tl.fromTo('.hero__top', { opacity: 1 }, { opacity: 0, duration: 0.5 }, 0);
        }
        tl.fromTo(heroMasks[0], { yPercent: 0 }, { yPercent: -55 }, 0);
        tl.fromTo(heroMasks[1], { yPercent: 0 }, { yPercent: -20 }, 0);
    });
}

// ── WHO WE ARE: word-by-word statement ───────────────────────────────────
// The one scroll-scrubbed paragraph on the page. Words start dim and come up
// to full ink as the statement crosses the viewport.
document.querySelectorAll('[data-split]').forEach((el) => {
    if (reduced) return;
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', words.join(' '));
    el.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
    gsap.fromTo(el.querySelectorAll('.w'),
        { opacity: 0.16 },
        {
            opacity: 1, ease: MOTION.ease.linear, stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: 0.6 },
        });
});

// ── Live experience: pinned media expansion ──────────────────────────────
// The event moment between the studio statement and the Signature. The frame
// opens from a centred crop to full bleed while the lines, which start over
// the frame, travel out to their edges; the image then dims so the pin hands
// off to the dark Signature. Phones: no pin, a short scrubbed reveal.
const expandEl = document.querySelector('#experience');
if (expandEl && !reduced) {
    const media = expandEl.querySelector('.expand__media');
    const img = media.querySelector('img');
    const scrim = expandEl.querySelector('.expand__scrim');
    const lines = expandEl.querySelectorAll('.expand__title .mask');
    revealLines(expandEl.querySelectorAll('.expand__line'), expandEl, 'top 65%');

    gsap.matchMedia().add({ wide: '(min-width: 640px)', narrow: '(max-width: 639px)' }, (ctx) => {
        if (ctx.conditions.wide) {
            gsap.timeline({
                defaults: { ease: MOTION.ease.linear },
                scrollTrigger: {
                    trigger: expandEl,
                    start: () => `top ${headerH()}px`,
                    end: '+=150%',
                    pin: true,
                    scrub: 0.8,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            })
                .fromTo(media, { clipPath: 'inset(18% 32% 18% 32% round 4px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.7, ease: 'power1.inOut' }, 0)
                .fromTo(img, { scale: 1.25 }, { scale: 1, duration: 0.7, ease: 'power1.out' }, 0)
                .fromTo(lines[0], { x: () => window.innerWidth * 0.12 }, { x: 0, duration: 0.7 }, 0)
                .fromTo(lines[1], { x: () => window.innerWidth * -0.12 }, { x: 0, duration: 0.7 }, 0)
                .fromTo(scrim, { opacity: 0.15 }, { opacity: 0.4, duration: 0.7 }, 0)
                .to(scrim, { opacity: 0.82, duration: 0.2 }, 0.8)
                .to(expandEl.querySelectorAll('.expand__meta, .expand__foot'), { opacity: 0, duration: 0.15 }, 0.85)
                .set({}, {}, 1);
        } else {
            gsap.timeline({
                defaults: { ease: MOTION.ease.linear },
                scrollTrigger: { trigger: expandEl, start: 'top 85%', end: 'center 50%', scrub: 0.6 },
            })
                .fromTo(media, { clipPath: 'inset(8% 6% 8% 6% round 4px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)' }, 0)
                .fromTo(img, { scale: 1.15 }, { scale: 1 }, 0);
        }
    });
}

// ── Signature Experience ─────────────────────────────────────────────────
// Pinned, scrubbed manifesto inside #we-create-section. One timeline whose
// positions run 0 -> 1 against the pin distance:
//   0.02 WE CREATE · 0.22 SPACES · 0.40 EXPERIENCES (+ six frames fan in)
//   0.60 MEMORY (frames drift out) · 0.78 manifesto
//   0.86 dissolve → 0.88 ARCHITECTURE IN MOTION (ten slots) · hold to 1.0
const sigx = document.querySelector('#we-create-section');

// Where each frame flies in from (fx/fy), its settle yaw (ry), when it lands
// (at), and where the drift at MEMORY pushes it (dx/dy) — each toward the
// edge it already sits nearest.
const SIGX_CARDS = [
    { n: 1, fx: -80, fy: 30, ry: 8, at: 0.420, dx: '-38%', dy: '-22%' },
    { n: 2, fx: 0, fy: -70, ry: 0, at: 0.428, dx: '0%', dy: '-40%' },
    { n: 3, fx: 80, fy: 30, ry: -8, at: 0.436, dx: '38%', dy: '-22%' },
    { n: 4, fx: -80, fy: -30, ry: 8, at: 0.444, dx: '-36%', dy: '24%' },
    { n: 5, fx: 0, fy: 70, ry: 0, at: 0.452, dx: '0%', dy: '40%' },
    { n: 6, fx: 80, fy: -30, ry: -8, at: 0.460, dx: '36%', dy: '24%' },
];

// The ten matrix slots, each sliding in from the edge of the grid it occupies:
// top row from above, side columns from their own side, bottom row from below.
const SIGX_MATRIX = [
    { id: 1, x: -150, y: 0 }, { id: 2, x: -150, y: 0 }, { id: 3, x: -150, y: 0 },
    { id: 4, x: 0, y: -130 }, { id: 5, x: 0, y: -130 },
    { id: 6, x: 150, y: 0 }, { id: 7, x: 150, y: 0 },
    { id: 8, x: 0, y: 130 }, { id: 9, x: 0, y: 130 }, { id: 10, x: 0, y: 130 }
];

if (sigx && reduced) {
    sigx.classList.add('is-static');
} else if (sigx) {
    const q = (s) => sigx.querySelector(s);
    const tl = gsap.timeline({
        defaults: { ease: MOTION.ease.linear },
        scrollTrigger: {
            trigger: sigx,
            start: () => `top ${headerH()}px`,
            end: '+=320%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
        },
    });

    // Progress indicator: one step lit at a time.
    const steps = [[1, 0.02, 0.2], [2, 0.2, 0.4], [3, 0.4, 0.6], [4, 0.6, 0.78]];
    steps.forEach(([n, on, off]) => {
        tl.to(q(`.sigx__ind--${n}`), { opacity: 1, duration: 0.01 }, on);
        if (n < 4) tl.to(q(`.sigx__ind--${n}`), { opacity: 0.35, duration: 0.01 }, off);
    });
    tl.to(q('.sigx__indicator'), { opacity: 0, duration: 0.04 }, 0.78);

    // 1. WE CREATE — the resting first frame (visible in CSS), so it is on
    // stage as the section scrolls in. The pin opens by leaning it back.
    tl.fromTo(q('.sigx__word--create'), { scale: 1 }, { scale: 1.06, duration: 0.15 }, 0.02);
    tl.to([q('.sigx__word--we'), q('.sigx__word--create')], { opacity: 0, yPercent: -30, duration: 0.05, ease: MOTION.ease.exit }, 0.17);

    // 2. SPACES — arrives from depth
    tl.fromTo(q('.sigx__word--spaces'), { opacity: 0, scale: 1.5, z: -300 }, { opacity: 1, scale: 1, z: 0, duration: 0.09, ease: MOTION.ease.ui }, 0.22);
    tl.to(q('.sigx__word--spaces'), { opacity: 0, scale: 0.8, duration: 0.05, ease: MOTION.ease.exit }, 0.34);

    // 3. EXPERIENCES — the six frames fan in around the word
    tl.fromTo(q('.sigx__word--experiences'), { opacity: 0, scale: 0.7, z: -400 }, { opacity: 1, scale: 1, z: 0, duration: 0.09, ease: MOTION.ease.ui }, 0.40);
    SIGX_CARDS.forEach((c) => {
        tl.fromTo(q(`.sigx__slot--${c.n}`),
            { opacity: 0, x: c.fx, y: c.fy, scale: 0.9, rotateY: c.ry * 2 },
            { opacity: 1, x: 0, y: 0, scale: 1, rotateY: c.ry, duration: 0.08, ease: 'power2.out' },
            c.at);
    });
    tl.to(q('.sigx__word--experiences'), { opacity: 0, scale: 1.15, duration: 0.05, ease: MOTION.ease.exit }, 0.55);

    // 4. MEMORY — frames drift outward and fade toward an afterimage
    tl.fromTo(q('.sigx__word--memory'), { opacity: 0, scale: 0.7, z: -300 }, { opacity: 1, scale: 1, z: 0, duration: 0.08, ease: MOTION.ease.ui }, 0.60);
    SIGX_CARDS.forEach((c) => {
        tl.to(q(`.sigx__slot--${c.n}`), { x: c.dx, y: c.dy, scale: 1.25, opacity: 0.14, duration: 0.18 }, 0.60);
    });
    tl.to(q('.sigx__word--memory'), { opacity: 0, scale: 1.3, duration: 0.05, ease: MOTION.ease.exit }, 0.72);

    // 5. Manifesto — lands and underlines.
    tl.to(q('.sigx__final'), { opacity: 1, duration: 0.02 }, 0.77);
    tl.fromTo(q('.sigx__final-line1'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.06, ease: MOTION.ease.ui }, 0.78);
    tl.fromTo(q('.sigx__final-line2'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.07, ease: MOTION.ease.ui }, 0.80);
    tl.fromTo(q('.sigx__final-underline'), { scaleX: 0 }, { scaleX: 1, duration: 0.05, ease: 'power2.out' }, 0.82);

    // 6. Dissolve and hand off to ARCHITECTURE IN MOTION (restored from the
    // pre-redesign build, values unchanged): the ten project slots all arrive
    // on the same beat, each sliding in from the edge it sits nearest, while
    // the heading and CTA fade up in the empty middle of the composition.
    tl.to(q('.sigx__final'), { opacity: 0, y: -25, duration: 0.04 }, 0.86);
    tl.to(q('.sigx__world'), { opacity: 0, duration: 0.04 }, 0.86);
    tl.set(q('.sigx__matrix'), { pointerEvents: 'none' }, 0.84);
    tl.to(q('.sigx__matrix'), { opacity: 1, duration: 0.03 }, 0.87);
    SIGX_MATRIX.forEach((m) => {
        tl.fromTo(q(`.sigx__mslot--${m.id}`),
            { opacity: 0, x: m.x, y: m.y, scale: 0.85 },
            { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.05, ease: 'power3.out' },
            0.88);
    });
    tl.fromTo(q('.sigx__matrix-centre'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.05, ease: 'power3.out' }, 0.89);
    tl.set(q('.sigx__matrix'), { pointerEvents: 'auto' }, 0.94);

    // Anchor the timeline's length to 1.0 so every position above maps
    // straight onto scroll progress, and the finished grid holds on screen
    // for the last stretch of the pin.
    tl.set(q('.sigx__matrix'), { opacity: 1 }, 1.0);
}

// ── Stats: count up once ─────────────────────────────────────────────────
if (!reduced) {
    document.querySelectorAll('.stat__num[data-count]').forEach((el) => {
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const counter = { v: 0 };
        el.textContent = `0${suffix}`;
        ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            once: true,
            onEnter: () => gsap.to(counter, {
                v: target, duration: 1.6, ease: 'power2.out',
                onUpdate: () => { el.textContent = `${Math.round(counter.v)}${suffix}`; },
            }),
        });
    });
}

// Masked headline lines across the dark sections.
revealLines(document.querySelectorAll('.crew__title [data-line]'), '.crew__title');
revealLines(document.querySelectorAll('.contact__headline-line'), '.contact__headline');
revealLines(document.querySelectorAll('.contact__closing-line'), '.contact__closing', 'top 90%');

// ── Capabilities: vocabulary moving against the scroll ───────────────────
const vocabRow = document.querySelector('.vocab__row');
if (vocabRow && !reduced) {
    gsap.fromTo(vocabRow, { xPercent: 0 }, {
        xPercent: -38,
        ease: MOTION.ease.linear,
        scrollTrigger: { trigger: '.capabilities', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    });
}

// ── Crew: panoramic environment ──────────────────────────────────────────
// Opens from a centred mask as it arrives; the photograph drifts inside the
// frame for the whole pass.
const pano = document.querySelector('.crew__pano-media');
if (pano && !reduced) {
    const panoImg = pano.querySelector('img');
    gsap.timeline({ scrollTrigger: { trigger: pano, start: 'top 95%', end: 'center 55%', scrub: 0.6 } })
        .fromTo(pano, { clipPath: () => (window.innerWidth < 640 ? 'inset(0% 8% 0% 8% round 4px)' : 'inset(0% 18% 0% 18% round 4px)') },
            { clipPath: 'inset(0% 0% 0% 0% round 4px)', ease: MOTION.ease.linear }, 0);
    gsap.fromTo(panoImg, { yPercent: -6, scale: 1.12 }, {
        yPercent: 6, scale: 1, ease: MOTION.ease.linear,
        scrollTrigger: { trigger: pano, start: 'top bottom', end: 'bottom top', scrub: true },
    });
}

// ── Disciplines: floating preview ────────────────────────────────────────
// Desktop only. Touch and narrow layouts render the photograph inside the
// row instead (CSS), so there is nothing to follow there.
const discPreview = document.querySelector('#disc-preview');
const discList = document.querySelector('.disciplines');
if (discPreview && discList && finePointer && !reduced) {
    const img = discPreview.querySelector('img');
    const px = gsap.quickTo(discPreview, 'x', { duration: 0.6, ease: MOTION.ease.ui });
    const py = gsap.quickTo(discPreview, 'y', { duration: 0.6, ease: MOTION.ease.ui });
    // Sits right of the pointer so it never covers the title being read.
    gsap.set(discPreview, { xPercent: 12, yPercent: -50, scale: 0.9 });

    discList.addEventListener('pointermove', (e) => { px(e.clientX); py(e.clientY); }, { passive: true });
    discList.querySelectorAll('.discipline').forEach((row) => {
        row.addEventListener('pointerenter', (e) => {
            if (img.getAttribute('src') !== row.dataset.img) img.src = row.dataset.img;
            gsap.set(discPreview, { x: e.clientX, y: e.clientY });
            gsap.to(discPreview, { autoAlpha: 1, scale: 1, duration: MOTION.dur.normal, ease: MOTION.ease.ui, overwrite: 'auto' });
        });
    });
    discList.addEventListener('pointerleave', () => {
        gsap.to(discPreview, { autoAlpha: 0, scale: 0.9, duration: MOTION.dur.fast, ease: MOTION.ease.exit, overwrite: 'auto' });
    });
}

// ── Capability band: second copy for the seamless CSS loop ───────────────
const bandGroup = document.querySelector('.band__group');
if (bandGroup) {
    const copy = bandGroup.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    bandGroup.after(copy);
}

// ── Testimonials ticker ──────────────────────────────────────────────────
const tgViewport = document.querySelector('#tg-viewport');
const tgTrack = document.querySelector('#tg-track');
if (tgViewport && tgTrack) {
    const first = tgTrack.querySelector('.tg-group');
    const clone = first.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('img').forEach((i) => { i.alt = ''; });
    tgTrack.appendChild(clone);

    const BASE_VELOCITY = 0.35;      // px per frame at 60fps: calm, editorial pace
    const SCROLL_BOOST_FACTOR = 0.04;
    const MAX_SCROLL_BOOST = 1.2;
    const BOOST_DECAY = 0.06;        // per-frame ease back to base speed
    const JUMP_EASE = 0.14;          // per-frame ease for next/prev nudges

    let groupWidth = 0;
    let cardStep = 0;
    let position = 0;
    let scrollBoost = 0;
    let jumpRemaining = 0;
    let hovering = false;
    let running = false;

    const measure = () => {
        const gap = parseFloat(getComputedStyle(tgTrack).columnGap) || 0;
        groupWidth = first.getBoundingClientRect().width + gap;
        const card = first.querySelector('.tg-card');
        if (card) cardStep = card.getBoundingClientRect().width + gap;
    };

    const tick = (time, deltaTime) => {
        if (!groupWidth) return;
        const dt = Math.min(deltaTime, 50) / (1000 / 60);
        scrollBoost += (0 - scrollBoost) * Math.min(BOOST_DECAY * dt, 1);
        const velocity = reduced || hovering ? 0 : BASE_VELOCITY + scrollBoost;
        position += velocity * dt;
        if (jumpRemaining !== 0) {
            const step = jumpRemaining * Math.min(JUMP_EASE * dt, 1);
            position += step;
            jumpRemaining -= step;
            if (Math.abs(jumpRemaining) < 0.5) { position += jumpRemaining; jumpRemaining = 0; }
        }
        position = ((position % groupWidth) + groupWidth) % groupWidth;
        tgTrack.style.transform = `translate3d(${-position}px, 0, 0)`;
    };

    const start = () => { if (running) return; measure(); gsap.ticker.add(tick); running = true; };
    const stop = () => { if (!running) return; gsap.ticker.remove(tick); running = false; };

    // Only tick while the section is on screen.
    ScrollTrigger.create({
        trigger: tgViewport,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? start() : stop()),
    });

    lenis?.on('scroll', ({ velocity }) => {
        if (!running || typeof velocity !== 'number') return;
        scrollBoost = Math.min(scrollBoost + Math.abs(velocity) * SCROLL_BOOST_FACTOR, MAX_SCROLL_BOOST);
    });

    tgViewport.addEventListener('pointerenter', () => { hovering = true; });
    tgViewport.addEventListener('pointerleave', () => { hovering = false; });
    document.querySelector('#tg-next')?.addEventListener('click', () => { start(); jumpRemaining += cardStep; });
    document.querySelector('#tg-prev')?.addEventListener('click', () => { start(); jumpRemaining -= cardStep; });

    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(measure, 150); });
    window.addEventListener('load', measure);
}

// ── Contextual cursor ────────────────────────────────────────────────────
// Only over [data-cursor] media (projects, hero reel): a labelled disc takes
// over from the pointer there. Elsewhere the native pointer is untouched.
// Transform-only (quickTo x/y), fine pointers only, never with reduced motion.
if (cursorEl && finePointer && !reduced) {
    root.classList.add('has-cursor');
    const cx = gsap.quickTo(cursorEl, 'x', { duration: MOTION.dur.instant, ease: MOTION.ease.ui });
    const cy = gsap.quickTo(cursorEl, 'y', { duration: MOTION.dur.instant, ease: MOTION.ease.ui });
    window.addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); }, { passive: true });

    document.querySelectorAll('[data-cursor]').forEach((host) => {
        host.addEventListener('pointerenter', () => {
            cursorHost = host;
            setCursorLabel(host);
            cursorEl.classList.add('is-active');
        });
        host.addEventListener('pointerleave', () => {
            cursorHost = null;
            cursorEl.classList.remove('is-active');
        });
    });
    // Controls inside the hero sit above the reel: hand the pointer back.
    document.querySelectorAll('.hero__inner a, .hero__inner button').forEach((el) => {
        el.addEventListener('pointerenter', () => cursorEl.classList.remove('is-active'));
        el.addEventListener('pointerleave', () => { if (cursorHost) cursorEl.classList.add('is-active'); });
    });
} else if (cursorEl) {
    cursorEl.remove();
}

// ── CONTACT ──────────────────────────────────────────────────────────────
// No backend on this site: a valid brief is handed to the mail client and a
// short confirmation plays over the section.
const contactEl = document.querySelector('#connect.contact');
const contactForm = document.querySelector('#contact-form');
if (contactEl && contactForm) {
    const emailPattern = /^\S+@\S+\.\S+$/;
    const nameInput = document.querySelector('#contact-name');
    const emailInput = document.querySelector('#contact-email');
    const noteEl = document.querySelector('#contact-note');
    let locked = false;

    const markInvalid = (input, invalid) => {
        input?.closest('.field')?.classList.toggle('is-invalid', invalid);
        input?.setAttribute('aria-invalid', String(invalid));
    };
    [nameInput, emailInput].forEach((input) => input?.addEventListener('input', () => markInvalid(input, false)));

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (locked) return;

        const values = {
            name: (nameInput?.value || '').trim(),
            email: (emailInput?.value || '').trim(),
            company: (document.querySelector('#contact-company')?.value || '').trim(),
            brief: (document.querySelector('#contact-brief')?.value || '').trim(),
        };
        const nameOk = values.name.length > 1;
        const emailOk = emailPattern.test(values.email);
        markInvalid(nameInput, !nameOk);
        markInvalid(emailInput, !emailOk);

        if (!nameOk || !emailOk) {
            (nameOk ? emailInput : nameInput)?.focus();
            if (noteEl) noteEl.textContent = !nameOk ? 'Please add your name' : 'Please add a valid email';
            return;
        }

        locked = true;
        if (noteEl) noteEl.textContent = 'Opening your mail client';
        contactEl.querySelectorAll('.field__input, #contact-submit').forEach((el) => { el.disabled = true; });

        const subject = encodeURIComponent(`Project brief — ${values.name}${values.company ? ` (${values.company})` : ''}`);
        const body = encodeURIComponent([
            values.brief || 'A date, a city, a product that needs an audience.',
            '',
            `Name: ${values.name}`,
            `Email: ${values.email}`,
            values.company ? `Company / Brand: ${values.company}` : null,
        ].filter(Boolean).join('\n'));
        window.location.href = `mailto:hello@rockcastle.com?subject=${subject}&body=${body}`;

        const flash = document.querySelector('#contact-flash');
        const line = document.querySelector('#contact-flash-line');
        const words = contactEl.querySelectorAll('.contact__flash-char');
        const sub = document.querySelector('#contact-flash-sub');
        const finish = () => {
            gsap.set(flash, { visibility: 'hidden' });
            flash.setAttribute('aria-hidden', 'true');
            scrollToTarget(contactEl.querySelector('.contact__credits'));
        };
        flash.setAttribute('aria-hidden', 'false');

        if (reduced) {
            gsap.set(flash, { visibility: 'visible', opacity: 1 });
            setTimeout(() => { gsap.set(flash, { opacity: 0 }); finish(); }, 2400);
            return;
        }

        gsap.set(flash, { visibility: 'visible', opacity: 0 });
        gsap.timeline()
            .to(flash, { opacity: 1, duration: MOTION.dur.fast, ease: MOTION.ease.ui })
            .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: MOTION.dur.reveal, ease: MOTION.ease.spatial }, '-=0.1')
            .fromTo(words, { yPercent: 105, y: 0 }, { yPercent: 0, y: 0, duration: MOTION.dur.reveal, ease: MOTION.ease.spatial, stagger: 0.08 }, '-=0.4')
            .fromTo(sub, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: MOTION.dur.normal, ease: MOTION.ease.ui }, '-=0.3')
            .to(flash, { opacity: 0, duration: MOTION.dur.normal, delay: 1.6, ease: MOTION.ease.inOut, onComplete: finish });
    });
}

// ── WhatsApp float: between hero and footer only ─────────────────────────
const whatsapp = document.querySelector('.whatsapp');
const footerEl = document.querySelector('#footer');
if (whatsapp && heroEl && footerEl) {
    let pastHero = false;
    let atFooter = false;
    const sync = () => whatsapp.classList.toggle('is-visible', pastHero && !atFooter);
    ScrollTrigger.create({ trigger: heroEl, start: 'bottom 60%', onToggle: (self) => { pastHero = self.isActive; sync(); }, end: 'max' });
    ScrollTrigger.create({ trigger: footerEl, start: 'top bottom', end: 'max', onToggle: (self) => { atFooter = self.isActive; sync(); } });
} else if (whatsapp) {
    whatsapp.classList.add('is-visible');
}

// ── Refresh once layout has settled ──────────────────────────────────────
// Only re-refresh after load if something actually changed height — an
// unconditional refresh would recompute the Signature pin while the user may
// already be scrolling through it.
requestAnimationFrame(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    const settledHeight = root.scrollHeight;
    window.addEventListener('load', () => {
        if (root.scrollHeight !== settledHeight) ScrollTrigger.refresh();
    });
});
