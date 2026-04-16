import React, { createContext, useContext, useState } from 'react';

export interface Supplement {
  id: string;
  name: string;
  days: string[];
  times: string[];
  withFood: boolean;
}


import { ImageSourcePropType } from 'react-native';

interface VitaminsContextType {
  supplements: Supplement[];
  setSupplements: React.Dispatch<React.SetStateAction<Supplement[]>>;
  pickedPet: ImageSourcePropType | undefined;
  setPickedPet: React.Dispatch<React.SetStateAction<ImageSourcePropType | undefined>>;
  pickedPlant: ImageSourcePropType | undefined;
  setPickedPlant: React.Dispatch<React.SetStateAction<ImageSourcePropType | undefined>>;
}

const VitaminsContext = createContext<VitaminsContextType>({
  supplements: [],
  setSupplements: () => {},
  pickedPet: undefined,
  setPickedPet: () => {},
  pickedPlant: undefined,
  setPickedPlant: () => {},
});


export const useVitamins = () => useContext(VitaminsContext);

export const VitaminsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [pickedPet, setPickedPet] = useState<ImageSourcePropType | undefined>(undefined);
  const [pickedPlant, setPickedPlant] = useState<ImageSourcePropType | undefined>(undefined);
  return (
    <VitaminsContext.Provider value={{ supplements, setSupplements, pickedPet, setPickedPet, pickedPlant, setPickedPlant }}>
      {children}
    </VitaminsContext.Provider>
  );
};
