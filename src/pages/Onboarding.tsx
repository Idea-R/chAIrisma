import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import GradientText from '../components/common/GradientText';
import CoachSelection from '../components/beauty/CoachCard';
import CameraView from '../components/beauty/CameraView';
import { useAppStore } from '../store';

const steps = [
  'welcome',
  'coachSelection',
  'skinAnalysis',
  'preferences',
  'complete'
];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthenticated, setUserProfile } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    skinConcerns: [] as string[],
    preferredBrands: [] as string[],
    priceRange: 'mid' as 'budget' | 'mid' | 'luxury',
  });
  
  const handleCapture = (imageSrc: string) => {
    setSelfieImage(imageSrc);
  };
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      setAuthenticated(true);
      setUserProfile({
        id: 'user-1',
        name: 'Beauty Enthusiast',
        email: 'user@example.com',
        selectedCoach: 'cara',
        skinTone: 'medium',
        preferences: {
          brands: preferences.preferredBrands,
          productTypes: [],
          priceRange: [0, 100]
        }
      });
      navigate('/dashboard');
    }
  };
  
  const toggleSkinConcern = (concern: string) => {
    setPreferences(prev => {
      const updatedConcerns = prev.skinConcerns.includes(concern)
        ? prev.skinConcerns.filter(c => c !== concern)
        : [...prev.skinConcerns, concern];
      
      return {
        ...prev,
        skinConcerns: updatedConcerns
      };
    });
  };
  
  const setPriceRange = (range: 'budget' | 'mid' | 'luxury') => {
    setPreferences(prev => ({
      ...prev,
      priceRange: range
    }));
  };
  
  const renderStepContent = () => {
    switch (steps[currentStep]) {
      case 'welcome':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-display">
              Welcome to <GradientText>ChAIrismatic</GradientText>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Your personal AI beauty coach is ready to help you perfect your makeup skills.
              Let's get you set up with a few quick steps!
            </p>
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleNextStep}
              icon={<ArrowRight size={20} />}
            >
              Get Started
            </Button>
          </motion.div>
        );
      
      case 'coachSelection':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
              Choose Your <GradientText>AI Beauty Coach</GradientText>
            </h2>
            <p className="text-gray-600 mb-8">
              Select the coach that best matches your style and preferences.
              You can change this later in settings.
            </p>
            
            <CoachSelection />
            
            <div className="mt-8">
              <Button 
                variant="primary" 
                onClick={handleNextStep}
                icon={<ArrowRight size={20} />}
              >
                Continue
              </Button>
            </div>
          </motion.div>
        );
      
      case 'skinAnalysis':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
              <GradientText>Skin Analysis</GradientText>
            </h2>
            <p className="text-gray-600 mb-8">
              Let's take a selfie to analyze your skin tone and features.
              This helps us provide more accurate recommendations.
            </p>
            
            {!selfieImage ? (
              <div className="mb-8">
                <CameraView onCapture={handleCapture} />
              </div>
            ) : (
              <div className="mb-8 flex flex-col items-center">
                <div className="w-64 h-64 rounded-full overflow-hidden mb-4">
                  <img 
                    src={selfieImage} 
                    alt="Your selfie" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  <CheckCircle size={16} className="mr-2" />
                  <span>Analysis Complete</span>
                </div>
              </div>
            )}
            
            <Button 
              variant="primary" 
              onClick={handleNextStep}
              disabled={!selfieImage}
              icon={<ArrowRight size={20} />}
            >
              Continue
            </Button>
          </motion.div>
        );
      
      case 'preferences':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
              Your <GradientText>Preferences</GradientText>
            </h2>
            <p className="text-gray-600 mb-8">
              Help us personalize your experience by telling us a bit about your preferences.
            </p>
            
            <div className="space-y-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Skin Concerns</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select all that apply to you:
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Acne', 'Dryness', 'Oiliness', 'Aging', 'Dark Spots', 'Sensitivity'].map(concern => (
                    <button
                      key={concern}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        preferences.skinConcerns.includes(concern)
                          ? 'bg-chairismatic-pink text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleSkinConcern(concern)}
                    >
                      {concern}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                <p className="text-sm text-gray-600 mb-4">
                  What's your preferred price range for beauty products?
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      preferences.priceRange === 'budget'
                        ? 'bg-chairismatic-pink text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setPriceRange('budget')}
                  >
                    Budget-Friendly
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      preferences.priceRange === 'mid'
                        ? 'bg-chairismatic-pink text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setPriceRange('mid')}
                  >
                    Mid-Range
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      preferences.priceRange === 'luxury'
                        ? 'bg-chairismatic-pink text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setPriceRange('luxury')}
                  >
                    Luxury
                  </button>
                </div>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              onClick={handleNextStep}
              icon={<ArrowRight size={20} />}
            >
              Continue
            </Button>
          </motion.div>
        );
      
      case 'complete':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
              <CheckCircle size={32} />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
              <GradientText>You're All Set!</GradientText>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Your AI beauty coach is ready to help you perfect your makeup skills.
              Let's start your beauty journey!
            </p>
            
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleNextStep}
            >
              Enter ChAIrismatic
            </Button>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="max-w-2xl w-full p-8">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
        
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              {steps.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-1 w-full mx-1 rounded-full ${
                    index <= currentStep ? 'bg-chairismatic-pink' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Onboarding;