import { StyleSheet, Text, View } from "react-native";

export default function Pet() {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Text>Pet Name</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c2ecc7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  headerContainer: {
    flex: 1/6,
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
    marginTop: 475,
    backgroundColor: '#b77e4c'
  },
  text: {
    color: '#00000',
    fontSize: 16,
  }
});