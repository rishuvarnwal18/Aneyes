import  { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

interface SecurityScoreProps {
  score: number;
}

const SecurityScore = ({ score }: SecurityScoreProps) => {
  const getScoreColor = () => {
    if (score < 50) return 'text-red-500';
    if (score < 70) return 'text-yellow-500';
    if (score < 90) return 'text-green-500';
    return 'text-blue-500';
  };

  const getScoreText = () => {
    if (score < 30) return 'Critical';
    if (score < 50) return 'Poor';
    if (score < 70) return 'Fair';
    if (score < 90) return 'Good';
    return 'Excellent';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg"
    >
      <div className="flex items-center mb-3">
        <Shield size={18} className={`mr-2 ${getScoreColor()}`} />
        <span className="text-sm font-medium text-gray-700">Overall Security Score</span>
      </div>
      
      <div className="flex items-center">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1 }}
            className={`h-full ${
              score < 50 ? 'bg-red-500' :
              score < 70 ? 'bg-yellow-500' :
              score < 90 ? 'bg-green-500' :
              'bg-blue-500'
            }`}
          />
        </div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="ml-4 text-2xl font-bold w-12 text-center"
        >
          <span className={getScoreColor()}>{score}</span>
        </motion.div>
      </div>
      
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>0</span>
        <span className={`font-medium ${getScoreColor()}`}>{getScoreText()}</span>
        <span>100</span>
      </div>
    </motion.div>
  );
};

export default SecurityScore;
 