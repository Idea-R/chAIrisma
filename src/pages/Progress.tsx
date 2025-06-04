import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/common/Navigation';
import Card from '../components/common/Card';
import GradientText from '../components/common/GradientText';
import LevelProgressBar from '../components/gamification/LevelProgressBar';
import SkillMeter from '../components/gamification/SkillMeter';
import StreakCounter from '../components/gamification/StreakCounter';
import AchievementBadge from '../components/gamification/AchievementBadge';
import { useProgressStore } from '../store/progressStore';

const Progress: React.FC = () => {
  const {
    level,
    experience,
    streak,
    skills,
    achievements,
    unlockedAchievements,
  } = useProgressStore();

  // Calculate next level experience requirements
  const calculateNextLevelExp = (currentLevel: number) => {
    if (currentLevel <= 10) return currentLevel * 100;
    if (currentLevel <= 25) return 1000 + (currentLevel - 10) * 200;
    if (currentLevel <= 50) return 5000 + (currentLevel - 25) * 300;
    if (currentLevel <= 75) return 15000 + (currentLevel - 50) * 500;
    return 35000 + (currentLevel - 75) * 1000;
  };

  const currentLevelExp = calculateNextLevelExp(level - 1);
  const nextLevelExp = calculateNextLevelExp(level);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          <GradientText>Your Beauty Journey</GradientText>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Overview */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Level {level}</h2>
                  <p className="text-gray-600">Keep practicing to level up!</p>
                </div>
                <StreakCounter streak={streak} />
              </div>

              <LevelProgressBar
                level={level}
                experience={experience}
                nextLevelExperience={nextLevelExp}
                currentLevelExperience={currentLevelExp}
              />
            </Card>

            <h2 className="text-xl font-semibold mb-4">Skill Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.values(skills).map((skill) => (
                <SkillMeter key={skill.name} skill={skill} />
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Achievements</h2>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  badge={achievement.badge}
                  name={achievement.name}
                  description={achievement.description}
                  isUnlocked={unlockedAchievements.has(achievement.id)}
                  unlockedAt={achievement.unlockedAt}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Progress;