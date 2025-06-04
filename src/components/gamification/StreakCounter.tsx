import React from 'react';
import { motion } from 'framer-motion';

interface StreakCounterProps {
  streak: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  return (
    <motion.div
      className="flex items-center space-x-2 bg-gradient-to-r from-chairismatic-pink to-chairismatic-purple text-white px-4 py-2 rounded-full"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-lg">🔥</span>
      <span className="font-medium">{streak} Day Streak</span>
    </motion.div>
  );
};