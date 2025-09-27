import React, { useRef, useEffect, useState, useCallback, useMemo, forwardRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { motion } from 'framer-motion';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import { use3DAnimation } from '../../hooks/use3DAnimation';
import { ModelLoader } from '../../components/3d/ModelLoader';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useTheme } from '../../context/ThemeContext';

export interface ScrollExperienceSection {
  model: string;
  position: [number, number, number];
  rotation: [number, number, number];
  content: React.ReactNode;
  animationStart?: (timeline: gsap.core.Timeline) => void;
  animationEnd?: (timeline: gsap.core.Timeline) => void;
}

export interface ScrollExperienceProps {
  sections: ScrollExperienceSection[];
  initialPosition?: [number, number, number];
}

const ScrollExperience = forwardRef<THREE.Group, ScrollExperienceProps>(({ sections, initialPosition = [0, 0, 0] }, ref) => {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const { size, scene, camera } = useThree();
  const { createTimeline } = use3DAnimation();
  const { scrollY } = useScrollAnimation(groupRef);
  const { isDarkMode, colors } = useTheme();

  // Helper function to generate skybox
  const skyBox = useMemo(() => {
    return three3DHelpersUtil.createSkybox(isDarkMode ? colors.darkEnvMap : colors.lightEnvMap, scene);
  }, [isDarkMode, colors, scene]);

  useEffect(() => {
    if (scene) {
      three3DHelpersUtil.createLights(scene);

      camera.position.set(0, 3, 10);
    }
  }, [scene, camera, colors, isDarkMode]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = -scrollY.current * 20;
    }
  });

  return (
    <group ref={groupRef} position={initialPosition}>
      {skyBox}
      {sections.map((section, index) => (
        <Section
          key={index}
          model={section.model}
          position={section.position}
          rotation={section.rotation}
          content={section.content}
          animationStart={section.animationStart}
          animationEnd={section.animationEnd}
        />
      ))}
    </group>
  );
});

ScrollExperience.displayName = 'ScrollExperience';

interface SectionProps {
  model: string;
  position: [number, number, number];
  rotation: [number, number, number];
  content: React.ReactNode;
  animationStart?: (timeline: gsap.core.Timeline) => void;
  animationEnd?: (timeline: gsap.core.Timeline) => void;
}

const Section: React.FC<SectionProps> = ({ model, position, rotation, content, animationStart, animationEnd }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();

  useEffect(() => {
    if (scene && meshRef.current) {
    }
  }, [scene, meshRef]);

  return (
    <group position={position} rotation={rotation}>
      <ModelLoader modelPath={model} />
      {content}
    </group>
  );
};

export default ScrollExperience;