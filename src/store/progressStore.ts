import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Skill {
  name: string;
  level: number;
  experience: number;
  accuracy: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  badge: string;
  unlockedAt?: Date;
  category: 'beginner' | 'skill' | 'social' | 'consistency';
}

export interface DailyChallenge {
  id: string;
  name: string;
  description: string;
  type: string;
  reward: number;
  completed: boolean;
}

interface ProgressState {
  // Core stats
  level: number;
  experience: number;
  totalPoints: number;
  streak: number;
  lastLoginDate: string;
  completedLooks: number;
  
  // Skills tracking
  skills: Record<string, Skill>;
  
  // Achievements
  achievements: Achievement[];
  unlockedAchievements: Set<string>;
  
  // Daily challenges
  dailyChallenge: DailyChallenge | null;
  
  // Actions
  addExperience: (amount: number) => void;
  completeChallenge: () => void;
  updateSkill: (skillName: string, accuracy: number) => void;
  unlockAchievement: (achievementId: string) => void;
  updateStreak: () => void;
  incrementCompletedLooks: () => void;
}

const calculateLevel = (experience: number): number => {
  if (experience < 1000) return Math.floor(experience / 100) + 1; // Levels 1-10
  if (experience < 5000) return Math.floor((experience - 1000) / 200) + 11; // Levels 11-25
  if (experience < 15000) return Math.floor((experience - 5000) / 300) + 26; // Levels 26-50
  if (experience < 35000) return Math.floor((experience - 15000) / 500) + 51; // Levels 51-75
  return Math.floor((experience - 35000) / 1000) + 76; // Levels 76-100
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // Initial state
      level: 1,
      experience: 0,
      totalPoints: 0,
      streak: 0,
      lastLoginDate: new Date().toISOString().split('T')[0],
      completedLooks: 0,
      
      skills: {
        foundation: { name: 'Foundation', level: 1, experience: 0, accuracy: 0 },
        eyeshadow: { name: 'Eyeshadow', level: 1, experience: 0, accuracy: 0 },
        eyeliner: { name: 'Eyeliner', level: 1, experience: 0, accuracy: 0 },
        lipstick: { name: 'Lipstick', level: 1, experience: 0, accuracy: 0 },
        contouring: { name: 'Contouring', level: 1, experience: 0, accuracy: 0 },
      },
      
      achievements: [],
      unlockedAchievements: new Set(),
      
      dailyChallenge: null,
      
      // Actions
      addExperience: (amount: number) => {
        set((state) => {
          const newExperience = state.experience + amount;
          const newLevel = calculateLevel(newExperience);
          const leveledUp = newLevel > state.level;
          
          return {
            experience: newExperience,
            level: newLevel,
            totalPoints: state.totalPoints + amount,
            ...(leveledUp && { levelUpAnimation: true }),
          };
        });
      },
      
      updateSkill: (skillName: string, accuracy: number) => {
        set((state) => {
          const skill = state.skills[skillName];
          if (!skill) return state;
          
          const experienceGain = Math.floor(accuracy * 10);
          const newExperience = skill.experience + experienceGain;
          const newLevel = Math.floor(newExperience / 100) + 1;
          
          return {
            skills: {
              ...state.skills,
              [skillName]: {
                ...skill,
                level: newLevel,
                experience: newExperience,
                accuracy: (skill.accuracy + accuracy) / 2,
              },
            },
          };
        });
      },
      
      unlockAchievement: (achievementId: string) => {
        set((state) => {
          if (state.unlockedAchievements.has(achievementId)) return state;
          
          const achievement = state.achievements.find(a => a.id === achievementId);
          if (!achievement) return state;
          
          const newUnlockedAchievements = new Set(state.unlockedAchievements);
          newUnlockedAchievements.add(achievementId);
          
          return {
            unlockedAchievements: newUnlockedAchievements,
            achievements: state.achievements.map(a => 
              a.id === achievementId 
                ? { ...a, unlockedAt: new Date() }
                : a
            ),
          };
        });
      },
      
      updateStreak: () => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const lastLogin = new Date(state.lastLoginDate);
          const dayDiff = Math.floor((Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
          
          return {
            streak: dayDiff === 1 ? state.streak + 1 : dayDiff === 0 ? state.streak : 0,
            lastLoginDate: today,
          };
        });
      },
      
      incrementCompletedLooks: () => {
        set((state) => ({
          completedLooks: state.completedLooks + 1,
        }));
      },
      
      completeChallenge: () => {
        set((state) => {
          if (!state.dailyChallenge || state.dailyChallenge.completed) return state;
          
          return {
            dailyChallenge: {
              ...state.dailyChallenge,
              completed: true,
            },
            totalPoints: state.totalPoints + state.dailyChallenge.reward,
          };
        });
      },
    }),
    {
      name: 'chairismatic-progress',
    }
  )
);