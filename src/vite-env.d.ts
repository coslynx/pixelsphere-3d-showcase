/// <reference types="vite/client" />

/**
 * @file vite-env.d.ts
 * @purpose Defines type definitions for environment variables and Vite-specific augmentations to TypeScript's global scope.
 * This file prevents type errors by providing type hints for environment variables
 * accessed via `import.meta.env` and augmenting the `ImportMeta` interface.
 */

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ENABLE_ANALYTICS: boolean;
  readonly VITE_MODEL_BASE_URL: string;
  // More environment variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'vite/client' {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_ENABLE_ANALYTICS: boolean;
    readonly VITE_MODEL_BASE_URL: string;
    // Add more env variables here as needed for type safety and avoid implicit `any`
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

declare module '*.glsl' {
  const value: string;
  export default value;
}

declare module '*.vert' {
  const value: string;
  export default value;
}

declare module '*.frag' {
  const value: string;
  export default value;
}

declare module 'three' {
  import * as THREE from 'three';

  interface Texture {
    /**
     * Optional URL to a .basis texture file.
     *
     * @remarks This URL can point to a KTX2-compressed texture if using THREE.KTX2Loader.
     */
    basis?: string | null;
  }
}