import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, Search, Award, Star, Users } from 'lucide-react';
import GradientText from '../components/common/GradientText';
import Button from '../components/common/Button';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Camera className="w-10 h-10 text-chairismatic-pink" />,
      title: 'Real-time AI Coaching',
      description: 'Get personalized, step-by-step guidance from your AI beauty coach as you apply makeup.'
    },
    {
      icon: <Search className="w-10 h-10 text-chairismatic-purple" />,
      title: 'Analyze Any Look',
      description: 'Upload photos or social media looks and instantly decode the products and techniques used.'
    },
    {
      icon: <Award className="w-10 h-10 text-chairismatic-blue" />,
      title: 'Track Your Progress',
      description: 'See your beauty skills improve over time with detailed progress tracking and achievements.'
    },
    {
      icon: <Star className="w-10 h-10 text-chairismatic-pink" />,
      title: 'Product Recommendations',
      description: 'Get personalized product suggestions tailored to your skin tone and preferences.'
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-chairismatic-pink via-chairismatic-purple to-chairismatic-blue overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-3/4 left-1/3 w-24 h-24 rounded-full bg-white animate-float" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full bg-white animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="md:w-1/2 text-white mb-10 md:mb-0"
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
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display leading-tight"
                variants={fadeInUp}
              >
                Your AI Beauty Coach
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl mb-6 font-light"
                variants={fadeInUp}
              >
                Decode Any Look, Perfect Your Style
              </motion.p>
              <motion.p 
                className="text-lg opacity-90 mb-8 max-w-lg"
                variants={fadeInUp}
              >
                ChAIrismatic analyzes any makeup look and provides real-time AI coaching to help you recreate it perfectly.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                variants={fadeInUp}
              >
                <Button 
                  size="lg" 
                  variant="primary" 
                  className="bg-white text-chairismatic-purple hover:text-chairismatic-pink"
                  onClick={() => navigate('/onboarding')}
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="!bg-transparent !border-white !text-white hover:!bg-white hover:!bg-opacity-10"
                  onClick={() => navigate('/dashboard')}
                >
                  Explore Looks
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-full shadow-xl overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg" 
                    alt="Beauty AI" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-white rounded-full shadow-lg overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg" 
                    alt="Beauty AI Coach" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-white rounded-full shadow-lg overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/3762804/pexels-photo-3762804.jpeg" 
                    alt="Beauty AI Coach" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">
              <GradientText>Meet Your Beauty AI Coaches</GradientText>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI coaches analyze your face in real-time and guide you through recreating any makeup look with step-by-step instructions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coach Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">
              <GradientText variant="secondary">Choose Your Coach</GradientText>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select the perfect AI beauty coach that matches your style and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Cara',
                role: 'Professional Beauty Coach',
                image: 'https://images.pexels.com/photos/3762804/pexels-photo-3762804.jpeg',
                expertise: 'Classic techniques, skin care, foundation',
                quote: '"Perfect! Now let\'s blend that foundation seamlessly."'
              },
              {
                name: 'Mika',
                role: 'Trendy Style Expert',
                image: 'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg',
                expertise: 'Viral trends, bold looks, social media aesthetics',
                quote: '"OMG yes! That eyeliner is giving main character energy!"'
              },
              {
                name: 'Luna',
                role: 'Luxury Beauty Guru',
                image: 'https://images.pexels.com/photos/6953521/pexels-photo-6953521.jpeg',
                expertise: 'High-end products, advanced techniques, special occasions',
                quote: '"Exquisite choice - this technique will elevate your entire look"'
              }
            ].map((coach, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
              >
                <div className="h-56 overflow-hidden">
                  <img 
                    src={coach.image} 
                    alt={coach.name} 
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{coach.name}</h3>
                  <p className="text-chairismatic-purple font-medium">{coach.role}</p>
                  <p className="text-gray-600 text-sm mt-2">
                    <strong>Expertise:</strong> {coach.expertise}
                  </p>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg italic text-gray-600">
                    {coach.quote}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-chairismatic-pink to-chairismatic-purple text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-display">Ready to Transform Your Beauty Routine?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of beauty enthusiasts who are perfecting their skills with ChAIrismatic
          </p>
          <Button 
            size="xl" 
            variant="primary" 
            className="bg-white text-chairismatic-purple hover:bg-gray-100"
            onClick={() => navigate('/onboarding')}
          >
            Get Started Free
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;