import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import PopUp from '@/components/PopUp';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
const PlaceholderImage = require('@/assets/images/profileicon.jpg')

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
        <Text style = {styles.headerText}>
          @VitaliUser
        </Text>
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Edit profile picture" onPress = {pickImageAsync} />
      </View>
      <View style={styles.aboutUsContainer}>
        <PopUp header="About Us" body="Vitali is a student made project by UCSC students. Our mission is to prioritize consistency health for working adults who often lead unpredictable lives."/>
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
  headerText: {
    color: '#000000',
    fontSize: 24
  },
  imageContainer: {
    flexDirection: 'row',
    flex: 1/5,
    alignItems: 'center',
    marginTop: -60,
  },
  usernameContainer: {
    flex: 1/12,
    alignItems: 'center',
  },
  footerContainer: {
    flex: 1/8,
    alignItems: 'flex-start',
  },
  aboutUsContainer: {
    flex: 1/4,
    alignItems: 'flex-end',
    backgroundColor: '#c2ecc7',
    borderRadius: 45
  }
});