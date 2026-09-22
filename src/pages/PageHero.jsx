import { Link } from 'react-router-dom'
import SlideUpText from '../components/ui/slide-up-text'
import './PageHero.css'

export default function PageHero({
  tag = 'ROCKCASTLE',
  title = '',
  accent = '',
  subtitle = '',
  currentPage = '',
}) {
  return (
    <section className="page-hero" aria-label={title}>
      <div className="page-hero__glow" aria-hidden="true" />
      <div className="page-hero__inner">
        <div className="page-hero__meta">
          <span className="page-hero__tag">
            <SlideUpText split="characters" stagger={0.02} inView={true} once={true}>
              {tag}
            </SlideUpText>
          </span>
          <span className="page-hero__breadcrumb">
            <Link to="/">HOME</Link> // {currentPage || tag}
          </span>
        </div>

        <h1 className="page-hero__title">
          <SlideUpText split="words" stagger={0.05} inView={true} once={true}>
            {title}
          </SlideUpText>
          {accent && (
            <>
              {' '}
              <span className="page-hero__title-accent">
                <SlideUpText split="words" stagger={0.05} delay={0.12} inView={true} once={true}>
                  {accent}
                </SlideUpText>
              </span>
            </>
          )}
        </h1>

        {subtitle && (
          <p className="page-hero__subtitle">
            <SlideUpText split="words" stagger={0.02} delay={0.18} inView={true} once={true}>
              {subtitle}
            </SlideUpText>
          </p>
        )}
      </div>
    </section>
  )
}
