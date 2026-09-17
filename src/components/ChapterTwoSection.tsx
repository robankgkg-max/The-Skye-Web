import { useEffect, useRef, useState } from 'react';
import { configureInlineVideo } from '../utils/mediaFix';

export default function ChapterTwoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);

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
      id="chapter-two"
      className="ch2-section"
      aria-label="Chapter 02: Minutes Away. Worlds Apart."
    >
      <div className="ch2-container">
        {/* Top Header */}
        <div className="ch2-header">
          <div className="ch2-meta-row">
            <span className="ch2-meta-tag">CHAPTER 02 &mdash; LOCATION</span>
            <span className="ch2-meta-coord">11.2588&deg; N, 75.7804&deg; E</span>
          </div>

          <h2 className="ch2-title">
            Minutes Away.<br />
            Worlds Apart.
          </h2>

          <div className="ch2-divider-top" aria-hidden="true" />
        </div>

        {/* Dynamic Editorial Content Stage */}
        <div className="ch2-stage">
          {/* Primary Feature Video: Woman tours luxury residence */}
          <div className="ch2-media-frame ch2-video-frame">
            <span className="ch2-num-badge">02 &mdash;</span>
            <video
              ref={videoRef}
              className="ch2-video"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="https://res.cloudinary.com/pcodbmuo/video/upload/so_1/v1786001987/Woman_tours_luxury_residence_1080p_202608051751_v8ls8k.jpg"
              src="https://res.cloudinary.com/pcodbmuo/video/upload/v1786001987/Woman_tours_luxury_residence_1080p_202608051751_v8ls8k.mp4"
            />
          </div>

          {/* Editorial Narrative & Distance Callouts */}
          <div className="ch2-editorial">
            <div className="ch2-telemetry-grid">
              <div className="ch2-telemetry-card">
                <span className="ch2-telemetry-time">20 <small>MIN</small></span>
                <span className="ch2-telemetry-label">To Calicut International Airport</span>
              </div>
              <div className="ch2-telemetry-card">
                <span className="ch2-telemetry-time">05 <small>MIN</small></span>
                <span className="ch2-telemetry-label">To IIM Kozhikode</span>
              </div>
            </div>

            <div className="ch2-prose">
              <p className="ch2-lead">
                In 20 minutes, you’re at the airport.
              </p>
              <p className="ch2-lead">
                In 5, you’re at IIM Kozhikode.
              </p>
              <p className="ch2-conclusion">
                But the moment you arrive home &mdash; the city that demands everything from you becomes nothing more than a view from your window.
              </p>
            </div>
          </div>
        </div>

        {/* Master Plan Map Presentation */}
        <div className="ch2-map-wrapper">
          <div className="ch2-map-header">
            <span className="ch2-map-caption">KASHMIR KUNNU RESIDENTIAL MASTER ENCLAVE &bull; 600M FROM NH 766</span>
            <button
              type="button"
              className="ch2-map-zoom-btn"
              onClick={() => setIsMapExpanded(!isMapExpanded)}
              aria-label={isMapExpanded ? "Contract master plan view" : "Expand master plan view"}
            >
              {isMapExpanded ? 'Fit View' : 'Inspect Details'}
            </button>
          </div>

          <div
            className={`ch2-map-frame ${isMapExpanded ? 'is-expanded' : ''}`}
            onClick={() => setIsMapExpanded(!isMapExpanded)}
            title="Click to toggle expanded view"
          >
            <img
              src="https://res.cloudinary.com/pcodbmuo/image/upload/v1786002490/ChatGPT_Image_Aug_6_2026_01_17_27_PM_ar1rzq.webp"
              alt="The Skye Kashmir Kunnu Master Plan showing connectivity 600 meters from NH 766"
              className="ch2-map-image"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="ch2-map-pill">
              <span>600 METERS FROM NH 766 &bull; CALICUT BYPASS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
