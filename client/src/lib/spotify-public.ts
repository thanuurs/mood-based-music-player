import { SpotifyTrack, MoodType, SpotifyRecommendations } from '@/types/spotify';

// Spotify Client Credentials flow - no user login required
class SpotifyPublicService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  // Get access token using Client Credentials flow (no user login)
  private async getClientToken(): Promise<string | null> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch('/api/spotify/client-token');
      if (!response.ok) return null;
      
      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 min early
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get client token:', error);
      return null;
    }
  }

  // Search for tracks by mood keywords
  async searchByMood(mood: MoodType): Promise<SpotifyTrack[]> {
    const token = await this.getClientToken();
    if (!token) return [];

    const moodQueries: Record<MoodType, string> = {
      happy: 'happy upbeat positive joy energetic dance',
      sad: 'sad melancholy emotional ballad slow',
      energetic: 'energetic pump up workout rock electronic',
      calm: 'calm peaceful relaxing ambient chill',
      romantic: 'romantic love songs ballad R&B soul',
      angry: 'angry rock metal hardcore intense'
    };

    try {
      const query = encodeURIComponent(moodQueries[mood]);
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=track&limit=20&market=US`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) return [];

      const data = await response.json();
      return data.tracks.items.filter((track: any) => track.preview_url) || [];
    } catch (error) {
      console.error('Failed to search tracks:', error);
      return [];
    }
  }

  // Get featured playlists for mood
  async getFeaturedPlaylists(mood: MoodType): Promise<SpotifyTrack[]> {
    const token = await this.getClientToken();
    if (!token) return [];

    try {
      // Get featured playlists
      const playlistResponse = await fetch(
        'https://api.spotify.com/v1/browse/featured-playlists?limit=10&country=US',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!playlistResponse.ok) return [];

      const playlistData = await playlistResponse.json();
      const playlists = playlistData.playlists.items;

      // Filter playlists by mood keywords
      const moodKeywords: Record<MoodType, string[]> = {
        happy: ['happy', 'good', 'feel', 'positive', 'upbeat'],
        sad: ['sad', 'melancholy', 'acoustic', 'indie'],
        energetic: ['workout', 'energy', 'pump', 'dance'],
        calm: ['chill', 'relax', 'ambient', 'peaceful'],
        romantic: ['love', 'romantic', 'r&b', 'soul'],
        angry: ['rock', 'metal', 'intense', 'hard']
      };

      const relevantPlaylist = playlists.find((playlist: any) => 
        moodKeywords[mood].some(keyword => 
          playlist.name.toLowerCase().includes(keyword) ||
          playlist.description?.toLowerCase().includes(keyword)
        )
      ) || playlists[0];

      if (!relevantPlaylist) return [];

      // Get tracks from the playlist
      const tracksResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${relevantPlaylist.id}/tracks?limit=20&market=US`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!tracksResponse.ok) return [];

      const tracksData = await tracksResponse.json();
      return tracksData.items
        .map((item: any) => item.track)
        .filter((track: any) => track && track.preview_url) || [];
    } catch (error) {
      console.error('Failed to get featured playlists:', error);
      return [];
    }
  }

  // Get mood-based tracks combining search and playlists
  async getMoodTracks(mood: MoodType): Promise<SpotifyTrack[]> {
    const [searchTracks, playlistTracks] = await Promise.all([
      this.searchByMood(mood),
      this.getFeaturedPlaylists(mood)
    ]);

    // Combine and deduplicate
    const allTracks = [...searchTracks, ...playlistTracks];
    const uniqueTracks = allTracks.filter((track, index, self) => 
      index === self.findIndex(t => t.id === track.id)
    );

    return uniqueTracks.slice(0, 10); // Return top 10 tracks
  }
}

export const spotifyPublicService = new SpotifyPublicService();