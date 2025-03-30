import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Copy, Check, Sliders, Zap } from 'lucide-react';

interface PasswordGeneratorProps {
  onUseGenerated: (password: string) => void;
}

const PasswordGenerator = ({ onUseGenerated }: PasswordGeneratorProps) => {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    pronounceable: false,
  });
  const [showOptions, setShowOptions] = useState(false);
  
  // Generate password on component mount or when options change
  useEffect(() => {
    generatePassword();
  }, [options]);
  
  const generatePassword = () => {
    let charset = '';
    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.numbers) charset += '0123456789';
    if (options.symbols) charset += '!@#$%^&*()_-+=<>?/[]{}|~';
    
    if (options.pronounceable) {
      // Generate more pronounceable password
      const vowels = 'aeiouy';
      const consonants = 'bcdfghjklmnpqrstvwxz';
      let result = '';
      
      for (let i = 0; i < options.length; i += 2) {
        // Add a consonant followed by a vowel to make it pronounceable
        if (i + 1 < options.length) {
          const consonant = consonants.charAt(Math.floor(Math.random() * consonants.length));
          const vowel = vowels.charAt(Math.floor(Math.random() * vowels.length));
          
          result += options.uppercase && Math.random() > 0.7 
            ? consonant.toUpperCase() 
            : consonant;
            
          result += vowel;
        } else {
          // If we need one more character
          result += consonants.charAt(Math.floor(Math.random() * consonants.length));
        }
      }
      
      // Add some numbers and symbols if needed
      if (options.numbers && result.length >= 8) {
        const pos = Math.floor(Math.random() * result.length);
        result = result.slice(0, pos) + 
                 Math.floor(Math.random() * 10) + 
                 result.slice(pos);
      }
      
      if (options.symbols && result.length >= 10) {
        const symbols = '!@#$%^&*';
        const pos = Math.floor(Math.random() * result.length);
        result = result.slice(0, pos) + 
                 symbols.charAt(Math.floor(Math.random() * symbols.length)) + 
                 result.slice(pos);
      }
      
      setPassword(result.slice(0, options.length));
    } else {
      // Regular random password
      let result = '';
      for (let i = 0; i < options.length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      setPassword(result);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleUse = () => {
    onUseGenerated(password);
  };
  
  const handleOptionChange = (option: keyof typeof options, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [option]: value }));
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Zap size={18} className="mr-2 text-yellow-500" />
          <h3 className="text-sm font-medium text-gray-700">Password Generator</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowOptions(!showOptions)}
          className="text-xs py-1 px-2 bg-white border border-gray-200 rounded flex items-center text-gray-600 hover:bg-gray-50"
        >
          <Sliders size={14} className="mr-1" />
          {showOptions ? 'Hide Options' : 'Show Options'}
        </motion.button>
      </div>
      
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 pb-4 border-b border-gray-200"
          >
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-600">Password Length: {options.length}</label>
                </div>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={options.length}
                  onChange={(e) => handleOptionChange('length', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>8</span>
                  <span>20</span>
                  <span>32</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="uppercase"
                    checked={options.uppercase}
                    onChange={(e) => handleOptionChange('uppercase', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="uppercase" className="ml-2 text-xs text-gray-600">Uppercase</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="lowercase"
                    checked={options.lowercase}
                    onChange={(e) => handleOptionChange('lowercase', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="lowercase" className="ml-2 text-xs text-gray-600">Lowercase</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="numbers"
                    checked={options.numbers}
                    onChange={(e) => handleOptionChange('numbers', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="numbers" className="ml-2 text-xs text-gray-600">Numbers</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="symbols"
                    checked={options.symbols}
                    onChange={(e) => handleOptionChange('symbols', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="symbols" className="ml-2 text-xs text-gray-600">Symbols</label>
                </div>
                
                <div className="flex items-center col-span-2">
                  <input
                    type="checkbox"
                    id="pronounceable"
                    checked={options.pronounceable}
                    onChange={(e) => handleOptionChange('pronounceable', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="pronounceable" className="ml-2 text-xs text-gray-600">More Pronounceable</label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="bg-white border border-gray-200 p-2 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
        <div className="flex items-center">
          <div className="flex-grow overflow-x-auto">
            {password}
          </div>
          
          <div className="flex-shrink-0 ml-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="text-gray-500 hover:text-gray-700"
              disabled={copied}
            >
              {copied ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Copy size={16} />
              )}
            </motion.button>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generatePassword}
          className="flex-1 py-2 bg-gray-100 text-gray-700 rounded flex items-center justify-center text-sm border border-gray-200 hover:bg-gray-200 transition-colors"
        >
          <RefreshCw size={14} className="mr-1" />
          Generate New
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUse}
          className="flex-1 py-2 bg-blue-500 text-white rounded flex items-center justify-center text-sm hover:bg-blue-600 transition-colors"
        >
          <Zap size={14} className="mr-1" />
          Use This Password
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PasswordGenerator;
 