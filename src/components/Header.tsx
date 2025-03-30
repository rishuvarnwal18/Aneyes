import  { motion } from 'framer-motion';
import { Lock, Shield, Menu } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Define animation variants for the logo
  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    hover: { 
      scale: 1.1,
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.9 }
  };

  // Pulsing animation variants
  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.1, 1, 1.1, 1],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  // Shield badge animation
  const shieldVariants = {
    initial: { scale: 0, y: 5, x: 5 },
    animate: { 
      scale: 1, 
      y: 0, 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 10,
        delay: 0.3
      }
    },
    hover: {
      rotate: [0, -10, 10, -5, 0],
      transition: { duration: 0.5 }
    }
  };

  return (
    <header className="w-full p-4 bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <motion.div 
          className="flex items-center" 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="relative mr-3"
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            variants={logoVariants}
          >
            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
              variants={pulseVariants}
            >
              <Lock size={20} className="text-white" />
            </motion.div>
            <motion.div 
              className="absolute -right-1 -top-1 bg-purple-600 rounded-full w-5 h-5 flex items-center justify-center shadow-sm border-2 border-white"
              variants={shieldVariants}
            >
              <Shield size={12} className="text-white" />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            PassGuard
          </motion.h1>
        </motion.div>

        <motion.div 
          className="hidden md:flex items-center space-x-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Password Tips</a>
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">About</a>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
            Advanced Features
          </button>
        </motion.div>

        <motion.button 
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Menu size={24} />
        </motion.button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div 
          className="md:hidden absolute left-0 right-0 bg-white shadow-md py-3 px-4 mt-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-3">
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors py-1">How It Works</a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors py-1">Password Tips</a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors py-1">About</a>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium shadow-sm">
              Advanced Features
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
 