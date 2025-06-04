export interface Coach {
  id: string;
  name: string;
  personality: string;
  expertise: string;
  avatarUrl: string;
  voiceId: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  imageUrl: string;
  colors?: string[];
  rating?: number;
  url?: string;
}

export interface Look {
  id: string;
  name: string;
  imageUrl: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  products: Product[];
  steps: string[];
  tags: string[];
}

export interface MakeupRegion {
  name: string;
  landmarks: number[];
  colors: string[];
  products?: Product[];
}

export interface MakeupAnalysis {
  regions: Record<string, MakeupRegion>;
  products: Product[];
  confidence: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  selectedCoach: string;
  skinTone: string;
  preferences: {
    brands: string[];
    productTypes: string[];
    priceRange: [number, number];
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  points: number;
}

export interface UserProgress {
  skillLevels: Record<string, number>;
  achievements: Achievement[];
  completedLooks: string[];
  streakDays: number;
  totalPoints: number;
  level: number;
}