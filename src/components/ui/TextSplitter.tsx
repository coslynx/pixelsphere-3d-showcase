import React, { useMemo } from 'react';
import { motion, Variants } from 'framer-motion';

interface TextSplitterProps {
  text: string;
  splitBy?: 'character' | 'word';
  animationVariants?: Variants;
  staggerChildren?: number;
  className?: string;
}

const defaultAnimationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const TextSplitter: React.FC<TextSplitterProps> = ({
  text,
  splitBy = 'character',
  animationVariants = defaultAnimationVariants,
  staggerChildren = 0.05,
  className,
}) => {
  const items = useMemo(() => {
    if (!text) return [];

    switch (splitBy) {
      case 'character':
        return text.split('');
      case 'word':
        return text.split(' ');
      default:
        console.error('Invalid splitBy value. Using character split.');
        return text.split('');
    }
  }, [text, splitBy]);

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: { staggerChildren: staggerChildren },
        },
      }}
      style={{ display: 'inline-block', position: 'relative' }}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <motion.span
            variants={animationVariants}
            style={{ display: 'inline-block', position: 'relative' }}
            aria-hidden="true"
          >
            {item}
          </motion.span>
          {splitBy === 'word' && index < items.length - 1 && <span>&nbsp;</span>}
        </React.Fragment>
      ))}
    </motion.div>
  );
};

export default TextSplitter;