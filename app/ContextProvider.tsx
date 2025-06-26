import React, { createContext, useContext, useState } from 'react';

type GlobalContextType = {
  isLocalTrackingScannerVisible: boolean;
  setIsLocalTrackingScannerVisible: (value: boolean) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLocalTrackingScannerVisible, setIsLocalTrackingScannerVisible] = useState(false);

  return (
    <GlobalContext.Provider value={{ isLocalTrackingScannerVisible, setIsLocalTrackingScannerVisible }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobalContext must be used within GlobalProvider');
  return context;
};