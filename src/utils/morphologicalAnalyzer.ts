import  { PasswordMorphology, MorphologicalComponent } from '../types';

// Password component types
const COMPONENT_TYPES = {
  LOWERCASE: 'lowercase',
  UPPERCASE: 'uppercase',
  DIGIT: 'digit',
  SPECIAL: 'special',
  REPEATING: 'repeating',
  SEQUENTIAL: 'sequential',
  DICTIONARY: 'dictionary'
};

// Common dictionary words to detect
const commonWords = [
  'password', 'admin', 'welcome', 'login', 'user',
  'summer', 'winter', 'spring', 'autumn', 'football',
  'baseball', 'hockey', 'soccer', 'qwerty', 'monkey',
  'dragon', 'master', 'superman', 'batman'
];

// Detect sequential patterns like abc, 123, etc.
const isSequential = (str: string): boolean => {
  if (str.length < 3) return false;
  
  const charCodes = str.split('').map(c => c.charCodeAt(0));
  let sequential = true;
  
  for (let i = 1; i < charCodes.length; i++) {
    if (Math.abs(charCodes[i] - charCodes[i-1]) !== 1) {
      sequential = false;
      break;
    }
  }
  
  return sequential;
};

// Detect repeating patterns
const isRepeating = (str: string): boolean => {
  if (str.length < 2) return false;
  
  const firstChar = str[0];
  return str.split('').every(c => c === firstChar);
};

// Detect dictionary words
const isDictionaryWord = (str: string): boolean => {
  return commonWords.some(word => 
    str.toLowerCase().includes(word.toLowerCase())
  );
};

// Analyze a segment of the password
const analyzeSegment = (segment: string): MorphologicalComponent => {
  // Determine the type of the segment
  let type = COMPONENT_TYPES.LOWERCASE;
  let strength = 1;
  
  if (/^[A-Z]+$/.test(segment)) {
    type = COMPONENT_TYPES.UPPERCASE;
    strength = 2;
  } else if (/^[0-9]+$/.test(segment)) {
    type = COMPONENT_TYPES.DIGIT;
    strength = 1.5;
  } else if (/^[^A-Za-z0-9]+$/.test(segment)) {
    type = COMPONENT_TYPES.SPECIAL;
    strength = 3;
  }
  
  // Check for patterns that reduce strength
  if (isRepeating(segment)) {
    type = COMPONENT_TYPES.REPEATING;
    strength = 0.5;
  } else if (isSequential(segment)) {
    type = COMPONENT_TYPES.SEQUENTIAL;
    strength = 0.7;
  } else if (isDictionaryWord(segment)) {
    type = COMPONENT_TYPES.DICTIONARY;
    strength = 0.8;
  }
  
  return {
    type,
    value: segment,
    strength
  };
};

// Breaking the password into morphological components
export const analyzeMorphology = (password: string): PasswordMorphology => {
  if (!password) {
    return {
      pattern: '',
      complexity: 0,
      components: []
    };
  }
  
  // Group by character types
  const components: MorphologicalComponent[] = [];
  let currentSegment = password[0];
  let currentType = '';
  
  if (/[a-z]/.test(currentSegment)) {
    currentType = 'a';
  } else if (/[A-Z]/.test(currentSegment)) {
    currentType = 'A';
  } else if (/[0-9]/.test(currentSegment)) {
    currentType = '9';
  } else {
    currentType = '#';
  }
  
  // Group characters by type
  for (let i = 1; i < password.length; i++) {
    const char = password[i];
    let type = '';
    
    if (/[a-z]/.test(char)) {
      type = 'a';
    } else if (/[A-Z]/.test(char)) {
      type = 'A';
    } else if (/[0-9]/.test(char)) {
      type = '9';
    } else {
      type = '#';
    }
    
    if (type === currentType) {
      currentSegment += char;
    } else {
      components.push(analyzeSegment(currentSegment));
      currentSegment = char;
      currentType = type;
    }
  }
  
  // Add the last segment
  if (currentSegment) {
    components.push(analyzeSegment(currentSegment));
  }
  
  // Create the pattern string (e.g., "aA9#")
  const pattern = components.map(comp => {
    switch (comp.type) {
      case COMPONENT_TYPES.LOWERCASE: return 'a'.repeat(comp.value.length);
      case COMPONENT_TYPES.UPPERCASE: return 'A'.repeat(comp.value.length);
      case COMPONENT_TYPES.DIGIT: return '9'.repeat(comp.value.length);
      case COMPONENT_TYPES.SPECIAL: return '#'.repeat(comp.value.length);
      case COMPONENT_TYPES.REPEATING: return 'r'.repeat(comp.value.length);
      case COMPONENT_TYPES.SEQUENTIAL: return 's'.repeat(comp.value.length);
      case COMPONENT_TYPES.DICTIONARY: return 'd'.repeat(comp.value.length);
      default: return comp.value;
    }
  }).join('');
  
  // Calculate complexity based on component strengths and entropy
  const complexity = components.reduce((sum, comp) => 
    sum + (comp.value.length * comp.strength), 0) / password.length;
  
  return {
    pattern,
    complexity: Math.min(complexity * 2, 5), // Scale to 0-5
    components
  };
};
 