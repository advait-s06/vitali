import PetSprite from '@/components/PetSprite';
import PlantSprite from '@/components/PlantSprite';
import { useVitamins } from '@/VitaminContext';
import { Image, StyleSheet, View } from 'react-native';
const healthBar = require('@/assets/images/Healthbar.png')

export default function Pet() {
  const { pickedPet, pickedPlant } = useVitamins();
  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image source={healthBar} style = {styles.healthbar}/>
        </View>
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
    backgroundColor: '#b4a3ff', // matches the home tab background
  },
  ecosystemContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginTop: 475,
      backgroundColor: '#bbbbbb'
    },
  headerContainer: {
    flex: 1/6,
    marginTop: 40,
    alignItems: 'center'
  },
  healthbar: {
    width: 399,
    height: 274,
  }
});
