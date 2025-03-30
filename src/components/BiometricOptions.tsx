import  { useState } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Shield, ToggleRight, ToggleLeft, Info } from 'lucide-react';

interface BiometricOptionsProps {
  onBiometricToggle: (enabled: boolean) => void;
}

const BiometricOptions = ({ onBiometricToggle }: BiometricOptionsProps) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    onBiometricToggle(newState);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-violet-100 mr-3">
            <Fingerprint size={20} className="text-violet-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-800">Biometric Analysis</h3>
            <p className="text-xs text-gray-500 mt-0.5">Analyze how you type, not just what you type</p>
          </div>
        </div>
        
        <button 
          onClick={handleToggle}
          className="focus:outline-none"
          aria-label={isEnabled ? "Disable biometric analysis" : "Enable biometric analysis"}
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            {isEnabled ? (
              <ToggleRight size={28} className="text-violet-600" />
            ) : (
              <ToggleLeft size={28} className="text-gray-400" />
            )}
          </motion.div>
        </button>
      </div>
      
      <div className="mt-3 flex items-start">
        <Info size={14} className="text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
        <p className="text-xs text-gray-500">
          Add an extra layer of security by analyzing your typing patterns. This can help identify if someone else is using your password.
        </p>
      </div>
      
      <div className="mt-3">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-xs text-violet-600 hover:text-violet-700 transition-colors"
        >
          {showInfo ? "Hide details" : "Learn more"}
        </button>
      </div>
      
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: showInfo ? "auto" : 0,
          opacity: showInfo ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {showInfo && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-medium text-gray-700 mb-2">How it works:</h4>
            <ul className="text-xs text-gray-600 space-y-1.5">
              <li className="flex items-start">
                <span className="inline-block h-1 w-1 rounded-full bg-violet-500 mt-1.5 mr-2"></span>
                <span>Measures your typing rhythm, speed, and patterns</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1 w-1 rounded-full bg-violet-500 mt-1.5 mr-2"></span>
                <span>Records the time between keystrokes and how long each key is pressed</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1 w-1 rounded-full bg-violet-500 mt-1.5 mr-2"></span>
                <span>Creates a unique typing signature that can be used as a secondary verification</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1 w-1 rounded-full bg-violet-500 mt-1.5 mr-2"></span>
                <span>Your typing data never leaves your device</span>
              </li>
            </ul>
            
            <div className="mt-4 p-2 bg-violet-50 rounded-lg border border-violet-100 flex">
              <Shield size={16} className="text-violet-600 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-violet-700">
                Even if someone steals your password, they won't be able to mimic your unique typing pattern.
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BiometricOptions;
 