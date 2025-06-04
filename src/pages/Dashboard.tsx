import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Scan, Search, Award, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAppStore } from '../store';
import Navigation from '../components/common/Navigation';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import GradientText from '../components/common/GradientText';
import LookCard from '../components/beauty/LookCard';
import ProgressRing from '../components/common/ProgressRing';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { trendingLooks, selectedCoach } = useAppStore();

  const quickActions = [
    {
      icon: <Scan size={24} />,
      title: 'Scan Look',
      description: 'Upload a photo or social post',
      action: () => navigate('/scan'),
      color: 'from-pink-500 to-purple-500'
    },
    {
      icon: <Camera size={24} />,
      title: 'Live Coach',
      description: 'Real-time makeup guidance',
      action: () => navigate('/coach'),
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: <Search size={24} />,
      title: 'Find Products',
      description: 'Browse recommended products',
      action: () => navigate('/products'),
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {/* Welcome Section */}
          <motion.section variants={fadeInUp} className="mb-8">
            <div className="flex items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Welcome to <GradientText>ChAIrismatic</GradientText>
                </h1>
                <p className="text-gray-600">Your AI beauty coach is ready to help you perfect your look</p>
              </div>
              {selectedCoach && (
                <div className="ml-auto">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-chairismatic-pink">
                      <img 
                        src={selectedCoach.avatarUrl} 
                        alt={selectedCoach.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{selectedCoach.name}</p>
                      <p className="text-xs text-gray-500">Your Beauty Coach</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.section>

          {/* Quick Actions */}
          <motion.section variants={fadeInUp} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Card 
                  key={index}
                  className="p-0 overflow-hidden hover:shadow-md transition-shadow"
                  onClick={action.action}
                >
                  <div className={`bg-gradient-to-r ${action.color} p-4 text-white`}>
                    {action.icon}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* Progress Snapshot */}
          <motion.section variants={fadeInUp} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Beauty Journey</h2>
            <Card className="bg-gradient-to-r from-chairismatic-pink to-chairismatic-purple p-0 overflow-hidden">
              <div className="p-6 text-white">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="mb-4 md:mb-0 md:mr-6">
                    <ProgressRing progress={65} size={80} strokeWidth={8} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Beauty Expert Level</h3>
                    <div className="flex items-center mb-3">
                      <Crown size={16} className="mr-1" />
                      <span className="font-medium">Intermediate</span>
                      <span className="ml-2 text-sm opacity-80">6,500 points</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="opacity-80">Completed Looks</p>
                        <p className="font-semibold text-lg">12</p>
                      </div>
                      <div>
                        <p className="opacity-80">Streak</p>
                        <p className="font-semibold text-lg">3 days</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto mt-4 md:mt-0">
                    <Button
                      variant="secondary"
                      className="!bg-white !text-chairismatic-purple hover:!bg-gray-100"
                      onClick={() => navigate('/profile')}
                    >
                      View Progress
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.section>

          {/* Trending Looks */}
          <motion.section variants={fadeInUp}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Trending Looks</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/trends')}
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingLooks.map((look, index) => (
                <motion.div
                  key={look.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <LookCard 
                    look={look}
                    onSelect={() => navigate(`/trends/${look.id}`)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;