import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps {
  password: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const PasswordInput = ({ password, onChange, onFocus, onBlur }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    if (password) {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [password]);
  
  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };
  
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <motion.div
          animate={isTyping ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Lock size={20} className={`${isFocused ? 'text-blue-500' : 'text-gray-500'} transition-colors`} />
        </motion.div>
      </div>
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full py-3 pl-10 pr-10 border transition-all duration-300 
                   ${isFocused 
                     ? 'border-blue-500 ring-2 ring-blue-200 shadow-sm' 
                     : 'border-gray-300 ring-0'
                   } rounded-lg`}
        placeholder="Enter your password"
        autoComplete="new-password"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex items-center pr-3"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {showPassword ? (
            <EyeOff size={20} className="text-gray-500 hover:text-gray-700 transition-colors" />
          ) : (
            <Eye size={20} className="text-gray-500 hover:text-gray-700 transition-colors" />
          )}
        </motion.div>
      </button>
    </div>
  );
};

export default PasswordInput;
 