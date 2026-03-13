import Button from '@/components/Button';
import { StyleSheet, View } from "react-native";

export default function Pet() {
    return (
        <View style={styles.container}>
            <View style={styles.footerContainer}>
                <Button label = "meow" />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f9ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center'
  },
});