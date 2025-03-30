import  { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

interface StrengthMeterProps {
  score: number;
  maxScore?: number;
}

const StrengthMeter = ({ score, maxScore = 4 }: StrengthMeterProps) => {
  const getColor = (index: number) => {
    if (index > score) return 'bg-gray-200';
    
    if (score === 0) return 'bg-red-500';
    if (score === 1) return 'bg-orange-500';
    if (score === 2) return 'bg-yellow-500';
    if (score === 3) return 'bg-green-400';
    return 'bg-green-600';
  };

  const getLabel = () => {
    if (score === 0) return 'Very Weak';
    if (score === 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className="mt-4">
      <div className="flex items-center mb-2">
        <motion.div
          animate={score > 2 ? 
            { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : 
            { scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Shield size={18} className={`mr-2 ${score >= 3 ? 'text-green-600' : 'text-orange-500'}`} />
        </motion.div>
        <motion.span 
          key={getLabel()}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium"
        >
          {getLabel()}
        </motion.span>
      </div>
      <div className="flex w-full gap-1">
        {Array.from({ length: maxScore }).map((_, i) => (
          <motion.div 
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className={`h-2 rounded-full flex-1 ${getColor(i)}`}
          />
        ))}
      </div>
    </div>
  );
};

export default StrengthMeter;
 