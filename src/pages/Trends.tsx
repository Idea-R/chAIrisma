import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Award, TrendingUp } from 'lucide-react';
import Navigation from '../components/common/Navigation';
import Card from '../components/common/Card';
import GradientText from '../components/common/GradientText';
import LookCard from '../components/beauty/LookCard';
import Button from '../components/common/Button';
import { useAppStore } from '../store';
import { Look } from '../types';

// Additional trending looks for this page
const additionalLooks: Look[] = [
  {
    id: 'look4',
    name: 'Bold Lips',
    imageUrl: 'https://images.pexels.com/photos/2746121/pexels-photo-2746121.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    difficulty: 'beginner',
    products: [],
    steps: [
      'Apply lip primer',
      'Line lips with a lip liner',
      'Fill in with bold lipstick',
      'Blot and reapply for intensity'
    ],
    tags: ['bold', 'lips', 'statement']
  },
  {
    id: 'look5',
    name: 'Sunset Eyes',
    imageUrl: 'https://images.pexels.com/photos/2695038/pexels-photo-2695038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    difficulty: 'advanced',
    products: [],
    steps: [
      'Apply eye primer',
      'Use orange in the crease',
      'Blend red on the outer corner',
      'Add yellow in the inner corner',
      'Blend for a sunset effect'
    ],
    tags: ['colorful', 'sunset', 'summer']
  },
  {
    id: 'look6',
    name: 'No-Makeup Makeup',
    imageUrl: 'https://images.pexels.com/photos/2752045/pexels-photo-2752045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    difficulty: 'beginner',
    products: [],
    steps: [
      'Apply tinted moisturizer',
      'Spot conceal where needed',
      'Add cream blush to cheeks',
      'Apply clear brow gel',
      'Finish with tinted lip balm'
    ],
    tags: ['natural', 'everyday', 'minimalist']
  },
  {
    id: 'look7',
    name: 'Glitter Cut Crease',
    imageUrl: 'https://images.pexels.com/photos/2823566/pexels-photo-2823566.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    difficulty: 'expert',
    products: [],
    steps: [
      'Apply eye primer',
      'Create a precise cut crease',
      'Pack glitter on the lid',
      'Apply winged liner',
      'Add dramatic lashes'
    ],
    tags: ['glitter', 'dramatic', 'evening']
  },
  {
    id: 'look8',
    name: 'Fresh Dewy Skin',
    imageUrl: 'https://images.pexels.com/photos/2923922/pexels-photo-2923922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    difficulty: 'beginner',
    products: [],
    steps: [
      'Apply hydrating primer',
      'Use dewy foundation',
      'Highlight high points of face',
      'Add cream blush',
      'Set minimally with powder'
    ],
    tags: ['dewy', 'glowy', 'fresh']
  },
  {
    id: 'look9',
    name: 'Graphic Liner',
    imageUrl: 'https://images.pexels.com/photos/2908783/pexels-photo-2908783.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    difficulty: 'advanced',
    products: [],
    steps: [
      'Apply eye primer',
      'Create a basic wing',
      'Add graphic elements',
      'Clean edges with concealer',
      'Keep the rest of the look simple'
    ],
    tags: ['graphic', 'editorial', 'artistic']
  }
];

const Trends: React.FC = () => {
  const { trendingLooks } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  
  // Combine store looks with additional looks
  const allLooks = [...trendingLooks, ...additionalLooks];
  
  // Filter looks based on search and difficulty
  const filteredLooks = allLooks.filter(look => {
    const matchesSearch = searchQuery === '' || 
      look.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      look.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === null || look.difficulty === difficultyFilter;
    
    return matchesSearch && matchesDifficulty;
  });
  
  const clearFilters = () => {
    setSearchQuery('');
    setDifficultyFilter(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          <GradientText>Trending Looks</GradientText>
        </h1>
        
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for looks, styles, or tags..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chairismatic-pink"
              />
            </div>
            
            <div className="flex space-x-3">
              <div className="relative inline-block">
                <select
                  value={difficultyFilter || ''}
                  onChange={(e) => setDifficultyFilter(e.target.value || null)}
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chairismatic-pink bg-white"
                >
                  <option value="">All Difficulty Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <Award size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <Filter size={16} className="text-gray-400" />
                </div>
              </div>
              
              {(searchQuery || difficultyFilter) && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </Card>
        
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <TrendingUp size={20} className="text-chairismatic-pink mr-2" />
            <h2 className="text-xl font-semibold">Popular This Week</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLooks.slice(0, 3).map((look, index) => (
              <motion.div
                key={look.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <LookCard look={look} />
              </motion.div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">All Trending Looks</h2>
          
          {filteredLooks.length === 0 ? (
            <Card className="py-8">
              <div className="text-center">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">No looks found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any looks matching your search criteria.
                </p>
                <Button 
                  variant="primary"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLooks.map((look, index) => (
                <motion.div
                  key={look.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (index % 4) * 0.1 }}
                >
                  <LookCard look={look} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Trends;