export  interface PasswordStrength {
  score: number;
  crackTime: string;
  feedback: {
    warning: string;
    suggestions: string[];
  };
}

export interface PasswordFeedback {
  score: number;
  crackTimeDisplay: string;
  warning: string;
  suggestions: string[];
  improvedPassword: string;
  entropy: number;
  morphology?: PasswordMorphology;
}

export interface PasswordMorphology {
  pattern: string;
  complexity: number;
  components: MorphologicalComponent[];
}

export interface MorphologicalComponent {
  type: string;
  value: string;
  strength: number;
}

export interface PasswordHistory {
  password: string;
  timestamp: Date;
  score: number;
  entropy: number;
}
 