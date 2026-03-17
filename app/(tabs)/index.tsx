import ModalButton from '@/components/ModalButton';
import PetList from '@/components/PetList';
import PetPicker from '@/components/PetPicker';
import PetSprite from '@/components/PetSprite';
import PlantList from '@/components/PlantList';
import PlantPicker from '@/components/PlantPicker';
import PlantSprite from '@/components/PlantSprite';
import { useState } from 'react';
import { ImageSourcePropType, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [isPetModalVisible, setIsPetModalVisible] = useState<boolean>(false);
  const [isPlantModalVisible, setIsPlantModalVisible] = useState<boolean>(false);
  const [pickedPet, setPickedPet] = useState<ImageSourcePropType | undefined>(undefined);
  const [pickedPlant, setPickedPlant] = useState<ImageSourcePropType | undefined>(undefined);
  const PlaceholderImage = require('@/assets/images/placeholder.png')
  const EcosystemBase = require('@/assets/images/base-ecosystem.png')

const onChangePet = () => {
  setIsPetModalVisible(true);
};

const onChangePlant = () => {
  setIsPlantModalVisible(true);
}

const onPetModalClose = () => {
  setIsPetModalVisible(false);
}

const onPlantModalClose = () => {
  setIsPlantModalVisible(false);
}

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Pet Name
        </Text>
        <Text style={styles.text}>
          With Plant Name
        </Text>
      </View>
      <View style ={styles.rightCornerContainer}>
        <ModalButton label = "Pet" onPress={onChangePet}/>
        <ModalButton label = "Plant" onPress={onChangePlant}/>
      </View>
          <View style={styles.ecosystemContainer}>
            {pickedPet && <PetSprite imageSize={200} stickerSource={pickedPet}/>}
            {pickedPlant && <PlantSprite imageSize={100} plantSource={pickedPlant}/>}
          </View>
      <PetPicker isVisible={isPetModalVisible} onClose={onPetModalClose}>
        <PetList onSelect={setPickedPet} onCloseModal={onPetModalClose} />
      </PetPicker>
      <PlantPicker isVisible={isPlantModalVisible} onClose={onPlantModalClose}>
        <PlantList onSelect={setPickedPlant} onCloseModal={onPlantModalClose} />
      </PlantPicker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#83dafa',
  },
  imageContainer: {
    flex: 1,
  },
  rightCornerContainer: {
    flex: 2,
    marginTop: 20,
    marginHorizontal: 20,
    position: 'absolute',
    left: 300,
  },
  headerContainer: {
    flex: 1/6,
    marginTop: 40,
    alignItems: 'center'
  },
  headerText: {
    color: '#000000',
    fontSize: 24,
  },
  ecosystemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 475,
    backgroundColor: '#b77e4c'
  },
  text: {
    color: '#00000',
    fontSize: 16,
  }
});