import React, { createContext, useContext, useState } from 'react';

export interface Supplement {
  id: string;
  name: string;
  days: string[];
  times: string[];
  withFood: boolean;
}

const VitaminsContext = createContext<{
  supplements: Supplement[];
  setSupplements: React.Dispatch<React.SetStateAction<Supplement[]>>;
}>({
  supplements: [],
  setSupplements: () => {},
});

export const useVitamins = () => useContext(VitaminsContext);

export const VitaminsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  return (
    <VitaminsContext.Provider value={{ supplements, setSupplements }}>
      {children}
    </VitaminsContext.Provider>
  );
};
