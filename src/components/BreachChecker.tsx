import  { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, Loader } from 'lucide-react';

interface BreachCheckerProps {
  isBreached: boolean;
  breachCount: number;
  isLoading: boolean;
}

const BreachChecker = ({ isBreached, breachCount, isLoading }: BreachCheckerProps) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4 flex items-center justify-center p-3 bg-gray-50 border border-gray-200 rounded-lg"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader size={16} className="text-blue-500 mr-2" />
        </motion.div>
        <span className="text-sm text-gray-600">Checking for breaches...</span>
      </motion.div>
    );
  }
  
  if (!isBreached && breachCount === 0) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`mt-4 p-3 rounded-lg border ${isBreached ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}
    >
      <div className="flex items-start">
        {isBreached ? (
          <AlertTriangle size={18} className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
        ) : (
          <Check size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
        )}
        
        <div>
          {isBreached ? (
            <>
              <p className="text-sm font-medium text-red-800 mb-1">
                Password found in {breachCount.toLocaleString()} data {breachCount === 1 ? 'breach' : 'breaches'}!
              </p>
              <p className="text-xs text-red-700">
                This password has appeared in known data breaches and should never be used.
              </p>
            </>
          ) : (
            <p className="text-sm text-green-800">
              Good news! This password was not found in any known data breaches.
            </p>
          )}
        </div>
      </div>
      
      {isBreached && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-2 pt-2 border-t border-red-200"
        >
          <button className="text-xs bg-white text-red-600 hover:bg-red-100 transition-colors py-1 px-3 rounded border border-red-300">
            View breach details
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BreachChecker;
 