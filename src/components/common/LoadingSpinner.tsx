import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };
  
  const colorClasses = {
    primary: 'border-chairismatic-pink',
    secondary: 'border-chairismatic-purple',
    white: 'border-white'
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-200 border-opacity-30 rounded-full`}></div>
        <div 
          className={`absolute top-0 left-0 ${sizeClasses[size]} border-4 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}
        ></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;