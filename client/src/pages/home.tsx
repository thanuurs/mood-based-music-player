import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useMusic } from '@/hooks/use-music';
import DancingCactus from '@/components/dancing-cactus';
import MoodSelector from '@/components/mood-selector';
import NowPlaying from '@/components/now-playing';
import MoodHistory from '@/components/mood-history';
import MusicVisualizer from '@/components/music-visualizer';
import { MoodType } from '@/types/spotify';
import { MoodSession } from '@shared/schema';
import { BarChart3, Music, ExternalLink } from 'lucide-react';

const moodDescriptions: Record<MoodType, string> = {
  happy: 'Spreading joy and positive vibes!',
  sad: 'Finding beauty in melancholy moments',
  energetic: 'Ready to conquer the world!',
  calm: 'Finding peace in the present moment',
  romantic: 'Love is in the air tonight',
  angry: 'Channel that intensity into power!'
};

const moodBackgrounds: Record<MoodType, string> = {
  happy: 'mood-gradient-happy',
  sad: 'mood-gradient-sad',
  energetic: 'mood-gradient-energetic',
  calm: 'mood-gradient-calm',
  romantic: 'mood-gradient-romantic',
  angry: 'mood-gradient-angry'
};

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    isConnected,
    isPlaying,
    currentTrack,
    position,
    duration,
    isLoading: musicLoading,
    playMoodPlaylist,
    togglePlayback,
    nextTrack,
    previousTrack,
    getAuthUrl
  } = useMusic();

  // Create mood session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (mood: MoodType) => {
      const response = await apiRequest('POST', '/api/mood-sessions', {
        mood,
        userId: null,
        songsPlayed: 0
      });
      return response.json();
    },
    onSuccess: (session: MoodSession) => {
      setCurrentSessionId(session.id);
      queryClient.invalidateQueries({ queryKey: ['/api/mood-sessions'] });
    }
  });

  // Update session mutation  
  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<MoodSession> }) => {
      const response = await apiRequest('PATCH', `/api/mood-sessions/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mood-sessions'] });
    }
  });

  // Get mood sessions for stats
  const { data: sessions } = useQuery<MoodSession[]>({
    queryKey: ['/api/mood-sessions'],
  });

  // Calculate stats
  const stats = {
    totalSessions: sessions?.length || 0,
    favoriteMood: sessions?.reduce((acc, session) => {
      acc[session.mood] = (acc[session.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    songsDiscovered: sessions?.reduce((sum, session) => sum + (session.songsPlayed || 0), 0) || 0
  };

  const favoriteMoodEntry = stats.favoriteMood 
    ? Object.entries(stats.favoriteMood).sort(([,a], [,b]) => b - a)[0]
    : null;

  const handleMoodSelect = async (mood: MoodType) => {
    setSelectedMood(mood);
    
    // Create a new mood session
    createSessionMutation.mutate(mood);
    
    // Play mood-based playlist
    await playMoodPlaylist(mood);
    
    toast({
      title: `${mood.charAt(0).toUpperCase() + mood.slice(1)} mood selected!`,
      description: moodDescriptions[mood]
    });
  };

  // Update session when track changes
  useEffect(() => {
    if (currentTrack && currentSessionId) {
      updateSessionMutation.mutate({
        id: currentSessionId,
        updates: {
          spotifyTrackId: currentTrack.id,
          trackName: currentTrack.name,
          artistName: currentTrack.artists[0]?.name,
          songsPlayed: (sessions?.find(s => s.id === currentSessionId)?.songsPlayed || 0) + 1
        }
      });
    }
  }, [currentTrack?.id, currentSessionId]);

  // Welcome message on first load
  useEffect(() => {
    toast({
      title: "Welcome to MoodTunes Cactus!",
      description: "Select a mood to start your musical journey with your dancing cactus buddy."
    });
  }, [toast]);

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      selectedMood ? moodBackgrounds[selectedMood] : 'bg-gradient-to-br from-green-100 via-blue-50 to-purple-100'
    }`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-4xl animate-bounce">🌵</div>
            <div>
              <h1 className="text-2xl font-fredoka text-green-600">MoodTunes Cactus</h1>
              <p className="text-sm text-gray-600">Your mood, your music, your vibe</p>
            </div>
          </div>
          
          {/* Music Service Status */}
          <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2">
            <Music className="mr-2" size={16} />
            Music Ready
          </Badge>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Mood Selection */}
        <MoodSelector 
          selectedMood={selectedMood}
          onMoodSelect={handleMoodSelect}
          disabled={!isConnected || musicLoading}
        />

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Dancing Cactus Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-sm shadow-2xl relative overflow-hidden">
              <CardContent className="p-8 text-center">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-orange-500/5 rounded-3xl"></div>
                <div className="absolute top-4 right-4 text-6xl opacity-10">🎵</div>
                <div className="absolute bottom-4 left-4 text-6xl opacity-10">🎶</div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-fredoka text-gray-800 mb-6">Meet Your Mood Buddy! 🌵</h3>
                  
                  {/* Dancing Cactus */}
                  <div className="mb-8">
                    <DancingCactus mood={selectedMood} isPlaying={isPlaying} />
                  </div>
                  
                  {/* Current Mood Display */}
                  <Card className="bg-gradient-to-r from-green-500/10 to-orange-500/10 mb-6">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-gray-800 mb-2">Current Vibe</h4>
                      <div className="text-3xl font-fredoka">
                        {selectedMood ? selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1) : 'Ready to Groove!'}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        {selectedMood ? moodDescriptions[selectedMood] : 'Select a mood to start your musical journey'}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Music Visualization */}
                  <MusicVisualizer isPlaying={isPlaying} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Now Playing */}
            <NowPlaying
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              position={position}
              duration={duration}
              onTogglePlayback={togglePlayback}
              onNextTrack={nextTrack}
              onPreviousTrack={previousTrack}
            />
            
            {/* Mood History */}
            <MoodHistory />
            
            {/* Quick Stats */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <BarChart3 className="mr-2 text-blue-600" size={20} />
                  Your Stats
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Sessions</span>
                    <span className="font-semibold text-green-600">{stats.totalSessions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Favorite Mood</span>
                    <span className="font-semibold text-orange-600 flex items-center">
                      {favoriteMoodEntry ? (
                        <>
                          {favoriteMoodEntry[0] === 'happy' && '😊'}
                          {favoriteMoodEntry[0] === 'sad' && '😢'}
                          {favoriteMoodEntry[0] === 'energetic' && '⚡'}
                          {favoriteMoodEntry[0] === 'calm' && '🧘'}
                          {favoriteMoodEntry[0] === 'romantic' && '💕'}
                          {favoriteMoodEntry[0] === 'angry' && '😠'}
                          <span className="ml-1 capitalize">{favoriteMoodEntry[0]}</span>
                        </>
                      ) : (
                        'None yet'
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Songs Discovered</span>
                    <span className="font-semibold text-purple-600">{stats.songsDiscovered}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-white/20 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">🌵</span>
            <span className="font-fredoka text-lg text-gray-700">MoodTunes Cactus</span>
            <span className="text-2xl">🎶</span>
          </div>
          <p className="text-sm text-gray-600">Your mood, your music, perfectly matched. Powered by Spotify.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-green-600">
              <Music size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-green-600">
              <ExternalLink size={20} />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
