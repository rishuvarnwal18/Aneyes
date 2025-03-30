import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Activity } from 'lucide-react';

interface KeystrokeDynamicsProps {
  enabled: boolean;
  onTypePatternAnalyzed: (score: number) => void;
}

const KeystrokeDynamics = ({ enabled, onTypePatternAnalyzed }: KeystrokeDynamicsProps) => {
  const [keyData, setKeyData] = useState<KeyData[]>([]);
  const [rhythmScore, setRhythmScore] = useState(0);
  const [rhythmMetrics, setRhythmMetrics] = useState({
    speed: 0,
    consistency: 0,
    fluency: 0
  });
  const [showDetails, setShowDetails] = useState(false);

  interface KeyData {
    key: string;
    pressTime: number;
    releaseTime: number;
    duration: number;
    interval?: number;
  }

  useEffect(() => {
    if (!enabled || keyData.length < 3) return;
    
    // Calculate typing metrics
    calculateMetrics();
  }, [keyData, enabled]);

  const recordKeyDown = (key: string) => {
    if (!enabled) return;
    
    const now = performance.now();
    setKeyData(prev => {
      const newData = [...prev];
      const existingIndex = newData.findIndex(k => k.key === key && !k.releaseTime);
      
      if (existingIndex >= 0) {
        // Key is already pressed, unusual but possible
        return newData;
      }
      
      // Calculate interval from previous key press if this isn't the first key
      let interval: number | undefined = undefined;
      if (newData.length > 0) {
        const lastKey = newData[newData.length - 1];
        interval = now - lastKey.pressTime;
      }
      
      return [...newData, { 
        key, 
        pressTime: now, 
        releaseTime: 0, 
        duration: 0,
        interval 
      }];
    });
  };

  const recordKeyUp = (key: string) => {
    if (!enabled) return;
    
    const now = performance.now();
    setKeyData(prev => {
      const newData = [...prev];
      // Find the most recent entry for this key that hasn't been released
      const index = newData.findIndex(k => k.key === key && !k.releaseTime);
      
      if (index >= 0) {
        newData[index].releaseTime = now;
        newData[index].duration = now - newData[index].pressTime;
      }
      
      return newData;
    });
  };

  const calculateMetrics = () => {
    if (keyData.length < 3) return;
    
    // Extract durations (how long keys are held)
    const durations = keyData
      .filter(k => k.duration > 0)
      .map(k => k.duration);
    
    // Extract intervals (time between keypresses)
    const intervals = keyData
      .filter(k => k.interval !== undefined)
      .map(k => k.interval as number);
    
    if (durations.length < 2 || intervals.length < 2) return;
    
    // Calculate metrics
    // 1. Speed: Average time between keypresses (lower is faster)
    const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
    const speedScore = Math.min(100, 1000 / avgInterval * 20); // Faster typing gets higher score
    
    // 2. Consistency: Standard deviation of intervals (lower is more consistent)
    const stdDevInterval = calculateStdDev(intervals);
    const consistencyScore = Math.min(100, 100 - (stdDevInterval / 5));
    
    // 3. Fluency: Ratio of typing time to pauses
    const totalTypingTime = durations.reduce((sum, val) => sum + val, 0);
    const totalTime = keyData[keyData.length - 1].pressTime - keyData[0].pressTime;
    const fluencyScore = Math.min(100, (totalTypingTime / totalTime) * 150);
    
    // Set the metrics
    setRhythmMetrics({
      speed: Math.round(speedScore),
      consistency: Math.round(consistencyScore),
      fluency: Math.round(fluencyScore)
    });
    
    // Calculate overall typing pattern score (0-100)
    const overallScore = Math.round((speedScore + consistencyScore + fluencyScore) / 3);
    setRhythmScore(overallScore);
    
    // Pass the score to parent component
    onTypePatternAnalyzed(overallScore);
  };

  const calculateStdDev = (values: number[]): number => {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(squareDiffs.reduce((sum, val) => sum + val, 0) / values.length);
  };

  // Create an object to track keyboard event handlers
  const keyHandlers = {
    handleKeyDown: (e: KeyboardEvent) => recordKeyDown(e.key),
    handleKeyUp: (e: KeyboardEvent) => recordKeyUp(e.key)
  };

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', keyHandlers.handleKeyDown);
      document.addEventListener('keyup', keyHandlers.handleKeyUp);
    }
    
    return () => {
      document.removeEventListener('keydown', keyHandlers.handleKeyDown);
      document.removeEventListener('keyup', keyHandlers.handleKeyUp);
    };
  }, [enabled]);

  // Don't render anything if feature is disabled or no typing data
  if (!enabled || keyData.length < 3) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 p-4 border border-gray-200 rounded-lg bg-violet-50"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Fingerprint size={18} className="mr-2 text-violet-600" />
          <h3 className="text-sm font-medium text-gray-700">Typing Pattern Analysis</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-violet-600 underline"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>
      
      <div className="flex items-center mb-2">
        <div className="w-full h-2 bg-gray-200 rounded-full mr-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${rhythmScore}%` }}
            transition={{ duration: 0.8 }}
            className={`h-full rounded-full ${
              rhythmScore < 40 ? 'bg-red-500' :
              rhythmScore < 60 ? 'bg-orange-500' :
              rhythmScore < 80 ? 'bg-green-500' :
              'bg-violet-500'
            }`}
          />
        </div>
        <span className="text-sm font-medium w-12 text-right">{rhythmScore}</span>
      </div>
      
      <div className="text-xs text-gray-600">
        {rhythmScore < 40 && "Your typing pattern is quite distinctive and may be easily recognizable."}
        {rhythmScore >= 40 && rhythmScore < 60 && "Your typing has a moderate distinctiveness - somewhat recognizable."}
        {rhythmScore >= 60 && rhythmScore < 80 && "Your typing pattern is fairly common - not too distinctive."}
        {rhythmScore >= 80 && "Your typing pattern is very smooth and balanced - hard to distinguish."}
      </div>
      
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 pt-3 border-t border-gray-200"
        >
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-white rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Typing Speed</div>
              <div className="flex justify-center">
                <Activity size={14} className="text-blue-500 mr-1" />
                <span className="text-sm font-medium">{rhythmMetrics.speed}</span>
              </div>
            </div>
            <div className="p-2 bg-white rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Consistency</div>
              <div className="flex justify-center">
                <Activity size={14} className="text-green-500 mr-1" />
                <span className="text-sm font-medium">{rhythmMetrics.consistency}</span>
              </div>
            </div>
            <div className="p-2 bg-white rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Fluency</div>
              <div className="flex justify-center">
                <Activity size={14} className="text-purple-500 mr-1" />
                <span className="text-sm font-medium">{rhythmMetrics.fluency}</span>
              </div>
            </div>
          </div>
          
          <p className="mt-3 text-xs text-gray-500">
            This analysis is based on your keystroke timing, rhythm, and typing fluency. 
            A distinctive typing pattern can be used as an additional layer of authentication.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default KeystrokeDynamics;
 