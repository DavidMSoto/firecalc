import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RatStage } from '../../context/ProgressionContext';
import poorRat from '../../assets/poor-rat.png';
import workingRat from '../../assets/working-rat.png';
import wealthyRat from '../../assets/wealthy-rat.png';

interface RatIconProps {
  stage: RatStage;
  className?: string;
}

export const RatIcon: React.FC<RatIconProps> = ({ stage, className = '' }) => {
  const ratImages = useMemo(() => ({
    poor: poorRat,
    working: workingRat,
    wealthy: wealthyRat,
  }), []);

  const animationVariants = useMemo(() => ({
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    hover: { scale: 1.1 },
  }), []);

  return (
    <motion.div
      className={`transition-transform duration-500 ease-in-out ${className}`}
      variants={animationVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ duration: 0.3 }}
    >
      <img
        src={ratImages[stage]}
        alt={`${stage} rat`}
        className="w-16 h-16 object-contain"
        loading="eager"
      />
    </motion.div>
  );
};