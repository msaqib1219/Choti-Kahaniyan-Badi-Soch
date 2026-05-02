const BGM_URLS = {
  forest: 'https://assets.mixkit.co/music/preview/mixkit-forest-river-591.mp3',
  sea: 'https://assets.mixkit.co/music/preview/mixkit-soft-ocean-waves-loop-716.mp3',
  car: 'https://assets.mixkit.co/music/preview/mixkit-driving-in-a-car-ambient-track-2490.mp3',
  default: 'https://assets.mixkit.co/music/preview/mixkit-dreamy-lullaby-6.mp3'
};

const SOUND_URLS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3',
  interaction: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Clapping
  transition: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Soft Pop
  sparkle: 'https://assets.mixkit.co/active_storage/sfx/2434/2434-preview.mp3'
};

class SoundService {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private bgmAudio: HTMLAudioElement | null = null;
  private currentBgmTheme: string | null = null;
  private isMuted: boolean = false;
  private speechSynthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onSpeechEndCallback: (() => void) | null = null;
  private audioContext: AudioContext | null = null;
  private currentBufferSource: AudioBufferSourceNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      Object.entries(SOUND_URLS).forEach(([key, url]) => {
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.sounds.set(key, audio);
      });
      this.speechSynthesis = window.speechSynthesis;
      
      // Ensure voices are loaded (some browsers load them asynchronously)
      if (this.speechSynthesis) {
        this.speechSynthesis.getVoices(); // Trigger load
        if (this.speechSynthesis.onvoiceschanged !== undefined) {
          this.speechSynthesis.onvoiceschanged = () => {
            console.log('Voices loaded:', this.speechSynthesis?.getVoices().length);
          };
        }
      }
    }
  }

  speak(text: string, lang: 'en' | 'ur' = 'en', onComplete?: () => void) {
    if (this.isMuted || !this.speechSynthesis) {
      if (onComplete) onComplete();
      return;
    }

    this.stopSpeaking();
    this.onSpeechEndCallback = onComplete || null;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Better voice detection
    let voices = this.speechSynthesis.getVoices();
    
    const trySpeak = () => {
      if (lang === 'ur') {
        utterance.lang = 'ur-PK';
        // Find Urdu voice
        const urduVoice = voices.find(v => v.lang.startsWith('ur'));
        if (urduVoice) utterance.voice = urduVoice;
        utterance.pitch = 1.0;
        utterance.rate = 0.85;
      } else {
        utterance.lang = 'en-US';
        const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Native')));
        if (englishVoice) utterance.voice = englishVoice;
        utterance.pitch = 1.1; 
        utterance.rate = 0.95;
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        if (this.onSpeechEndCallback) {
          this.onSpeechEndCallback();
          this.onSpeechEndCallback = null;
        }
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        this.currentUtterance = null;
        if (this.onSpeechEndCallback) {
          this.onSpeechEndCallback();
          this.onSpeechEndCallback = null;
        }
      };

      this.currentUtterance = utterance;
      this.speechSynthesis!.speak(utterance);
    };

    if (voices.length === 0) {
      // Wait for voices if not loaded
      const checkVoice = setInterval(() => {
        voices = this.speechSynthesis!.getVoices();
        if (voices.length > 0) {
          clearInterval(checkVoice);
          trySpeak();
        }
      }, 100);
      
      // Timeout after 1.5s
      setTimeout(() => clearInterval(checkVoice), 1500);
    } else {
      trySpeak();
    }
  }

  stopSpeaking() {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
    if (this.currentBufferSource) {
      this.currentBufferSource.stop();
      this.currentBufferSource = null;
    }
    this.currentUtterance = null;
    if (this.onSpeechEndCallback) {
      const cb = this.onSpeechEndCallback;
      this.onSpeechEndCallback = null;
      cb();
    }
  }

  async playBase64PCM(base64Data: string, onComplete?: () => void) {
    if (this.isMuted) return;
    this.stopSpeaking();
    this.onSpeechEndCallback = onComplete || null;

    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }
      
      const arrayBuffer = bytes.buffer;
      const audioBuffer = this.audioContext.createBuffer(1, arrayBuffer.byteLength / 2, 24000);
      const channelData = audioBuffer.getChannelData(0);
      const dataView = new DataView(arrayBuffer);
      
      for (let i = 0; i < channelData.length; i++) {
          channelData[i] = dataView.getInt16(i * 2, true) / 32768.0;
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.onended = () => {
        if (this.currentBufferSource === source) {
          this.currentBufferSource = null;
          if (this.onSpeechEndCallback) {
            const cb = this.onSpeechEndCallback;
            this.onSpeechEndCallback = null;
            cb();
          }
        }
      };
      source.start();
      this.currentBufferSource = source;
    } catch (err) {
      console.error('Error playing PCM audio:', err);
      if (onComplete) onComplete();
    }
  }

  play(soundName: keyof typeof SOUND_URLS) {
    if (this.isMuted) return;
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.currentTime = 0;
      // Drastically lower volumes as requested
      const volumes = {
        click: 0.2,
        interaction: 0.3,
        success: 0.3,
        transition: 0.1,
        sparkle: 0.2
      };
      sound.volume = volumes[soundName] || 0.5;
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
