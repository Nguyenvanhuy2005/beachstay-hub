
import React from 'react';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';

interface AnimationWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  type?: 'tween' | 'spring' | 'inertia';
}

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

export const slideVariants = (direction: 'up' | 'down' | 'left' | 'right', distance: number): Variants => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return {
    hidden: { opacity: 0, ...directions[direction] },
    visible: (i = 0) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
      },
    }),
  };
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 50,
  duration = 0.5,
  once = true,
  className = '',
  type = 'tween',
  ...props
}) => {
  let variants: Variants;

  if (direction) {
    variants = slideVariants(direction, distance);
  } else {
    variants = fadeVariants;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      custom={delay}
      variants={variants}
      transition={{ duration, type }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimationWrapper;
