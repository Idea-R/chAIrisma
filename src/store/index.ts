import { create } from 'zustand';
import { Coach, UserProfile, UserProgress, Look } from '../types';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  
  // User
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  
  // Coaches
  coaches: Coach[];
  selectedCoach: Coach | null;
  setSelectedCoach: (coach: Coach) => void;
  
  // Progress
  userProgress: UserProgress | null;
  updateProgress: (progress: Partial<UserProgress>) => void;
  
  // Looks
  trendingLooks: Look[];
  savedLooks: Look[];
  addSavedLook: (look: Look) => void;
  removeSavedLook: (lookId: string) => void;
  
  // Camera
  cameraActive: boolean;
  setCameraActive: (active: boolean) => void;
}

// Initial coaches data
const initialCoaches: Coach[] = [
  {
    id: 'cara',
    name: 'Cara',
    personality: 'Professional Beauty Coach',
    expertise: 'Classic techniques, skin care, foundation',
    avatarUrl: 'https://images.pexels.com/photos/3762804/pexels-photo-3762804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    voiceId: 'voice_id_cara'
  },
  {
    id: 'mika',
    name: 'Mika',
    personality: 'Trendy Style Expert',
    expertise: 'Viral trends, bold looks, social media aesthetics',
    avatarUrl: 'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    voiceId: 'voice_id_mika'
  },
  {
    id: 'luna',
    name: 'Luna',
    personality: 'Luxury Beauty Guru',
    expertise: 'High-end products, advanced techniques, special occasions',
    avatarUrl: 'https://images.pexels.com/photos/6953521/pexels-photo-6953521.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    voiceId: 'voice_id_luna'
  }
];

// Initial trending looks
const initialTrendingLooks: Look[] = [
  {
    id: 'look1',
    name: 'Natural Glam',
    imageUrl: 'https://images.pexels.com/photos/2703181/pexels-photo-2703181.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    difficulty: 'beginner',
    products: [],
    steps: [
      'Apply foundation evenly',
      'Highlight cheekbones and brow bone',
      'Apply neutral eyeshadow',
      'Finish with mascara and lip gloss'
    ],
    tags: ['natural', 'everyday', 'glam']
  },
  {
    id: 'look2',
    name: 'Smokey Eye',
    imageUrl: 'https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    difficulty: 'intermediate',
    products: [],
    steps: [
      'Prime your eyelids',
      'Apply dark eyeshadow to outer corner',
      'Blend into crease',
      'Line upper and lower lash lines',
      'Blend for smokey effect'
    ],
    tags: ['smokey', 'evening', 'dramatic']
  },
  {
    id: 'look3',
    name: 'Summer Glow',
    imageUrl: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    difficulty: 'beginner',
    products: [],
    steps: [
      'Apply tinted moisturizer',
      'Add cream bronzer to cheeks',
      'Highlight high points of face',
      'Finish with glossy lips'
    ],
    tags: ['summer', 'glowy', 'dewy']
  }
];

export const useAppStore = create<AppState>((set) => ({
  // Auth
  isAuthenticated: false,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  
  // User
  userProfile: null,
  setUserProfile: (profile) => set({ userProfile: profile }),
  
  // Coaches
  coaches: initialCoaches,
  selectedCoach: initialCoaches[0], // Default to Cara
  setSelectedCoach: (coach) => set({ selectedCoach: coach }),
  
  // Progress
  userProgress: null,
  updateProgress: (progress) => set((state) => ({
    userProgress: state.userProgress ? { ...state.userProgress, ...progress } : null
  })),
  
  // Looks
  trendingLooks: initialTrendingLooks,
  savedLooks: [],
  addSavedLook: (look) => set((state) => ({
    savedLooks: [...state.savedLooks, look]
  })),
  removeSavedLook: (lookId) => set((state) => ({
    savedLooks: state.savedLooks.filter(look => look.id !== lookId)
  })),
  
  // Camera
  cameraActive: false,
  setCameraActive: (active) => set({ cameraActive: active }),
}));