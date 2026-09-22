import Navigation from '../components/Navigation'
import PageHero from './PageHero'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Connect() {
  return (
    <>
      <Navigation />
      <main>
        <PageHero
          tag="[ CONNECT & INITIATE ]"
          currentPage="CONNECT"
          title="LET'S BUILD"
          accent="SOMETHING MONUMENTAL."
          subtitle="Share your brief, explore partnership opportunities, or schedule a visit to our Dubai fabrication atelier."
        />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
