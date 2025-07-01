import { motion } from 'framer-motion';

interface MusicVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
}

export default function MusicVisualizer({ isPlaying, barCount = 7 }: MusicVisualizerProps) {
  const colors = ['#22C55E', '#F97316', '#8B5CF6', '#0EA5E9', '#EC4899'];
  
  return (
    <div className="flex justify-center items-end space-x-1 h-12">
      {Array.from({ length: barCount }).map((_, index) => (
        <motion.div
          key={index}
          className="w-1 bg-current rounded-full"
          style={{ 
            color: colors[index % colors.length],
            height: isPlaying ? 'auto' : '4px'
          }}
          animate={isPlaying ? {
            height: [4, Math.random() * 40 + 10, 4],
            transition: {
              duration: 0.5 + Math.random() * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.1
            }
          } : { height: 4 }}
        />
      ))}
    </div>
  );
}
