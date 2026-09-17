import { useEffect, useRef } from 'react';

// Desktop Landscape 8s Video Asset (optimized for instant zero-lag scrub)
const DESKTOP_VIDEO_SRC = 'https://res.cloudinary.com/pcodbmuo/video/upload/q_auto,w_1280/v1789475074/heero_desk_qu5x4n.mp4';
const DESKTOP_VIDEO_POSTER = 'https://res.cloudinary.com/pcodbmuo/video/upload/so_1/v1789475074/heero_desk_qu5x4n.jpg';

// Vertical Video Asset specifically tailored for Tablet and Mobile displays (optimized 720p 2.6MB for liquid 60fps scrub)
const MOBILE_TABLET_VIDEO_SRC = 'https://res.cloudinary.com/pcodbmuo/video/upload/q_auto,w_720/v1789476865/hero_yirvaz.mp4';
const MOBILE_TABLET_VIDEO_POSTER = 'https://res.cloudinary.com/pcodbmuo/video/upload/so_1/v1789476865/hero_yirvaz.jpg';

function isTabletOrMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  // Tablets & Mobile phones (width <= 1024px or portrait orientation up to 1200px)
  return window.innerWidth <= 1024 || (window.innerHeight > window.innerWidth && window.innerWidth <= 1200);
}

