import  { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, ThumbsUp } from 'lucide-react';

interface FeedbackSectionProps {
  warning: string;
  suggestions: string[];
  improvedPassword: string;
  onUseImproved: (password: string) => void;
}

const FeedbackSection = ({ warning, suggestions, improvedPassword, onUseImproved }: FeedbackSectionProps) => {
  if (!warning && suggestions.length === 0) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-5 p-4 rounded-lg border border-gray-200 bg-gray-50"
    >
      {warning && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-start mb-3"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: 3, repeatDelay: 5 }}
          >
            <AlertCircle size={18} className="mt-0.5 mr-2 text-orange-500 flex-shrink-0" />
          </motion.div>
          <p className="text-sm text-gray-700">{warning}</p>
        </motion.div>
      )}
      
      {suggestions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-3"
        >
          <p className="text-sm font-medium text-gray-700 mb-2">Suggestions to improve:</p>
          <ul className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <motion.li 
                key={index} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
                className="flex items-start"
              >
                <ArrowRight size={16} className="mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">{suggestion}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
      
      {improvedPassword && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-4 pt-3 border-t border-gray-200"
        >
          <p className="text-sm font-medium text-gray-700 mb-2">AI-generated stronger alternative:</p>
          <div className="flex items-center">
            <motion.code 
              className="px-3 py-1 bg-gray-100 rounded text-sm mr-2 flex-grow overflow-x-auto reveal-code"
            >
              {improvedPassword}
            </motion.code>
            <motion.button 
              onClick={() => onUseImproved(improvedPassword)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition shadow-sm"
            >
              <ThumbsUp size={14} className="mr-1" />
              Use
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FeedbackSection;
 