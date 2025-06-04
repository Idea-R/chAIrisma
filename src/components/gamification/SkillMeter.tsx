import React from 'react';
import { motion } from 'framer-motion';
import { Skill } from '../../store/progressStore';

interface SkillMeterProps {
  skill: Skill;
}

const SkillMeter: React.FC<SkillMeterProps> = ({ skill }) => {
  const accuracy = Math.round(skill.accuracy * 100);
  
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">{skill.name}</h3>
        <span className="text-sm text-gray-500">Level {skill.level}</span>
      </div>
      
      <div className="space-y-2">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-chairismatic-pink to-chairismatic-purple"
            initial={{ width: 0 }}
            animate={{ width: `${accuracy}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>Accuracy: {accuracy}%</span>
          <span>XP: {skill.experience}</span>
        </div>
      </div>
    </div>
  );
};

export default SkillMeter;