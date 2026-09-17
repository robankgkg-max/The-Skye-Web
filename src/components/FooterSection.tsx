export default function FooterSection() {
  return (
    <footer className="ts-footer" id="footer" aria-label="The Skye Footer">
      {/* The Skye Logo */}
      <a href="#hero" aria-label="The Skye Home" style={{ display: 'inline-block' }}>
        <img
          src="https://res.cloudinary.com/pcodbmuo/image/upload/v1785881715/The_sky_logo_r7luwt.webp"
          alt="The Skye"
          className="ts-footer__logo-skye"
          referrerPolicy="no-referrer"
        />
      </a>

      {/* Tagline */}
      <p className="ts-footer__tagline">
        The Skye is not just a residential project &mdash; it is a manifestation of a deeper intent.
        Perched on Kashmir Kunnu, a quiet hilltop in Kozhikode, conceived for those who lead
        with intent and seek spaces that elevate both living and thinking.
      </p>

      {/* Crietor Group Logo */}
      <a
        href="https://crietorgroup.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Crietor Group"
        style={{ display: 'inline-block' }}
      >
        <img
          src="https://res.cloudinary.com/pcodbmuo/image/upload/v1785881715/Creator_Logo_okorm9.webp"
          alt="Crietor Group"
          className="ts-footer__logo-crietor"
          referrerPolicy="no-referrer"
        />
      </a>

      {/* Quick Links */}
      <nav className="ts-footer__nav" aria-label="Quick Links">
        <span className="ts-footer__label">Quick Links</span>
        <ul>
          <li><a href="#hero">The Skye</a></li>
          <li><a href="#about">Private Residences</a></li>
          <li><a href="#why-opener">Location &amp; Accessibility</a></li>
          <li><a href="#exhale">Photo Gallery</a></li>
          <li><a href="#chapter-4">Video Gallery</a></li>
          <li><a href="#chapter-5">News &amp; Events</a></li>
          <li><a href="#footer">Contact Us</a></li>
        </ul>
      </nav>

      {/* Get in Touch */}
      <div className="ts-footer__contact">
        <span className="ts-footer__label">Get in Touch</span>
        <address className="ts-footer__contact-address">
          Second Floor, Emir Centre,<br />
          Eranjipalam, Calicut.
        </address>
        <a href="mailto:enquiry@theskye.in" className="ts-footer__contact-link">
          enquiry@theskye.in
        </a>
        <a href="tel:+914954916635" className="ts-footer__contact-link">
          +91 0495 491 6635
        </a>
        <a
          href="https://wa.me/919207880033"
          target="_blank"
          rel="noopener noreferrer"
          className="ts-footer__contact-link"
        >
          +91 92078 80033 (WhatsApp)
        </a>
      </div>

      {/* Social Icons */}
      <div className="ts-footer__social">
        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="ts-footer__social-btn">
          YT
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="ts-footer__social-btn">
          IG
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="ts-footer__social-btn">
          FB
        </a>
      </div>

      {/* Divider */}
      <hr className="ts-footer__divider" />

      {/* Bottom Bar */}
      <div className="ts-footer__bottom">
        <p>&copy; 2026 The Skye by Crietor Group. All rights reserved.</p>
        <p>
          RERA: K-RERA/PRJ/KKD/036/2026 &nbsp;|&nbsp;{' '}
          <a href="https://rera.kerala.gov.in" target="_blank" rel="noopener noreferrer">
            rera.kerala.gov.in
          </a>
        </p>
      </div>
    </footer>
  );
}
