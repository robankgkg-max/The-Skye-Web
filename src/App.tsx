import { useEffect, useRef, useState, useCallback } from 'react';
import CinematicScrollHero from './components/CinematicScrollHero';
import VisionSection from './components/VisionSection';
import MyHomeSections from './components/MyHomeSections';
import ArchitectSection from './components/ArchitectSection';
import WhyOpenerSection from './components/WhyOpenerSection';
import ChapterOneSection from './components/ChapterOneSection';
import ChapterTwoSection from './components/ChapterTwoSection';
import ChapterThreeSection from './components/ChapterThreeSection';
import ChapterFourSection from './components/ChapterFourSection';
import ChapterFiveSection from './components/ChapterFiveSection';
import PrivateResidencesSection from './components/PrivateResidencesSection';
import FooterSection from './components/FooterSection';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const totalSlides = 3;

  // Slide transition logic
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
  }, [totalSlides]);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [totalSlides]);

  // Scroll listener: show navbar only once user has completely scrolled past the hero section
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section') || document.getElementById('cinematic-hero');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        // Becomes visible only when the bottom of the hero section reaches or passes the top of the viewport
        setIsScrolled(heroBottom <= 80);
      } else {
        setIsScrolled(window.scrollY > window.innerHeight);
      }
    };

    handleScroll(); // Initial check on load (navbar will be hidden)
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Custom luxury cursor lerp animation
  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mouseX}px`;
        cursorRef.current.style.top = `${mouseY}px`;
      }
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }
      animId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(animateRing);

    // Attach hover detection to interactive elements
    const updateHoverListeners = () => {
      const targets = document.querySelectorAll<HTMLElement>('a, button, [role="button"], .hero-dot');
      targets.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovered(true));
        el.addEventListener('mouseleave', () => setIsHovered(false));
      });
    };

    updateHoverListeners();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [currentSlide, isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div id="skye-root" className="relative w-full min-h-screen">
      {/* Custom Fluid Cursor */}
      <div
        id="cursor"
        ref={cursorRef}
        className={isHovered ? 'hover' : ''}
        aria-hidden="true"
      />
      <div
        id="cursor-ring"
        ref={ringRef}
        aria-hidden="true"
      />

      {/* Fullscreen Mobile Navigation Overlay */}
      <div
        id="mobileMenu"
        className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}
        aria-modal="true"
        role="dialog"
      >
        <button
          type="button"
          className="mobile-menu-close"
          id="mobileClose"
          onClick={closeMenu}
          aria-label="Close navigation menu"
        >
          ✕
        </button>
        <a href="#hero" onClick={closeMenu}>Home</a>
        <a href="#about" onClick={closeMenu}>The Vision</a>
        <a href="#exhale" onClick={closeMenu}>My Home</a>
        <a href="#why-opener" onClick={closeMenu}>Why The Skye</a>
        <a href="#footer" onClick={closeMenu}>Contact</a>
      </div>

      {/* Primary Fixed Navigation Bar */}
      <nav id="nav" className={isScrolled ? 'scrolled' : ''}>
        <a href="#hero" id="nav-brand-link" aria-label="The Skye Home">
          <img
            src="https://res.cloudinary.com/pcodbmuo/image/upload/v1785881715/The_sky_logo_r7luwt.webp"
            alt="The Skye"
            className="nav-logo"
            referrerPolicy="no-referrer"
          />
        </a>

        <ul className="nav-links" id="desktop-nav-links">
          <li><a href="#about" id="nav-link-vision">The Vision</a></li>
          <li><a href="#exhale" id="nav-link-home">My Home</a></li>
          <li><a href="#why-opener" id="nav-link-why">Why The Skye</a></li>
          <li><a href="#footer" id="nav-link-contact">Contact</a></li>
        </ul>

        <a href="#footer" className="nav-cta" id="nav-cta-enquire">
          Enquire Now
        </a>

        <div
          className="nav-menu-toggle"
          id="navToggle"
          role="button"
          tabIndex={0}
          aria-label="Open menu"
          onClick={() => setIsMenuOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsMenuOpen(true);
            }
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      {/* Section 1: Cinematic Scroll-Driven Video Hero */}
      <CinematicScrollHero />

      {/* Section 2: The Skye Feature Slides Hero Section */}
      <section id="hero" aria-label="The Skye Hero Presentation">
        <div className="hero-slider" id="heroSwiper">
          <div className="swiper-wrapper">
            {/* Slide 1: Golf Hilltop */}
            <div
              id="hero-slide-0"
              className={`hero-slide ${currentSlide === 0 ? 'swiper-slide-active' : ''}`}
            >
              <picture>
                <source
                  media="(max-width: 768px)"
                  srcSet="https://res.cloudinary.com/pcodbmuo/image/upload/v1785878783/Golf_wsth6n.webp"
                />
                <img
                  src="https://res.cloudinary.com/pcodbmuo/image/upload/v1785887581/golf_web_hfluyk.webp"
                  alt="Kashmir Kunnu Hilltop"
                  className="hero-slide-img"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              </picture>
              <div className="hero-cover">
                <div className="hc-tl">
                  Kashmir Kunnu<br />The Rarest<br />Hilltop In<br />Calicut
                </div>
                <div className="hc-tr">
                  Serenity,<br />Altitude &amp;<br />Soul<br />Above The<br />Ordinary
                </div>
                <div className="hc-bl">
                  <h1 className="hc-headline">
                    Rise<br /><em>Above</em><br />The Rest.
                  </h1>
                  <span className="hc-sub">Private Residences for Visionaries</span>
                </div>
              </div>
            </div>

            {/* Slide 2: Pool & Sunset Video on Mobile */}
            <div
              id="hero-slide-1"
              className={`hero-slide ${currentSlide === 1 ? 'swiper-slide-active' : ''}`}
            >
              <picture>
                <source
                  media="(max-width: 768px)"
                  srcSet="https://res.cloudinary.com/pcodbmuo/image/upload/v1785878782/pool-0_oeucib.webp"
                />
                <img
                  src="https://res.cloudinary.com/pcodbmuo/image/upload/v1785878781/pool_qji0sb.webp"
                  alt="The Skye Pool"
                  className="hero-slide-img"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </picture>
              <video
                className="hero-slide-video"
                poster="https://res.cloudinary.com/pcodbmuo/video/upload/so_1/v1786021993/Woman_turns_at_sunset_1080p_202608061842_t3gta1.jpg"
                src="https://res.cloudinary.com/pcodbmuo/video/upload/v1786021993/Woman_turns_at_sunset_1080p_202608061842_t3gta1.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
              <div className="hero-cover hc-s2">
                <div className="hc-tl">
                  Where Only<br />The Rarest<br />Choose To Live
                </div>
                <div className="hc-tr">
                  The View<br />From The Top<br />Was Always<br />Yours.
                </div>
                <div className="hc-bl hc-bl-small">
                  <span className="hc-sub hc-sub-plain">
                    Residences '26<br />The Visionary Collection
                  </span>
                </div>
                <div className="hc-bl hc-br">
                  <h2 className="hc-headline">
                    You Always<br />Knew It Was<br />Up Here.
                  </h2>
                  <span className="hc-sub">4 &amp; 5 BHK Private Villas</span>
                </div>
              </div>
            </div>

            {/* Slide 3: Rolls Royce & Hilltop Elevation */}
            <div
              id="hero-slide-2"
              className={`hero-slide ${currentSlide === 2 ? 'swiper-slide-active' : ''}`}
            >
              <picture>
                <source
                  media="(max-width: 768px)"
                  srcSet="https://res.cloudinary.com/pcodbmuo/image/upload/v1785878780/Rollls-0_ha6bh2.webp"
                />
                <img
                  src="https://res.cloudinary.com/pcodbmuo/image/upload/v1785878780/Rolls_omdpey.webp"
                  alt="The Skye Rolls"
                  className="hero-slide-img"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </picture>
              <div className="hero-cover hc-s3">
                <div className="hc-tl">
                  Intent &amp;<br />Elevation<br />The Hill That<br />Chooses You
                </div>
                <div className="hc-tr">
                  Rare<br />&amp; Sovereign<br />Upper-Crest<br />Living
                </div>
                <div className="hc-bl">
                  <h2 className="hc-headline">
                    Yes You’re<br />Meant To Live<br />Above The Clouds
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Slider Pagination Indicators */}
        <div className="hero-indicators" id="hero-indicators">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              type="button"
              id={`hero-dot-${index}`}
              className={`hero-dot ${currentSlide === index ? 'active' : ''}`}
              data-slide={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Section 2 — The Vision / About */}
      <VisionSection />

      {/* Sections 3, 4, 5 — My Home: My Exhale, My Momentum, My Edge */}
      <MyHomeSections />

      {/* Section 6 — The Mind Behind The Skye */}
      <ArchitectSection />

      {/* Section 7 — Why The Skye: Five Chapters Opener */}
      <WhyOpenerSection />

      {/* Chapter 01 — The Last Hilltop Of Its Kind */}
      <ChapterOneSection />

      {/* Chapter 02 — Minutes Away. Worlds Apart. */}
      <ChapterTwoSection />

      {/* Chapter 03 — 62 Homes. One Hill. No Compromises. */}
      <ChapterThreeSection />

      {/* Chapter 04 — Above the City. Beyond the Clock. */}
      <ChapterFourSection />

      {/* Chapter 05 — The Company You Keep. */}
      <ChapterFiveSection />

      {/* The Residences — Private Residences for Visionaries */}
      <PrivateResidencesSection />

      {/* Official The Skye & Crietor Group Footer */}
      <FooterSection />
    </div>
  );
}
