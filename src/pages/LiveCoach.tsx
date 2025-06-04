import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Pause, Play, SkipForward, Award } from 'lucide-react';
import Navigation from '../components/common/Navigation';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import GradientText from '../components/common/GradientText';
import ProgressRing from '../components/common/ProgressRing';
import FaceMeshRenderer from '../components/beauty/FaceMeshRenderer';
import { useAppStore } from '../store';

const LiveCoach: React.FC = () => {
  const { selectedCoach } = useAppStore();
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [guidanceMessage, setGuidanceMessage] = useState('');
  
  // Demo steps - in a real app, these would be generated dynamically based on the look
  const steps = [
    'Apply primer to create a smooth base',
    'Blend foundation evenly across your face',
    'Add concealer under your eyes and on blemishes',
    'Set your base with translucent powder',
    'Apply blush to the apples of your cheeks',
    'Create depth with bronzer on your cheekbones',
    'Apply eyeshadow base on your eyelids',
    'Blend darker eyeshadow into the crease'
  ];
  
  // Simulated AI coach messages for demo
  const coachMessages = [
    "Let's start by applying primer. This creates a smooth base for your foundation.",
    "Now blend your foundation evenly. Use circular motions for the best coverage.",
    "Great! Now add concealer under your eyes and on any blemishes. Tap gently to blend.",
    "Set your base with translucent powder. Focus on the T-zone to prevent shininess.",
    "Time for blush! Smile and apply to the apples of your cheeks in circular motions.",
    "Perfect! Now add bronzer to your cheekbones for definition. Use a light hand.",
    "Apply your eyeshadow base across the entire lid. This helps colors pop and last longer.",
    "Now blend the darker shade into your crease using a windshield wiper motion."
  ];
  
  useEffect(() => {
    if (!isPaused) {
      setGuidanceMessage(coachMessages[currentStep]);
      
      // Simulate progress
      const timer = setInterval(() => {
        setProgress(prev => {
          const nextProgress = prev + 0.5;
          if (nextProgress >= (currentStep + 1) * (100 / steps.length)) {
            clearInterval(timer);
            return (currentStep + 1) * (100 / steps.length);
          }
          return nextProgress;
        });
      }, 100);
      
      return () => clearInterval(timer);
    }
  }, [currentStep, isPaused]);
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          <GradientText>Live Coaching</GradientText> with {selectedCoach?.name || 'Your Coach'}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6 overflow-hidden p-0">
              <div className="relative aspect-video w-full">
                <FaceMeshRenderer />
                
                {/* Controls overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 flex justify-between items-center">
                  <div className="flex space-x-3">
                    <Button 
                      variant="ghost" 
                      className="text-white hover:bg-white hover:bg-opacity-20"
                      onClick={togglePause}
                      icon={isPaused ? <Play size={20} /> : <Pause size={20} />}
                    >
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-white hover:bg-white hover:bg-opacity-20"
                      onClick={handleNextStep}
                      icon={<SkipForward size={20} />}
                    >
                      Next Step
                    </Button>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white hover:bg-opacity-20"
                    onClick={toggleVoice}
                    icon={isVoiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  >
                    {isVoiceEnabled ? 'Voice On' : 'Voice Off'}
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="p-0 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-chairismatic-pink to-chairismatic-purple text-white">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-white">
                    <img 
                      src={selectedCoach?.avatarUrl} 
                      alt={selectedCoach?.name || 'Coach'}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <p className="font-medium">{selectedCoach?.name || 'Your Coach'} says:</p>
                    <p className="text-xs opacity-80">{selectedCoach?.personality}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <motion.p 
                  key={guidanceMessage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg"
                >
                  {guidanceMessage}
                </motion.p>
              </div>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Overall Progress</h2>
                <ProgressRing progress={progress} />
              </div>
              
              <div className="h-1 w-full bg-gray-200 rounded-full mb-6">
                <div 
                  className="h-1 bg-gradient-to-r from-chairismatic-pink to-chairismatic-purple rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <h3 className="font-medium mb-3">Current Step: {currentStep + 1}/{steps.length}</h3>
              <p className="text-gray-600 mb-4">{steps[currentStep]}</p>
              
              <Button 
                variant="primary" 
                fullWidth
                onClick={handleNextStep}
                disabled={currentStep >= steps.length - 1}
              >
                Next Step
              </Button>
            </Card>
            
            <Card>
              <h2 className="text-lg font-semibold mb-4">Look Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                    <img 
                      src="https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Look preview"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Smokey Eye Look</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="flex items-center">
                        <Award size={14} className="mr-1" /> 
                        Intermediate
                      </span>
                      <span className="mx-2">•</span>
                      <span>8 steps</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Products Used</h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex justify-between">
                      <span>Primer</span>
                      <span className="text-gray-600">Hydrating Base</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Foundation</span>
                      <span className="text-gray-600">Luminous Silk</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Eyeshadow</span>
                      <span className="text-gray-600">Smokey Palette</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Lipstick</span>
                      <span className="text-gray-600">Mauve Matte</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveCoach;