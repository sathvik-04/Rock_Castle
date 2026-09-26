import Navigation from '../components/Navigation'
import PageHero from './PageHero'
import Process from '../components/Process'
import Services from '../components/Services'
import Footer from '../components/Footer'

export default function HowWeWork() {
  return (
    <>
      <Navigation />
      <main>
        <PageHero
          tag="[ HOW WE WORK ]"
          currentPage="HOW WE WORK"
          title="METHODOLOGY &"
          accent="FABRICATION."
          subtitle="From structural sign-off to Dubai floor fabrication and venue load-in — an integrated spatial engineering engine under one roof."
        />
        <Process />
        <Services />
      </main>
      <Footer />
    </>
  )
}
