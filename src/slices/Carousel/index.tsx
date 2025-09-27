import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GLTFModel, useGLTF } from '@react-three/drei';
import { useSpring, animated } from 'framer-motion';
import gsap from 'gsap';
import { Bounded } from '../../components/ui/Bounded';
import { ModelLoader } from '../../components/3d/ModelLoader';
import { use3DAnimation } from '../../hooks/use3DAnimation';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import { Button } from '../../components/ui/Button';

interface CarouselProps {
  models: { url: string; position: [number, number, number]; rotation: [number, number, number] }[];
  autoRotate?: boolean;
  rotationSpeed?: number;
  transitionDuration?: number;
  initialModelIndex?: number;
  navigationControls?: boolean;
  className?: string;
}

const Carousel: React.FC<CarouselProps> = React.memo(({
  models,
  autoRotate = true,
  rotationSpeed = 0.01,
  transitionDuration = 2,
  initialModelIndex = 0,
  navigationControls = true,
  className = '',
}) => {
  const [currentModelIndex, setCurrentModelIndex] = useState(initialModelIndex);
  const sceneRef = useRef<THREE.Scene>(null);
  const { scene, camera } = useThree();
  const { play, pause } = use3DAnimation({});
  const isTransitioning = useRef(false);

  const nextModel = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrentModelIndex((prevIndex) => (prevIndex + 1) % models.length);
    setTimeout(() => { isTransitioning.current = false }, transitionDuration * 1000);
  }, [models.length, transitionDuration]);

  const prevModel = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrentModelIndex((prevIndex) => (prevIndex - 1 + models.length) % models.length);
    setTimeout(() => { isTransitioning.current = false }, transitionDuration * 1000);
  }, [models.length, transitionDuration]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (autoRotate) {
      const rotate = () => {
        if(!isTransitioning.current){
          nextModel();
        }
        timeoutId = setTimeout(rotate, transitionDuration * 3000);
      };

      timeoutId = setTimeout(rotate, transitionDuration * 3000); // Initial start
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [autoRotate, nextModel, transitionDuration]);

  useFrame(() => {
    if (sceneRef.current && autoRotate) {
      sceneRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas style={{ width: '100%', height: '500px' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={0.8} />
        <group ref={sceneRef}>
          {models.map((model, index) => (
            <ModelLoader
              key={index}
              modelPath={model.url}
              position={model.position}
              rotation={model.rotation}
              visible={index === currentModelIndex}
            />
          ))}
        </group>
      </Canvas>
      {navigationControls && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-4">
          <button
            onClick={prevModel}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Previous
          </button>
          <button
            onClick={nextModel}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
});

export default Carousel;