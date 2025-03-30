import  { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface TimeToCrackProps {
  timeEstimate: string;
}

const TimeToCrack = ({ timeEstimate }: TimeToCrackProps) => {
  return (
    <div className="flex items-center mt-3 text-sm">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, ease: "linear", repeat: Infinity, repeatDelay: 5 }}
      >
        <Clock size={16} className="mr-2 text-gray-600" />
      </motion.div>
      <div>
        <span className="font-medium text-gray-700">Time to crack: </span>
        <motion.span 
          key={timeEstimate}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-gray-600 data-field"
        >
          {timeEstimate}
        </motion.span>
      </div>
    </div>
  );
};

export default TimeToCrack;
 