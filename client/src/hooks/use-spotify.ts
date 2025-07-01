import { useState, useEffect, useCallback } from 'react';
import { spotifyService } from '@/lib/spotify';
import { SpotifyTrack, MoodType } from '@/types/spotify';

interface SpotifyState {
  isConnected: boolean;
  isPlaying: boolean;
  currentTrack: SpotifyTrack | null;
  position: number;
  duration: number;
}

export function useSpotify() {
  const [state, setState] = useState<SpotifyState>({
    isConnected: false,
    isPlaying: false,
    currentTrack: null,
    position: 0,
    duration: 0
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize Spotify player
    spotifyService.initializePlayer().then((connected) => {
      setState(prev => ({ ...prev, isConnected: connected }));
    });

    // Listen for player state changes
    const handleStateChange = (event: CustomEvent) => {
      const playerState = event.detail;
      setState(prev => ({
        ...prev,
        isPlaying: !playerState.paused,
        currentTrack: playerState.track_window?.current_track || null,
        position: playerState.position || 0,
        duration: playerState.duration || 0
      }));
    };

    window.addEventListener('spotify-state-change', handleStateChange as EventListener);

    return () => {
      window.removeEventListener('spotify-state-change', handleStateChange as EventListener);
    };
  }, []);

  const playMoodPlaylist = useCallback(async (mood: MoodType) => {
    setIsLoading(true);
    try {
      const recommendations = await spotifyService.getRecommendations(mood);
      if (recommendations && recommendations.tracks.length > 0) {
        const trackUris = recommendations.tracks.map(track => `spotify:track:${track.id}`);
        await spotifyService.playPlaylist(trackUris);
      }
    } catch (error) {
      console.error('Failed to play mood playlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const togglePlayback = useCallback(async () => {
    if (state.isPlaying) {
      await spotifyService.pause();
    } else {
      await spotifyService.resume();
    }
  }, [state.isPlaying]);

  const nextTrack = useCallback(async () => {
    await spotifyService.nextTrack();
  }, []);

  const previousTrack = useCallback(async () => {
    await spotifyService.previousTrack();
  }, []);

  const getAuthUrl = useCallback(async () => {
    try {
      const response = await fetch('/api/spotify/auth');
      const data = await response.json();
      return data.authUrl;
    } catch (error) {
      console.error('Failed to get auth URL:', error);
      return null;
    }
  }, []);

  return {
    ...state,
    isLoading,
    playMoodPlaylist,
    togglePlayback,
    nextTrack,
    previousTrack,
    getAuthUrl
  };
}
