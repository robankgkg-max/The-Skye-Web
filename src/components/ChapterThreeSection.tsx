import { useEffect, useRef, useState } from 'react';
import { configureInlineVideo } from '../utils/mediaFix';

export default function ChapterThreeSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeMetric, setActiveMetric] = useState<number>(0);

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

  const metricHighlights = [
    { label: "Sovereign Villas", value: "62", subtitle: "Private enclave on hilltop" },
    { label: "Undisturbed Acres", value: "10", subtitle: "Acres of pristine silence" },
    { label: "Absolute Privacy", value: "100%", subtitle: "Zero shared lobby density" }
  ];

  return (
    <section
      id="chapter-three"
      className="ch3-section"
      aria-label="Chapter 03: 62 Homes. One Hill. No Compromises."
    >
      <div className="ch3-container">
        {/* Top Meta Bar */}
        <div className="ch3-meta-bar">
          <span className="ch3-meta-tag">CHAPTER 03 &mdash; DENSITY &amp; SCALE</span>
          <span className="ch3-meta-coord">62 HOMES &bull; 10 ACRES OF SILENCE</span>
        </div>

        {/* Video Sanctuary Frame */}
        <div className="ch3-media-frame ch3-video-frame">
          <span className="ch3-num-badge">03 &mdash;</span>
          <video
            ref={videoRef}
            className="ch3-video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="https://res.cloudinary.com/pcodbmuo/video/upload/so_1/v1786003081/From_Klickpin.com-_Elegant_Wedding_Invitations_for_Fall-pin-id-1038572364075388162_tjtpje.jpg"
            src="https://res.cloudinary.com/pcodbmuo/video/upload/v1786003081/From_Klickpin.com-_Elegant_Wedding_Invitations_for_Fall-pin-id-1038572364075388162_tjtpje.mp4"
          />
          <div className="ch3-video-scrim" />
        </div>

        {/* The Manifesto Presentation */}
        <div className="ch3-manifesto">
          <div className="ch3-title-wrap">
            <h2 className="ch3-title">
              <span>62 Homes.</span>
              <span>One Hill.</span>
              <span className="ch3-title-accent">No Compromises.</span>
            </h2>
            <div className="ch3-divider" aria-hidden="true" />
          </div>

          <div className="ch3-prose">
            <p className="ch3-refusal">Not 400 units sharing a lobby.</p>
            <p className="ch3-refusal">Not a tower where your neighbour hears your mornings.</p>
            <p className="ch3-resolution">
              62 private villas on 10 acres of silence &mdash; where your community is curated, your space is sovereign, and your privacy is absolute.
            </p>
          </div>

          {/* Elevated Architectural Density Comparison (Desktop & Tablet Enhanced) */}
          <div className="ch3-metrics-grid">
            {metricHighlights.map((metric, idx) => (
              <div
                key={metric.label}
                className={`ch3-metric-card ${activeMetric === idx ? 'is-active' : ''}`}
                onMouseEnter={() => setActiveMetric(idx)}
              >
                <span className="ch3-metric-val">{metric.value}</span>
                <span className="ch3-metric-lbl">{metric.label}</span>
                <span className="ch3-metric-sub">{metric.subtitle}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aerial Panorama Frame */}
        <div className="ch3-aerial-wrapper">
          <div className="ch3-aerial-header">
            <span className="ch3-aerial-tag">AERIAL ELEVATION VIEW</span>
            <span className="ch3-aerial-caption">THE SKYE AT KASHMIR KUNNU &bull; EXCLUSIVE RIDGE TOPOGRAPHY</span>
          </div>

          <div className="ch3-media-frame ch3-image-frame">
            <img
              src="https://res.cloudinary.com/pcodbmuo/image/upload/v1786003585/ChatGPT_Image_Aug_6_2026_01_35_39_PM_d0dwvh.webp"
              alt="Aerial panoramic bird's eye view of The Skye 62 villa development nestled atop the lush green Kashmir Kunnu hill"
              className="ch3-image"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="ch3-aerial-badge">
              <span>10 ACRE HILLTOP RIDGE &bull; LOW-DENSITY SANCTUARY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
