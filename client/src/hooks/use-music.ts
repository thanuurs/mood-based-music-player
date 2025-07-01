import { useState, useEffect, useCallback } from 'react';
import { musicService } from '@/lib/music-service';
import { SpotifyTrack, MoodType } from '@/types/spotify';

interface MusicState {
  isPlaying: boolean;
  currentTrack: SpotifyTrack | null;
  position: number;
  duration: number;
}

export function useMusic() {
  const [state, setState] = useState<MusicState>({
    isPlaying: false,
    currentTrack: null,
    position: 0,
    duration: 0
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStateChange = (event: CustomEvent) => {
      const musicState = event.detail;
      setState({
        isPlaying: musicState.isPlaying,
        currentTrack: musicState.currentTrack,
        position: musicState.position,
        duration: musicState.duration
      });
    };

    window.addEventListener('music-state-change', handleStateChange as EventListener);

    return () => {
      window.removeEventListener('music-state-change', handleStateChange as EventListener);
    };
  }, []);

  const playMoodPlaylist = useCallback(async (mood: MoodType) => {
    setIsLoading(true);
    try {
      await musicService.playMoodPlaylist(mood);
    } catch (error) {
      console.error('Failed to play mood playlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const togglePlayback = useCallback(async () => {
    await musicService.togglePlayback();
  }, []);

  const nextTrack = useCallback(async () => {
    await musicService.nextTrack();
  }, []);

  const previousTrack = useCallback(async () => {
    await musicService.previousTrack();
  }, []);

  return {
    ...state,
    isLoading,
    isConnected: true, // Always connected for demo mode
    playMoodPlaylist,
    togglePlayback,
    nextTrack,
    previousTrack,
    getAuthUrl: () => Promise.resolve(null) // No auth needed for demo
  };
}