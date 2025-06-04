import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  variant = 'primary',
}) => {
  const gradients = {
    primary: 'from-chairismatic-pink to-chairismatic-purple',
    secondary: 'from-chairismatic-purple to-chairismatic-blue',
    accent: 'from-chairismatic-pink to-chairismatic-blue'
  };

  return (
    <span className={`bg-gradient-to-r ${gradients[variant]} bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
};

export default GradientText;