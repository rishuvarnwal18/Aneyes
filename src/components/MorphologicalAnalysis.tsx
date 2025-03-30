import  { motion } from 'framer-motion';
import { PasswordMorphology, MorphologicalComponent } from '../types';
import { Code, Layers } from 'lucide-react';

interface MorphologicalAnalysisProps {
  morphology: PasswordMorphology;
}

const MorphologicalAnalysis = ({ morphology }: MorphologicalAnalysisProps) => {
  if (!morphology || morphology.components.length === 0) {
    return null;
  }
  
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'lowercase': return 'Lowercase letters';
      case 'uppercase': return 'Uppercase letters';
      case 'digit': return 'Digits';
      case 'special': return 'Special characters';
      case 'repeating': return 'Repeating pattern';
      case 'sequential': return 'Sequential pattern';
      case 'dictionary': return 'Common word/pattern';
      default: return type;
    }
  };
  
  const getTypeColor = (type: string, strength: number): string => {
    if (strength <= 0.8) return 'text-red-500';
    if (strength <= 1.5) return 'text-orange-500';
    if (strength <= 2.5) return 'text-green-500';
    return 'text-blue-500';
  };
  
  const getStrengthText = (strength: number): string => {
    if (strength <= 0.8) return 'Very Weak';
    if (strength <= 1.5) return 'Weak';
    if (strength <= 2.5) return 'Medium';
    return 'Strong';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-5 p-4 rounded-lg border border-gray-200 bg-gray-50 binary-bg"
    >
      <div className="flex items-center mb-3">
        <motion.div
          animate={{ 
            rotateY: [0, 180, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: 1, repeatDelay: 10 }}
        >
          <Layers size={18} className="mr-2 text-purple-600" />
        </motion.div>
        <h3 className="text-sm font-medium text-gray-700">Morphological Analysis</h3>
      </div>
      
      <div className="flex items-center mb-3">
        <Code size={16} className="mr-2 text-gray-500" />
        <motion.div 
          className="text-xs font-medium bg-gray-100 px-2 py-1 rounded tracking-wide font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {morphology.pattern.split('').map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 * index }}
              className={
                char === 'a' ? 'text-blue-500' : 
                char === 'A' ? 'text-purple-500' : 
                char === '9' ? 'text-green-500' : 
                char === '#' ? 'text-red-500' : 
                char === 'r' ? 'text-orange-500' :
                char === 's' ? 'text-yellow-500' :
                'text-gray-500'
              }
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
        <div className="ml-2 text-xs text-gray-500">(pattern code)</div>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-2 mt-3"
      >
        {morphology.components.map((component: MorphologicalComponent, index: number) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="text-sm flex justify-between p-1.5 border-b border-gray-100 hover:bg-gray-100 transition-colors rounded"
          >
            <div className="flex items-start">
              <span className="font-mono bg-gray-100 text-xs px-1.5 py-0.5 rounded mr-2">
                {component.value}
              </span>
              <span className="text-gray-600">{getTypeLabel(component.type)}</span>
            </div>
            <motion.span 
              className={`text-xs font-medium ${getTypeColor(component.type, component.strength)}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + (0.1 * index) }}
            >
              {getStrengthText(component.strength)}
            </motion.span>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="mt-3 pt-2 border-t border-gray-200"
      >
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Overall Pattern Complexity:</span>
          <div className="flex items-center">
            <div className="w-24 h-2 bg-gray-200 rounded-full mr-2 overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${morphology.complexity >= 3 ? 'bg-green-500' : 'bg-orange-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${(morphology.complexity / 5) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.5 }}
              ></motion.div>
            </div>
            <span className="text-xs font-medium">{morphology.complexity.toFixed(1)}/5</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MorphologicalAnalysis;
 