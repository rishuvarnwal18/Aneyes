import  { motion } from 'framer-motion';
import { Shield, Lock, AlertTriangle, Info } from 'lucide-react';

const PasswordTips = () => {
  const tips = [
    {
      icon: <Shield size={18} className="text-blue-500" />,
      title: "Use Passphrases",
      description: "Combine multiple words with spaces or symbols, like 'correct-horse-battery-staple'",
    },
    {
      icon: <Lock size={18} className="text-purple-500" />,
      title: "Unique Passwords",
      description: "Never reuse passwords across different sites or services",
    },
    {
      icon: <AlertTriangle size={18} className="text-amber-500" />,
      title: "Avoid Personal Info",
      description: "Don't use birthdays, names, or other easily discoverable information",
    },
    {
      icon: <Info size={18} className="text-green-500" />,
      title: "Length Matters",
      description: "Aim for at least 12 characters; longer is generally stronger",
    },
  ];

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="flex items-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 2, repeat: 1, repeatDelay: 5 }}
        >
          <Shield size={20} className="mr-2" />
        </motion.div>
        <h3 className="font-medium">Password Security Tips</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white">
        {tips.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="password-tip-card border border-gray-200 rounded-lg p-3"
          >
            <div className="flex items-start">
              <div className="mr-2 mt-0.5">{tip.icon}</div>
              <div>
                <h4 className="text-sm font-medium text-gray-800">{tip.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PasswordTips;
 