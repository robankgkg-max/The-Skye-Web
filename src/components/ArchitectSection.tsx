import { useEffect, useRef, useState, useCallback, type PointerEvent as ReactPointerEvent } from 'react';
import { configureInlineVideo } from '../utils/mediaFix';

export default function ArchitectSection() {
  const frameRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  // Sync state with video element
  const syncState = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setIsPlaying(!video.paused);
    setIsMuted(video.muted);
  }, []);

  // Try to play with audio or fallback to muted
  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.play().then(() => {
      syncState();
    }).catch(() => {
      video.muted = true;
      video.play().then(() => {
        syncState();
      }).catch(() => {});

      const unmute = () => {
        if (videoRef.current) {
          videoRef.current.muted = false;
          syncState();
        }
        ['pointerdown', 'keydown', 'touchstart'].forEach((type) => {
          document.removeEventListener(type, unmute);
        });
      };

      ['pointerdown', 'keydown', 'touchstart'].forEach((type) => {
        document.addEventListener(type, unmute, { passive: true, once: true });
      });
    });
  }, [syncState]);

  const MAX_DURATION = 55; // Stop video exactly at 0:55 seconds

  // Video time update listener
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // If playback reaches or exceeds 55 seconds, stop and pause
      if (video.currentTime >= MAX_DURATION) {
        video.currentTime = MAX_DURATION;
        video.pause();
        setIsPlaying(false);
        setProgress(100);
        return;
      }
      
      const effectiveDuration = Math.min(video.duration || MAX_DURATION, MAX_DURATION);
      const currentProgress = (video.currentTime / effectiveDuration) * 100;
      setProgress(Math.min(100, currentProgress));
    };

    const handlePlay = () => {
      // If user plays while already at or past 55s, restart from 0
      if (video.currentTime >= MAX_DURATION) {
        video.currentTime = 0;
      }
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setIsMuted(video.muted);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  // Auto-play when intersecting
  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video) return;

    configureInlineVideo(video, { muted: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Autoplay on mobile MUST begin muted to be permitted by iOS / WebKit
            video.muted = true;
            video.defaultMuted = true;
            video.play().then(() => {
              syncState();
            }).catch(() => {});
          } else {
            video.pause();
            syncState();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(frame);

    return () => {
      observer.disconnect();
    };
  }, [syncState]);

  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      // User tapped button: play with sound
      video.muted = false;
      video.play().then(() => {
        syncState();
      }).catch(() => {
        video.muted = true;
        video.play().then(() => syncState()).catch(() => {});
      });
    } else {
      video.pause();
      syncState();
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Scrub bar interaction
  const seek = (clientX: number) => {
    const bar = barRef.current;
    const video = videoRef.current;
    if (!bar || !video) return;

    const rect = bar.getBoundingClientRect();
    const newRatio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    video.currentTime = newRatio * MAX_DURATION;
    setProgress(newRatio * 100);
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const bar = barRef.current;
    if (!bar) return;
    bar.setPointerCapture(e.pointerId);
    seek(e.clientX);

    const onPointerMove = (ev: PointerEvent) => {
      seek(ev.clientX);
    };

    const onPointerUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  return (
    <section id="architect" className="tmb" aria-label="The Mind Behind The Skye">
      <div className="tmb-inner">
        <div className="tmb-top">
          <span className="tmb-label">The Mind Behind The Skye</span>
          <span className="tmb-place">Kashmir Kunnu &middot; Kozhikode</span>
        </div>
        <div className="tmb-rule"></div>

        <div className="tmb-stage">
          <div className="tmb-side tmb-side-l">
            <h2 className="tmb-name">
              Roopesh<br />VM
            </h2>
            <span className="tmb-role">Architect &amp; Principal Designer</span>
          </div>

          <figure
            className={`tmb-frame ${isPlaying ? 'is-playing' : ''} ${isMuted ? 'is-muted' : ''}`}
            id="tmbFrame"
            ref={frameRef}
          >
            <video
              id="tmbVideo"
              ref={videoRef}
              className="tmb-video"
              playsInline
              muted
              preload="auto"
              poster="https://res.cloudinary.com/pcodbmuo/video/upload/so_1/v1789369768/ARCHITECT_vejcey.jpg"
              src="https://res.cloudinary.com/pcodbmuo/video/upload/v1789369768/ARCHITECT_vejcey.mp4"
            />

            {/* Glass Play/Pause Button */}
            <button
              className="tmb-play"
              id="tmbPlay"
              type="button"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              onClick={togglePlay}
            >
              <svg className="tmb-ic-play" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
              <svg className="tmb-ic-pause" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5h3v14H8zM13 5h3v14h-3z" />
              </svg>
            </button>

            {/* Glass Volume Button */}
            <button
              className="tmb-vol"
              id="tmbVol"
              type="button"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              onClick={toggleMute}
            >
              <svg className="tmb-ic-on" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4z" />
                <path
                  d="M16.5 8.5a5 5 0 0 1 0 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <svg className="tmb-ic-off" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4z" />
                <path
                  d="M16 9.5l4 5M20 9.5l-4 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Interactive Timeline Progress Bar */}
            <div
              className="tmb-bar"
              id="tmbBar"
              ref={barRef}
              role="slider"
              aria-label="Video progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              onPointerDown={handlePointerDown}
            >
              <span
                className="tmb-bar-fill"
                id="tmbBarFill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </figure>

          <div className="tmb-side tmb-side-r">
            <p className="tmb-serif">
              Designing with intention.<br />Creating for generations.
            </p>
            <p className="tmb-note">
              A vision takes shape when passion,<br />purpose and place come together.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
