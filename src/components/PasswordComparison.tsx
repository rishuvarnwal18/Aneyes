import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';
import { analyzePassword } from '../utils/passwordUtils';

interface PasswordComparisonProps {
  currentPassword: string;
  comparePassword: string;
  setComparePassword: (password: string) => void;
}

const PasswordComparison = ({ currentPassword, comparePassword, setComparePassword }: PasswordComparisonProps) => {
  const [showComparePassword, setShowComparePassword] = useState(false);
  const [comparison, setComparison] = useState({
    currentScore: 0,
    compareScore: 0,
    currentEntropy: 0,
    compareEntropy: 0,
    currentCrackTime: '',
    compareCrackTime: ''
  });
  
  useEffect(() => {
    if (currentPassword || comparePassword) {
      const currentAnalysis = analyzePassword(currentPassword);
      const compareAnalysis = analyzePassword(comparePassword);
      
      setComparison({
        currentScore: currentAnalysis.score,
        compareScore: compareAnalysis.score,
        currentEntropy: currentAnalysis.entropy,
        compareEntropy: compareAnalysis.entropy,
        currentCrackTime: currentAnalysis.crackTimeDisplay,
        compareCrackTime: compareAnalysis.crackTimeDisplay
      });
    }
  }, [currentPassword, comparePassword]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
    >
      <div className="flex items-center mb-4">
        <RefreshCw size={18} className="mr-2 text-purple-500" />
        <h3 className="text-sm font-medium text-gray-700">Compare Passwords</h3>
      </div>
      
      <div className="relative mb-4">
        <input
          type={showComparePassword ? "text" : "password"}
          value={comparePassword}
          onChange={(e) => setComparePassword(e.target.value)}
          placeholder="Enter a password to compare"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => setShowComparePassword(!showComparePassword)}
        >
          {showComparePassword ? (
            <EyeOff size={18} className="text-gray-500" />
          ) : (
            <Eye size={18} className="text-gray-500" />
          )}
        </button>
      </div>
      
      {currentPassword && comparePassword && (
        <div className="mt-4">
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-xs font-medium text-gray-500 mb-3">PASSWORD COMPARISON</h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Strength Score</span>
                  <span>Higher is better</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-grow grid grid-cols-2 gap-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(comparison.currentScore / 4) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        style={{ backgroundColor: getScoreColor(comparison.currentScore) }}
                        className="h-full"
                      />
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(comparison.compareScore / 4) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        style={{ backgroundColor: getScoreColor(comparison.compareScore) }}
                        className="h-full"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-3 grid grid-cols-2 gap-2 text-center">
                    <div className="text-sm font-medium" style={{ color: getScoreColor(comparison.currentScore) }}>
                      {comparison.currentScore}/4
                    </div>
                    <div className="text-sm font-medium" style={{ color: getScoreColor(comparison.compareScore) }}>
                      {comparison.compareScore}/4
                    </div>
                  </div>
                </div>
                <div className="flex text-xs text-gray-500 mt-1 grid grid-cols-2 gap-2">
                  <div>Current Password</div>
                  <div>Compare Password</div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Entropy</span>
                  <span>Higher is better</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-grow grid grid-cols-2 gap-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((comparison.currentEntropy / 100) * 100, 100)}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-blue-500"
                      />
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((comparison.compareEntropy / 100) * 100, 100)}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-3 grid grid-cols-2 gap-2 text-center">
                    <div className="text-sm font-medium text-blue-600">
                      {comparison.currentEntropy.toFixed(1)}
                    </div>
                    <div className="text-sm font-medium text-blue-600">
                      {comparison.compareEntropy.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Time to Crack</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm p-2 bg-gray-50 rounded border border-gray-100">
                    {comparison.currentCrackTime}
                  </div>
                  <div className="text-sm p-2 bg-gray-50 rounded border border-gray-100">
                    {comparison.compareCrackTime}
                  </div>
                </div>
              </div>
              
              <div className="pt-3 text-center">
                <div className={`text-sm font-medium ${getBetterPasswordClass(comparison)}`}>
                  {getBetterPasswordText(comparison)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const getScoreColor = (score: number): string => {
  if (score === 0) return '#ef4444';
  if (score === 1) return '#f97316';
  if (score === 2) return '#f59e0b';
  if (score === 3) return '#10b981';
  return '#3b82f6';
};

const getBetterPasswordClass = (comparison: any): string => {
  if (!comparison.currentScore && !comparison.compareScore) return 'text-gray-500';
  
  if (comparison.currentScore > comparison.compareScore) {
    return 'text-green-600';
  } else if (comparison.currentScore < comparison.compareScore) {
    return 'text-blue-600';
  } else if (comparison.currentEntropy > comparison.compareEntropy) {
    return 'text-green-600';
  } else if (comparison.currentEntropy < comparison.compareEntropy) {
    return 'text-blue-600';
  }
  
  return 'text-purple-600';
};

const getBetterPasswordText = (comparison: any): string => {
  if (!comparison.currentScore && !comparison.compareScore) return 'Enter passwords to compare';
  
  if (comparison.currentScore > comparison.compareScore) {
    return 'Your current password is stronger';
  } else if (comparison.currentScore < comparison.compareScore) {
    return 'The comparison password is stronger';
  } else if (comparison.currentEntropy > comparison.compareEntropy) {
    return 'Your current password has higher entropy';
  } else if (comparison.currentEntropy < comparison.compareEntropy) {
    return 'The comparison password has higher entropy';
  }
  
  return 'Both passwords are equally strong';
};

export default PasswordComparison;
 