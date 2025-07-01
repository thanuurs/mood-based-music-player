import { motion } from 'framer-motion';
import { MoodType } from '@/types/spotify';

interface DancingCactusProps {
  mood: MoodType | null;
  isPlaying: boolean;
}

const moodConfig = {
  happy: {
    emoji: '😊',
    animation: 'bounce',
    color: 'text-yellow-500'
  },
  sad: {
    emoji: '😢',
    animation: 'sway',
    color: 'text-blue-500'
  },
  energetic: {
    emoji: '⚡',
    animation: 'dance',
    color: 'text-red-500'
  },
  calm: {
    emoji: '🧘',
    animation: 'pulse',
    color: 'text-green-500'
  },
  romantic: {
    emoji: '💕',
    animation: 'pulse',
    color: 'text-pink-500'
  },
  angry: {
    emoji: '😠',
    animation: 'bounce',
    color: 'text-orange-500'
  }
};

const animations = {
  bounce: {
    y: [0, -20, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  sway: {
    rotate: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  dance: {
    y: [0, -10, 0],
    rotate: [-2, 2, -2],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function DancingCactus({ mood, isPlaying }: DancingCactusProps) {
  const config = mood ? moodConfig[mood] : { emoji: '😊', animation: 'pulse', color: 'text-green-500' };
  
  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        className="text-9xl relative"
        animate={isPlaying ? animations[config.animation as keyof typeof animations] : { scale: 1 }}
      >
        🌵
        <motion.div
          className={`absolute -top-4 -right-4 text-4xl ${config.color}`}
          animate={{
            scale: [1, 1.2, 1],
            transition: { duration: 1, repeat: Infinity }
          }}
        >
          {config.emoji}
        </motion.div>
      </motion.div>
      
      {/* Dance Floor Effect */}
      <div className="mt-4 flex justify-center space-x-2">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: index === 0 ? 'var(--cactus)' : 
                             index === 1 ? 'var(--sunset)' :
                             index === 2 ? 'var(--mood-purple)' : 'var(--sky)'
            }}
            animate={isPlaying ? {
              scale: [1, 1.5, 1],
              transition: {
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2
              }
            } : { scale: 1 }}
          />
        ))}
      </div>
    </div>
  );
}
