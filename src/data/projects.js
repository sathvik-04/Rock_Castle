// Shared project data — used by the Work grid and each project's case-study
// page (src/components/CaseStudy.jsx). Drop real photos/videos into
// `placeholder` fields' spots when they're ready; everything else here is
// real copy, not filler.
export const projects = [
  {
    slug: 'the-pavilion',
    name: 'The Pavilion',
    client: 'Northwind Motors',
    year: '2024',
    location: 'Dubai, UAE',
    category: 'experience',
    catLabel: 'Experience Design',
    tagline: 'A brand pavilion built to be a destination, not a booth.',
    stats: [
      { value: '2,400', label: 'Square Metres' },
      { value: '18', label: 'Days To Build' },
      { value: '40K+', label: 'Visitors' },
    ],
    brief: 'A global brand needed more than a booth — they needed a destination. The challenge: create an architectural experience that would stop people in their tracks and hold them there.',
    idea: 'One continuous path: visitors were pulled through a sequence of compressed, dark corridors that suddenly opened into a full-height atrium — the reveal was the whole idea.',
    design: 'Sketches became renders, renders became load calculations. A steel-frame lattice shell wrapped in tensioned fabric let daylight through without ever showing the structure holding it up.',
    result: 'Doors opened. Lights on. The space that began as a conversation now holds thousands. The idea became an experience people talk about long after they\'ve left.',
    shots: ['Arrival — Wide', 'Atrium — Reveal', 'Crowd — Reaction', 'Fabrication — BTS', 'Lighting Plot', 'Exit — Night'],
    placeholder: '[ PROJECT IMAGE ]',
    image: '/images/work-01.webp',
  },
  {
    slug: 'meridian-tower',
    name: 'Meridian Tower',
    client: 'Meridian Group',
    year: '2023',
    location: 'Dubai, UAE',
    category: 'spatial',
    catLabel: 'Spatial Design',
    tagline: 'A corporate HQ redesigned as a spatial narrative, not a floor plan.',
    stats: [
      { value: '14', label: 'Floors Reworked' },
      { value: '6', label: 'Months' },
      { value: '1,200', label: 'Staff Relocated' },
    ],
    brief: 'A headquarters that felt like any other office block. The brief: turn the building itself into a statement about who the company is, floor by floor.',
    idea: 'Every floor got its own material language tied to a stage of the company\'s history — the ground floor told the origin story, the top floor told where they were headed.',
    design: 'Material palettes, lighting temperature, and even acoustic treatment were mapped floor-by-floor before a single wall moved, so the transitions between levels read as chapters.',
    result: 'Corporate headquarters transformed into a living, breathing spatial narrative — leadership now walks candidates through the building instead of a deck.',
    shots: ['Lobby — Wide', 'Floor 04 — Detail', 'Stair Core', 'Material Study', 'Night Elevation', 'Staff Walkthrough'],
    placeholder: '[ PROJECT IMAGE ]',
    image: '/images/work-02.webp',
  },
  {
    slug: 'horizon-festival',
    name: 'Horizon Festival',
    client: 'Apex Studios',
    year: '2024',
    location: 'Dubai, UAE',
    category: 'brand',
    catLabel: 'Brand Experience',
    tagline: 'Three days, one activation, architecture built to move with the crowd.',
    stats: [
      { value: '3', label: 'Days' },
      { value: '11', label: 'Moving Parts' },
      { value: '25K', label: 'Attendees' },
    ],
    brief: 'A three-day experiential brand activation fusing architecture, light, and sound — with eleven moving parts across three days that all had to land on cue, every time.',
    idea: 'Rather than one fixed stage, the whole site was built as a kit of modular structures that reconfigured overnight, so the festival felt different each morning.',
    design: 'Rigging, load-in routes, and power distribution were planned around a 6-hour overnight turnaround window — the real design constraint was the clock, not the concept.',
    result: 'Our activation had eleven moving parts across three days. Rockcastle\'s on-ground team never once made that our problem — the client\'s words, not ours.',
    shots: ['Site — Aerial', 'Stage — Build', 'Crowd — Night 1', 'Rigging — BTS', 'Sound Check', 'Load-Out'],
    placeholder: '[ PROJECT VIDEO ]',
    image: '/images/work-03.webp',
  },
  {
    slug: 'continuum-pavilion',
    name: 'Continuum Pavilion',
    client: 'Al Wasl Cultural District',
    year: '2024',
    location: 'Dubai, UAE',
    category: 'spatial',
    catLabel: 'Spatial Installation',
    tagline: 'A kinetic architectural pavilion engineered for 24-hour light shifts.',
    stats: [
      { value: '3,200', label: 'Square Metres' },
      { value: '22', label: 'Days To Build' },
      { value: '60K+', label: 'Visitors' },
    ],
    brief: 'A temporary cultural pavilion that transformed its spatial volume from sunrise to midnight.',
    idea: 'Light-reactive louvers and kinetic steel planes dynamically filtering natural and theatrical light.',
    design: 'Full bespoke steel fabrication and computer-choreographed lighting nodes integrated into the structure.',
    result: 'Over sixty thousand visitors over two weeks; hailed as Dubai’s most daring temporary pavilion.',
    shots: ['Dawn — Exterior', 'Interior — Kinetic Louvers', 'Night — Lighting Plot'],
    placeholder: '[ PROJECT IMAGE ]',
    image: '/images/signature-01.webp',
  },
]

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug)
}

export function getAdjacentProject(slug) {
  const idx = projects.findIndex((p) => p.slug === slug)
  if (idx === -1) return projects[0]
  return projects[(idx + 1) % projects.length]
}
