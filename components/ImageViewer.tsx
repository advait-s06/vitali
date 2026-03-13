import { Image } from 'expo-image';
import { ImageSourcePropType, StyleSheet } from 'react-native';

type Props = {
  imgSource: ImageSourcePropType;
  theme?: 'profile'
  selectedImage?: string;
};

export default function ImageViewer({ imgSource, theme, selectedImage }: Props) {
    const imageSource = selectedImage ? { uri: selectedImage } : imgSource;
    if (theme === 'profile') {
        return (
            <Image source={imageSource} style={styles.profileimg} />
        );
    }
  return <Image source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 250,
    borderRadius: 50,
  },
  profileimg: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20
  },
});
