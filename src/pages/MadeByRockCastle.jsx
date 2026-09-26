import Navigation from '../components/Navigation'
import DomeGallery from '../components/DomeGallery'
import Footer from '../components/Footer'

export default function MadeByRockCastle() {
  return (
    <>
      <Navigation />
      <main>

        {/* Dome Gallery - Immersive 3D image sphere */}
        <section style={{ width: '100%', height: '100vh', position: 'relative' }}>
          <DomeGallery
            fit={0.8}
            minRadius={700}
            maxVerticalRotationDeg={4}
            segments={28}
            dragDampening={1.8}
            grayscale={false}
            autoRotate={true}
            autoRotateSpeed={8}
          />
        </section>

      </main>
      <Footer />
    </>
  )
}
