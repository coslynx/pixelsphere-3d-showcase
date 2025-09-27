import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';

/**
 * @internal
 */
interface AnimationContextProps {
  animations: { [name: string]: THREE.AnimationClip };
  mixer: THREE.AnimationMixer;
}

/**
 * @internal
 */
const AnimationContext = React.createContext<AnimationContextProps | undefined>(undefined);

interface AnimationControls {
  /**
   * Plays a specified animation.
   * @param name The name of the animation to play.
   * @param crossFadeDuration Optional crossfade duration.
   */
  play: (name: string, crossFadeDuration?: number) => void;
  /**
   * Pauses a specified animation.
   * @param name The name of the animation to pause.
   */
  pause: (name: string) => void;
  /**
   * Stops a specified animation, resetting it to the beginning.
   * @param name The name of the animation to stop.
   */
  stop: (name: string) => void;
  /**
   * Seeks a specified animation to a specific time.
   * @param name The name of the animation to seek.
   * @param time The time to seek to (in seconds).
   */
  seek: (name: string, time: number) => void;
  /**
   * Creates and caches a GSAP timeline that updates uniforms of a material.
   * @param name - The name of the animation.
   * @param target - The material whose uniforms will be animated.
   * @param uniforms - An object specifying the uniform properties to animate.
   * @param duration - The duration of the animation in seconds.
   */
  createTimeline: (name: string, target: THREE.Material, uniforms: { [key: string]: number }, duration: number) => void;
  /**
   * Check if any animation is active.
   */
  isActive: () => boolean;
}

/**
 * Type that allows a Three object and clips
 */
interface AnimationSet {
  object: THREE.Object3D;
  clips: THREE.AnimationClip[];
}

/**
 * @internal
 */
interface use3DAnimationProps {
  object?: THREE.Object3D | null;
  animations?: AnimationSet[];
}

/**
 * @internal
 */
const emptyActions: { [name: string]: THREE.AnimationAction } = {};

/**
 * Custom React hook for managing 3D animations, providing an API to control and synchronize animations.
 * @param props - Configuration options for the hook, providing for the parent
 * @returns {AnimationControls} - An object containing animation control functions.
 */
export const use3DAnimation = (props: use3DAnimationProps): AnimationControls => {
  const { object, animations } = props;
  const { clock } = useThree();
  const mixer = useMemo(() => new THREE.AnimationMixer(object || undefined), [object]);
  const [actions, setActions] = useState<{ [name: string]: THREE.AnimationAction }>(emptyActions);
  const actionsRef = useRef(actions);
  const timelinesRef = useRef<{ [name: string]: gsap.core.Timeline }>({});

  useEffect(() => {
    if (!animations || !object) return;

    const newActions: { [name: string]: THREE.AnimationAction } = {};
    animations.forEach((animSet) => {
      animSet.clips.forEach(clip => {
        newActions[clip.name] = mixer.clipAction(clip, animSet.object);
      });
    });

    actionsRef.current = newActions;
    setActions(newActions);

    return () => {
      // Clear existing actions and timelines
      mixer.stopAllAction();
      for (const timelineName in timelinesRef.current) {
        timelinesRef.current[timelineName].kill();
      }
      timelinesRef.current = {};
    };
  }, [object, animations, mixer]);

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  const play = useCallback((name: string, crossFadeDuration: number = 0.2) => {
    const action = actionsRef.current[name];
    if (!action) {
      console.warn(`Animation "${name}" not found.`);
      return;
    }

    const currentAction = mixer.existingAction(action.clip);
    if (currentAction && currentAction !== action) {
      currentAction.crossFadeTo(action, crossFadeDuration, true).start();
    }

    action.reset().fadeIn(crossFadeDuration).play();
  }, [mixer]);

  const pause = useCallback((name: string) => {
    const action = actionsRef.current[name];
    if (action) {
      action.fadeOut(0.2).stop();
    }
  }, []);

  const stop = useCallback((name: string) => {
    const action = actionsRef.current[name];
    if (action) {
      action.stop();
      action.reset();
    }
  }, []);

  const seek = useCallback((name: string, time: number) => {
    const action = actionsRef.current[name];
    if (action) {
      action.time = time;
      mixer.update(0);
    }
  }, [mixer]);

  const createTimeline = useCallback((name: string, target: THREE.Material, uniforms: { [key: string]: number }, duration: number) => {
    if (timelinesRef.current[name]) {
      timelinesRef.current[name].kill();
    }

    const timeline = gsap.timeline({
      onUpdate: () => {
        target.needsUpdate = true;
      }
    });

    for (const uniformName in uniforms) {
      timeline.to(target.uniforms[uniformName], {
        value: uniforms[uniformName],
        duration: duration,
        ease: "power2.inOut"
      }, 0);
    }

    timelinesRef.current[name] = timeline;
  }, []);

  const isActive = useCallback((): boolean => {
    for (const name in actionsRef.current) {
      if (actionsRef.current[name].isRunning()) return true;
    }

    return false;
  }, []);

  return {
    play,
    pause,
    stop,
    seek,
    createTimeline,
    isActive
  };
};