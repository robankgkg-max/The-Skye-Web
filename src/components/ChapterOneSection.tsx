import { useEffect, useRef } from 'react';
import { configureInlineVideo } from '../utils/mediaFix';

export default function ChapterOneSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    configureInlineVideo(video, { muted: true, loop: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.muted = true;
            video.defaultMuted = true;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="chapter-one"
      className="ch1-section"
      aria-label="Chapter 01: The Last Hilltop Of Its Kind"
    >
      {/* Subtle background ambient watermark or coordinate accents */}
      <span className="ch1-coord-tag">01 &mdash; KASHMIR KUNNU</span>

      {/* Header Block */}
      <div className="ch1-header">
        <p className="ch1-eyebrow">WHY THE SKYE</p>
        <h2 className="ch1-title">
          The Last Hilltop<br />Of Its Kind.
        </h2>
        <div className="ch1-accent-line" aria-hidden="true" />
      </div>

      {/* Main Media & Editorial Stage */}
      <div className="ch1-stage">
        {/* Primary Video: Woman relaxing in luxury home */}
        <div className="ch1-media-frame ch1-video-frame">
          <span className="ch1-num-badge">01 &mdash;</span>
          <video
            ref={videoRef}
            className="ch1-video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="https://res.cloudinary.com/pcodbmuo/video/upload/so_1/v1786000303/Woman_relaxing_in_luxury_home_202608061241_w60faq.jpg"
            src="https://res.cloudinary.com/pcodbmuo/video/upload/v1786000303/Woman_relaxing_in_luxury_home_202608061241_w60faq.mp4"
          />
        </div>

        {/* Manifesto / Editorial Statement */}
        <div className="ch1-manifesto">
          <div className="ch1-divider-top" aria-hidden="true" />

          <div className="ch1-text-group">
            <p className="ch1-statement ch1-statement-primary">
              Kashmir Kunnu cannot be replicated, rezoned, or rebuilt.
            </p>
            <p className="ch1-statement ch1-statement-secondary">
              When these 62 villas are gone &mdash;<br className="hidden md:inline" />
              this address disappears from the market forever.
            </p>
            <div className="ch1-urgency-group">
              <p className="ch1-urgency-item">There is no next batch.</p>
              <p className="ch1-urgency-item">There is no waitlist.</p>
              <p className="ch1-urgency-highlight">There is only now.</p>
            </div>
          </div>

          <div className="ch1-divider-bottom" aria-hidden="true" />
        </div>

        {/* Secondary Still: Yoga / Inner Sanctuary Image */}
        <div className="ch1-media-frame ch1-image-frame">
          <img
            src="https://res.cloudinary.com/pcodbmuo/image/upload/v1785878779/yoga_cvqspl.webp"
            alt="Sanctuary and stillness at The Skye, Kashmir Kunnu"
            className="ch1-image"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </section>
  );
}
