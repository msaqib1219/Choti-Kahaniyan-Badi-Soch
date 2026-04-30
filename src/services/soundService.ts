const SOUND_URLS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3',
  interaction: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
  transition: 'https://assets.mixkit.co/active_storage/sfx/2808/2808-preview.mp3',
  sparkle: 'https://assets.mixkit.co/active_storage/sfx/2434/2434-preview.mp3'
};

class SoundService {
  private sounds: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    // Preload sounds
    if (typeof window !== 'undefined') {
      Object.entries(SOUND_URLS).forEach(([key, url]) => {
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.sounds.set(key, audio);
      });
    }
  }

  play(soundName: keyof typeof SOUND_URLS) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(err => console.warn('Audio play blocked:', err));
    }
  }
}

export const soundService = new SoundService();
