import { useEffect, useRef } from 'react';
import { configureInlineVideo } from '../utils/mediaFix';

export default function ChapterFiveSection() {
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
      id="chapter-five"
      className="ch5-section"
      aria-label="Chapter 03: The Company You Keep."
    >
      <div className="ch5-container">
        {/* Top Meta Bar */}
        <div className="ch5-meta-bar">
          <span className="ch5-meta-tag">CHAPTER 03 &mdash; THE COMMUNITY</span>
          <span className="ch5-meta-coord">THE PRIVATE CLUBHOUSE &bull; INVITATION ENCLAVE</span>
        </div>

        {/* Title Header */}
        <div className="ch5-header">
          <h2 className="ch5-title">
            The Company<br />
            <span className="ch5-title-italic">You Keep.</span>
          </h2>
          <div className="ch5-divider" aria-hidden="true" />
        </div>

        {/* Narrative Prose */}
        <div className="ch5-prose-wrap">
          <p className="ch5-lead">
            The people who live here don’t talk about price.
          </p>

          <p className="ch5-lead">
            They talk about legacy, intention, and what they’re building.
          </p>

          <p className="ch5-conclusion">
            At The Skye, your neighbours are founders, visionaries and leaders &mdash; people who chose this hill because ordinary addresses were never an option.
          </p>
        </div>

        {/* Video Presentation: Luxury Clubhouse with Billiards, Carrom & Valley View Lounge */}
        <div className="ch5-media-wrapper">
          <div className="ch5-media-meta">
            <span className="ch5-media-badge">05 &mdash; THE CLUB AT THE SKYE</span>
            <span className="ch5-media-tag">PRIVATE CIGAR &amp; BILLIARDS SALON</span>
          </div>

          <div className="ch5-media-frame">
            <video
              ref={videoRef}
              className="ch5-video"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="https://res.cloudinary.com/pcodbmuo/video/upload/so_1/v1786013055/Luxury_clubhouse_inside_exclusiv__1080p_202608061557_izqtnd.jpg"
              src="https://res.cloudinary.com/pcodbmuo/video/upload/v1786013055/Luxury_clubhouse_inside_exclusiv__1080p_202608061557_izqtnd.mp4"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
