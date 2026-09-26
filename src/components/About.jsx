import WhoWeAre from './WhoWeAre'
import Leadership from './Leadership'

/**
 * About component (Composite wrapper)
 * Preserved for backwards compatibility.
 * Renders both <WhoWeAre /> and <Leadership /> components in order.
 */
export default function About() {
  return (
    <>
      <WhoWeAre />
      <Leadership />
    </>
  )
}

export { WhoWeAre, Leadership }
