import { Image } from 'expo-image';
import { ImageSourcePropType, View } from 'react-native';

type Props = {
  imageSize: number;
  plantSource: ImageSourcePropType;
};

export default function PlantSprite({ imageSize, plantSource }: Props) {
  return (
    <View style={{ top: -80, left: -15 }}>
      <Image source={plantSource} style={{ width: imageSize, height: imageSize }} />
    </View>
  );
}
