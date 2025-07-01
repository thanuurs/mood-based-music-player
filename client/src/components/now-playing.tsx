import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';
import { SpotifyTrack } from '@/types/spotify';

interface NowPlayingProps {
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  onTogglePlayback: () => void;
  onNextTrack: () => void;
  onPreviousTrack: () => void;
}

function formatTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function NowPlaying({
  currentTrack,
  isPlaying,
  position,
  duration,
  onTogglePlayback,
  onNextTrack,
  onPreviousTrack
}: NowPlayingProps) {
  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Music className="mr-2 text-green-600" size={20} />
          Now Playing
        </h3>
        
        <div className="space-y-4">
          {/* Album Art */}
          <div className="w-full h-48 bg-gradient-to-br from-green-200/20 to-orange-200/20 rounded-xl flex items-center justify-center overflow-hidden">
            {currentTrack?.album.images[0] ? (
              <img 
                src={currentTrack.album.images[0].url} 
                alt={currentTrack.album.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Music size={64} className="text-gray-400" />
            )}
          </div>
          
          {/* Track Info */}
          <div className="text-center">
            <div className="font-semibold text-gray-800 truncate">
              {currentTrack?.name || 'Select a mood to start'}
            </div>
            <div className="text-sm text-gray-600 truncate">
              {currentTrack?.artists[0]?.name || 'Your perfect playlist awaits'}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            {currentTrack && (
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatTime(position)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            )}
          </div>
          
          {/* Playback Controls */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onPreviousTrack}
              disabled={!currentTrack}
              className="rounded-full"
            >
              <SkipBack size={16} />
            </Button>
            
            <Button
              size="icon"
              onClick={onTogglePlayback}
              disabled={!currentTrack}
              className="w-12 h-12 bg-green-600 hover:bg-green-700 rounded-full"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={onNextTrack}
              disabled={!currentTrack}
              className="rounded-full"
            >
              <SkipForward size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
