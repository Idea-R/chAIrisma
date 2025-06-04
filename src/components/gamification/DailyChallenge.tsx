import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { DailyChallenge as DailyChallengeType } from '../../store/progressStore';

interface DailyChallengeProps {
  challenge: DailyChallengeType;
  onComplete: () => void;
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ challenge, onComplete }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Daily Challenge</h3>
        <span className="text-chairismatic-pink font-medium">+{challenge.reward} XP</span>
      </div>
      
      <p className="text-gray-600 mb-4">{challenge.description}</p>
      
      <Button
        variant={challenge.completed ? "secondary" : "primary"}
        onClick={onComplete}
        disabled={challenge.completed}
        fullWidth
      >
        {challenge.completed ? "Completed!" : "Complete Challenge"}
      </Button>
    </motion.div>
  );
};

export default DailyChallenge;