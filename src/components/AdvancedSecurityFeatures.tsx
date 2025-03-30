import  { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import BiometricOptions from './BiometricOptions';
import KeystrokeDynamics from './KeystrokeDynamics';

interface AdvancedSecurityFeaturesProps {
  onBiometricScoreChange: (score: number) => void;
}

const AdvancedSecurityFeatures = ({ onBiometricScoreChange }: AdvancedSecurityFeaturesProps) => {
  const [expanded, setExpanded] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  
  const handleBiometricToggle = (enabled: boolean) => {
    setBiometricEnabled(enabled);
    if (!enabled) {
      onBiometricScoreChange(0);
    }
  };
  
  const handleTypePatternAnalyzed = (score: number) => {
    onBiometricScoreChange(score);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
      >
        <div className="flex items-center">
          <Shield size={18} className="mr-2 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Advanced Security Features</span>
        </div>
        {expanded ? (
          <ChevronUp size={18} className="text-blue-600" />
        ) : (
          <ChevronDown size={18} className="text-blue-600" />
        )}
      </button>
      
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: expanded ? "auto" : 0,
          opacity: expanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {expanded && (
          <div className="mt-3 space-y-3">
            <BiometricOptions onBiometricToggle={handleBiometricToggle} />
            <KeystrokeDynamics 
              enabled={biometricEnabled} 
              onTypePatternAnalyzed={handleTypePatternAnalyzed} 
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdvancedSecurityFeatures;
 