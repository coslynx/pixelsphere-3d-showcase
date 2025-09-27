import React, { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Bounded } from '../../components/ui/Bounded';
import { TextSplitter } from '../../components/ui/TextSplitter';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface HeroProps {
  title: string;
  subtitle: string;
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, className = '' }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScrollAnimation(heroRef);
  const { viewport } = useThree();

  return (
    <section ref={heroRef} className={`relative py-24 ${className}`}>
      <Bounded>
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            <TextSplitter text={title} />
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            <TextSplitter text={subtitle} />
          </p>
        </div>
      </Bounded>
    </section>
  );
};

export default Hero;