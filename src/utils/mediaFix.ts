/**
 * Universal Mobile Video Compatibility Helper
 * Ensures 100% compliant, stutter-free playback across iOS Safari (iPhone / iPad)
 * and all Android mobile browsers (Chrome, Samsung Internet, Firefox).
 */

export function configureInlineVideo(video: HTMLVideoElement, options?: { muted?: boolean; loop?: boolean }) {
  if (!video) return;

  const shouldBeMuted = options?.muted !== false;

  // Crucial for iOS WebKit: must be set on both the DOM property and attribute
  if (shouldBeMuted) {
    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute('muted', '');
  } else {
    video.defaultMuted = false;
    video.muted = false;
    video.volume = 1;
    video.removeAttribute('muted');
  }
  
  if (options?.loop !== undefined) {
    video.loop = options.loop;
  }

  // Set all vendor inline-playback attributes
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('x5-playsinline', '');
  video.setAttribute('webkit-playsinline', 'true');
  video.setAttribute('playsinline', 'true');
  video.setAttribute('x5-playsinline', 'true');
  video.setAttribute('disablePictureInPicture', 'true');
}

/**
 * Robust play trigger for mobile browsers that avoids unhandled promise rejections
 * and automatically falls back to muted playback if user-agent policies prevent sound.
 */
export async function safePlayVideo(video: HTMLVideoElement, preferAudio: boolean = false): Promise<boolean> {
  if (!video) return false;

  if (preferAudio) {
    video.muted = false;
    try {
      await video.play();
      return true;
    } catch {
      // Audio autoplay rejected by mobile browser (expected without user interaction)
      // Fallback immediately to muted inline playback
      video.muted = true;
      video.defaultMuted = true;
      try {
        await video.play();
        return true;
      } catch {
        return false;
      }
    }
  } else {
    video.muted = true;
    video.defaultMuted = true;
    try {
      await video.play();
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Unlocks iOS media playback on first user touch/scroll gesture.
 * Mobile Safari allows background audio/video once primed by a user gesture.
 */
let isGloballyUnlocked = false;

export function registerGlobalMediaUnlock(getVideos?: () => (HTMLVideoElement | null)[]) {
  if (typeof window === 'undefined' || isGloballyUnlocked) return;

  const unlock = () => {
    isGloballyUnlocked = true;

    if (getVideos) {
      const vids = getVideos();
      vids.forEach((v) => {
        if (v && v.paused && v.autoplay) {
          v.play().catch(() => {});
        }
      });
    }

    // Remove listeners once primed
    const events = ['touchstart', 'pointerdown', 'scroll', 'keydown'];
    events.forEach((evt) => {
      window.removeEventListener(evt, unlock);
      document.removeEventListener(evt, unlock);
    });
  };

  const events = ['touchstart', 'pointerdown', 'scroll', 'keydown'];
  events.forEach((evt) => {
    window.addEventListener(evt, unlock, { passive: true, once: true });
    document.addEventListener(evt, unlock, { passive: true, once: true });
  });
}
