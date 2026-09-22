import Navigation from '../components/Navigation'
import PageHero from './PageHero'
import About from '../components/About'
import Testimonials from '../components/Testimonials'
import Crew from '../components/Crew'
import Footer from '../components/Footer'

export default function Stories() {
  return (
    <>
      <Navigation />
      <main>
        <PageHero
          tag="[ STORIES & CULTURE ]"
          currentPage="STORIES"
          title="ARCHITECTS OF"
          accent="THE UNTOLD."
          subtitle="The studio, the collective, and the visionary collaborations behind 140+ monumental builds across Dubai and the world."
        />
        <About />
        <Testimonials />
        <Crew />
      </main>
      <Footer />
    </>
  )
}
