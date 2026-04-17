import ModalButton from '@/components/ModalButton';
import PetList from '@/components/PetList';
import PetPicker from '@/components/PetPicker';
import PetSprite from '@/components/PetSprite';
import PlantList from '@/components/PlantList';
import PlantPicker from '@/components/PlantPicker';
import PlantSprite from '@/components/PlantSprite';
import { useVitamins } from '@/VitaminContext';
import { ImageBackground } from 'expo-image';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const ecoBackground = require('@/assets/images/Background.png')

export default function Index() {
  const [isPetModalVisible, setIsPetModalVisible] = React.useState(false);
  const [isPlantModalVisible, setIsPlantModalVisible] = React.useState(false);
  const { pickedPet, setPickedPet, pickedPlant, setPickedPlant } = useVitamins();
  const [petName, setPetName] = React.useState('Pet Name');
  const [plantName, setPlantName] = React.useState('Plant Name');
  const petLastTap = React.useRef(0);
  const plantLastTap = React.useRef(0);

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

const handlePetDoubleTap = () => {
  const now = Date.now();
  if (now - petLastTap.current < 300) {
    Alert.prompt(
      'Edit Pet Name',
      'Enter new name:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: (text: string | undefined) => setPetName(text || petName) }
      ],
      'plain-text',
      petName
    );
  }
  petLastTap.current = now;
};

const handlePlantDoubleTap = () => {
  const now = Date.now();
  if (now - plantLastTap.current < 300) {
    Alert.prompt(
      'Edit Plant Name',
      'Enter new name:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: (text: string | undefined) => setPlantName(text || plantName) }
      ],
      'plain-text',
      plantName
    );
  }
  plantLastTap.current = now;
};

  return (
    <View style={styles.container}>
      <ImageBackground
        source={ecoBackground}
        style={{ flex: 1}}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handlePetDoubleTap}>
            <Text style={styles.headerText}>
              {' '}{petName}{' '}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlantDoubleTap}>
            <Text style={styles.text}>
              {' '}With {plantName}{' '}
            </Text>
          </TouchableOpacity>
        </View>
        <View style ={styles.rightCornerContainer}>
          <ModalButton label = "Pet" onPress={onChangePet}/>
          <ModalButton label = "Plant" onPress={onChangePlant}/>
        </View>
            <View style={styles.ecosystemContainer}>
              {pickedPet && <PetSprite imageSize={250} stickerSource={pickedPet}/>}
              {pickedPlant && <PlantSprite imageSize={200} plantSource={pickedPlant}/>}
            </View>
        <PetPicker isVisible={isPetModalVisible} onClose={onPetModalClose}>
          <PetList onSelect={setPickedPet} onCloseModal={onPetModalClose} />
        </PetPicker>
        <PlantPicker isVisible={isPlantModalVisible} onClose={onPlantModalClose}>
          <PlantList onSelect={setPickedPlant} onCloseModal={onPlantModalClose} />
        </PlantPicker>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  ecosystemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 475,
    backgroundColor: '#418549'
  },
  text: {
    color: '#00000',
    fontSize: 16,
    backgroundColor: '#ffffff',
    borderRadius: 5,
  }
});
