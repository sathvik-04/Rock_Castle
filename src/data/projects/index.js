import thePavilion from './the-pavilion'
import meridianTower from './meridian-tower'
import horizonFestival from './horizon-festival'
import continuumPavilion from './continuum-pavilion'
import luminaryAtrium from './luminary-atrium'
import kineticSoundstage from './kinetic-soundstage'
import solsticePavilion from './solstice-pavilion'
import mirageChamber from './mirage-chamber'

export {
  thePavilion,
  meridianTower,
  horizonFestival,
  continuumPavilion,
  luminaryAtrium,
  kineticSoundstage,
  solsticePavilion,
  mirageChamber,
}

export const projects = [
  thePavilion,
  meridianTower,
  horizonFestival,
  continuumPavilion,
  luminaryAtrium,
  kineticSoundstage,
  solsticePavilion,
  mirageChamber,
]

export function getProjectBySlug(slug) {
  if (!slug) return projects[0]
  const clean = slug.toLowerCase().replace(/[-_\s]/g, '')
  return (
    projects.find(
      (p) =>
        p.slug.toLowerCase() === slug.toLowerCase() ||
        p.slug.toLowerCase().replace(/[-_\s]/g, '') === clean ||
        p.name.toLowerCase().replace(/[-_\s]/g, '') === clean
    ) || projects[0]
  )
}

export function getAdjacentProject(slug) {
  const current = getProjectBySlug(slug)
  const idx = projects.findIndex((p) => p.slug === current?.slug)
  if (idx === -1) return projects[0]
  return projects[(idx + 1) % projects.length]
}

export default projects
