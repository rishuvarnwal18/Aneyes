import  { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TypingPatternVisualizerProps {
  typingData: any[];
  active: boolean;
}

const TypingPatternVisualizer = ({ typingData, active }: TypingPatternVisualizerProps) => {
  const [barHeights, setBarHeights] = useState<number[]>([]);
  
  useEffect(() => {
    if (!active || typingData.length < 3) {
      setBarHeights(Array(20).fill(0));
      return;
    }
    
    // Extract keystroke timing data
    const keyData = typingData.filter(data => data.duration > 0);
    
    if (keyData.length > 0) {
      // Normalize the data to values between 3 and 20 (for bar heights)
      const durations = keyData.map(k => k.duration);
      const min = Math.min(...durations);
      const max = Math.max(...durations);
      const range = max - min || 1; // Avoid division by zero
      
      // Generate heights based on keystroke patterns
      let heights: number[] = [];
      
      // Mix of key durations and intervals to create a visually interesting pattern
      for (let i = 0; i < keyData.length && heights.length < 20; i++) {
        const normalizedHeight = 3 + ((keyData[i].duration - min) / range) * 17;
        heights.push(normalizedHeight);
        
        if (keyData[i].interval && heights.length < 20) {
          const intervalHeight = 3 + (Math.min(keyData[i].interval, 500) / 500) * 17;
          heights.push(intervalHeight);
        }
      }
      
      // Pad with random values if we don't have enough
      while (heights.length < 20) {
        heights.push(Math.random() * 17 + 3);
      }
      
      // Take just the first 20 values
      heights = heights.slice(0, 20);
      
      setBarHeights(heights);
    }
  }, [typingData, active]);
  
  if (!active) return null;
  
  return (
    <div className="visualizer-container mt-2">
      {barHeights.map((height, index) => (
        <motion.div
          key={index}
          className="visualizer-dot"
          style={{ height: `${height}px` }}
          initial={{ scaleY: 0 }}
          animate={{ 
            scaleY: 1,
            backgroundColor: index % 3 === 0 ? '#8b5cf6' : 
                             index % 3 === 1 ? '#6366f1' : '#3b82f6'
          }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.02,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};

export default TypingPatternVisualizer;
 