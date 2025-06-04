import React from 'react';
import { motion } from 'framer-motion';
import { BookmarkPlus, BookmarkCheck, ExternalLink } from 'lucide-react';
import { Look } from '../../types';
import Card from '../common/Card';
import { useAppStore } from '../../store';

interface LookCardProps {
  look: Look;
  onSelect?: () => void;
}

const LookCard: React.FC<LookCardProps> = ({ look, onSelect }) => {
  const { savedLooks, addSavedLook, removeSavedLook } = useAppStore();
  
  const isSaved = savedLooks.some(saved => saved.id === look.id);
  
  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      removeSavedLook(look.id);
    } else {
      addSavedLook(look);
    }
  };
  
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced: 'bg-purple-100 text-purple-800',
    expert: 'bg-red-100 text-red-800',
  };

  return (
    <Card 
      className="h-full flex flex-col overflow-hidden"
      hoverEffect
      onClick={onSelect}
    >
      <div className="relative h-48 -mx-4 -mt-4 mb-4">
        <img 
          src={look.imageUrl} 
          alt={look.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={toggleSave}
          className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors"
        >
          {isSaved ? (
            <BookmarkCheck size={20} className="text-chairismatic-pink" />
          ) : (
            <BookmarkPlus size={20} className="text-gray-600" />
          )}
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
          <h3 className="text-white font-semibold text-lg">{look.name}</h3>
        </div>
      </div>
      
      <div className="flex-grow">
        <div className="flex items-center mb-3">
          <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[look.difficulty]}`}>
            {look.difficulty.charAt(0).toUpperCase() + look.difficulty.slice(1)}
          </span>
          
          <div className="ml-auto flex space-x-1">
            {look.tags.map((tag, index) => (
              <span key={index} className="text-xs text-gray-500">#{tag}</span>
            ))}
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Steps: {look.steps.length}</p>
          <p>Products: {look.products.length || 'Auto-detected'}</p>
        </div>
      </div>
      
      <motion.button 
        className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-chairismatic-pink to-chairismatic-purple text-white rounded-lg flex items-center justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Try This Look
        <ExternalLink size={16} className="ml-2" />
      </motion.button>
    </Card>
  );
};

export default LookCard;