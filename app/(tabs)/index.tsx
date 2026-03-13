import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import { StyleSheet, Text, View } from "react-native";
const PlaceholderImage = require('@/assets/images/placeholder.png')

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Pet Name
        </Text>
      </View>
      <View style ={styles.rightCornerContainer}>
        <Button label = "Settings" />
        <Button label = "Pet" />
      </View>
      <View style={styles.ecosystemContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f9ff',
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
    flex: 1/12,
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
    marginBottom: 40
  }
});