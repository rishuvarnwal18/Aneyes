import  zxcvbn from 'zxcvbn';
import { PasswordFeedback } from '../types';
import { analyzeMorphology } from './morphologicalAnalyzer';
import { sha1 } from './cryptoUtils';

// Common patterns from breached password datasets
const commonPatterns = [
  'password', '123456', 'qwerty', 'admin', 'welcome',
  'letmein', 'monkey', 'sunshine', 'princess', 'football',
  'summer', 'winter', 'spring', 'autumn', 'dragon',
  'baseball', 'soccer', 'superman', 'starwars'
];

// Calculate time to crack based on hash algorithm
export const calculateTimeToCrack = (score: number, password: string): string => {
  // These are just rough estimates based on 2023 hardware capabilities
  const times = [
    "Less than 1 second", // Very weak
    "A few hours", // Weak
    "A few weeks", // Moderate
    "A few years", // Strong
    "Centuries" // Very strong
  ];
  
  return times[score];
};

// Generate improved password suggestion
export const improvePassword = (password: string, score: number): string => {
  if (score >= 4) return password; // Already strong

  let improved = password;
  
  // Basic improvements
  if (!/[A-Z]/.test(improved)) {
    improved = improved.replace(/[a-z]/, (match) => match.toUpperCase());
  }
  
  if (!/[0-9]/.test(improved)) {
    improved += Math.floor(Math.random() * 100);
  }
  
  if (!/[^A-Za-z0-9]/.test(improved)) {
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    improved += symbols[Math.floor(Math.random() * symbols.length)];
  }
  
  // Add complexity based on original password
  if (score <= 2) {
    // Add random replacements for weak passwords
    improved = improved
      .replace(/a/gi, '@')
      .replace(/e/gi, '3')
      .replace(/i/gi, '!')
      .replace(/o/gi, '0')
      .replace(/s/gi, '$');
    
    // Add some random characters if still too weak
    if (improved.length < 12) {
      const extraChars = '!@#$%^&*abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      while (improved.length < 14) {
        improved += extraChars[Math.floor(Math.random() * extraChars.length)];
      }
    }
  }
  
  return improved;
};

export const analyzePassword = (password: string): PasswordFeedback => {
  if (!password) {
    return {
      score: 0,
      crackTimeDisplay: "Instant",
      warning: "Enter a password",
      suggestions: ["Type a password to analyze"],
      improvedPassword: "",
      entropy: 0
    };
  }

  const result = zxcvbn(password);
  const score = result.score;
  
  // Get more specific feedback 
  const warning = result.feedback.warning || getDefaultWarning(score);
  let suggestions = result.feedback.suggestions;
  
  // Check for common patterns not covered by zxcvbn
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    suggestions.push("Avoid using common words found in password breaches");
  }
  
  // If suggestions are empty, provide defaults based on score
  if (suggestions.length === 0) {
    suggestions = getDefaultSuggestions(score);
  }
  
  const crackTimeDisplay = calculateTimeToCrack(score, password);
  const improvedPassword = improvePassword(password, score);
  
  // Calculate entropy manually
  const entropy = calculateEntropy(password);
  
  // Generate morphological analysis
  const morphology = analyzeMorphology(password);
  
  return {
    score,
    crackTimeDisplay,
    warning,
    suggestions,
    improvedPassword,
    entropy,
    morphology
  };
};

// Check if a password has been exposed in data breaches using the Pwned Passwords API
export const checkPwnedPassword = async (password: string) => {
  try {
    // First, hash the password with SHA-1
    const passwordHash = await sha1(password);
    
    // Use the k-anonymity model - only send first 5 chars of the hash
    const prefix = passwordHash.substring(0, 5);
    const suffix = passwordHash.substring(5).toUpperCase();
    
    // Mock the API call for demo purposes
    // In a real implementation, this would call an API endpoint
    return mockPwnedPasswordCheck(passwordHash);
    
  } catch (error) {
    console.error('Error checking password breach:', error);
    return { breached: false, count: 0 };
  }
};

// Mock implementation for demo purposes
// This simulates certain passwords being in data breaches
const mockPwnedPasswordCheck = (hash: string) => {
  const commonHashes = [
    'e38ad214943daad1d64c102faec29de4afe9da3d', // password123
    '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', // password
    '7c4a8d09ca3762af61e59520943dc26494f8941b', // 123456
    '5cec175b165e3d5e62c9e13ce848ef6feac81bff', // qwerty123
    'f7c3bc1d808e04732adf679965ccc34ca7ae3441', // admin
  ];
  
  if (commonHashes.includes(hash.toLowerCase())) {
    return { 
      breached: true, 
      count: Math.floor(Math.random() * 1000000) + 10000 
    };
  }
  
  // Randomly mark some passwords as breached for demo purposes
  const randomBreached = Math.random() < 0.2;
  if (randomBreached) {
    return { 
      breached: true, 
      count: Math.floor(Math.random() * 1000) + 1 
    };
  }
  
  return { breached: false, count: 0 };
};

const getDefaultWarning = (score: number): string => {
  switch (score) {
    case 0: return "This password would be cracked instantly";
    case 1: return "This password is very weak and could be easily guessed";
    case 2: return "This password is somewhat predictable";
    case 3: return "This is a good password but could be stronger";
    case 4: return "This is a strong password";
    default: return "";
  }
};

const getDefaultSuggestions = (score: number): string[] => {
  if (score >= 4) return ["Your password is strong!"];
  
  return [
    "Add more characters for better security",
    "Mix uppercase and lowercase letters",
    "Add numbers and special characters", 
    "Avoid predictable patterns and sequences",
    "Use a passphrase with multiple words"
  ].slice(0, 5 - score);
};

// Calculate password entropy
const calculateEntropy = (password: string): number => {
  if (!password) return 0;
  
  // Character set size based on password composition
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33; // Special chars
  
  // Shannon entropy calculation: log2(poolSize^length)
  // Equivalent to length * log2(poolSize)
  if (poolSize === 0) return 0;
  const entropy = password.length * (Math.log(poolSize) / Math.log(2));
  
  return entropy;
};
 