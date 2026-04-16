import PetSprite from '@/components/PetSprite';
import PlantSprite from '@/components/PlantSprite';
import { useVitamins } from '@/VitaminContext';
import { StyleSheet, View } from 'react-native';

export default function Pet() {
  const { pickedPet, pickedPlant } = useVitamins();
  return (
    <View style={styles.container}>
      <View style={styles.ecosystemContainer}>
        {pickedPet && <PetSprite imageSize={250} stickerSource={pickedPet} />}
        {pickedPlant && <PlantSprite imageSize={200} plantSource={pickedPlant} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#83dafa', // matches the home tab background
  },
  ecosystemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: 16,
    marginTop: 120,
  },
});
