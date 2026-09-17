import { useEffect, useRef, useState } from 'react';
import { configureInlineVideo } from '../utils/mediaFix';

export default function ChapterFourSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

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
            video.play().then(() => setIsPlaying(true)).catch(() => {});
          } else {
            video.pause();
            setIsPlaying(false);
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
      id="chapter-four"
      className="ch4-section"
      aria-label="Chapter 04: Above the City. Beyond the Clock."
    >
      <div className="ch4-container">
        {/* Top Meta Bar */}
        <div className="ch4-meta-bar">
          <span className="ch4-meta-tag">CHAPTER 04 &mdash; TIMELESS ACCESS</span>
          <span className="ch4-meta-coord">PRIVATE HELIPAD &bull; DIRECT AIR ACCESS</span>
        </div>

        {/* Header Block with Title & Divider */}
        <div className="ch4-header">
          <h2 className="ch4-title">
            Above the City.<br />
            <span className="ch4-title-italic">Beyond the Clock.</span>
          </h2>
          <div className="ch4-divider" aria-hidden="true" />
        </div>

        {/* Narrative Prose Block */}
        <div className="ch4-prose-container">
          <p className="ch4-prose-opening">
            Because some moments cannot wait for traffic.
          </p>

          <p className="ch4-prose-vignette">
            A surprise landing for your daughter’s birthday. A Kochi board meeting and back by dinner.
          </p>

          <p className="ch4-prose-closing">
            At The Skye, every journey begins from a place designed for people whose time is their most valuable asset.
          </p>
        </div>

        {/* Premium Time-Saved / Direct Route Callouts (Elevated for Tablet & Desktop) */}
        <div className="ch4-callout-grid">
          <div className="ch4-callout-card">
            <span className="ch4-callout-value">KOCHI</span>
            <span className="ch4-callout-time">35 MIN</span>
            <span className="ch4-callout-label">Direct Helipad Transit</span>
          </div>
          <div className="ch4-callout-card">
            <span className="ch4-callout-value">BENGALURU</span>
            <span className="ch4-callout-time">65 MIN</span>
            <span className="ch4-callout-label">Air Charter Corridor</span>
          </div>
          <div className="ch4-callout-card">
            <span className="ch4-callout-value">CALICUT AIRPORT</span>
            <span className="ch4-callout-time">08 MIN</span>
            <span className="ch4-callout-label">Direct Runway Link</span>
          </div>
        </div>

        {/* Hero Media: Helicopter Landing / Helipad Aerial Showcase */}
        <div className="ch4-media-wrapper">
          <div className="ch4-media-topbar">
            <span className="ch4-badge-num">04 &mdash; PRIVATE HELIPAD FACILITY</span>
            <span className="ch4-badge-loc">KASHMIR KUNNU ELEVATION 673M</span>
          </div>

          <div className="ch4-media-frame">
            <video
              ref={videoRef}
              className="ch4-video"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="https://res.cloudinary.com/pcodbmuo/video/upload/so_1/v1786006446/Helicopter_landing_at_luxury_villa_202608061423_gvez08.jpg"
              src="https://res.cloudinary.com/pcodbmuo/video/upload/v1786006446/Helicopter_landing_at_luxury_villa_202608061423_gvez08.mp4"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
