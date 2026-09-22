import Navigation from '../components/Navigation'
import PageHero from './PageHero'
import Signature from '../components/Signature'
import Work from '../components/Work'
import Footer from '../components/Footer'

export default function MadeByRockCastle() {
  return (
    <>
      <Navigation />
      <main>
        <PageHero
          tag="[ MADE BY ROCK CASTLE ]"
          currentPage="MADE BY ROCK CASTLE"
          title="MONUMENTAL"
          accent="EXPERIENCES."
          subtitle="Twelve years of spatial architecture, immersive environments, and cultural pavilions fabricated and engineered from our Dubai atelier."
        />
        <Signature />
        <Work />
      </main>
      <Footer />
    </>
  )
}
