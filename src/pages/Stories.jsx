import Navigation from '../components/Navigation'
import PageHero from './PageHero'
import WhoWeAre from '../components/WhoWeAre'
import Leadership from '../components/Leadership'
import ClientStories from '../components/client-stories/ClientStories'
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
        <WhoWeAre />
        <Leadership />
        <ClientStories id="testimonials" theme="light" />
        <Crew />
      </main>
      <Footer />
    </>
  )
}
