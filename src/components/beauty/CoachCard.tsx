import React from 'react';
import { motion } from 'framer-motion';
import { Coach } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { useAppStore } from '../../store';

interface CoachCardProps {
  coach: Coach;
  onSelect: () => void;
  isSelected: boolean;
}

const CoachCard: React.FC<CoachCardProps> = ({ coach, onSelect, isSelected }) => {
  return (
    <Card className={`overflow-hidden ${isSelected ? 'ring-2 ring-chairismatic-pink' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="relative w-full md:w-32 h-32">
          <img
            src={coach.avatarUrl}
            alt={`${coach.name} - AI Beauty Coach`}
            className="absolute inset-0 w-full h-full object-cover object-center rounded-t-lg md:rounded-lg"
          />
        </div>
        <div className="flex-grow p-4">
          <h3 className="text-lg font-semibold">{coach.name}</h3>
          <p className="text-sm text-gray-600 font-medium">{coach.personality}</p>
          <p className="text-xs text-gray-500 mt-1">Expertise: {coach.expertise}</p>
          
          <Button 
            variant={isSelected ? 'primary' : 'secondary'}
            size="sm"
            className="mt-3"
            onClick={onSelect}
          >
            {isSelected ? 'Selected' : 'Choose Coach'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

const CoachSelection: React.FC = () => {
  const { coaches, selectedCoach, setSelectedCoach } = useAppStore();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Choose Your Beauty Coach</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {coaches.map((coach) => (
          <motion.div 
            key={coach.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CoachCard
              coach={coach}
              isSelected={selectedCoach?.id === coach.id}
              onSelect={() => setSelectedCoach(coach)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CoachSelection;