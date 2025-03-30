import  { motion } from 'framer-motion';
import { PasswordHistory } from '../types';
import { Clock, ChevronRight, Trash, ShieldOff } from 'lucide-react';
import { formatDistanceToNow } from '../utils/dateUtils';

interface PasswordHistoryTrackerProps {
  history: PasswordHistory[];
  onPasswordClick: (password: string) => void;
}

const PasswordHistoryTracker = ({ history, onPasswordClick }: PasswordHistoryTrackerProps) => {
  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4 p-6 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center"
      >
        <Clock size={32} className="text-gray-300 mb-2" />
        <p className="text-sm text-gray-500">No password history yet</p>
        <p className="text-xs text-gray-400 mt-1">Passwords you analyze will appear here</p>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 border border-gray-200 rounded-lg bg-white divide-y divide-gray-100"
    >
      <div className="p-3 bg-gray-50 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center">
          <Clock size={16} className="text-blue-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-700">Password History</h3>
        </div>
        <button className="text-xs text-gray-500 hover:text-red-500 flex items-center">
          <Trash size={14} className="mr-1" />
          Clear
        </button>
      </div>
      
      <div className="overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-300">
        {history.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="p-3 hover:bg-gray-50 cursor-pointer border-l-4 flex items-center justify-between"
            style={{ 
              borderLeftColor: getScoreColor(item.score),
            }}
            onClick={() => onPasswordClick(item.password)}
          >
            <div className="flex-grow">
              <div className="flex items-center">
                <div className="font-mono text-sm text-gray-700 mr-2">
                  {maskPassword(item.password)}
                </div>
                <div className={`text-xs px-1.5 py-0.5 rounded-full ${getScoreBgColor(item.score)}`}>
                  {getScoreLabel(item.score)}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                <span>{formatDistanceToNow(item.timestamp)} ago</span>
                <span className="mx-2">•</span>
                <span>Entropy: {item.entropy.toFixed(1)}</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const maskPassword = (password: string): string => {
  if (password.length <= 3) return '•••••••';
  return password.substring(0, 2) + '•'.repeat(password.length - 3) + password.substring(password.length - 1);
};

const getScoreColor = (score: number): string => {
  if (score === 0) return '#ef4444';
  if (score === 1) return '#f97316';
  if (score === 2) return '#f59e0b';
  if (score === 3) return '#10b981';
  return '#3b82f6';
};

const getScoreBgColor = (score: number): string => {
  if (score === 0) return 'bg-red-100 text-red-800';
  if (score === 1) return 'bg-orange-100 text-orange-800';
  if (score === 2) return 'bg-yellow-100 text-yellow-800';
  if (score === 3) return 'bg-green-100 text-green-800';
  return 'bg-blue-100 text-blue-800';
};

const getScoreLabel = (score: number): string => {
  if (score === 0) return 'Very Weak';
  if (score === 1) return 'Weak';
  if (score === 2) return 'Fair';
  if (score === 3) return 'Good';
  return 'Strong';
};

export default PasswordHistoryTracker;
 