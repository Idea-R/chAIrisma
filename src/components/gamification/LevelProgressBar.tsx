import React from 'react';
import { motion } from 'framer-motion';

interface LevelProgressBarProps {
  level: number;
  experience: number;
  nextLevelExperience: number;
  currentLevelExperience: number;
}

const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  level,
  experience,
  nextLevelExperience,
  currentLevelExperience,
}) => {
  const progress = ((experience - currentLevelExperience) / (nextLevelExperience - currentLevelExperience)) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Level {level}</span>
        <span className="text-xs text-gray-500">
          {experience - currentLevelExperience}/{nextLevelExperience - currentLevelExperience} XP
        </span>
      </div>
      
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-chairismatic-pink to-chairismatic-purple"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};