export default function CinematicScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!container || !video) return;

    // Detect initial form-factor (Tablet/Mobile vertical vs Desktop landscape)
    const isInitialMobile = isTabletOrMobileDevice();
    let currentSource = isInitialMobile ? MOBILE_TABLET_VIDEO_SRC : DESKTOP_VIDEO_SRC;
    let currentPoster = isInitialMobile ? MOBILE_TABLET_VIDEO_POSTER : DESKTOP_VIDEO_POSTER;

    // Set hardware and browser attributes
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');
    video.setAttribute('muted', '');
    video.preload = 'auto';
    video.poster = currentPoster;

    if (video.src !== currentSource) {
      video.src = currentSource;
      video.load();
    }

    let targetProgress = 0;
    let currentProgress = 0;
    let animFrameId: number;
    let isSeeking = false;
    let seekStartTime = 0;
    let videoDuration = isInitialMobile ? 8.96 : 8.02;

    // Hardware priming on user interaction or first touch/scroll for iOS WebKit & Android
    let isPrimed = false;
    const primeVideo = () => {
      if (isPrimed) return;
      isPrimed = true;
      const p = video.play();
      if (p !== undefined) {
        p.then(() => {
          video.pause();
        }).catch(() => {});
      }
    };
    window.addEventListener('touchstart', primeVideo, { passive: true, once: true });
    window.addEventListener('pointerdown', primeVideo, { passive: true, once: true });
    window.addEventListener('scroll', primeVideo, { passive: true, once: true });

    const onLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        videoDuration = video.duration;
      }
      try {
        if (video.currentTime === 0) {
          video.currentTime = 0.001;
        }
      } catch {}
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);

    // Seek completion notification
    const onSeeked = () => {
      isSeeking = false;
    };
    video.addEventListener('seeked', onSeeked);

    // Modern frame presentation callback if supported
    let rVFCId: number | null = null;
    if ('requestVideoFrameCallback' in HTMLVideoElement.prototype && 'requestVideoFrameCallback' in video) {
      const onFramePresented = () => {
        isSeeking = false;
        if (videoRef.current && 'requestVideoFrameCallback' in videoRef.current) {
          rVFCId = (videoRef.current as unknown as { requestVideoFrameCallback: (cb: () => void) => number })
            .requestVideoFrameCallback(onFramePresented);
        }
      };
      rVFCId = (video as unknown as { requestVideoFrameCallback: (cb: () => void) => number })
        .requestVideoFrameCallback(onFramePresented);
    }

    // Cached layout metrics
    let stageHeight = window.innerHeight * 0.9;
    let containerHeight = container.offsetHeight || window.innerHeight * 2.88;
    let totalScrollable = Math.max(containerHeight - stageHeight, 1);

    const measureBounds = () => {
      const stage = container.querySelector<HTMLElement>('.c-hero-stage');
      stageHeight = stage ? stage.offsetHeight : window.innerHeight * 0.9;
      containerHeight = container.offsetHeight || window.innerHeight * 2.88;
      totalScrollable = Math.max(containerHeight - stageHeight, 1);
    };

    const calculateProgress = () => {
      const rect = container.getBoundingClientRect();
      const scrolled = -rect.top;
      const rawProgress = scrolled / totalScrollable;
      return Math.min(Math.max(rawProgress, 0), 1);
    };

    const handleScroll = () => {
      targetProgress = calculateProgress();
    };

    // Responsive source switching on resize / orientation flip
    const handleResize = () => {
      measureBounds();
      const isMobileNow = isTabletOrMobileDevice();
      const nextSource = isMobileNow ? MOBILE_TABLET_VIDEO_SRC : DESKTOP_VIDEO_SRC;
      const nextPoster = isMobileNow ? MOBILE_TABLET_VIDEO_POSTER : DESKTOP_VIDEO_POSTER;

      if (currentSource !== nextSource) {
        currentSource = nextSource;
        currentPoster = nextPoster;
        const prevRatio = video.duration && !isNaN(video.duration) && video.duration > 0
          ? video.currentTime / video.duration
          : currentProgress;

        video.src = nextSource;
        video.poster = nextPoster;
        video.load();

        const onSwitchLoaded = () => {
          if (video.duration && !isNaN(video.duration) && video.duration > 0) {
            videoDuration = video.duration;
            try {
              video.currentTime = Math.min(Math.max(prevRatio * video.duration, 0), video.duration - 0.01);
            } catch {}
          }
        };
        video.addEventListener('loadedmetadata', onSwitchLoaded, { once: true });
      }

      targetProgress = calculateProgress();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    measureBounds();
    targetProgress = calculateProgress();

    // High-precision 60/120fps continuous animation loop
    let lastFrameTime = performance.now();
    let floatTime = 0;

    const renderLoop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastFrameTime) / 1000, 0.1);
      lastFrameTime = timestamp;

      // Delta-time independent continuous linear interpolation (LERP):
      // Tuned lerpSpeed gives instant thumb response without lag while flowing like water.
      const isMobileNow = isTabletOrMobileDevice();
      const lerpSpeed = isMobileNow ? 9.5 : 8.2;
      const lerpFactor = 1 - Math.exp(-lerpSpeed * dt);
      currentProgress += (targetProgress - currentProgress) * lerpFactor;

      if (Math.abs(targetProgress - currentProgress) < 0.00008) {
        currentProgress = targetProgress;
      }

      // ─── Super Smooth Mist-Like Typography Overlay Transition ───
      if (overlay) {
        // Graceful fade range across initial 0 to 0.20 of the runway
        const fadeLimit = 0.20;
        if (currentProgress < fadeLimit) {
          const t = currentProgress / fadeLimit;
          // Smooth cubic ease-out: dissolves cleanly right at scroll initiation without layout jumps
          const ease = 1 - Math.pow(1 - t, 2.5);
          const opacity = Math.max(0, 1 - ease);
          const translateY = -40 * ease; // floats upward like rising mist
          const scale = 1 - 0.03 * ease;

          // Ambient subtle breathing only when fully resting at top (zero oscillation during scroll)
          floatTime += dt * 1.2;
          const floatY = currentProgress < 0.005 ? Math.sin(floatTime) * 2.0 : 0;

          overlay.style.visibility = 'visible';
          overlay.style.opacity = opacity.toFixed(4);
          const totalY = translateY + floatY;
          overlay.style.transform = `translate3d(-50%, -50%, 0) translateY(${totalY.toFixed(2)}px) scale(${scale.toFixed(4)})`;
          overlay.style.pointerEvents = currentProgress < 0.05 ? 'auto' : 'none';
        } else {
          // Stay permanently hidden during the rest of the journey — NEVER reappears at bottom
          overlay.style.opacity = '0';
          overlay.style.visibility = 'hidden';
          overlay.style.pointerEvents = 'none';
        }
      }

      // ─── Water-Smooth Continuous Hardware-Accelerated Video Scrubbing ───
      const dur = (video.duration && !isNaN(video.duration) && video.duration > 0)
        ? video.duration
        : videoDuration;

      // Target time strictly from LERP-smoothed progress
      const targetTime = Math.min(Math.max(currentProgress * dur, 0), Math.max(0, dur - 0.02));

      // Keep video paused so browser playback clock never fights scroll clock
      if (!video.paused) {
        video.pause();
      }

      // Watchdog timer: If browser delays or drops seeked callback over 35ms, auto-unlock
      if (isSeeking && (timestamp - seekStartTime > 35)) {
        isSeeking = false;
      }

      // Seek whenever decoder is ready and target has advanced
      const timeDiff = Math.abs(targetTime - video.currentTime);
      if (!isSeeking && timeDiff > 0.015) {
        isSeeking = true;
        seekStartTime = timestamp;
        try {
          video.currentTime = targetTime;
        } catch {
          isSeeking = false;
        }
      }

      animFrameId = requestAnimationFrame(renderLoop);
    };

    animFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animFrameId);
      if (rVFCId !== null && 'cancelVideoFrameCallback' in video) {
        try {
          (video as unknown as { cancelVideoFrameCallback: (id: number) => void }).cancelVideoFrameCallback(rVFCId);
        } catch {}
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('touchstart', primeVideo);
      window.removeEventListener('pointerdown', primeVideo);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('seeked', onSeeked);
    };
  }, []);

  const initialPoster = typeof window !== 'undefined' && isTabletOrMobileDevice()
    ? MOBILE_TABLET_VIDEO_POSTER
    : DESKTOP_VIDEO_POSTER;

  return (
    <div
      ref={containerRef}
      id="hero-section"
      className="c-hero-runway"
      aria-label="The Skye Cinematic Scroll Presentation"
    >
      {/* Sticky 100vh Full-Viewport Stage with 3D perspective */}
      <div className="c-hero-stage">
        <video
          ref={videoRef}
          className="c-hero-video"
          preload="auto"
          muted
          playsInline
          poster={initialPoster}
          aria-hidden="true"
        />

        {/* High-fashion editorial cinematic film vignette scrim */}
        <div className="c-hero-scrim" />
        <div className="c-hero-fluid-glow" />

        {/* Master Editorial Old-Money / Haute Real-Estate Typography Overlay */}
        <div ref={overlayRef} className="c-hero-overlay">
          <div className="c-hero-content">
            {/* Top Triad Columns: PRIVATE RESIDENCES | CALICUT HILLTOP | EST. 2026 */}
            <header className="c-hero-top-triptych">
              <div className="c-hero-col c-hero-col-left">
                <span className="c-hero-col-label">PRIVATE</span>
                <span className="c-hero-col-val">RESIDENCES</span>
              </div>
              <div className="c-hero-col-divider" />
              <div className="c-hero-col c-hero-col-center">
                <span className="c-hero-col-label">CALICUT</span>
                <span className="c-hero-col-val">HILLTOP</span>
              </div>
              <div className="c-hero-col-divider" />
              <div className="c-hero-col c-hero-col-right">
                <span className="c-hero-col-label">EST.</span>
                <span className="c-hero-col-val">2026</span>
              </div>
            </header>

            {/* Central Master Title Block with Exact Reference Hierarchy */}
            <div className="c-hero-centerpiece">
              <p className="c-hero-eyebrow-phrase">WHERE VISIONARIES</p>
              <div className="c-hero-title-group">
                <h1 className="c-hero-primary-text">TOUCH THE</h1>
                <span className="c-hero-cursive-flourish">Clouds</span>
              </div>
              <p className="c-hero-location-anchor">KASHMIR KUNNU</p>
            </div>

            {/* Bottom Specs and Distinction Block */}
            <footer className="c-hero-bottom-manifest">
              <div className="c-hero-specs-duo">
                <span className="c-hero-spec-item">62 SANCTUARY VILLAS</span>
                <span className="c-hero-spec-vbar" />
                <span className="c-hero-spec-item">4 &amp; 5 BHK</span>
              </div>

              <div className="c-hero-bottom-rule" />

              <p className="c-hero-crest-mantra">
                CONCEIVED FOR THE UPPER CREST
              </p>

              {/* Discrete Editorial Scroll Cue with Vertical Bar */}
              <div className="c-hero-scroll-cue" aria-hidden="true">
                <span className="c-hero-scroll-text">SCROLL TO EXPLORE</span>
                <div className="c-hero-scroll-line-wrap">
                  <span className="c-hero-scroll-pip" />
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
