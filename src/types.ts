export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface AnamneseData {
  completed: boolean;
  age: number;
  gender: string;
  mainGoal: string;
  symptoms: string[];
  sleepHours: number;
  energyLevel: number;
  dietStyle: string;
  spiritualPractice: string;
  physicalActivity: string;
  waterIntake: string;
  stressLevel: number;
  currentMedications: string;
}

export interface DailyCheckIn {
  date: string; // YYYY-MM-DD
  physical: number; // 1-5
  emotional: number; // 1-5
  spiritual: number; // 1-5
  sleep: number; // hours
  water: number; // ml
  steps: number;
  notes: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  mood: 'joy' | 'neutral' | 'sad' | 'anxious' | 'angry' | 'tired';
  aiAnalysis?: {
    sentiment: string;
    advice: string;
    tags: string[];
  };
}

export interface Protocol {
  id: string;
  name: string;
  description: string;
  category: 'Físico' | 'Mental' | 'Espiritual' | 'Alimentar';
  duration: string;
  completedDays: string[]; // dates completed
  isActive: boolean;
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  time: string; // e.g., "08:00"
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
  completedHistory: { [date: string]: boolean }; // YYYY-MM-DD -> taken
}

export interface Exercise {
  id: string;
  name: string;
  duration: number; // in seconds
  description: string;
  videoUrl?: string;
  category: 'Fisioterapia' | 'Mobilidade' | 'Meditação' | 'Respiração';
  completedHistory: string[]; // dates completed
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface TerapeutaAppointment {
  id: string;
  date: string;
  time: string;
  therapistName: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
