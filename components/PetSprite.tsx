import { Image } from 'expo-image';
import { ImageSourcePropType, View } from 'react-native';

type Props = {
  imageSize: number;
  stickerSource: ImageSourcePropType;
};

export default function PetSprite({ imageSize, stickerSource }: Props) {
  return (
    <View style={{ top: -100 }}>
      <Image source={stickerSource} style={{ width: imageSize, height: imageSize }} />
    </View>
  );
}
