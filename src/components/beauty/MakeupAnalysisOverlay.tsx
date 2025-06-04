import React from 'react';
import { motion } from 'framer-motion';
import { MakeupAnalysis } from '../../types';

interface MakeupAnalysisOverlayProps {
  analysis: MakeupAnalysis;
  onRegionClick?: (regionName: string) => void;
}

const MakeupAnalysisOverlay: React.FC<MakeupAnalysisOverlayProps> = ({
  analysis,
  onRegionClick,
}) => {
  return (
    <div className="absolute inset-0">
      <svg className="w-full h-full">
        {Object.entries(analysis.regions).map(([name, region]) => (
          <motion.g
            key={name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 0.8 }}
            onClick={() => onRegionClick?.(name)}
            className="cursor-pointer"
          >
            <path
              d={`M ${region.landmarks
                .map(i => `${i.x * 100}% ${i.y * 100}%`)
                .join(' L ')} Z`}
              fill={region.colors[0]}
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={`${region.landmarks[0].x * 100}%`}
              y={`${region.landmarks[0].y * 100}%`}
              className="text-xs fill-white stroke-black stroke-1"
              transform="translate(10, -10)"
            >
              {name}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
};

export default MakeupAnalysisOverlay;