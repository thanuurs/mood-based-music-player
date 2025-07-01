import { Card, CardContent } from '@/components/ui/card';
import { History } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { MoodSession } from '@shared/schema';

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days > 0) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  } else {
    return 'Just now';
  }
}

const moodEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  energetic: '⚡',
  calm: '🧘',
  romantic: '💕',
  angry: '😠'
};

export default function MoodHistory() {
  const { data: sessions, isLoading } = useQuery<MoodSession[]>({
    queryKey: ['/api/mood-sessions'],
  });

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <History className="mr-2 text-purple-600" size={20} />
            Mood History
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div>
                      <div className="w-16 h-4 bg-gray-200 rounded"></div>
                      <div className="w-20 h-3 bg-gray-200 rounded mt-1"></div>
                    </div>
                  </div>
                  <div className="w-12 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentSessions = sessions?.slice(0, 5) || [];

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <History className="mr-2 text-purple-600" size={20} />
          Mood History
        </h3>
        
        <div className="space-y-3">
          {recentSessions.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-gray-400 text-sm">No mood sessions yet</div>
              <div className="text-gray-500 text-xs mt-1">Start by selecting a mood above!</div>
            </div>
          ) : (
            recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{moodEmojis[session.mood] || '🎵'}</span>
                  <div>
                    <div className="font-medium text-sm capitalize">{session.mood}</div>
                    <div className="text-xs text-gray-500">
                      {formatTimeAgo(new Date(session.timestamp))}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {session.songsPlayed} songs
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
