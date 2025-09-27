import { create } from 'zustand';
import { useLayoutEffect } from 'react';

interface StoreState {
  isMobile: boolean;
  isLoaded: boolean;
  theme: 'light' | 'dark';
  performanceMode: boolean;
}

interface StoreActions {
  setIsMobile: (isMobile: boolean) => void;
  setIsLoaded: (isLoaded: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setPerformanceMode: (performanceMode: boolean) => void;
}

type Store = StoreState & StoreActions;

const initialStoreState: StoreState = {
  isMobile: false,
  isLoaded: false,
  theme: 'light',
  performanceMode: false,
};

const useStore = create<Store>((set, get) => ({
  ...initialStoreState,
  setIsMobile: (isMobile: boolean) => set({ isMobile }),
  setIsLoaded: (isLoaded: boolean) => set({ isLoaded }),
  setTheme: (theme: 'light' | 'dark') => {
    if (theme !== 'light' && theme !== 'dark') {
      console.error(`Invalid theme string: ${theme}. Theme must be 'light' or 'dark'.`);
      return;
    }
    set({ theme });
  },
  setPerformanceMode: (performanceMode: boolean) => set({ performanceMode }),
}));

// Set initial isMobile state on client side
useLayoutEffect(() => {
  useStore.setState({ isMobile: window.innerWidth < 768 }); // Example breakpoint for mobile
}, []);

export default useStore;

// Testing Notes:
// - Test the store with different initial states to ensure that the values are properly set.
// - Test the actions to ensure that they update the state correctly.
// - Test the error handling in the setTheme action.
// - Measure performance in each stage with performance hooks.