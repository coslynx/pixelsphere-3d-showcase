import React, { ReactNode, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  icon3d?: React.FC<{ size: number; color: string }> | null;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  className = '',
  icon3d,
  iconPosition = 'left',
}) => {
  const { colors } = useTheme();

  const renderIcon = useMemo(() => {
    if (!icon3d) return null;

    const IconComponent = React.memo(icon3d);
    return (
      <IconComponent size={1} color={colors.primary} />
    );
  }, [icon3d, colors]);

  return (
    <motion.button
      className={`
        flex items-center justify-center
        bg-[#3498DB] text-white
        font-inter rounded-md
        py-2 px-4
        hover:bg-sky-700
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon3d && iconPosition === 'left' && (
        <span className="mr-2">{renderIcon}</span>
      )}
      {label}
      {icon3d && iconPosition === 'right' && (
        <span className="ml-2">{renderIcon}</span>
      )}
    </motion.button>
  );
};

export default Button;