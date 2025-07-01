import { MoodType } from '@/types/spotify';

// Web Audio API-based music generator
export class AudioGenerator {
  private audioContext: AudioContext | null = null;
  private currentOscillators: OscillatorNode[] = [];
  private masterGain: GainNode | null = null;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3; // Set master volume
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private createOscillator(frequency: number, type: OscillatorType = 'sine'): OscillatorNode | null {
    if (!this.audioContext || !this.masterGain) return null;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    gainNode.gain.value = 0.1;
    
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    return oscillator;
  }

  private getMoodFrequencies(mood: MoodType): { frequencies: number[]; waveType: OscillatorType; tempo: number } {
    const moodConfigs = {
      happy: {
        frequencies: [440, 523.25, 659.25, 783.99], // A4, C5, E5, G5 - Major chord progression
        waveType: 'sine' as OscillatorType,
        tempo: 120
      },
      sad: {
        frequencies: [220, 261.63, 311.13, 369.99], // A3, C4, D#4, F#4 - Minor progression
        waveType: 'sine' as OscillatorType,
        tempo: 60
      },
      energetic: {
        frequencies: [330, 440, 554.37, 659.25], // E4, A4, C#5, E5 - Power chord
        waveType: 'sawtooth' as OscillatorType,
        tempo: 140
      },
      calm: {
        frequencies: [196, 246.94, 293.66, 349.23], // G3, B3, D4, F4 - Peaceful progression
        waveType: 'sine' as OscillatorType,
        tempo: 80
      },
      romantic: {
        frequencies: [261.63, 329.63, 392, 493.88], // C4, E4, G4, B4 - Romantic progression
        waveType: 'triangle' as OscillatorType,
        tempo: 90
      },
      angry: {
        frequencies: [146.83, 185, 233.08, 293.66], // D3, F#3, A#3, D4 - Aggressive progression
        waveType: 'square' as OscillatorType,
        tempo: 160
      }
    };

    return moodConfigs[mood];
  }

  async startMoodMusic(mood: MoodType): Promise<boolean> {
    if (!this.audioContext) return false;

    // Resume audio context if suspended (required for user interaction)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.stopMusic();

    const config = this.getMoodFrequencies(mood);
    const beatInterval = (60 / config.tempo) * 1000; // Convert BPM to milliseconds

    // Create oscillators for the mood
    config.frequencies.forEach((freq, index) => {
      setTimeout(() => {
        const osc = this.createOscillator(freq, config.waveType);
        if (osc) {
          this.currentOscillators.push(osc);
          osc.start();
          
          // Add rhythmic pattern
          const gainNode = osc.context.createGain();
          osc.disconnect();
          osc.connect(gainNode);
          gainNode.connect(this.masterGain!);
          
          // Create rhythmic envelope
          this.createRhythmicPattern(gainNode, beatInterval, mood);
        }
      }, index * 100); // Stagger note starts
    });

    return true;
  }

  private createRhythmicPattern(gainNode: GainNode, beatInterval: number, mood: MoodType) {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const patternLength = 4; // 4 beats
    const beatDuration = beatInterval / 1000; // Convert to seconds

    // Different rhythmic patterns for different moods
    const patterns = {
      happy: [1, 0.3, 0.7, 0.3], // Strong-weak-medium-weak
      sad: [0.8, 0.2, 0.5, 0.2], // Slow, melancholic
      energetic: [1, 0.8, 1, 0.8], // Driving rhythm
      calm: [0.6, 0.3, 0.4, 0.3], // Gentle, flowing
      romantic: [0.7, 0.4, 0.6, 0.4], // Smooth, flowing
      angry: [1, 0.9, 1, 0.9] // Aggressive, powerful
    };

    const pattern = patterns[mood];

    // Repeat pattern
    for (let cycle = 0; cycle < 8; cycle++) { // 8 cycles = 32 beats
      pattern.forEach((volume, beat) => {
        const time = now + (cycle * patternLength * beatDuration) + (beat * beatDuration);
        gainNode.gain.setValueAtTime(volume * 0.1, time);
        gainNode.gain.setValueAtTime(0.05, time + beatDuration * 0.8);
      });
    }
  }

  stopMusic() {
    this.currentOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (error) {
        // Oscillator might already be stopped
      }
    });
    this.currentOscillators = [];
  }

  setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }
}

export const audioGenerator = new AudioGenerator();