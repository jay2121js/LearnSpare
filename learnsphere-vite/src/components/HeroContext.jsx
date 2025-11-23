import React, { createContext, useState, useContext } from 'react';

// Create the context
const HeroContext = createContext();

// Provider component
export const HeroProvider = ({ children }) => {
  const [heroVisible, setHeroVisible] = useState(false);

  return (
    <HeroContext.Provider value={{ heroVisible, setHeroVisible }}>
      {children}
    </HeroContext.Provider>
  );
};

// Custom hook for easier access
export const useHero = () => useContext(HeroContext);
