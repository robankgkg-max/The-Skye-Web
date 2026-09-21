import { useEffect, useRef, useState, useCallback, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent } from 'react';
import PrivateViewingModal from './PrivateViewingModal';

// Declaration for window.YT
declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId?: string;
          playerVars?: Record<string, any>;
          events?: {
            onReady?: (event: { target: any }) => void;
            onStateChange?: (event: { data: number; target: any }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => any;
      PlayerState?: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function PrivateResidencesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const isIntersectingRef = useRef<boolean>(false);

  const [isReady, setIsReady] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(96); // 1:36 default or dynamic
  const [progress, setProgress] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Safe Play with Sound Function
  const playWithSound = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    setHasStarted(true);

    try {
      // Unmute and set high volume
      if (typeof player.unMute === 'function') player.unMute();
      if (typeof player.setVolume === 'function') player.setVolume(100);
      setIsMuted(false);

      if (typeof player.playVideo === 'function') {
        player.playVideo();
      }
      setIsPlaying(true);
    } catch {
      // If browser blocks unmuted autoplay without previous user interaction, fallback to muted then unmute on next gesture
      try {
        if (typeof player.mute === 'function') player.mute();
        setIsMuted(true);
        if (typeof player.playVideo === 'function') {
          player.playVideo();
        }
        setIsPlaying(true);

        const tryUnmuteOnGesture = () => {
          if (playerRef.current && isIntersectingRef.current) {
            try {
              if (typeof playerRef.current.unMute === 'function') playerRef.current.unMute();
              if (typeof playerRef.current.setVolume === 'function') playerRef.current.setVolume(100);
              setIsMuted(false);
            } catch {
              // ignore
            }
          }
          ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((type) => {
            window.removeEventListener(type, tryUnmuteOnGesture);
          });
        };

        ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((type) => {
          window.addEventListener(type, tryUnmuteOnGesture, { passive: true, once: true });
        });
      } catch {
        // ignore
      }
    }
  }, []);

  // Safe Pause Function
  const pauseVideo = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    try {
      if (typeof player.pauseVideo === 'function') {
        player.pauseVideo();
      }
      setIsPlaying(false);
    } catch {
      // ignore
    }
  }, []);

  // Load YouTube IFrame API
  useEffect(() => {
    let checkInterval: any = null;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (playerRef.current) return;

      const playerDiv = document.getElementById('pr-yt-player');
      if (!playerDiv) return;

      try {
        playerRef.current = new window.YT.Player('pr-yt-player', {
          videoId: 'r9SacTlPUEY',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            playsinline: 1,
            origin: window.location.origin,
            enablejsapi: 1,
          },
          events: {
            onReady: (event: any) => {
              setIsReady(true);
              const dur = event.target.getDuration();
              if (dur && dur > 0) setDuration(dur);

              // If already scrolled into view before player ready, auto-play with sound!
              if (isIntersectingRef.current) {
                playWithSound();
              }
            },
            onStateChange: (event: any) => {
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
              if (event.data === 1) {
                setIsPlaying(true);
                setHasStarted(true);
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                setIsPlaying(false);
                setProgress(100);
              }
            },
          },
        });
      } catch (err) {
        console.error('Error initializing YouTube player:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      if (!document.getElementById('yt-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }

      checkInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkInterval);
          initPlayer();
        }
      }, 100);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
        playerRef.current = null;
      }
    };
  }, [playWithSound]);

  // IntersectionObserver: Auto-play with sound when section is in view, pause when scrolled past
  useEffect(() => {
    const targetElement = containerRef.current || sectionRef.current;
    if (!targetElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isIntersectingRef.current = true;
            playWithSound();
          } else {
            isIntersectingRef.current = false;
            pauseVideo();
          }
        });
      },
      {
        threshold: 0.35, // triggers when 35% of the video section is visible in viewport
      }
    );

    observer.observe(targetElement);

    return () => {
      observer.disconnect();
    };
  }, [playWithSound, pauseVideo]);

  // Sync Progress and Current Time
  useEffect(() => {
    const timer = setInterval(() => {
      const player = playerRef.current;
      if (player && typeof player.getCurrentTime === 'function' && typeof player.getPlayerState === 'function') {
        const state = player.getPlayerState();
        if (state === 1 && !isDraggingRef.current) {
          const cur = player.getCurrentTime() || 0;
          const dur = player.getDuration() || duration || 96;
          setCurrentTime(cur);
          if (dur > 0) {
            setDuration(dur);
            setProgress(Math.min(100, (cur / dur) * 100));
          }
        }
      }
    }, 200);

    return () => clearInterval(timer);
  }, [duration]);

  // Toggle Play / Pause on direct user click
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseVideo();
    } else {
      playWithSound();
    }
  }, [isPlaying, pauseVideo, playWithSound]);

  // Toggle Mute / Unmute
  const toggleMute = useCallback((e?: ReactMouseEvent) => {
    if (e) e.stopPropagation();
    const player = playerRef.current;
    if (!player) return;

    if (isMuted) {
      if (typeof player.unMute === 'function') {
        player.unMute();
      }
      if (typeof player.setVolume === 'function') {
        player.setVolume(100);
      }
      setIsMuted(false);
    } else {
      if (typeof player.mute === 'function') {
        player.mute();
      }
      setIsMuted(true);
    }
  }, [isMuted]);

  // Handle Timeline Seeking / Dragging
  const seek = useCallback((clientX: number) => {
    const bar = barRef.current;
    const player = playerRef.current;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const targetTime = ratio * (duration || 96);

    setProgress(ratio * 100);
    setCurrentTime(targetTime);

    if (player && typeof player.seekTo === 'function') {
      player.seekTo(targetTime, true);
    }
  }, [duration]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    seek(e.clientX);

    const onPointerMove = (evt: PointerEvent) => {
      seek(evt.clientX);
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Handler for CTA buttons: Pause video immediately when clicked
  const handleCtaClick = () => {
    pauseVideo();
  };

  const handleBookViewingClick = (e: ReactMouseEvent) => {
    e.preventDefault();
    pauseVideo();
    setIsModalOpen(true);
  };

  // Allow other components or nav items to open the viewing modal
  useEffect(() => {
    const handleOpenModal = () => {
      pauseVideo();
      setIsModalOpen(true);
    };
    window.addEventListener('open-private-viewing', handleOpenModal);
    return () => {
      window.removeEventListener('open-private-viewing', handleOpenModal);
    };
  }, [pauseVideo]);

  return (
    <section
      className="pr"
      id="residences"
      ref={sectionRef}
      aria-label="Private Residences for Visionaries"
    >
      <div className="pr__inner">
        {/* ① Eyebrow label */}
        <span className="pr__eyebrow">The Residences</span>
        <div className="pr__rule pr__rule--sm" />

        {/* ② Main heading */}
        <h2 className="pr__heading">
          Private Residences<br />
          for <em>Visionaries</em>
        </h2>

        {/* ③ Project metadata */}
        <p className="pr__meta">62 Villas &middot; 4 &amp; 5 BHK &middot; Kashmir Kunnu, Calicut</p>
        <p className="pr__rera">RERA: K-RERA/PRJ/KKD/036/2026</p>

        {/* ④ Interactive Video Player with Custom Controls */}
        <div
          className={`pr__video ${isPlaying ? 'is-playing' : ''} ${isMuted ? 'is-muted' : ''}`}
          ref={containerRef}
          role="region"
          aria-label="Villa preview video player"
          onClick={togglePlay}
        >
          {/* YouTube Player Mount Container */}
          <div className="pr__yt-wrap">
            <div id="pr-yt-player" className="pr__yt-iframe" />
          </div>

          {/* Initial Poster / Sunset Glow Cover (Fades out when playback starts) */}
          <div className={`pr__video-bg ${hasStarted ? 'pr__video-bg--hidden' : ''}`} />

          {/* Glass Play / Pause Button */}
          <button
            className="pr__play"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 5H10V19H7V5ZM14 5H17V19H14V5Z" fill="white" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 3.8L20.5 12L6 20.2V3.8Z" fill="white" />
              </svg>
            )}
          </button>

          {/* Glass Volume Mute / Unmute Button */}
          <button
            className="pr__vol"
            type="button"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            onClick={toggleMute}
          >
            {isMuted ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 9v6h4l5 4V5L8 9H4z" />
                <path
                  d="M16 9.5l4 5M20 9.5l-4 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 9v6h4l5 4V5L8 9H4z" />
                <path
                  d="M16.5 8.5a5 5 0 0 1 0 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          {/* Video Bottom Info Overlay */}
          <div className="pr__video-info" onClick={(e) => e.stopPropagation()}>
            <div className="pr__video-tag">
              <span>A Life</span>
              <span>In a Higher Frame.</span>
            </div>
            <span className="pr__video-dur">
              {hasStarted ? `${formatTime(currentTime)} / ${formatTime(duration)}` : '01:36'}
            </span>
          </div>

          {/* Interactive Custom Timeline Progress Bar */}
          <div
            className="pr__bar"
            ref={barRef}
            role="slider"
            aria-label="Video progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            onPointerDown={handlePointerDown}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="pr__bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* ⑤ Callout + rule */}
        <p className="pr__callout">Experience Euphoria Firsthand.</p>
        <div className="pr__rule pr__rule--md" />

        {/* ⑥ CTA buttons - Pause video on click */}
        <div className="pr__ctas">
          <button
            type="button"
            className="pr__btn pr__btn--light"
            onClick={handleBookViewingClick}
            aria-haspopup="dialog"
          >
            Book a Private Viewing
            <span className="pr__btn-icon">→</span>
          </button>
          <a
            href="#footer"
            className="pr__btn pr__btn--dark"
            onClick={handleCtaClick}
          >
            Download Brochure
            <span className="pr__btn-icon">↓</span>
          </a>
        </div>

        {/* ⑦ Footer tagline */}
        <p className="pr__foot">Exclusive Homes for a Brighter Tomorrow.</p>
      </div>

      {/* Private Viewing Form Modal */}
      <PrivateViewingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
