import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Home, Scan, Award, User, Sparkles } from 'lucide-react';
import GradientText from './GradientText';

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/scan', label: 'Scan Look', icon: <Scan size={20} /> },
    { path: '/coach', label: 'Live Coach', icon: <Camera size={20} /> },
    { path: '/trends', label: 'Trends', icon: <Sparkles size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 md:hidden z-10">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center py-3 px-2 ${
                isActive(item.path) 
                  ? 'text-chairismatic-pink' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
              {isActive(item.path) && (
                <motion.div 
                  className="absolute bottom-0 h-1 w-6 bg-gradient-to-r from-chairismatic-pink to-chairismatic-purple rounded-t-lg"
                  layoutId="indicator"
                />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Top Navigation */}
      <header className="hidden md:block bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">
                <GradientText>ChAIrismatic</GradientText>
              </span>
            </Link>
            <nav className="flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center px-3 py-2 transition-colors ${
                    isActive(item.path)
                      ? 'text-chairismatic-pink'
                      : 'text-gray-600 hover:text-chairismatic-pink'
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                  {isActive(item.path) && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-chairismatic-pink to-chairismatic-purple"
                      layoutId="nav-indicator"
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navigation;