import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { configureInlineVideo } from '../utils/mediaFix';

gsap.registerPlugin(ScrollTrigger);

export default function VisionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const founderVideoRef = useRef<HTMLVideoElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [isPlaying1, setIsPlaying1] = useState(false);
  const [isFounderPlaying, setIsFounderPlaying] = useState(false);
  const [isFounderMuted, setIsFounderMuted] = useState(false);
  const [founderProgress, setFounderProgress] = useState(0);
  const [showCover, setShowCover] = useState(true);
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const START_TIME = 13; // 0:13 seconds
  const END_TIME = 68;   // 1:08 = 68 seconds
  const CLIP_DURATION = END_TIME - START_TIME; // 55 seconds total duration

  // Video timekeeper enforcing [0:13 - 1:08] window
  useEffect(() => {
    const v = founderVideoRef.current;
    if (!v) return;

    // Configure inline video properties for iOS / Android WebKit
    configureInlineVideo(v, { muted: true });

    // Set initial start point safely
    const initTime = () => {
      try {
        if (v.currentTime < START_TIME) {
          v.currentTime = START_TIME;
        }
      } catch {
        // ignore seek error if media not yet ready
      }
    };

    if (v.readyState >= 1) {
      initTime();
    } else {
      v.addEventListener('loadedmetadata', initTime, { once: true });
    }

    const handleTimeUpdate = () => {
      if (v.currentTime < START_TIME) {
        v.currentTime = START_TIME;
      }
      if (v.currentTime >= END_TIME) {
        v.currentTime = START_TIME;
        v.pause();
        setIsFounderPlaying(false);
        setFounderProgress(100);
        return;
      }
      const elapsed = v.currentTime - START_TIME;
      setFounderProgress(Math.min(100, Math.max(0, (elapsed / CLIP_DURATION) * 100)));
    };

    const handlePlay = () => setIsFounderPlaying(true);
    const handlePause = () => setIsFounderPlaying(false);
    const handleVolume = () => setIsFounderMuted(v.muted);

    v.addEventListener('timeupdate', handleTimeUpdate);
    v.addEventListener('play', handlePlay);
    v.addEventListener('pause', handlePause);
    v.addEventListener('volumechange', handleVolume);

    return () => {
      v.removeEventListener('timeupdate', handleTimeUpdate);
      v.removeEventListener('play', handlePlay);
      v.removeEventListener('pause', handlePause);
      v.removeEventListener('volumechange', handleVolume);
    };
  }, []);

  // Auto play/pause when user scrolls into/past the section with 0.8s cover photo display
  useEffect(() => {
    const v = founderVideoRef.current;
    if (!v) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // User scrolled into view: show cover photo first
            setShowCover(true);

            if (playTimeoutRef.current) {
              clearTimeout(playTimeoutRef.current);
            }

            // Brief 0.8s cover photo display, then start inline playback seamlessly
            playTimeoutRef.current = setTimeout(() => {
              setShowCover(false);
              try {
                if (v.currentTime < START_TIME || v.currentTime >= END_TIME) {
                  v.currentTime = START_TIME;
                }
              } catch {
                // ignore seek error
              }

              // On mobile scroll, autoplay MUST start muted to satisfy iOS Safari WebKit policies
              v.muted = true;
              v.defaultMuted = true;
              setIsFounderMuted(true);
              v.play().catch(() => {});
            }, 800);
          } else {
            // Scrolled out of view: cancel timer and pause
            if (playTimeoutRef.current) {
              clearTimeout(playTimeoutRef.current);
              playTimeoutRef.current = null;
            }
            if (!v.paused) {
              v.pause();
            }
            setShowCover(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(v);
    return () => {
      observer.disconnect();
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, []);

  const handleToggleFounderPlay = () => {
    const v = founderVideoRef.current;
    if (!v) return;
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
    if (v.paused) {
      setShowCover(false);
      try {
        if (v.currentTime < START_TIME || v.currentTime >= END_TIME) {
          v.currentTime = START_TIME;
        }
      } catch {
        // ignore seek error
      }
      // Direct user tap: attempt playback with unmuted sound
      v.muted = false;
      setIsFounderMuted(false);
      v.play().catch(() => {
        // Fallback to muted if device audio is restricted
        v.muted = true;
        setIsFounderMuted(true);
        v.play().catch(() => {});
      });
    } else {
      v.pause();
    }
  };

  const handleToggleFounderMute = () => {
    const v = founderVideoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsFounderMuted(v.muted);
    if (v.paused) {
      v.play().catch(() => {});
    }
  };

  const handleFounderSeek = (e: MouseEvent<HTMLDivElement>) => {
    const v = founderVideoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = START_TIME + clickRatio * CLIP_DURATION;
  };

  useEffect(() => {
    document.body.classList.add('gsap-ready');

    const ctx = gsap.context(() => {
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isReducedMotion) {
        gsap.set(
          '#hedLine1, #hedLine2, #hedAn, #hedSky, #hedRule, #aboutImgSticky, #aboutPortrait, #aboutP1, #aboutDivider, #aboutP2, #founderBlock, #photo1, #photo2',
          { opacity: 1, transform: 'none', clipPath: 'none' }
        );
        const rule = document.getElementById('hedRule');
        if (rule) rule.style.width = '56px';
        document.querySelectorAll<SVGPathElement>('.sig-path').forEach((p) => {
          p.style.strokeDashoffset = '0';
        });
        return;
      }

      gsap.from('#hedAn', {
        opacity: 0,
        y: 18,
        duration: 1,
        ease: 'power3.out',
        delay: 0.1,
        scrollTrigger: {
          trigger: '.vision-headline-wrap',
          start: 'top 80%',
        },
      });

      gsap.to('#hedLine1', {
        y: '0%',
        duration: 1.1,
        ease: 'power4.out',
        delay: 0.18,
        scrollTrigger: {
          trigger: '.vision-headline-wrap',
          start: 'top 80%',
        },
      });

      gsap.to('#hedLine2', {
        y: '0%',
        duration: 1.1,
        ease: 'power4.out',
        delay: 0.34,
        scrollTrigger: {
          trigger: '.vision-headline-wrap',
          start: 'top 80%',
        },
      });

      gsap.from('#hedSky', {
        opacity: 0,
        y: 14,
        duration: 0.9,
        delay: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.vision-headline-wrap',
          start: 'top 80%',
        },
      });

      gsap.to('#hedRule', {
        width: '56px',
        duration: 1,
        ease: 'power2.out',
        delay: 0.8,
        scrollTrigger: {
          trigger: '.vision-headline-wrap',
          start: 'top 80%',
        },
      });

      gsap.to('.vision-ghost', {
        x: '-4%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.vision-headline-wrap',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });

      gsap.to('#aboutImgSticky', {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.3,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: '#aboutImgSticky',
          start: 'top 85%',
        },
      });

      gsap.to('#aboutImgParallax', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-split',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
        },
      });

      gsap.to('#aboutPortrait', {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.2,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: '#aboutPortrait',
          start: 'top 82%',
        },
        onComplete: () => {
          document.getElementById('aboutPortrait')?.classList.add('revealed');
        },
      });

      gsap.to('#aboutP1', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#aboutP1',
          start: 'top 85%',
        },
      });

      gsap.to('#aboutDivider', {
        scaleX: 1,
        duration: 1.1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: '#aboutDivider',
          start: 'top 88%',
        },
      });

      gsap.to('#aboutP2', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#aboutP2',
          start: 'top 85%',
        },
      });

      gsap.to('#founderBlock', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#founderBlock',
          start: 'top 88%',
          onEnter: () => {
            document.querySelectorAll<SVGPathElement>('.sig-path').forEach((path, index) => {
              gsap.fromTo(
                path,
                { strokeDashoffset: 1 },
                {
                  strokeDashoffset: 0,
                  duration: 0.7 + index * 0.06,
                  ease: 'power2.inOut',
                  delay: 0.15 + index * 0.07,
                }
              );
            });
          },
        },
      });

      ['#photo1', '#photo2'].forEach((selector, index) => {
        gsap.to(selector, {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.15,
          ease: 'power4.inOut',
          delay: index * 0.18,
          scrollTrigger: {
            trigger: selector,
            start: 'top 86%',
          },
          onComplete: () => {
            document.querySelector(selector)?.classList.add('revealed');
          },
        });
      });
    }, sectionRef);

    // Refresh after images load
    const refresh = () => ScrollTrigger.refresh();
    const imgs = sectionRef.current?.querySelectorAll('img');
    imgs?.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', refresh, { once: true });
      }
    });

    const timer1 = setTimeout(refresh, 600);
    const timer2 = setTimeout(refresh, 1800);

    // Safety fallback
    const fallbackTimer = setTimeout(() => {
      ['#aboutImgSticky', '#aboutPortrait', '#photo1', '#photo2'].forEach((selector) => {
        const el = document.querySelector<HTMLElement>(selector);
        if (!el) return;
        const clip = getComputedStyle(el).clipPath;
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView && clip && clip !== 'none' && /100%|inset\(1?0*[1-9]/.test(clip)) {
          gsap.set(el, { clipPath: 'inset(0% 0 0% 0)' });
        }
      });
    }, 2500);

    return () => {
      ctx.revert();
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Mobile video observer and control
  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;

    if (v1) {
      configureInlineVideo(v1, { muted: true, loop: true });
    }
    if (v2) {
      configureInlineVideo(v2, { muted: true, loop: true });
    }

    const onPlay = () => setIsPlaying1(true);
    const onPause = () => setIsPlaying1(false);

    if (v1) {
      v1.addEventListener('play', onPlay);
      v1.addEventListener('pause', onPause);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            // Autoplay MUST be muted on mobile to succeed across iOS Safari & Android
            v.muted = true;
            v.defaultMuted = true;
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (v1) observer.observe(v1);
    if (v2) observer.observe(v2);

    return () => {
      if (v1) {
        v1.removeEventListener('play', onPlay);
        v1.removeEventListener('pause', onPause);
      }
      observer.disconnect();
    };
  }, []);

  const handleTogglePlay1 = () => {
    const v1 = video1Ref.current;
    if (!v1) return;
    if (v1.paused) {
      // Direct user tap: attempt unmuted audio
      v1.muted = false;
      v1.play().catch(() => {
        v1.muted = true;
        v1.play().catch(() => {});
      });
    } else {
      v1.pause();
    }
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="An Invitation to Fly the Sky"
      className="relative w-full"
    >
      {/* ===================== PART 1: BIG CENTERED HEADLINE ===================== */}
      <div className="vision-headline-wrap" id="vision-headline-container">
        {/* Ghost ambient background type */}
        <div className="vision-ghost" aria-hidden="true">
          SKY
        </div>

        <span className="vision-label" id="vision-section-label">
          The Vision
        </span>

        <span className="hed-an" id="hedAn">
          AN
        </span>

        <span className="hed-main" aria-label="Invitation To Fly">
          <span className="hed-line">
            <span className="hed-line-inner" id="hedLine1">
              INVITATION
            </span>
          </span>
          <span className="hed-line">
            <span className="hed-line-inner" id="hedLine2">
              TO FLY
            </span>
          </span>
        </span>

        <span className="hed-sky" id="hedSky">
          THE SKY
        </span>
        <span className="hed-rule" id="hedRule"></span>
      </div>

      {/* ===================== PART 2: IMAGE + EDITORIAL SPLIT ===================== */}
      <div className="about-split" id="about-split-container">
        {/* LEFT — full-bleed Rolls Royce image / video player */}
        <div className="about-img-col">
          <div className="about-img-sticky" id="aboutImgSticky">
            <video
              ref={founderVideoRef}
              id="aboutImgParallax"
              className="about-founder-video"
              playsInline
              preload="auto"
              poster="https://res.cloudinary.com/pcodbmuo/video/upload/so_13/v1789369917/IFLUE_xwh1wg.jpg"
              src="https://res.cloudinary.com/pcodbmuo/video/upload/v1789369917/IFLUE_xwh1wg.mp4"
              muted={isFounderMuted}
            />

            {/* 2.5s Cover Photo Overlay */}
            <div
              className={`about-vid-cover ${!showCover ? 'is-hidden' : ''}`}
              onClick={handleToggleFounderPlay}
              onTouchEnd={handleToggleFounderPlay}
              role="button"
              tabIndex={0}
              aria-hidden="true"
            >
              <img
                src="https://res.cloudinary.com/pcodbmuo/image/upload/v1785879457/founder_wz8mwy.webp"
                alt="Iflu Rahman — The Skye"
                className="about-vid-cover-img"
                loading="eager"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Glass Play/Pause Center Button */}
            <button
              type="button"
              className={`about-vid-play ${isFounderPlaying ? 'is-playing' : ''}`}
              aria-label={isFounderPlaying ? 'Pause video' : 'Play video'}
              onClick={handleToggleFounderPlay}
            >
              {isFounderPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" style={{ marginLeft: 3 }}>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            {/* Glass Audio Toggle */}
            <button
              type="button"
              className="about-vid-sound"
              aria-label={isFounderMuted ? 'Unmute' : 'Mute'}
              onClick={handleToggleFounderMute}
            >
              {isFounderMuted ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>

            {/* Floating Timeline Progress Bar (matching architect video timeline design) */}
            <div
              className="about-vid-bar"
              onClick={handleFounderSeek}
              role="slider"
              aria-label="Founder video progress"
              aria-valuenow={Math.round(founderProgress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span
                className="about-vid-bar-fill"
                style={{ width: `${founderProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT — ivory editorial magazine grid */}
        <div className="about-editorial">
          {/* UPPER: founder portrait + first paragraph */}
          <div className="about-upper">
            <div className="about-portrait" id="aboutPortrait">
              <img
                src="https://res.cloudinary.com/pcodbmuo/image/upload/v1785879457/founder_wz8mwy.webp"
                alt="Iflu Rahman — Founder & Chairman, Crietor Group"
                loading="eager"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="about-p1" id="aboutP1">
              <p>
                The Skye is not just a residential project—it is a manifestation
                of a deeper intent. Perched on Kashmir Kunnu, a quiet hilltop in
                Kozhikode, The Skye was conceived for a rare breed of individuals:
                those who lead with intent, who value clarity over clutter, and
                who seek spaces that elevate both living and thinking.
              </p>
              <p>
                As one of the most exclusive Luxury Villas in Calicut, this is not
                luxury for show. It is luxury with soul. Every element of The
                Skye—from the purity of light and air to the openness of its
                design—has been crafted to support a life of intent, reflection,
                and quiet confidence.
              </p>
            </div>
          </div>

          {/* Editorial hairline divider */}
          <div className="about-divider" id="aboutDivider"></div>

          {/* LOWER: founder text + signature LEFT / stacked B&W photos RIGHT */}
          <div className="about-lower">
            <div className="about-founder-col">
              <div className="about-p2" id="aboutP2">
                <p>
                  I've always believed that behind every visionary, there is a
                  home. A space that anchors their spirit, restores their energy,
                  and gives their intent the room to grow wings.
                </p>
                <p>
                  The Skye is that kind of space—elevated, expansive, and alive
                  with quiet strength. It is more than an address; it is a launchpad
                  for those destined to rise above the ordinary. Here, high above
                  the city, you're not just living—you're soaring.
                </p>
                <p>
                  This is your invitation to fly the Skye. Welcome to upper-crest
                  living, envisioned with intent.
                </p>
              </div>

              {/* Handwritten-style SVG signature + founder credit */}
              <div className="founder-block" id="founderBlock">
                <div className="founder-sig-wrap">
                  <svg
                    viewBox="0 0 130 90"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="#0F0F0F"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {/* I - tall ascender */}
                    <path
                      className="sig-path"
                      pathLength="1"
                      strokeWidth="1.6"
                      d="M10,10 C10,12 9,20 10,32 C11,44 10,54 10,62"
                    />
                    {/* f - loop */}
                    <path
                      className="sig-path"
                      pathLength="1"
                      strokeWidth="1.6"
                      d="M10,36 C14,32 20,26 24,28 C28,30 26,38 22,44 C18,50 16,56 18,60 C20,64 26,58 30,52"
                    />
                    {/* l - simple tall */}
                    <path
                      className="sig-path"
                      pathLength="1"
                      strokeWidth="1.4"
                      d="M30,52 C32,44 34,34 36,24 C37,18 36,16 35,22 C34,30 34,40 34,50"
                    />
                    {/* u - curve */}
                    <path
                      className="sig-path"
                      pathLength="1"
                      strokeWidth="1.4"
                      d="M34,36 C36,32 40,30 44,34 C47,38 46,46 44,52 C42,58 44,62 48,58"
                    />
                    {/* space / connector */}
                    <path
                      className="sig-path"
                      pathLength="1"
                      strokeWidth="1.2"
                      d="M48,58 C52,52 56,46 58,42"
                    />
                    {/* R - sweeping */}
                    <path
                      className="sig-path"
                      pathLength="1"
                      strokeWidth="1.6"
                      d="M58,18 C58,22 57,34 58,46 C59,56 58,62 58,68"
                    />
                    <path
                      className="sig-path"
                      pathLength="1"
                      strokeWidth="1.4"
                      d="M58,28 C64,22 72,20 74,28 C76,36 70,42 64,44 C70,46 76,54 80,64"
                    />
                    {/* a - small */}
                    <path
                      className="sig-path"
                      pathLength="1"
                      strokeWidth="1.3"
                      d="M82,42 C86,36 94,34 96,40 C98,46 96,54 94,60 C93,64 94,66 96,62"
                    />
                    {/* h - loop + descend */}
                    <path
                      className="sig-path"
                      pathLength="1"
                      strokeWidth="1.3"
                      d="M96,40 C98,34 104,28 108,32 C112,36 110,44 108,52 C106,60 108,66 110,62"
                    />
                    {/* m - double hump */}
                    <path
                      className="sig-path"
                      pathLength="1"
                      strokeWidth="1.3"
                      d="M110,50 C112,44 116,40 118,44 C120,48 118,56 116,62 C114,68 116,72 120,66"
                    />
                    {/* a - final */}
                    <path
                      className="sig-path"
                      pathLength="1"
                      strokeWidth="1.3"
                      d="M120,48 C122,42 126,40 128,46 C130,52 128,60 124,66"
                    />
                    {/* Underline flourish */}
                    <path
                      className="sig-path"
                      pathLength="1"
                      strokeWidth="0.8"
                      d="M8,74 C40,72 80,71 128,72"
                    />
                    {/* Tiny dot */}
                    <circle cx="130" cy="76" r="1.8" fill="#0F0F0F" stroke="none" />
                  </svg>
                </div>

                <div className="founder-meta">
                  <span className="founder-name-text">Iflu Rahman</span>
                  <span className="founder-title-text">
                    Founder &amp; Chairman<br />
                    Crietor Group
                  </span>
                </div>
              </div>
            </div>

            {/* Stacked editorial B&W interior photos */}
            <div className="about-photos">
              <div className="photo-wrap" id="photo1">
                <img
                  src="https://res.cloudinary.com/pcodbmuo/image/upload/v1785878776/inter-2_fwrvaw.webp"
                  alt="The Skye Interior — Living Space"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="photo-wrap" id="photo2">
                <img
                  src="https://res.cloudinary.com/pcodbmuo/image/upload/v1785878775/int-0_uvfdtx.webp"
                  alt="The Skye Interior — Architectural Detail"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* MOBILE-ONLY EDITORIAL MEDIA COMPOSITION */}
            <div className="about-mobile-ed" aria-hidden="false">
              <div className="ame-row ame-row-1">
                <div
                  className="ame-video-wrap ame-v1"
                  onClick={handleTogglePlay1}
                  onTouchEnd={handleTogglePlay1}
                  role="button"
                  tabIndex={0}
                  aria-label={isPlaying1 ? "Pause interview clip" : "Play interview clip"}
                >
                  <video
                    id="ameVideo1"
                    ref={video1Ref}
                    className="ame-video"
                    playsInline
                    muted
                    loop
                    autoPlay
                    preload="auto"
                    poster="https://res.cloudinary.com/pcodbmuo/video/upload/so_1/v1786013221/iflue_smzvzr.jpg"
                    src="https://res.cloudinary.com/pcodbmuo/video/upload/v1786013221/iflue_smzvzr.mp4"
                  />
                  <button
                    type="button"
                    className={`ame-play ${isPlaying1 ? 'is-playing is-hidden' : ''}`}
                    id="amePlay1"
                    aria-label="Play video"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePlay1();
                    }}
                  />
                </div>

                <div className="ame-side">
                  <span className="ame-rule" aria-hidden="true"></span>
                  <div className="ame-side-text">
                    <p className="ame-statement">
                      India’s First<br />
                      Intent Based<br />
                      Residential<br />
                      Development
                    </p>
                    <p className="ame-by">by</p>
                    <img
                      className="ame-logo"
                      src="https://res.cloudinary.com/pcodbmuo/image/upload/e_make_transparent:25/f_png/v1786068596/ChatGPT_Image_Aug_7_2026_07_39_16_AM_ihq1lg.png"
                      alt="Creator Group — Built With Intent"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>

              <div className="ame-row ame-row-2">
                <blockquote className="ame-quote">
                  <p>
                    Behind every<br />
                    successful visionary,<br />
                    there is a home that<br />
                    made it possible.
                  </p>
                  <span className="ame-quote-rule" aria-hidden="true"></span>
                  <div className="ame-quote-foot">
                    <span className="ame-quote-name">Iflu Rahman.</span>
                    <span className="ame-quote-role">CEO &amp; MD</span>
                  </div>
                </blockquote>

                <div className="ame-video-wrap ame-v2">
                  <video
                    id="ameVideo2"
                    ref={video2Ref}
                    className="ame-video"
                    playsInline
                    muted
                    loop
                    autoPlay
                    preload="auto"
                    poster="https://res.cloudinary.com/pcodbmuo/video/upload/so_1/v1786021993/Woman_turns_at_sunset_1080p_202608061842_t3gta1.jpg"
                    src="https://res.cloudinary.com/pcodbmuo/video/upload/v1786021993/Woman_turns_at_sunset_1080p_202608061842_t3gta1.mp4"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* /about-lower */}
        </div>
        {/* /about-editorial */}
      </div>
      {/* /about-split */}
    </section>
  );
}
