import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoodType } from '@/types/spotify';
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';

// Simplified mood data
const moods: { id: MoodType; label: string; emoji: string; color: string }[] = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: 'bg-yellow-400' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: 'bg-blue-400' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡', color: 'bg-red-400' },
  { id: 'calm', label: 'Calm', emoji: '😌', color: 'bg-green-400' },
  { id: 'romantic', label: 'Romantic', emoji: '💕', color: 'bg-pink-400' },
  { id: 'angry', label: 'Angry', emoji: '😠', color: 'bg-orange-400' }
];

// Simple cactus component
function SimpleCactus({ mood, isPlaying }: { mood: MoodType | null; isPlaying: boolean }) {
  const getAnimation = () => {
    if (!isPlaying) return 'animate-pulse';
    switch (mood) {
      case 'happy': return 'animate-bounce';
      case 'energetic': return 'animate-ping';
      case 'calm': return 'animate-pulse';
      default: return 'animate-bounce';
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <div className={`text-8xl ${getAnimation()}`}>
        🌵
      </div>
      <p className="mt-4 text-lg font-medium">
        {mood ? `Dancing to ${mood} vibes!` : 'Select a mood to see me dance!'}
      </p>
    </div>
  );
}

// Simple audio generator
class SimpleAudio {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  async start(mood: MoodType) {
    this.stop();
    
    try {
      this.audioContext = new AudioContext();
      this.oscillator = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();

      // Simple frequency mapping
      const frequencies: Record<MoodType, number> = {
        happy: 440,    // A4
        sad: 220,      // A3
        energetic: 330, // E4
        calm: 196,     // G3
        romantic: 261,  // C4
        angry: 146     // D3
      };

      this.oscillator.frequency.value = frequencies[mood];
      this.oscillator.type = 'sine';
      this.gainNode.gain.value = 0.1;

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      this.oscillator.start();
      this.isPlaying = true;
      
      return true;
    } catch (error) {
      console.error('Audio failed:', error);
      return false;
    }
  }

  stop() {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isPlaying = false;
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

const simpleAudio = new SimpleAudio();

export default function SimpleHome() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  const handleMoodSelect = async (mood: MoodType) => {
    setSelectedMood(mood);
    const success = await simpleAudio.start(mood);
    if (success) {
      setIsPlaying(true);
      setCurrentTrack(`${mood.charAt(0).toUpperCase() + mood.slice(1)} Melody`);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      simpleAudio.stop();
      setIsPlaying(false);
    } else if (selectedMood) {
      handleMoodSelect(selectedMood);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            MoodTunes Cactus 🌵
          </h1>
          <p className="text-xl text-white/80">
            Choose your mood and watch the cactus dance!
          </p>
        </div>

        {/* Mood Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Select Your Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {moods.map((mood) => (
                <Button
                  key={mood.id}
                  variant={selectedMood === mood.id ? "default" : "outline"}
                  className={`h-20 flex flex-col gap-2 ${mood.color} ${
                    selectedMood === mood.id ? 'ring-4 ring-white' : ''
                  }`}
                  onClick={() => handleMoodSelect(mood.id)}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="font-medium">{mood.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dancing Cactus */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <SimpleCactus mood={selectedMood} isPlaying={isPlaying} />
          </CardContent>
        </Card>

        {/* Simple Player */}
        {currentTrack && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">{currentTrack}</h3>
                    <p className="text-sm text-muted-foreground">Generated Audio</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={togglePlayback}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {selectedMood && (
                <div className="mt-4">
                  <Badge variant="secondary" className="capitalize">
                    {selectedMood} Mode
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}