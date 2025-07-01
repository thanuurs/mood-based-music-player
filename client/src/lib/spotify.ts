import { SpotifyRecommendations, SpotifyPlaybackState } from '@/types/spotify';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

export class SpotifyService {
  private player: any = null;
  private deviceId: string | null = null;
  private accessToken: string | null = null;

  async getAccessToken(): Promise<string | null> {
    try {
      const response = await fetch('/api/spotify/token');
      if (!response.ok) return null;
      
      const data = await response.json();
      this.accessToken = data.accessToken;
      return data.accessToken;
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  }

  async initializePlayer(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!window.Spotify) {
        window.onSpotifyWebPlaybackSDKReady = () => {
          this.setupPlayer().then(resolve);
        };
      } else {
        this.setupPlayer().then(resolve);
      }
    });
  }

  private async setupPlayer(): Promise<boolean> {
    const token = await this.getAccessToken();
    if (!token) return false;

    this.player = new window.Spotify.Player({
      name: 'MoodTunes Cactus Player',
      getOAuthToken: (cb: (token: string) => void) => {
        cb(token);
      },
      volume: 0.5
    });

    this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
      console.log('Ready with Device ID', device_id);
      this.deviceId = device_id;
    });

    this.player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
      console.log('Device ID has gone offline', device_id);
    });

    this.player.addListener('player_state_changed', (state: any) => {
      if (!state) return;
      
      // Emit custom event for player state changes
      window.dispatchEvent(new CustomEvent('spotify-state-change', { detail: state }));
    });

    await this.player.connect();
    return true;
  }

  async getRecommendations(mood: string): Promise<SpotifyRecommendations | null> {
    try {
      const response = await fetch(`/api/spotify/recommendations/${mood}`);
      if (!response.ok) return null;
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      return null;
    }
  }

  async playTrack(trackUri: string): Promise<boolean> {
    if (!this.accessToken || !this.deviceId) return false;

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [trackUri]
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to play track:', error);
      return false;
    }
  }

  async playPlaylist(trackUris: string[]): Promise<boolean> {
    if (!this.accessToken || !this.deviceId) return false;

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: trackUris
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to play playlist:', error);
      return false;
    }
  }

  async pause(): Promise<boolean> {
    if (!this.player) return false;
    
    try {
      await this.player.pause();
      return true;
    } catch (error) {
      console.error('Failed to pause:', error);
      return false;
    }
  }

  async resume(): Promise<boolean> {
    if (!this.player) return false;
    
    try {
      await this.player.resume();
      return true;
    } catch (error) {
      console.error('Failed to resume:', error);
      return false;
    }
  }

  async nextTrack(): Promise<boolean> {
    if (!this.player) return false;
    
    try {
      await this.player.nextTrack();
      return true;
    } catch (error) {
      console.error('Failed to skip to next track:', error);
      return false;
    }
  }

  async previousTrack(): Promise<boolean> {
    if (!this.player) return false;
    
    try {
      await this.player.previousTrack();
      return true;
    } catch (error) {
      console.error('Failed to skip to previous track:', error);
      return false;
    }
  }

  async getCurrentState(): Promise<any> {
    if (!this.player) return null;
    
    try {
      return await this.player.getCurrentState();
    } catch (error) {
      console.error('Failed to get current state:', error);
      return null;
    }
  }
}

export const spotifyService = new SpotifyService();
