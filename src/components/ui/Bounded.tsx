import React, { forwardRef } from 'react';
import { ReactNode } from 'react';

interface BoundedProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  maxWidth?: string;
  className?: string;
}

/**
 * Bounded is a container component that limits content to a maximum width and centers it horizontally.
 */
const Bounded = forwardRef<HTMLDivElement, BoundedProps>(
  ({ children, maxWidth = 'max-w-7xl', className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`mx-auto ${maxWidth} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Bounded.displayName = 'Bounded';

export default React.memo(Bounded);