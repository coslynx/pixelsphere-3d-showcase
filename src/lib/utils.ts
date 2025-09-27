import * as THREE from 'three';

/**
 * Converts a hexadecimal color string to a THREE.Color object.
 * Supports both six-digit (#RRGGBB) and short form (#RGB) hex codes.
 * @param hex The hexadecimal color string.
 * @returns A THREE.Color object, or black if the hex code is invalid.
 */
export const hexToRgb = (hex: string): THREE.Color => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const hexCode = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexCode);
  if (result) {
    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;
    return new THREE.Color(r, g, b);
  }

  console.error(`Invalid hex code: ${hex}`);
  return new THREE.Color(0, 0, 0); // Default to black on error
};

/**
 * Converts a THREE.Color object to a hexadecimal color string.
 * @param color The THREE.Color object.
 * @returns A six-digit hexadecimal color string.
 */
export const rgbToHex = (color: THREE.Color): string => {
  const hex = color.getHexString();
  return `#${hex.padStart(6, '0')}`;
};

/**
 * Standard linear interpolation function.
 * @param start The starting value.
 * @param end The ending value.
 * @param alpha The interpolation factor (0 to 1).
 * @returns The interpolated value.
 */
export const lerp = (start: number, end: number, alpha: number): number => {
  return start + (end - start) * alpha;
};

/**
 * Normalizes a THREE.Vector3, handling the case where the vector has zero length.
 * @param vector The THREE.Vector3 to normalize.
 * @returns The normalized THREE.Vector3, or a zero vector if the input vector has zero length.
 */
export const safeNormalize = (vector: THREE.Vector3): THREE.Vector3 => {
  const newVector = vector.clone();
  if (newVector.length() === 0) {
    console.warn("safeNormalize: Vector has zero length.");
    return new THREE.Vector3(0, 0, 0);
  }
  return newVector.normalize();
};

/**
 * Disposes of a Three.js material and its textures to prevent memory leaks.
 * @param material The THREE.Material to dispose of.
 */
export const disposeMaterial = (material: THREE.Material): void => {
  if (material.map) {
    material.map.dispose();
  }
  if (material.lightMap) {
    material.lightMap.dispose();
  }
  if (material.bumpMap) {
    material.bumpMap.dispose();
  }
  if (material.normalMap) {
    material.normalMap.dispose();
  }
  if (material.specularMap) {
    material.specularMap.dispose();
  }
  if (material.envMap) {
    material.envMap.dispose();
  }
  if (material.alphaMap) {
    material.alphaMap.dispose();
  }
    if (material.aoMap) {
        material.aoMap.dispose();
    }
    if (material.displacementMap) {
        material.displacementMap.dispose();
    }
    if (material.emissiveMap) {
        material.emissiveMap.dispose();
    }
    if (material.metalnessMap) {
        material.metalnessMap.dispose();
    }
    if (material.roughnessMap) {
        material.roughnessMap.dispose();
    }

  material.dispose();
};

/**
 * Disposes of a Three.js geometry to prevent memory leaks.
 * @param geometry The THREE.BufferGeometry to dispose of.
 */
export const disposeGeometry = (geometry: THREE.BufferGeometry): void => {
  geometry.dispose();
};

/**
 * Extracts the filename from a given path, stripping any directory information.
 * @param path The file path.
 * @returns The filename.
 */
export const getFileNameFromPath = (path: string): string => {
  return path.split('/').pop() || path;
};

/**
 * Optimizes Draco compressed meshes within a Three.js Object3D for better performance.
 * @param object The Three.js Object3D to optimize.
 * @returns The optimized Three.js Object3D.
 */
export const optimizeDracoModel = (object: THREE.Object3D): THREE.Object3D => {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BufferGeometry) {
      // Add Draco-specific optimization logic here if needed
      // Example: child.geometry.computeVertexNormals();
    }
  });
  return object;
};

/**
 * Detects if the user's device is a mobile device.
 * @returns True if the device is a mobile device, false otherwise.
 */
export const isMobile = (): boolean => {
  if (navigator.userAgentData) {
    return navigator.userAgentData.mobile;
  }
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

/**
 * Returns a debounced version of the function.
 * @param func The function to debounce.
 * @param delay The delay in milliseconds.
 * @returns The debounced function.
 */
export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debouncedFunc = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };

  return debouncedFunc as T;
}

/**
 * Creates a performance monitor for measuring execution times.
 * @returns An object with `begin` and `end` methods.
 */
export const createPerformanceMonitor = () => {
  let startTime: number;
  return {
    begin: () => {
      startTime = performance.now();
    },
    end: (): number => {
      if (startTime === undefined) {
        console.warn("createPerformanceMonitor: begin() was not called before end().");
        return 0;
      }
      return performance.now() - startTime;
    },
  };
};

/**
 * Applies ARIA attributes to a Three.js Object3D to enhance accessibility.
 * @param element - The Three.js Object3D to apply ARIA attributes to.
 * @param label - The ARIA label text.
 */
export const applyAriaLabel = (element: THREE.Object3D, label: string): void => {
  if (!element) {
    console.warn("applyAriaLabel: Element is null or undefined.");
    return;
  }

  // Attempt to create a DOM element associated with the 3D object
  // This may not always be possible or appropriate, depending on the context
  if (element.userData) {
    element.userData.ariaLabel = label;
    // Consider adding additional ARIA attributes (role, describedby)
    element.userData.tabIndex = 0;  // Make focusable if interactive
  } else {
    console.warn("applyAriaLabel: Cannot set aria-label directly on this object.  Accessibility may be limited.");
  }
};