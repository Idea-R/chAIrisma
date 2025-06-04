import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  onClick,
}) => {
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 ${className}`}
      onClick={onClick}
      whileHover={hoverEffect ? { scale: 1.01, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.div>
  );
};

export default Card;