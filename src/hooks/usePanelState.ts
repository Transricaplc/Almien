import { useState, useCallback, useEffect } from 'react';

export type PanelMode = 'normal' | 'minimized' | 'maximized';

export interface PanelPosition {
  x: number;
  y: number;
}

export interface PanelSize {
  width: number;
  height: number;
}

export interface PanelState {
  position: PanelPosition;
  size: PanelSize;
  mode: PanelMode;
}

const STORAGE_KEY = 'safesync-panel-states';

const defaultPanelState: PanelState = {
  position: { x: 0, y: 16 },
  size: { width: 900, height: 500 },
  mode: 'normal',
};

/**
 * Get all panel states from localStorage
 */
const getStoredStates = (): Record<string, PanelState> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

/**
 * Save all panel states to localStorage
 */
const saveStoredStates = (states: Record<string, PanelState>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  } catch {
    // localStorage not available
  }
};

/**
 * Custom hook for managing panel state with localStorage persistence
 * 
 * @param panelId - Unique identifier for the panel (used as localStorage key)
 * @param initialState - Optional initial state override
 */
export const usePanelState = (panelId: string, initialState?: Partial<PanelState>) => {
  // Load initial state from localStorage or use defaults
  const [state, setState] = useState<PanelState>(() => {
    const stored = getStoredStates();
    return stored[panelId] || { ...defaultPanelState, ...initialState };
  });

  // Persist state changes to localStorage
  useEffect(() => {
    const stored = getStoredStates();
    stored[panelId] = state;
    saveStoredStates(stored);
  }, [panelId, state]);

  // Position management
  const setPosition = useCallback((position: PanelPosition) => {
    setState(prev => ({ ...prev, position }));
  }, []);

  const updatePosition = useCallback((deltaX: number, deltaY: number) => {
    setState(prev => ({
      ...prev,
      position: {
        x: prev.position.x + deltaX,
        y: Math.max(0, prev.position.y + deltaY),
      },
    }));
  }, []);

  // Size management
  const setSize = useCallback((size: PanelSize) => {
    setState(prev => ({ ...prev, size }));
  }, []);

  // Mode management
  const setMode = useCallback((mode: PanelMode) => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const toggleMinimize = useCallback(() => {
    setState(prev => ({
      ...prev,
      mode: prev.mode === 'minimized' ? 'normal' : 'minimized',
    }));
  }, []);

  const toggleMaximize = useCallback(() => {
    setState(prev => ({
      ...prev,
      mode: prev.mode === 'maximized' ? 'normal' : 'maximized',
    }));
  }, []);

  const expand = useCallback(() => {
    setState(prev => ({
      ...prev,
      mode: prev.mode === 'minimized' ? 'normal' : prev.mode,
    }));
  }, []);

  const collapse = useCallback(() => {
    setState(prev => ({
      ...prev,
      mode: 'minimized',
    }));
  }, []);

  const maximize = useCallback(() => {
    setState(prev => ({
      ...prev,
      mode: 'maximized',
    }));
  }, []);

  const reset = useCallback(() => {
    setState({ ...defaultPanelState, ...initialState });
  }, [initialState]);

  return {
    ...state,
    setPosition,
    updatePosition,
    setSize,
    setMode,
    toggleMinimize,
    toggleMaximize,
    expand,
    collapse,
    maximize,
    reset,
    isMinimized: state.mode === 'minimized',
    isMaximized: state.mode === 'maximized',
    isNormal: state.mode === 'normal',
  };
};

export default usePanelState;
