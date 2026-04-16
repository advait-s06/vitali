import React, { createContext, useContext, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';

export type Supplement = {
  id: string;
  name: string;
  days: string[];
  times: string[];
  withFood: boolean;
  takenToday: boolean;
};

type VitaminsContextType = {
  supplements: Supplement[];
  setSupplements: React.Dispatch<React.SetStateAction<Supplement[]>>;
  pickedPet: ImageSourcePropType | null;
  setPickedPet: React.Dispatch<React.SetStateAction<ImageSourcePropType | null>>;
  pickedPlant: ImageSourcePropType | null;
  setPickedPlant: React.Dispatch<React.SetStateAction<ImageSourcePropType | null>>;
};

const VitaminsContext = createContext<VitaminsContextType | undefined>(undefined);

export function VitaminsProvider({ children }: { children: React.ReactNode }) {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [pickedPet, setPickedPet] = useState<ImageSourcePropType | null>(null);
  const [pickedPlant, setPickedPlant] = useState<ImageSourcePropType | null>(null);

  return (
    <VitaminsContext.Provider
      value={{
        supplements,
        setSupplements,
        pickedPet,
        setPickedPet,
        pickedPlant,
        setPickedPlant,
      }}
    >
      {children}
    </VitaminsContext.Provider>
  );
}
export function useVitamins() {
  const context = useContext(VitaminsContext);

  if (!context) {
    throw new Error('useVitamins must be used inside VitaminsProvider');
  }

  return context;
}