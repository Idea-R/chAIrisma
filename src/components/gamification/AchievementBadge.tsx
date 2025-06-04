import React from 'react';
import { motion } from 'framer-motion';

interface AchievementBadgeProps {
  badge: string;
  name: string;
  description: string;
  isUnlocked?: boolean;
  unlockedAt?: Date;
  onClick?: () => void;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  badge,
  name,
  description,
  isUnlocked = false,
  unlockedAt,
  onClick,
}) => {
  return (
    <motion.div
      className={`relative group cursor-pointer ${isUnlocked ? '' : 'opacity-50 grayscale'}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all duration-200">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{badge}</div>
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{description}</p>
            {isUnlocked && unlockedAt && (
              <p className="text-xs text-chairismatic-pink mt-1">
                Unlocked {unlockedAt.toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        
        {!isUnlocked && (
          <div className="absolute inset-0 bg-white bg-opacity-80 rounded-xl flex items-center justify-center">
            <div className="text-2xl">🔒</div>
          </div>
        )}
      </div>
    </motion.div>
  );
};