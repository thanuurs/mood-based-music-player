import { Button } from '@/components/ui/button';
import { MoodType } from '@/types/spotify';

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onMoodSelect: (mood: MoodType) => void;
  disabled?: boolean;
}

const moods: Array<{
  id: MoodType;
  emoji: string;
  name: string;
  description: string;
  hoverGradient: string;
}> = [
  {
    id: 'happy',
    emoji: '😊',
    name: 'Happy',
    description: 'Upbeat & Joyful',
    hoverGradient: 'hover:bg-gradient-to-r hover:from-yellow-100 hover:to-orange-100'
  },
  {
    id: 'sad',
    emoji: '😢',
    name: 'Sad',
    description: 'Melancholy & Reflective',
    hoverGradient: 'hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100'
  },
  {
    id: 'energetic',
    emoji: '⚡',
    name: 'Energetic',
    description: 'High Energy & Pump Up',
    hoverGradient: 'hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100'
  },
  {
    id: 'calm',
    emoji: '🧘',
    name: 'Calm',
    description: 'Peaceful & Relaxed',
    hoverGradient: 'hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100'
  },
  {
    id: 'romantic',
    emoji: '💕',
    name: 'Romantic',
    description: 'Love & Affection',
    hoverGradient: 'hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100'
  },
  {
    id: 'angry',
    emoji: '😠',
    name: 'Angry',
    description: 'Intense & Powerful',
    hoverGradient: 'hover:bg-gradient-to-r hover:from-red-100 hover:to-orange-100'
  }
];

export default function MoodSelector({ selectedMood, onMoodSelect, disabled }: MoodSelectorProps) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-fredoka text-center text-gray-800 mb-8">
        How are you feeling today? 🎭
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
        {moods.map((mood) => (
          <Button
            key={mood.id}
            onClick={() => onMoodSelect(mood.id)}
            disabled={disabled}
            variant="ghost"
            className={`
              bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl 
              transition-all duration-300 hover:scale-105 border-2 border-transparent 
              h-auto flex flex-col items-center space-y-2
              ${mood.hoverGradient}
              ${selectedMood === mood.id ? 'ring-4 ring-green-500/30 bg-green-50' : ''}
            `}
          >
            <div className="text-4xl">{mood.emoji}</div>
            <div className="font-semibold text-gray-800">{mood.name}</div>
            <div className="text-xs text-gray-500 text-center">{mood.description}</div>
          </Button>
        ))}
      </div>
    </section>
  );
}
