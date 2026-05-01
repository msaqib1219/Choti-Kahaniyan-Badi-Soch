const BGM_URLS = {
  forest: 'https://assets.mixkit.co/music/preview/mixkit-forest-river-591.mp3',
  sea: 'https://assets.mixkit.co/music/preview/mixkit-soft-ocean-waves-loop-716.mp3',
  car: 'https://assets.mixkit.co/music/preview/mixkit-driving-in-a-car-ambient-track-2490.mp3',
  default: 'https://assets.mixkit.co/music/preview/mixkit-dreamy-lullaby-6.mp3'
};

const SOUND_URLS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3',
  interaction: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
  transition: 'https://assets.mixkit.co/active_storage/sfx/2808/2808-preview.mp3',
  sparkle: 'https://assets.mixkit.co/active_storage/sfx/2434/2434-preview.mp3'
};

class SoundService {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private bgmAudio: HTMLAudioElement | null = null;
  private currentBgmTheme: string | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      Object.entries(SOUND_URLS).forEach(([key, url]) => {
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.sounds.set(key, audio);
      });
    }
  }

  play(soundName: keyof typeof SOUND_URLS) {
    if (this.isMuted) return;
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(err => console.warn('Audio play blocked:', err));
    }
  }

  updateBGM(theme: keyof typeof BGM_URLS) {
    if (this.currentBgmTheme === theme) return;
    
    if (this.bgmAudio) {
      // Fade out current music
      const oldAudio = this.bgmAudio;
      const fadeInterval = setInterval(() => {
        if (oldAudio.volume > 0.05) {
          oldAudio.volume -= 0.05;
        } else {
          oldAudio.pause();
          clearInterval(fadeInterval);
        }
      }, 50);
    }

    this.currentBgmTheme = theme;
    this.bgmAudio = new Audio(BGM_URLS[theme]);
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = 0;
    this.bgmAudio.muted = this.isMuted;
    
    this.bgmAudio.play().catch(err => {
      console.warn('BGM play blocked - waiting for interaction:', err);
      // We'll naturally try again on the next user interaction (click/start)
    });

    // Fade in new music
    const fadeInInterval = setInterval(() => {
      if (this.bgmAudio && this.bgmAudio.volume < 0.3) {
        this.bgmAudio.volume += 0.02;
      } else {
        clearInterval(fadeInInterval);
      }
    }, 100);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgmAudio) {
      this.bgmAudio.muted = this.isMuted;
    }
    return this.isMuted;
  }
}

export const soundService = new SoundService();
