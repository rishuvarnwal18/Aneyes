import  { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzePassword, checkPwnedPassword } from './utils/passwordUtils';
import PasswordInput from './components/PasswordInput';
import StrengthMeter from './components/StrengthMeter';
import TimeToCrack from './components/TimeToCrack';
import FeedbackSection from './components/FeedbackSection';
import ThresholdSlider from './components/ThresholdSlider';
import Header from './components/Header';
import MorphologicalAnalysis from './components/MorphologicalAnalysis';
import PasswordTips from './components/PasswordTips';
import PasswordGenerator from './components/PasswordGenerator';
import BreachChecker from './components/BreachChecker';
import StrengthChart from './components/StrengthChart';
import PasswordComparison from './components/PasswordComparison';
import PasswordHistoryTracker from './components/PasswordHistoryTracker';
import SecurityScore from './components/SecurityScore';
import AdvancedSecurityFeatures from './components/AdvancedSecurityFeatures';
import { Lock, Shield, AlertTriangle, ChevronDown, ChevronUp, Zap, User, Award, Clock, RefreshCw } from 'lucide-react';
import Confetti from 'react-confetti';
import { PasswordHistory } from './types';
import TabsContainer from './components/TabsContainer';

function App() {
  const [password, setPassword] = useState('');
  const [threshold, setThreshold] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [reachedStrongPassword, setReachedStrongPassword] = useState(false);
  const [activeFeedbackTab, setActiveFeedbackTab] = useState('analysis');
  const [isBreached, setIsBreached] = useState(false);
  const [breachCount, setBreachCount] = useState(0);
  const [checkingBreach, setCheckingBreach] = useState(false);
  const [passwordHistory, setPasswordHistory] = useState<PasswordHistory[]>([]);
  const [comparePassword, setComparePassword] = useState('');
  const [biometricScore, setBiometricScore] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [feedback, setFeedback] = useState({
    score: 0,
    crackTimeDisplay: "Instant",
    warning: "Enter a password",
    suggestions: ["Type a password to analyze"],
    improvedPassword: "",
    entropy: 0,
    morphology: {
      pattern: '',
      complexity: 0,
      components: []
    }
  });
  
  useEffect(() => {
    const result = analyzePassword(password);
    setFeedback(result);
    
    // Check if we've reached a strong password for the first time
    if (result.score === 4 && !reachedStrongPassword && password.length > 0) {
      setShowConfetti(true);
      setReachedStrongPassword(true);
      
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
    
    // Reset breach status when password changes
    if (password) {
      setIsBreached(false);
      setBreachCount(0);
      
      // Add to history if different from the most recent entry
      const lastHistory = passwordHistory[0];
      if (!lastHistory || lastHistory.password !== password) {
        setPasswordHistory(prev => [{
          password,
          timestamp: new Date(),
          score: result.score,
          entropy: result.entropy
        }, ...prev].slice(0, 10)); // Keep only the last 10 entries
      }
    }
  }, [password, reachedStrongPassword, passwordHistory]);
  
  useEffect(() => {
    // Check for password breaches after a short delay to avoid too many requests
    const checkBreaches = async () => {
      if (password.length >= 8) {
        setCheckingBreach(true);
        try {
          const { breached, count } = await checkPwnedPassword(password);
          setIsBreached(breached);
          setBreachCount(count);
        } catch (error) {
          console.error('Error checking for breaches:', error);
        } finally {
          setCheckingBreach(false);
        }
      }
    };
    
    const timer = setTimeout(() => {
      if (password) {
        checkBreaches();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [password]);
  
  const handleThresholdChange = (value: number) => {
    setThreshold(value);
  };
  
  const handleUseImproved = (improved: string) => {
    setPassword(improved);
  };
  
  const handleUseGenerated = (generated: string) => {
    setPassword(generated);
  };
  
  const handlePasswordHistoryClick = (historyPassword: string) => {
    setPassword(historyPassword);
  };
  
  const handleBiometricScoreChange = (score: number) => {
    setBiometricScore(score);
  };
  
  const meetsThreshold = feedback.score >= threshold;
  
  const getTotalSecurityScore = () => {
    let score = feedback.score * 20; // Base score (0-80)
    
    // Add points for password length
    if (password.length > 12) score += 5;
    if (password.length > 16) score += 5;
    
    // Subtract points for breached passwords
    if (isBreached) score -= 30;
    
    // Add points for biometric score (if enabled)
    if (biometricScore > 0) {
      // Add up to 10 points based on biometric score
      score += Math.min(10, biometricScore / 10);
    }
    
    // Ensure score is between 0-100
    return Math.max(0, Math.min(100, score));
  };

  // Hero banner animation variants
  const heroIconVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 20,
        delay: 0.6 
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, -5, 5, 0],
      transition: { duration: 1 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 cyberpunk-grid" ref={containerRef}>
      {showConfetti && <Confetti width={containerRef.current?.offsetWidth || 800} height={window.innerHeight} recycle={false} numberOfPieces={200} />}
      
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-8 sm:px-6 texture-bg">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl w-full mx-auto space-y-6"
        >
          {/* Hero Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1510511459019-5dda7724fd87?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwcGFzc3dvcmQlMjBkaWdpdGFsJTIwc2VjdXJpdHl8ZW58MHx8fHwxNzQzMjQ0OTA2fDA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800"
                alt="Cybersecurity laptop" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/70 to-blue-900/80"></div>
            </div>
            
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">PassGuard Advanced</h1>
                <p className="text-lg text-gray-100 max-w-xl">
                  Secure your digital life with AI-powered password analysis, breach detection, and intelligent suggestions
                </p>
              </motion.div>
              
              <motion.div
                variants={heroIconVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                className="absolute -bottom-5 bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full shadow-lg"
              >
                <Shield size={32} className="text-white" />
              </motion.div>
            </div>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column */}
            <motion.div 
              className="lg:w-8/12"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Password Input Card */}
              <div className={`cyberpunk-card p-6 shadow-lg ${isActive ? 'focus-active' : ''}`}>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Strength Analyzer</h2>
                  <p className="text-gray-600">
                    Enter your password to analyze its strength and get AI-powered suggestions for improvement.
                  </p>
                </motion.div>
                
                <div className="mt-6">
                  <div className="animated-gradient-border">
                    <PasswordInput 
                      password={password} 
                      onChange={setPassword}
                      onFocus={() => setIsActive(true)}
                      onBlur={() => setIsActive(false)}
                    />
                  </div>
                  
                  <AnimatePresence>
                    {password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <StrengthMeter score={feedback.score} />
                          </motion.div>
                          
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="flex flex-col justify-center"
                          >
                            <TimeToCrack timeEstimate={feedback.crackTimeDisplay} />
                            <div className="mt-2">
                              <span className="text-sm text-gray-600">
                                Entropy: <span className="font-mono font-bold">{feedback.entropy.toFixed(1)}</span> bits
                              </span>
                            </div>
                          </motion.div>
                        </div>
                        
                        <SecurityScore score={getTotalSecurityScore()} />
                        
                        <BreachChecker 
                          isBreached={isBreached} 
                          breachCount={breachCount} 
                          isLoading={checkingBreach}
                        />
                        
                        {/* Advanced Security Features */}
                        <AdvancedSecurityFeatures 
                          onBiometricScoreChange={handleBiometricScoreChange}
                        />
                        
                        {/* Feedback Tabs */}
                        <TabsContainer 
                          activeTab={activeFeedbackTab}
                          onChange={setActiveFeedbackTab}
                          tabs={[
                            { id: 'analysis', label: 'Analysis', icon: <Shield size={16} /> },
                            { id: 'history', label: 'History', icon: <Clock size={16} /> },
                            { id: 'compare', label: 'Compare', icon: <RefreshCw size={16} /> },
                            { id: 'generate', label: 'Generate', icon: <Zap size={16} /> }
                          ]}
                          content={{
                            analysis: (
                              <>
                                <motion.div
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                  <button 
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className="flex items-center text-sm text-blue-600 mt-4 mb-2 hover:text-blue-800 transition-colors"
                                  >
                                    {showAdvanced ? (
                                      <>
                                        <ChevronUp size={16} className="mr-1" />
                                        Hide Advanced Analysis
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown size={16} className="mr-1" />
                                        Show Advanced Analysis
                                      </>
                                    )}
                                  </button>
                                </motion.div>
                                
                                <AnimatePresence>
                                  {showAdvanced && feedback.morphology && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      <MorphologicalAnalysis morphology={feedback.morphology} />
                                      <StrengthChart password={password} score={feedback.score} entropy={feedback.entropy} />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                                
                                <motion.div
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ duration: 0.3, delay: 0.4 }}
                                >
                                  <FeedbackSection 
                                    warning={feedback.warning}
                                    suggestions={feedback.suggestions}
                                    improvedPassword={feedback.improvedPassword}
                                    onUseImproved={handleUseImproved}
                                  />
                                </motion.div>
                              </>
                            ),
                            history: (
                              <PasswordHistoryTracker 
                                history={passwordHistory}
                                onPasswordClick={handlePasswordHistoryClick}
                              />
                            ),
                            compare: (
                              <PasswordComparison 
                                currentPassword={password}
                                comparePassword={comparePassword}
                                setComparePassword={setComparePassword}
                              />
                            ),
                            generate: (
                              <PasswordGenerator onUseGenerated={handleUseGenerated} />
                            )
                          }}
                        />
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          <ThresholdSlider onThresholdChange={handleThresholdChange} />
                        </motion.div>
                        
                        <AnimatePresence>
                          {password && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.5, delay: 0.6 }}
                              className={`mt-6 p-3 rounded-lg flex items-center ${meetsThreshold ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}
                            >
                              {meetsThreshold ? (
                                <>
                                  <Lock size={18} className="mr-2 text-green-600" />
                                  <span className="text-sm">This password meets your selected strength threshold.</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle size={18} className="mr-2 text-amber-600" />
                                  <span className="text-sm">This password doesn't meet your selected strength threshold.</span>
                                </>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
            
            {/* Right Column - Tips and Extras */}
            <motion.div 
              className="lg:w-4/12"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* User Security Panel */}
              <div className="cyberpunk-card p-5 shadow-lg mb-6">
                <div className="flex items-center mb-4">
                  <User size={20} className="mr-2 text-blue-500" />
                  <h3 className="text-lg font-bold text-gray-800">Your Security</h3>
                </div>
                
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxjeWJlcnNlY3VyaXR5JTIwcGFzc3dvcmQlMjBkaWdpdGFsJTIwc2VjdXJpdHl8ZW58MHx8fHwxNzQzMjQ0OTA2fDA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800"
                    alt="Digital security visualization" 
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-3 text-white">
                      <p className="text-sm font-semibold">Protect your digital identity</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Passwords Analyzed:</span>
                    <span className="font-bold text-blue-600">{passwordHistory.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Strong Passwords:</span>
                    <span className="font-bold text-green-600">
                      {passwordHistory.filter(p => p.score >= 3).length}
                    </span>
                  </div>
                  
                  {passwordHistory.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Strength:</span>
                      <span className="font-bold text-purple-600">
                        {(passwordHistory.reduce((sum, p) => sum + p.score, 0) / passwordHistory.length).toFixed(1)}
                      </span>
                    </div>
                  )}
                  
                  {biometricScore > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Typing Pattern Score:</span>
                      <span className="font-bold text-violet-600">
                        {biometricScore}
                      </span>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-gray-100">
                    <button className="w-full py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center">
                      <Award size={16} className="mr-1" />
                      Take Security Challenge
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Password Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <PasswordTips />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="py-4 text-center text-sm text-gray-500"
      >
        <p>PassGuard Advanced - Intelligent Password Strength Analyzer 2023</p>
      </motion.footer>
    </div>
  );
}

export default App;
 