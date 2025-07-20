
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FullscreenContextType {
  isMaximized: boolean;
  toggle: () => void;
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined);

export const FullscreenProvider = ({ children }: { children: ReactNode }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const toggle = () => {
    setIsMaximized(prev => !prev);
  };

  return (
    <FullscreenContext.Provider value={{ isMaximized, toggle }}>
      {children}
    </FullscreenContext.Provider>
  );
};

export const useFullscreen = () => {
  const context = useContext(FullscreenContext);
  if (context === undefined) {
    throw new Error('useFullscreen must be used within a FullscreenProvider');
  }
  return context;
};
