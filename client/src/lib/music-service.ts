import { MoodType, SpotifyTrack } from '@/types/spotify';
import { audioGenerator } from './audio-generator';

// Generated music data for each mood - completely standalone
const generatedMusicData: Record<MoodType, SpotifyTrack[]> = {
  happy: [
    {
      id: 'happy-1',
      name: 'Happy Song',
      artists: [{ name: 'Joy Artist', id: 'artist-1' }],
      album: {
        name: 'Happy Album',
        images: [{ url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZENzAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMCIgZmlsbD0iYmxhY2siIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5IYXBweTwvdGV4dD48L3N2Zz4=', height: 300, width: 300 }]
      },
      duration_ms: 180000,
      preview_url: null,
      external_urls: { spotify: '#' }
    },
    {
      id: 'happy-2', 
      name: 'Sunshine Vibes',
      artists: [{ name: 'Bright Day', id: 'artist-2' }],
      album: {
        name: 'Golden Hour',
        images: [{ url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZBNTAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iYmxhY2siIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TdW5zaGluZTwvdGV4dD48L3N2Zz4=', height: 300, width: 300 }]
      },
      duration_ms: 200000,
      preview_url: null,
      external_urls: { spotify: '#' }
    }
  ],
  sad: [
    {
      id: 'sad-1',
      name: 'Melancholy Rain',
      artists: [{ name: 'Blue Skies', id: 'artist-3' }],
      album: {
        name: 'Rainy Days',
        images: [{ url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDE2OUUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5SYWluPC90ZXh0Pjwvc3ZnPg==', height: 300, width: 300 }]
      },
      duration_ms: 210000,
      preview_url: null,
      external_urls: { spotify: '#' }
    }
  ],
  energetic: [
    {
      id: 'energetic-1',
      name: 'Power Up',
      artists: [{ name: 'Electric Storm', id: 'artist-4' }],
      album: {
        name: 'High Voltage',
        images: [{ url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY0NTAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FbmVyZ3k8L3RleHQ+PC9zdmc+', height: 300, width: 300 }]
      },
      duration_ms: 190000,
      preview_url: null,
      external_urls: { spotify: '#' }
    }
  ],
  calm: [
    {
      id: 'calm-1',
      name: 'Peaceful Waters',
      artists: [{ name: 'Zen Garden', id: 'artist-5' }],
      album: {
        name: 'Tranquility',
        images: [{ url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzJDRDMyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DYWxtPC90ZXh0Pjwvc3ZnPg==', height: 300, width: 300 }]
      },
      duration_ms: 240000,
      preview_url: null,
      external_urls: { spotify: '#' }
    }
  ],
  romantic: [
    {
      id: 'romantic-1',
      name: 'Love Song',
      artists: [{ name: 'Heart Strings', id: 'artist-6' }],
      album: {
        name: 'Romance',
        images: [{ url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2OUI0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Mb3ZlPC90ZXh0Pjwvc3ZnPg==', height: 300, width: 300 }]
      },
      duration_ms: 220000,
      preview_url: null,
      external_urls: { spotify: '#' }
    }
  ],
  angry: [
    {
      id: 'angry-1',
      name: 'Rage Mode',
      artists: [{ name: 'Fire Storm', id: 'artist-7' }],
      album: {
        name: 'Intensity',
        images: [{ url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjREMxNDNDIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5GaXJlPC90ZXh0Pjwvc3ZnPg==', height: 300, width: 300 }]
      },
      duration_ms: 180000,
      preview_url: null,
      external_urls: { spotify: '#' }
    }
  ]
};

export class MusicService {
  private currentTrack: SpotifyTrack | null = null;
  private currentPlaylist: SpotifyTrack[] = [];
  private currentIndex = 0;
  private isPlaying = false;
  private position = 0;
  private duration = 0;
  private positionTimer: NodeJS.Timeout | null = null;

  constructor() {
    // No need for HTML audio setup
  }

  private startPositionTracking() {
    this.stopPositionTracking();
    this.positionTimer = setInterval(() => {
      if (this.isPlaying) {
        this.position += 100; // Increment by 100ms
        this.dispatchStateChange();
      }
    }, 100);
  }

  private stopPositionTracking() {
    if (this.positionTimer) {
      clearInterval(this.positionTimer);
      this.positionTimer = null;
    }
  }

  private dispatchStateChange() {
    window.dispatchEvent(new CustomEvent('music-state-change', {
      detail: {
        currentTrack: this.currentTrack,
        isPlaying: this.isPlaying,
        position: this.position,
        duration: this.duration
      }
    }));
  }

  async getMoodPlaylist(mood: MoodType): Promise<SpotifyTrack[]> {
    // Return generated music data for the mood
    return generatedMusicData[mood] || [];
  }

  async playMoodPlaylist(mood: MoodType): Promise<boolean> {
    try {
      const playlist = await this.getMoodPlaylist(mood);
      if (playlist.length === 0) return false;

      this.currentPlaylist = playlist;
      this.currentIndex = 0;
      return this.playCurrentTrack();
    } catch (error) {
      console.error('Failed to play mood playlist:', error);
      return false;
    }
  }

  async playCurrentTrack(): Promise<boolean> {
    if (this.currentPlaylist.length === 0) return false;

    const track = this.currentPlaylist[this.currentIndex];
    this.currentTrack = track;

    // Extract mood from track name or use a default
    const moodFromTrack = this.extractMoodFromTrack(track);
    
    // Stop any currently playing audio
    audioGenerator.stopMusic();
    
    // Start generated music for the mood
    const success = await audioGenerator.startMoodMusic(moodFromTrack);
    if (!success) return false;

    this.isPlaying = true;
    this.position = 0;
    this.duration = track.duration_ms;
    this.startPositionTracking();
    this.dispatchStateChange();
    
    // Simulate track ending after duration (shortened for demo)
    const playDuration = Math.min(track.duration_ms, 30000); // Max 30 seconds
    setTimeout(() => {
      this.nextTrack();
    }, playDuration);

    return true;
  }

  private extractMoodFromTrack(track: SpotifyTrack): MoodType {
    const trackName = track.name.toLowerCase();
    if (trackName.includes('happy') || trackName.includes('joy')) return 'happy';
    if (trackName.includes('sad') || trackName.includes('melancholy')) return 'sad';
    if (trackName.includes('energy') || trackName.includes('power')) return 'energetic';
    if (trackName.includes('calm') || trackName.includes('peaceful')) return 'calm';
    if (trackName.includes('love') || trackName.includes('romantic')) return 'romantic';
    if (trackName.includes('anger') || trackName.includes('rage')) return 'angry';
    return 'happy'; // Default fallback
  }

  async togglePlayback(): Promise<boolean> {
    try {
      if (this.isPlaying) {
        audioGenerator.stopMusic();
        this.stopPositionTracking();
        this.isPlaying = false;
      } else {
        if (this.currentTrack) {
          const mood = this.extractMoodFromTrack(this.currentTrack);
          await audioGenerator.startMoodMusic(mood);
          this.startPositionTracking();
          this.isPlaying = true;
        }
      }
      this.dispatchStateChange();
      return true;
    } catch (error) {
      console.error('Failed to toggle playback:', error);
      return false;
    }
  }

  async nextTrack(): Promise<boolean> {
    if (this.currentPlaylist.length === 0) return false;

    this.currentIndex = (this.currentIndex + 1) % this.currentPlaylist.length;
    return this.playCurrentTrack();
  }

  async previousTrack(): Promise<boolean> {
    if (this.currentPlaylist.length === 0) return false;

    this.currentIndex = this.currentIndex === 0 
      ? this.currentPlaylist.length - 1 
      : this.currentIndex - 1;
    return this.playCurrentTrack();
  }

  getCurrentTrack(): SpotifyTrack | null {
    return this.currentTrack;
  }

  getPlaybackState() {
    return {
      isPlaying: this.isPlaying,
      position: this.position,
      duration: this.duration,
      currentTrack: this.currentTrack
    };
  }
}

export const musicService = new MusicService();