import React, { createContext, useContext, useState } from 'react';

const ColetaContext = createContext();

export const ColetaProvider = ({ children }) => {
  const [selectedColeta, setSelectedColeta] = useState(null);

  const selectColeta = (coleta) => {
    setSelectedColeta(coleta);
  };

  const clearColeta = () => {
    setSelectedColeta(null);
  };

  return (
    <ColetaContext.Provider value={{ selectedColeta, selectColeta, clearColeta }}>
      {children}
    </ColetaContext.Provider>
  );
};

export const useColeta = () => useContext(ColetaContext);
