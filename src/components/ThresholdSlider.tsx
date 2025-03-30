import  { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders } from 'lucide-react';

interface ThresholdSliderProps {
  onThresholdChange: (value: number) => void;
}

const ThresholdSlider = ({ onThresholdChange }: ThresholdSliderProps) => {
  const [value, setValue] = useState(3); // Default to "Good"
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    onThresholdChange(newValue);
  };
  
  const getThresholdLabel = () => {
    switch(value) {
      case 0: return "Any Password (Not Recommended)";
      case 1: return "Basic";
      case 2: return "Medium";
      case 3: return "Good";
      case 4: return "Very Strong";
      default: return "Good";
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6 p-4 border border-gray-200 rounded-lg"
    >
      <div className="flex items-center mb-3">
        <motion.div
          animate={{ rotate: [0, -15, 15, -5, 5, 0] }}
          transition={{ duration: 2, repeat: 1, repeatDelay: 5 }}
        >
          <Sliders size={18} className="mr-2 text-blue-500" />
        </motion.div>
        <h3 className="text-sm font-medium text-gray-700">Password Strength Threshold</h3>
      </div>
      
      <div className="mt-2">
        <div className="relative w-full h-6 mb-2">
          <div className="slider-track absolute inset-y-0 left-0 right-0 m-auto">
            <div 
              className="slider-track-fill absolute inset-y-0 left-0" 
              style={{ width: `${(value / 4) * 100}%` }}
            ></div>
            <motion.div 
              className="slider-thumb"
              style={{ left: `${(value / 4) * 100}%` }}
              whileTap={{ scale: 1.2 }}
            ></motion.div>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="4"
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer opacity-0 absolute"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">Weak</span>
          <motion.span 
            key={getThresholdLabel()}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-medium text-blue-600"
          >
            {getThresholdLabel()}
          </motion.span>
          <span className="text-xs text-gray-500">Strong</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ThresholdSlider;
 