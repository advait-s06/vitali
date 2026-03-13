import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
const PlaceholderImage = require('@/assets/images/placeholder.png')

export default function ProfileScreen() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer theme='profile' imgSource = {PlaceholderImage} selectedImage={selectedImage}/>
      </View>
      <View style = {styles.usernameContainer}>
        <Text style = {styles.text}>
          @VitaliUser
        </Text>
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Edit profile picture" onPress = {pickImageAsync} />
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f9ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000000',
    fontSize: 24
  },
  imageContainer: {
    flexDirection: 'row',
    flex: 1/5,
    alignItems: 'center',
    marginTop: -150,
  },
  usernameContainer: {
    flex: 1/12,
    alignItems: 'center',
  },
  footerContainer: {
    flex: 1/4,
    alignItems: 'flex-start',
  },
});