import './HeroSection.css'
import heroImage from '../assets/hero_nai.jpeg'

export default function HeroSection() {
  return (
    <section className="hero-section">
      <img 
        src={heroImage}
        alt="Hero" 
        className="hero-image"
      />
      <div className="hero-overlay">
        <header className="hero-header">
          <h1 className="logo-text">
            Recuerdos de Nai
          </h1>
          <p className="welcome-text">
            Aunque estés lejos, siempre estás en mis pensamientos
          </p>
        </header>
      </div>
    </section>
  )
}
